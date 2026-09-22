/**
 * =======================================================
 * FABLE 5 - Interactive Math & Dynamic SVG Chart Engine
 * Specially Crafted for High-End Financial Projection Visuals
 * =======================================================
 */

class FableEngine {
    constructor() {
        this.svgNS = "http://www.w3.org/2000/svg";
    }

    /**
     * Calculates future value of a Systematic Investment Plan (SIP)
     * FV = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
     * @param {number} monthlyAmt P
     * @param {number} annualRate r (e.g. 12 for 12%)
     * @param {number} years n (converted to months)
     */
    calculateSIP(monthlyAmt, annualRate, years) {
        const i = (annualRate / 100) / 12; // Monthly rate
        const n = years * 12; // Total months
        
        const totalInvested = monthlyAmt * n;
        
        let futureValue = 0;
        if (i > 0) {
            futureValue = monthlyAmt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        } else {
            futureValue = totalInvested;
        }

        const wealthGained = futureValue - totalInvested;

        return {
            invested: Math.round(totalInvested),
            wealthGained: Math.round(wealthGained),
            totalValue: Math.round(futureValue)
        };
    }

    /**
     * Generates a curved SVG Path from a set of points (Lerped Cubic Bezier)
     * @param {Array} dataPoints Array of numbers
     * @param {number} width Width of SVG viewbox
     * @param {number} height Height of SVG viewbox
     */
    generateSVGPath(dataPoints, width, height) {
        const maxVal = Math.max(...dataPoints, 1);
        const minVal = 0;
        const range = maxVal - minVal;
        
        const points = dataPoints.map((val, idx) => {
            const x = (idx / (dataPoints.length - 1)) * (width - 40) + 20;
            const y = height - ((val / maxVal) * (height - 60) + 30); // 30px padding bottom/top
            return { x, y };
        });

        if (points.length === 0) return "";

        // Standard bezier curve generator
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            
            // Control points for cubic bezier
            const cpX1 = p0.x + (p1.x - p0.x) / 2;
            const cpY1 = p0.y;
            const cpX2 = p0.x + (p1.x - p0.x) / 2;
            const cpY2 = p1.y;

            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
        }

        return {
            linePath: path,
            points: points
        };
    }

    /**
     * Renders a financial growth chart on an SVG container
     * @param {string} svgId Element Selector
     * @param {number} monthlyAmt 
     * @param {number} annualRate 
     * @param {number} years 
     */
    drawGrowthChart(svgSelector, monthlyAmt, annualRate, years) {
        const svg = document.querySelector(svgSelector);
        if (!svg) return;

        // Clear existing children except definitions
        const defs = svg.querySelector('defs');
        svg.innerHTML = '';
        if (defs) svg.appendChild(defs);

        const width = svg.clientWidth || 600;
        const height = svg.clientHeight || 300;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Generate data arrays over time
        const investedData = [];
        const totalValData = [];
        
        for (let y = 1; y <= years; y++) {
            const result = this.calculateSIP(monthlyAmt, annualRate, y);
            investedData.push(result.invested);
            totalValData.push(result.totalValue);
        }

        // Draw curves
        const totalPathData = this.generateSVGPath(totalValData, width, height);
        const investedPathData = this.generateSVGPath(investedData, width, height);

        if (!totalPathData || !investedPathData) return;

        // Create elements
        // 1. Grid Lines
        const gridGroup = document.createElementNS(this.svgNS, "g");
        gridGroup.setAttribute("stroke", "#e2e8f0");
        gridGroup.setAttribute("stroke-width", "1");
        gridGroup.setAttribute("stroke-dasharray", "4 4");
        
        const linesCount = 4;
        for (let l = 1; l < linesCount; l++) {
            const yPos = (l / linesCount) * (height - 60) + 30;
            const gridLine = document.createElementNS(this.svgNS, "line");
            gridLine.setAttribute("x1", "20");
            gridLine.setAttribute("y1", yPos);
            gridLine.setAttribute("x2", width - 20);
            gridLine.setAttribute("y2", yPos);
            gridGroup.appendChild(gridLine);
        }
        svg.appendChild(gridGroup);

        // 2. Areas under paths
        const drawArea = (points, fillStyle, className) => {
            if (points.length === 0) return;
            let areaPath = `M ${points[0].x} ${height - 10}`;
            
            // Build upper line
            areaPath += ` L ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i];
                const p1 = points[i + 1];
                const cpX1 = p0.x + (p1.x - p0.x) / 2;
                const cpY1 = p0.y;
                const cpX2 = p0.x + (p1.x - p0.x) / 2;
                const cpY2 = p1.y;
                areaPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
            }
            areaPath += ` L ${points[points.length - 1].x} ${height - 10} Z`;

            const areaEl = document.createElementNS(this.svgNS, "path");
            areaEl.setAttribute("d", areaPath);
            areaEl.setAttribute("fill", fillStyle);
            areaEl.setAttribute("class", className);
            svg.appendChild(areaEl);
        };

        drawArea(totalPathData.points, "url(#totalGrad)", "chart-area-total");
        drawArea(investedPathData.points, "url(#investedGrad)", "chart-area-invested");

        // 3. Line for Invested Capital
        const investedLine = document.createElementNS(this.svgNS, "path");
        investedLine.setAttribute("d", investedPathData.linePath);
        investedLine.setAttribute("fill", "none");
        investedLine.setAttribute("stroke", "#64748b");
        investedLine.setAttribute("stroke-width", "3");
        investedLine.setAttribute("stroke-linecap", "round");
        investedLine.setAttribute("class", "chart-line-invested");
        svg.appendChild(investedLine);

        // 4. Line for Total Value
        const totalLine = document.createElementNS(this.svgNS, "path");
        totalLine.setAttribute("d", totalPathData.linePath);
        totalLine.setAttribute("fill", "none");
        totalLine.setAttribute("stroke", "url(#lineGrad)");
        totalLine.setAttribute("stroke-width", "5");
        totalLine.setAttribute("stroke-linecap", "round");
        totalLine.setAttribute("class", "chart-line-total");
        svg.appendChild(totalLine);

        // 5. Interactive Dots
        const addDots = (points, color, radius) => {
            points.forEach((pt, index) => {
                // Draw dots for start, mid-way, and end
                if (index === 0 || index === points.length - 1 || index === Math.floor(points.length / 2)) {
                    const dot = document.createElementNS(this.svgNS, "circle");
                    dot.setAttribute("cx", pt.x);
                    dot.setAttribute("cy", pt.y);
                    dot.setAttribute("r", radius);
                    dot.setAttribute("fill", color);
                    dot.setAttribute("stroke", "#ffffff");
                    dot.setAttribute("stroke-width", "3");
                    dot.setAttribute("class", "chart-dot");
                    
                    // Add animate tag for pulse
                    const anim = document.createElementNS(this.svgNS, "animate");
                    anim.setAttribute("attributeName", "r");
                    anim.setAttribute("values", `${radius};${radius * 1.4};${radius}`);
                    anim.setAttribute("dur", "2.5s");
                    anim.setAttribute("repeatCount", "indefinite");
                    dot.appendChild(anim);

                    svg.appendChild(dot);
                }
            });
        };

        addDots(investedPathData.points, "#64748b", 5);
        addDots(totalPathData.points, "#d4af37", 7);
    }
}

// Instantiate globally
const fable = new FableEngine();
window.fable = fable;
