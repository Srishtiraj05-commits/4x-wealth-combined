/**
 * =======================================================
 * ANIMASTER LIB - Modern JS Animation Engine
 * Designed for High-End Cinematic Web Interactions
 * =======================================================
 */

class Animaster {
    constructor() {
        this.revealSelector = '.an-reveal';
        this.splitTextSelector = '.an-split-text';
        this.magneticSelector = '[data-magnetic]';
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initSplitText();
            this.initScrollReveal();
            this.initMagneticElements();
            this.initCustomCursor();
            this.initSmoothScroll();
        });
    }

    // Splits text into characters wrapped in spans for staggered animations
    initSplitText() {
        const elements = document.querySelectorAll(this.splitTextSelector);
        elements.forEach(element => {
            const text = element.textContent.trim();
            element.textContent = '';
            
            // Split into words, then chars
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.classList.add('an-word');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                wordSpan.style.overflow = 'hidden'; // Essential for Clipping Mask Reveal
                wordSpan.style.verticalAlign = 'bottom';

                for (let i = 0; i < word.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = word[i];
                    charSpan.classList.add('an-char');
                    charSpan.style.display = 'inline-block';
                    charSpan.style.transform = 'translateY(110%)'; // Hidden below the overflow boundary
                    charSpan.style.opacity = '0';
                    charSpan.style.transition = 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease';
                    // Stagger calculation
                    const delay = (wordIndex * 2 + i) * 0.025;
                    charSpan.style.transitionDelay = `${delay}s`;
                    
                    wordSpan.appendChild(charSpan);
                }
                
                element.appendChild(wordSpan);
                
                // Add a space span after word (unless it's the last word)
                if (wordIndex < words.length - 1) {
                    const space = document.createElement('span');
                    space.innerHTML = '&nbsp;';
                    space.style.display = 'inline-block';
                    element.appendChild(space);
                }
            });
        });
    }

    // Scroll reveal using IntersectionObserver
    initScrollReveal() {
        const revealElements = document.querySelectorAll(this.revealSelector);
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('an-active');
                    
                    // If contains split text chars, trigger them
                    const chars = entry.target.querySelectorAll('.an-char');
                    chars.forEach(char => {
                        char.style.transform = 'translateY(0)';
                        char.style.opacity = '1';
                    });
                    
                    // Unobserve after activating to avoid repeats (unless user wants scroll-back effects)
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            // Apply initial styles based on classes
            if (el.classList.contains('an-fade-up')) {
                el.style.transform = 'translateY(50px)';
                el.style.opacity = '0';
                el.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease';
            } else if (el.classList.contains('an-fade-in')) {
                el.style.opacity = '0';
                el.style.transition = 'opacity 1.2s ease';
            } else if (el.classList.contains('an-scale-up')) {
                el.style.transform = 'scale(0.92)';
                el.style.opacity = '0';
                el.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease';
            }

            observer.observe(el);
        });

        // Setup class triggers for active status in css
        const style = document.createElement('style');
        style.textContent = `
            .an-reveal.an-active {
                transform: translate(0) scale(1) !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Magnetic cursor elements
    initMagneticElements() {
        const magneticElements = document.querySelectorAll(this.magneticSelector);
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const bound = el.getBoundingClientRect();
                const x = e.clientX - bound.left - bound.width / 2;
                const y = e.clientY - bound.top - bound.height / 2;
                
                // Pull element toward cursor (default factor 0.35)
                const strength = el.getAttribute('data-magnetic-strength') || 0.35;
                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                
                // If it has children inside to float offset
                const inner = el.querySelector('.an-magnetic-inner');
                if (inner) {
                    inner.style.transform = `translate(${x * strength * 0.5}px, ${y * strength * 0.5}px)`;
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                const inner = el.querySelector('.an-magnetic-inner');
                if (inner) {
                    inner.style.transform = '';
                }
            });
        });
    }

    // Premium custom cursor trail
    initCustomCursor() {
        // Disable on mobile/tablet devices
        if (window.innerWidth <= 1024) return;

        const cursorDot = document.createElement('div');
        const cursorRing = document.createElement('div');

        cursorDot.classList.add('an-cursor-dot');
        cursorRing.classList.add('an-cursor-ring');

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        // Core styling for custom cursors
        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            .an-cursor-dot {
                width: 6px;
                height: 6px;
                background-color: var(--accent-color, #d4af37);
                border-radius: 50%;
                position: fixed;
                top: 0;
                left: 0;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 9999;
                transition: width 0.3s ease, height 0.3s ease;
            }
            .an-cursor-ring {
                width: 36px;
                height: 36px;
                border: 1px solid var(--primary-color, #0b1a30);
                border-radius: 50%;
                position: fixed;
                top: 0;
                left: 0;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 9998;
                transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                            border-color 0.3s ease, background-color 0.3s ease, width 0.3s ease, height 0.3s ease;
            }
            body:hover .an-cursor-dot, body:hover .an-cursor-ring {
                opacity: 1;
            }
            .an-cursor-hover-active .an-cursor-ring {
                width: 50px;
                height: 50px;
                background-color: rgba(11, 26, 48, 0.05);
                border-color: var(--accent-color, #d4af37);
            }
            .an-cursor-hover-active .an-cursor-dot {
                width: 10px;
                height: 10px;
            }
        `;
        document.head.appendChild(cursorStyle);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth lagging animation for the ring
        const animateCursorRing = () => {
            // Lerp calculation
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(animateCursorRing);
        };
        animateCursorRing();

        // Handle interactive hover states
        const interactiveElements = 'a, button, input[type="range"], input[type="submit"], .sk-slider, .vg-glow-card, .clickable';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.add('an-cursor-hover-active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.remove('an-cursor-hover-active');
            }
        });
    }

    // High-performance smooth scrolling engine with inertial damping
    initSmoothScroll() {
        if (window.innerWidth <= 1024) return; // Skip on mobile/tablets for native touch scrolling

        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;
        const ease = 0.085; // Dampening inertia coefficient
        let isScrolling = false;

        // Wheel event listener to intercept scrolling
        window.addEventListener('wheel', (e) => {
            // Bypass if modals/menu drawer are active to prevent scrolling page behind overlay
            if (document.querySelector('.search-modal.active') || 
                document.querySelector('.login-modal.active') || 
                document.querySelector('.sk-drawer.active')) {
                return;
            }

            e.preventDefault();
            targetScrollY += e.deltaY * 0.9; // Dynamic scroll speed modifier

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(updateScroll);
            }
        }, { passive: false });

        // Update scroll state if page changes position natively (like anchors, tabs, keys)
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                targetScrollY = window.scrollY;
                currentScrollY = window.scrollY;
            }
        });

        const updateScroll = () => {
            currentScrollY += (targetScrollY - currentScrollY) * ease;
            window.scrollTo(0, currentScrollY);

            // Continue animation loop until scroll stabilizes
            if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
                requestAnimationFrame(updateScroll);
            } else {
                isScrolling = false;
            }
        };
    }
}

// Instantiate globally
const animaster = new Animaster();
window.animaster = animaster;
