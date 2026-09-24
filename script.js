/* ============================================================
   4X WEALTH — CINEMATIC WEBGL & GSAP ENGINE
   Includes Three.js coordinate scroll timeline and interactive panels
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ENTRANCE SEQUENCE (SMOOTH, ZERO-BLINK GSAP ENTRANCE)
  // Note: .hero-word is animated via pure 60fps CSS keyframes to prevent JS flicker
  // ==========================================
  function initializeEntranceAnimations() {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (document.querySelector('.hero-ivory-badge')) {
        tl.from('.hero-ivory-badge', { opacity: 0, y: -12, duration: 0.45 }, 0.05);
      }
      if (document.querySelector('.hero-sub-text')) {
        tl.from('.hero-sub-text', { opacity: 0, y: 14, duration: 0.5 }, 0.65);
      }
      if (document.querySelector('.hero-cta-group')) {
        tl.from('.hero-cta-group', { opacity: 0, y: 14, duration: 0.5 }, 0.8);
      }
      const trustCards = document.querySelectorAll('.hero-trust-grid > div');
      if (trustCards.length > 0) {
        tl.fromTo(trustCards, 
          { opacity: 0, y: 18, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(1.5)' },
          0.95
        );
      }
    }
  }
  initializeEntranceAnimations();

  // ==========================================
  // 2. GLOBAL SCROLL-TRIGGERED SEQUENTIAL POP FOR ALL CARDS (SMOOTH & PERMANENTLY VISIBLE)
  // ==========================================
  function initGlobalCardScrollPop() {
    const cardSelectors = [
      '.who-pillars-list',
      '.who-we-are-grid',
      '.philosophy-cycle-grid',
      '.diligence-steps-grid',
      '.approach-steps-container',
      '.universe-grid',
      '.pillars-3-grid',
      '.pillar-services-list',
      '.serve-5-grid',
      '.team-leadership-grid',
      '.team-execution-grid',
      '.partners-cards-grid',
      '.fb-steps-3',
      '.fb-metrics-bar',
      '.fb-grid',
      '.lab-stats-grid',
      '.lab-modules-container',
      '.sector-heatmap-grid',
      '.features-grid',
      '.product-metrics-grid',
      '.resources-cards-grid',
      '.blog-grid',
      '.blogs-page-grid',
      '.reports-grid',
      '.sif-kpi-grid',
      '.sif-controls-grid',
      '.testimonials-track'
    ];

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      cardSelectors.forEach(selector => {
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
          const items = Array.from(container.children).filter(el => 
            !el.classList.contains('gold-divider-wrap') && 
            !el.classList.contains('diligence-loop-connector')
          );
          if (items.length > 0) {
            ScrollTrigger.create({
              trigger: container,
              start: 'top 90%',
              once: true,
              onEnter: () => {
                gsap.fromTo(items, 
                  { opacity: 0, y: 24, scale: 0.96 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity', overwrite: 'auto' }
                );
              }
            });
          }
        });
      });
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children).filter(el => 
              !el.classList.contains('gold-divider-wrap') && 
              !el.classList.contains('diligence-loop-connector')
            );
            children.forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0) scale(1)';
              }, index * 70);
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(c => {
          Array.from(c.children).forEach(child => {
            if (!child.classList.contains('gold-divider-wrap') && !child.classList.contains('diligence-loop-connector')) {
              child.style.opacity = '0';
              child.style.transform = 'translateY(24px) scale(0.96)';
              child.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            }
          });
          observer.observe(c);
        });
      });
    }
  }
  initGlobalCardScrollPop();

  // ==========================================
  // 2. SMOOTH SCROLL (LENIS)
  // ==========================================
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Link Lenis to GSAP ScrollTrigger if both are loaded
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ==========================================
  // 3. THREE.JS CINEMATIC WEBGL ENGINE
  // ==========================================
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf0f4f8, 0.005);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(scene.fog.color);

    // Lighting (Brighter ambient for light theme reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x007aff, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLightBlue = new THREE.PointLight(0x007aff, 2.5, 100);
    pointLightBlue.position.set(-10, -5, -40);
    scene.add(pointLightBlue);

    const pointLightPink = new THREE.PointLight(0xff2d55, 3.5, 150);
    pointLightPink.position.set(10, 5, -150);
    scene.add(pointLightPink);

    // WebGL Content Groups
    const heroGroup = new THREE.Group();
    const corridorGroup = new THREE.Group();
    const labGroup = new THREE.Group();
    const footerGroup = new THREE.Group();
    scene.add(heroGroup);
    scene.add(corridorGroup);
    scene.add(labGroup);
    scene.add(footerGroup);

    // Set group visibility to false initially to prevent overlapping with Atrium Hero layout on landing
    corridorGroup.visible = false;
    labGroup.visible = false;
    footerGroup.visible = false;

    // --- A. HERO SCENE: Glass headquarters facade + Particles ---
    // Floating dust particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Custom circular point particle material (Adjusted for light theme)
    const pMaterial = new THREE.PointsMaterial({
      color: 0x007aff,
      size: 0.12,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending
    });
    const dustParticles = new THREE.Points(particleGeo, pMaterial);
    heroGroup.add(dustParticles);

    // --- B. CORRIDOR SCENE: Concentric square tunnel ---
    const corridorZStart = -60;
    const corridorZEnd = -130;
    const tunnelCount = 18;
    for (let i = 0; i < tunnelCount; i++) {
      const tZ = corridorZStart - (i * (Math.abs(corridorZEnd - corridorZStart) / tunnelCount));
      const size = 6 + Math.sin(i * 0.5) * 1.5;
      const shape = new THREE.RingGeometry(size, size + 0.04, 4);
      shape.rotateZ(Math.PI / 4); // Turn into diamonds
      
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x007aff : 0xff2d55,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(shape, ringMat);
      ring.position.set(0, 0, tZ);
      corridorGroup.add(ring);
    }

    // Holographic floating charts in corridor
    const chartGeo = new THREE.PlaneGeometry(8, 4, 10, 10);
    const chartWireMat = new THREE.MeshBasicMaterial({
      color: 0x007aff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    
    // Deform grid to represent dynamic markets
    const posAttr = chartGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const zOffset = Math.sin(vx * 0.8) * Math.cos(vy * 0.8) * 0.6;
      posAttr.setZ(i, zOffset);
    }
    
    const chartMesh1 = new THREE.Mesh(chartGeo, chartWireMat);
    chartMesh1.position.set(-6, 2, corridorZStart - 30);
    chartMesh1.rotation.y = 0.5;
    corridorGroup.add(chartMesh1);

    const chartMesh2 = new THREE.Mesh(chartGeo, chartWireMat);
    chartMesh2.position.set(6, -2, corridorZStart - 50);
    chartMesh2.rotation.y = -0.5;
    corridorGroup.add(chartMesh2);

    // --- C. AI HEDGE LAB SCENE: Central Rotating Core + Module Nodes ---
    const labCenterZ = -170;
    
    // Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const coreWire = new THREE.MeshBasicMaterial({
      color: 0x007aff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreWire);
    coreMesh.position.set(0, 0, labCenterZ);
    labGroup.add(coreMesh);

    // Outer core cloud points
    const coreCloudGeo = new THREE.SphereGeometry(5.2, 24, 24);
    const coreCloudPoints = new THREE.Points(coreCloudGeo, new THREE.PointsMaterial({
      color: 0xff2d55,
      size: 0.08,
      transparent: true,
      opacity: 0.4
    }));
    coreCloudPoints.position.set(0, 0, labCenterZ);
    labGroup.add(coreCloudPoints);

    // Interconnected Module Nodes
    const moduleCoords = [
      { x: -9, y: 5, z: labCenterZ - 10, color: 0x007aff },  // Portfolio (Blue)
      { x: 9, y: -4, z: labCenterZ - 5, color: 0xff2d55 },   // Risk (Pink)
      { x: -7, y: -6, z: labCenterZ - 15, color: 0xff9500 },  // Forecast (Orange)
      { x: 8, y: 7, z: labCenterZ - 20, color: 0x34aadc }    // Alternative (Light Blue)
    ];
    
    const nodeGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const nodesList = [];

    moduleCoords.forEach((coord) => {
      const nodeMat = new THREE.MeshPhongMaterial({
        color: coord.color,
        emissive: 0x050b14,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(coord.x, coord.y, coord.z);
      labGroup.add(node);
      nodesList.push(node);

      // Glowing connection line to core
      const linePoints = [];
      linePoints.push(new THREE.Vector3(0, 0, labCenterZ));
      linePoints.push(new THREE.Vector3(coord.x, coord.y, coord.z));
      
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: coord.color,
        transparent: true,
        opacity: 0.3
      });
      const linkLine = new THREE.Line(lineGeo, lineMat);
      labGroup.add(linkLine);
    });

    // --- D. FOOTER SCENE: Rotating wireframe globe ---
    const footerZ = -340;
    const globeGeo = new THREE.SphereGeometry(15, 30, 30);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x007aff,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const wireGlobe = new THREE.Mesh(globeGeo, globeMat);
    wireGlobe.position.set(0, -12, footerZ);
    footerGroup.add(wireGlobe);

    const globePointsGeo = new THREE.SphereGeometry(15.2, 20, 20);
    const globePoints = new THREE.Points(globePointsGeo, new THREE.PointsMaterial({
      color: 0xff2d55,
      size: 0.08,
      transparent: true,
      opacity: 0.25
    }));
    globePoints.position.set(0, -12, footerZ);
    footerGroup.add(globePoints);

    // Window resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================
    // 4. GSAP SCROLL TIMELINE (CAMERA MOVES)
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && document.getElementById('scroll-container')) {
      const cameraTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            heroGroup.visible = false;
            corridorGroup.visible = false;
            labGroup.visible = false;
            footerGroup.visible = false;
          }
        }
      });

      cameraTimeline
        // 1. Move camera down the glass building facade
        .to(camera.position, { z: -40, x: 0, y: 0, duration: 2 })
        // 2. Travel through the Corridor Diamond rings
        .to(camera.position, { z: -110, x: 1, y: -0.5, duration: 3 })
        // 3. Pan and focus into the AI Hedge Lab orbiting core
        .to(camera.position, { z: -160, x: -2, y: 1.5, duration: 4 })
        // 4. Move past the lab and align into the calm indices field
        .to(camera.position, { z: -250, x: 0, y: 0, duration: 3 })
        // 5. Tilt camera downwards to face the rotating wireglobe
        .to(camera.position, { z: -300, y: -8, duration: 3 })
        .to(camera.rotation, { x: -0.2, duration: 2 }, '<');
    }

    // Parallax mouse movements
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 3;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 3;
    });

    // ==========================================
    // 5. ANIMATION LOOP (60FPS WebGL Render)
    // ==========================================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Rotate elements
      dustParticles.rotation.y = elapsedTime * 0.02;
      dustParticles.rotation.x = elapsedTime * 0.015;

      chartMesh1.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
      chartMesh2.rotation.z = Math.cos(elapsedTime * 0.4) * 0.05;

      coreMesh.rotation.y = elapsedTime * 0.15;
      coreCloudPoints.rotation.y = -elapsedTime * 0.08;

      nodesList.forEach((node, idx) => {
        node.rotation.x = elapsedTime * 0.3 * (idx % 2 === 0 ? 1 : -1);
        node.rotation.y = elapsedTime * 0.2;
      });

      wireGlobe.rotation.y = elapsedTime * 0.05;
      globePoints.rotation.y = elapsedTime * 0.05;

      // Apply mouse parallax interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Apply offset only to the groups, preserving ScrollTrigger on the camera
      heroGroup.position.x = currentMouseX * 0.8;
      heroGroup.position.y = currentMouseY * 0.8;

      corridorGroup.position.x = currentMouseX * 1.5;
      corridorGroup.position.y = currentMouseY * 1.5;

      labGroup.position.x = currentMouseX * 2;
      labGroup.position.y = currentMouseY * 2;

      renderer.render(scene, camera);
    }
    animate();
  }

  // ==========================================
  // 6. SPOTLIGHT & CUSTOM CURSOR INTERACTS
  // ==========================================
  const spotlight = document.getElementById('spotlight');
  const cursorRing = document.getElementById('cursorRing');
  const cursorDot = document.getElementById('cursorDot');

  if (spotlight || cursorRing || cursorDot) {
    window.addEventListener('mousemove', (e) => {
      const tgtX = e.clientX;
      const tgtY = e.clientY;
      
      if (spotlight) {
        spotlight.style.left = `${tgtX}px`;
        spotlight.style.top = `${tgtY}px`;
      }
      if (cursorDot) {
        cursorDot.style.left = `${tgtX}px`;
        cursorDot.style.top = `${tgtY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${tgtX}px`;
        cursorRing.style.top = `${tgtY}px`;
      }
    }, { passive: true });

    // Hover states for links and interactive elements
    if (cursorRing) {
      document.querySelectorAll('.clickable, button, a, input, select, textarea, .glass-card, .blog-card, .stock-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (cursorRing) cursorRing.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          if (cursorRing) cursorRing.classList.remove('hovered');
        });
      });
    }
  }

  // 3D Glass tilt card logic (bounded, stable micro-tilt)
  document.querySelectorAll('.hover-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      
      // Bounded subtle micro-tilt (max ±2.5 degrees) for stable, premium feel
      const rotX = Math.max(-2.5, Math.min(2.5, -y * 0.008));
      const rotY = Math.max(-2.5, Math.min(2.5, x * 0.008));
      
      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
      card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 7. COUNTERS & TIMELINE GSAP SCRUB
  // ==========================================
  const triggerStatsScrub = () => {
    if (!document.getElementById('corridor-section') || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const statsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#corridor-section',
        start: 'top 80%',
        once: true
      }
    });

    statsTimeline.to({}, {
      duration: 1.6,
      onUpdate: function() {
        const progress = this.progress();
        const value1 = (14.2 * progress).toFixed(1);
        const value2 = Math.round(27 * progress);
        
        const el1 = document.getElementById('c-stat-1');
        const el2 = document.getElementById('c-stat-2');
        if (el1) el1.textContent = `₹${value1}B`;
        if (el2) el2.textContent = `${value2} YRS`;
      }
    });
  };
  triggerStatsScrub();

  // Highlight timeline progress line
  if (document.getElementById('timelineProgress') && document.querySelector('.timeline-container') && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to('#timelineProgress', {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: true
      }
    });
  }

  // ==========================================
  // 8. INTERACTIVE LAB MODULES PANEL
  // ==========================================
  const moduleData = {
    portfolio: {
      title: "PORTFOLIO INTELLIGENCE",
      desc: "Optimizes capital layouts dynamically using Modern Portfolio Theory (MPT) and covariance matrices to capture maximal returns at predefined risk levels.",
      activation: "98% PERFORMANCE",
      load: "0.14 TFLOPS"
    },
    risk: {
      title: "RISK MITIGATION ENGINE",
      desc: "Runs multi-factor scenario testing and downside probability simulations to calculate exact asset protection buffers during global macro contractions.",
      activation: "100% SECURE",
      load: "0.85 TFLOPS"
    },
    forecast: {
      title: "PREDICTIVE FORECAST CORE",
      desc: "Applies multi-layer LSTM neural net models on historical asset indices to forecast near-term vector movements.",
      activation: "78% CONVICTION",
      load: "1.42 TFLOPS"
    },
    alternative: {
      title: "ALTERNATIVE DATA INGEST",
      desc: "NLP models crawl public corporate filings, satellite logistic indices, and news feeds to ingest raw market sentiments.",
      activation: "ONLINE",
      load: "0.08 TFLOPS"
    }
  };

  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const infoActivation = document.getElementById('infoActivation');
  const infoLoad = document.getElementById('infoLoad');
  const infoPanel = document.getElementById('moduleInfoPanel');

  document.querySelectorAll('[data-module]').forEach(node => {
    node.addEventListener('mouseenter', () => {
      const modKey = node.getAttribute('data-module');
      const data = moduleData[modKey];
      
      if (data) {
        if (infoPanel && typeof gsap !== 'undefined') {
          gsap.to(infoPanel, { opacity: 0.4, y: 10, duration: 0.15, onComplete: () => {
            if (infoTitle) infoTitle.textContent = data.title;
            if (infoDesc) infoDesc.textContent = data.desc;
            if (infoActivation) infoActivation.textContent = data.activation;
            if (infoLoad) infoLoad.textContent = data.load;
            
            gsap.to(infoPanel, { opacity: 1, y: 0, duration: 0.25 });
          }});
        } else {
          if (infoTitle) infoTitle.textContent = data.title;
          if (infoDesc) infoDesc.textContent = data.desc;
          if (infoActivation) infoActivation.textContent = data.activation;
          if (infoLoad) infoLoad.textContent = data.load;
        }
      }
    });
  });

  // ==========================================
  // 9. COMPOUND SIP ENGINE CALCULATOR
  // ==========================================
  const sliderMonthly = document.getElementById('sliderMonthly');
  const sliderRate = document.getElementById('sliderRate');
  const sliderYears = document.getElementById('sliderYears');

  const monthlyVal = document.getElementById('monthlyVal');
  const returnVal = document.getElementById('returnVal');
  const periodVal = document.getElementById('periodVal');

  const simInvested = document.getElementById('simInvested');
  const simGained = document.getElementById('simGained');
  const simTotal = document.getElementById('simTotal');

  const fableChart = document.getElementById('fableChart');
  const lineTotal = document.getElementById('lineTotal');
  const lineInvested = document.getElementById('lineInvested');
  const areaTotal = document.getElementById('areaTotal');
  const areaInvested = document.getElementById('areaInvested');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  const calculateSIP = () => {
    if (!sliderMonthly || !sliderRate || !sliderYears) return;
    const P = Math.max(0, parseFloat(sliderMonthly.value) || 0);
    const r = Math.max(0, (parseFloat(sliderRate.value) || 0) / 100 / 12);
    const years = Math.max(1, parseInt(sliderYears.value) || 1);
    const n = years * 12;

    if (monthlyVal) monthlyVal.textContent = formatCurrency(P).replace('.00', '');
    if (returnVal) returnVal.textContent = `${sliderRate.value} %`;
    if (periodVal) periodVal.textContent = `${years} Years`;

    // Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const investedAmount = P * n;
    let totalFV = investedAmount;
    if (r > 0) {
      totalFV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }
    const wealthGained = Math.max(0, totalFV - investedAmount);

    if (simInvested) simInvested.textContent = formatCurrency(investedAmount).replace('.00', '');
    if (simGained) simGained.textContent = formatCurrency(wealthGained).replace('.00', '');
    if (simTotal) simTotal.textContent = formatCurrency(totalFV).replace('.00', '');

    // Render SVG path coordinates
    const width = 500;
    const height = 180;
    let pointsTotal = [];
    let pointsInvested = [];

    for (let i = 0; i <= years; i++) {
      const currentMonths = i * 12;
      const curInvested = P * currentMonths;
      let curTotal = curInvested;
      if (r > 0) {
        curTotal = P * ((Math.pow(1 + r, currentMonths) - 1) / r) * (1 + r);
      }

      const x = (i / years) * width;
      const yTotal = height - (totalFV > 0 ? (curTotal / totalFV) * (height - 20) : 0) - 10;
      const yInvested = height - (totalFV > 0 ? (curInvested / totalFV) * (height - 20) : 0) - 10;

      pointsTotal.push(`${x},${yTotal}`);
      pointsInvested.push(`${x},${yInvested}`);
    }

    const pathTotalStr = `M ${pointsTotal.join(' L ')}`;
    const pathInvestedStr = `M ${pointsInvested.join(' L ')}`;

    if (lineTotal) lineTotal.setAttribute('d', pathTotalStr);
    if (lineInvested) lineInvested.setAttribute('d', pathInvestedStr);

    if (areaTotal) areaTotal.setAttribute('d', `${pathTotalStr} L ${width},${height} L 0,${height} Z`);
    if (areaInvested) areaInvested.setAttribute('d', `${pathInvestedStr} L ${width},${height} L 0,${height} Z`);
  };

  if (sliderMonthly && sliderRate && sliderYears) {
    [sliderMonthly, sliderRate, sliderYears].forEach(slider => {
      slider.addEventListener('input', calculateSIP);
    });
    calculateSIP(); // Init on start
  }

  // ==========================================
  // 10. LIVE MARKET TICKER SIMULATION & REAL-TIME LOAD
  // ==========================================
  const tickerData = [
    { symbol: "NIFTY 50", name: "NIFTY 50", price: 24850.30, change: 0.65, logo: "N" },
    { symbol: "SENSEX", name: "SENSEX", price: 81420.15, change: 0.58, logo: "S" },
    { symbol: "RELIANCE", name: "Reliance", price: 2985.40, change: 1.12, logo: "R" },
    { symbol: "HDFC BANK", name: "HDFC Bank", price: 1642.50, change: 0.45, logo: "H" },
    { symbol: "TCS", name: "TCS", price: 4210.80, change: -0.32, logo: "T" },
    { symbol: "INFOSYS", name: "Infosys", price: 1785.20, change: 0.88, logo: "I" },
    { symbol: "ICICI BANK", name: "ICICI Bank", price: 1195.60, change: 0.72, logo: "I" },
    { symbol: "SBI", name: "SBI", price: 835.40, change: 1.05, logo: "S" },
    { symbol: "BHARTI AIRTEL", name: "Bharti Airtel", price: 1817.20, change: 0.65, logo: "B" },
    { symbol: "L&T", name: "L&T", price: 3560.00, change: -0.25, logo: "L" },
    { symbol: "TATA MOTORS", name: "Tata Motors", price: 985.40, change: 1.45, logo: "T" },
    { symbol: "ITC", name: "ITC", price: 482.60, change: 0.35, logo: "I" },
    { symbol: "KOTAK BANK", name: "Kotak Bank", price: 1792.10, change: -0.42, logo: "K" },
    { symbol: "AXIS BANK", name: "Axis Bank", price: 1178.50, change: 0.68, logo: "A" },
    { symbol: "HUL", name: "HUL", price: 2654.30, change: -0.18, logo: "H" },
    { symbol: "BAJAJ FINANCE", name: "Bajaj Finance", price: 7240.00, change: 1.25, logo: "B" },
    { symbol: "M&M", name: "M&M", price: 2890.50, change: 0.92, logo: "M" },
    { symbol: "NTPC", name: "NTPC", price: 392.40, change: 0.55, logo: "N" },
    { symbol: "HCL TECH", name: "HCL Tech", price: 1634.00, change: -0.65, logo: "H" },
    { symbol: "MARUTI", name: "Maruti", price: 12450.00, change: 0.78, logo: "M" },
    { symbol: "SUN PHARMA", name: "Sun Pharma", price: 1710.20, change: -0.30, logo: "S" },
    { symbol: "TITAN", name: "Titan", price: 3420.00, change: 1.15, logo: "T" },
    { symbol: "ULTRATECH", name: "UltraTech", price: 11250.00, change: -0.40, logo: "U" },
    { symbol: "POWER GRID", name: "Power Grid", price: 318.50, change: 0.42, logo: "P" },
    { symbol: "COAL INDIA", name: "Coal India", price: 492.00, change: 1.80, logo: "C" },
    { symbol: "TATA STEEL", name: "Tata Steel", price: 158.40, change: 0.95, logo: "T" },
    { symbol: "ASIAN PAINTS", name: "Asian Paints", price: 2860.00, change: -0.52, logo: "A" },
    { symbol: "JSW STEEL", name: "JSW Steel", price: 945.00, change: 0.82, logo: "J" }
  ];

  const marqueeTrack = document.getElementById('marketMarqueeTrack');
  if (marqueeTrack) {
    let isInitialRender = true;

    const renderMovers = (data) => {
      if (!Array.isArray(data) || data.length === 0) return;
      if (isInitialRender || marqueeTrack.children.length === 0) {
        let htmlContent = '';
        data.forEach(stock => {
          if (!stock) return;
          const price = Number(stock.price) || 0;
          const change = Number(stock.change) || 0;
          const isPositive = change >= 0;
          const cardClass = isPositive ? 'positive' : 'negative';
          const arrow = isPositive ? '▲' : '▼';
          const sign = isPositive ? '+' : '';
          
          htmlContent += `
            <div class="stock-card ${cardClass}" data-ticker-symbol="${stock.symbol || ''}">
              <div class="stock-logo-container">${stock.logo || (stock.name ? stock.name[0] : '•')}</div>
              <span class="stock-symbol">${stock.name || stock.symbol || ''}</span>
              <span class="stock-price">₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span class="stock-change ${cardClass}">${arrow} ${sign}${change.toFixed(2)}%</span>
            </div>
            <span class="marquee-separator">✦</span>
          `;
        });
        marqueeTrack.innerHTML = htmlContent + htmlContent;
        marqueeTrack.style.animation = 'none';
        void marqueeTrack.offsetWidth; // reflow trigger
        marqueeTrack.style.animation = '';
        isInitialRender = false;
      } else {
        data.forEach(stock => {
          if (!stock) return;
          const price = Number(stock.price) || 0;
          const change = Number(stock.change) || 0;
          const isPositive = change >= 0;
          const cardClass = isPositive ? 'positive' : 'negative';
          const arrow = isPositive ? '▲' : '▼';
          const sign = isPositive ? '+' : '';
          const newPriceText = `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          const newChangeText = `${arrow} ${sign}${change.toFixed(2)}%`;
          
          const cards = marqueeTrack.querySelectorAll(`[data-ticker-symbol="${stock.symbol}"]`);
          cards.forEach(card => {
            const priceEl = card.querySelector('.stock-price');
            const changeEl = card.querySelector('.stock-change');
            if (priceEl && priceEl.textContent !== newPriceText) {
              priceEl.textContent = newPriceText;
              card.classList.add('tick-flash');
              setTimeout(() => card.classList.remove('tick-flash'), 600);
            }
            if (changeEl && changeEl.textContent !== newChangeText) {
              changeEl.textContent = newChangeText;
            }
            card.className = `stock-card ${cardClass}`;
            if (changeEl) {
              changeEl.className = `stock-change ${cardClass}`;
            }
            card.setAttribute('data-ticker-symbol', stock.symbol);
          });
        });
      }
    };

    // ── RENDER IMMEDIATELY from local fallback (works on static Netlify too) ──
    renderMovers(tickerData);

    // ── Then try to fetch live data and update ──
    const loadRealtimeStocks = () => {
      fetch('stocks_data.json?t=' + Date.now(), { cache: 'no-store' })
        .then(response => {
          if (!response.ok) throw new Error('File not found');
          return response.json();
        })
        .then(data => {
          if (data && data.length > 0) renderMovers(data);
        })
        .catch(() => {
          // Keep existing render, do nothing
        });
    };

    // Fetch live data after short delay (let animation start first)
    setTimeout(loadRealtimeStocks, 1000);

    // Poll for NSE live updates every 10 seconds
    setInterval(loadRealtimeStocks, 10000);
  }

  // ==========================================
  // 11. NAVIGATION, SEARCH & COMPLIANCE MODALS
  // ==========================================
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const searchModalClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('searchInput');
  const searchResultsList = document.getElementById('searchResultsList');

  // Header Scroll Class toggle (Always keep navbar accessible)
  const siteHeader = document.getElementById('mainHeader') || document.querySelector('.header-wrapper');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // --- A. LIVE SITE SEARCH INDEX & ENGINE ---
  const SITE_INDEX = [
    { title: "Mutual Funds Overview", desc: "Systematic SIP & Diversified Equity/Debt Funds", url: "mutual-funds.html", category: "Invest" },
    { title: "Direct Equity & Stocks", desc: "Exchange-listed equities & fundamental diligence", url: "stocks.html", category: "Invest" },
    { title: "Portfolio Management Services (PMS)", desc: "Discretionary & Non-Discretionary Mandates (₹50L+)", url: "pms.html", category: "Invest" },
    { title: "Alternative Investment Funds (AIF)", desc: "Category I, II & III Private Mandates (₹1 Cr+)", url: "aif.html", category: "Invest" },
    { title: "Specialized Investment Funds (SIF) Tracker", desc: "Live SIF Screener & NAV synchronizer (₹10L+)", url: "sif-tracker.html", category: "Tools" },
    { title: "Full SIF Screener Engine", desc: "Institutional filtering with advanced metrics", url: "sif-screener.html", category: "Tools" },
    { title: "Unlisted Shares & Pre-IPO", desc: "Private market assets & growth equity access", url: "unlisted-shares.html", category: "Invest" },
    { title: "Government & Sovereign Bonds", desc: "Sovereign-backed dated securities & primary yield", url: "bonds.html", category: "Preserve" },
    { title: "Corporate Fixed Income", desc: "Institutional yield structures & credit instruments", url: "bonds.html#corporate", category: "Preserve" },
    { title: "Life & Asset Insurance", desc: "Keyman, Term & Comprehensive risk protection", url: "insurance.html", category: "Protect" },
    { title: "National Pension System (NPS)", desc: "Tier I & Tier II low-cost pension wealth creation", url: "retirement-planning.html#nps", category: "Plan" },
    { title: "Retirement Corpus Planner", desc: "Inflation-adjusted retirement income modeling", url: "retirement-planning.html", category: "Plan" },
    { title: "Goal-Based Wealth Planning", desc: "Milestone-driven family wealth & legacy mandates", url: "goal-planning.html", category: "Plan" },
    { title: "Tax Optimization & ELSS", desc: "Section 80C compliance & capital gains harvesting", url: "tax-planning.html", category: "Plan" },
    { title: "Corporate Treasury & Cash Optimization", desc: "Enterprise cash flow & overnight liquidity yields", url: "corporate-wealth.html", category: "Corporate" },
    { title: "GIFT City IFSC Cross-Border Desk", desc: "Foreign currency assets & global investment mandates", url: "gift-city.html", category: "Global" },
    { title: "NRI Global Wealth Services", desc: "FEMA compliance, NRE/NRO portfolios & repatriation", url: "nri-services.html", category: "Global" },
    { title: "SIP Compounding Calculator", desc: "Calculate compounding growth for monthly SIPs", url: "calculators.html#card-sip", category: "Calculators" },
    { title: "Lumpsum Growth Planner", desc: "Project multi-year compound interest on lump sums", url: "calculators.html#card-lumpsum", category: "Calculators" },
    { title: "SWP Cash Flow Engine", desc: "Systematic monthly payout withdrawal calculator", url: "calculators.html#card-swp", category: "Calculators" },
    { title: "EMI & Loan Amortization", desc: "Schedule loan principal & interest payments", url: "calculators.html#card-emi", category: "Calculators" },
    { title: "FIRE Freedom Calculator", desc: "Calculate Financial Independence Retire Early target", url: "calculators.html#card-fire", category: "Calculators" },
    { title: "AI Hedge Lab & Quant Core", desc: "Quantitative conviction signals & volatility models", url: "hedge-lab.html", category: "Research" },
    { title: "Market Insights & Blogs", desc: "Expert wealth intelligence & market commentary", url: "blogs.html", category: "Insights" },
    { title: "About 4X Wealth", desc: "Leadership, working principles & institutional partners", url: "about.html", category: "About" }
  ];

  function renderSearchResults(query = '') {
    if (!searchResultsList) return;
    const q = query.trim().toLowerCase();
    const results = q ? SITE_INDEX.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    ) : SITE_INDEX.slice(0, 8);

    if (results.length === 0) {
      searchResultsList.innerHTML = `<div style="text-align: center; padding: 2rem; color: #6B7280; font-size: 14px;">No matching results found for "${query}". Try searching for <em>SIP</em>, <em>PMS</em>, <em>Bonds</em>, or <em>Calculators</em>.</div>`;
      return;
    }

    searchResultsList.innerHTML = results.map(item => `
      <a href="${item.url}" class="search-result-item clickable">
        <div class="search-result-info">
          <h4 style="color:#1C2333;">${item.title}</h4>
          <p style="color:#6B7280;">${item.desc}</p>
        </div>
        <span class="search-result-badge">${item.category}</span>
      </a>
    `).join('');
  }

  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      if (searchModal) {
        searchModal.classList.add('open');
        renderSearchResults('');
        if (searchInput) {
          searchInput.value = '';
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    });
  }

  if (searchModalClose) {
    searchModalClose.addEventListener('click', () => {
      if (searchModal) searchModal.classList.remove('open');
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('open');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  document.querySelectorAll('.search-tag-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const tag = chip.getAttribute('data-tag') || chip.textContent.trim();
      if (searchInput) {
        searchInput.value = tag;
        renderSearchResults(tag);
      }
    });
  });

  // --- B. 3-TIER LOGIN & SIGN-UP MODAL ENGINE ---
  const loginModal = document.getElementById('loginModal');
  const loginCloseBtn = document.getElementById('loginCloseBtn');

  const switchLoginTab = (mode = 'retail', authType = 'login') => {
    if (mode === 'client') mode = 'corporate';
    
    const modalTypeHeader = document.getElementById('modalTypeHeader');
    if (modalTypeHeader) {
      modalTypeHeader.textContent = authType === 'signup' ? `${mode.toUpperCase()} SIGN UP PORTAL` : `${mode.toUpperCase()} CLIENT PORTAL`;
    }

    const tabRetailBtn = document.getElementById('tabRetailBtn');
    const tabCorporateBtn = document.getElementById('tabCorporateBtn');
    const tabPartnerBtn = document.getElementById('tabPartnerBtn');

    const retailFormContainer = document.getElementById('retailFormContainer');
    const corporateFormContainer = document.getElementById('corporateFormContainer');
    const partnerFormContainer = document.getElementById('partnerFormContainer');

    [tabRetailBtn, tabCorporateBtn, tabPartnerBtn].forEach(b => { if (b) b.classList.remove('active'); });
    [retailFormContainer, corporateFormContainer, partnerFormContainer].forEach(f => { if (f) f.style.display = 'none'; });

    if (mode === 'retail') {
      if (tabRetailBtn) tabRetailBtn.classList.add('active');
      if (retailFormContainer) retailFormContainer.style.display = 'block';
    } else if (mode === 'partner') {
      if (tabPartnerBtn) tabPartnerBtn.classList.add('active');
      if (partnerFormContainer) partnerFormContainer.style.display = 'block';
    } else {
      if (tabCorporateBtn) tabCorporateBtn.classList.add('active');
      if (corporateFormContainer) corporateFormContainer.style.display = 'block';
    }
  };

  const openLogin = (mode = 'retail', authType = 'login') => {
    switchLoginTab(mode, authType);
    if (loginModal) loginModal.classList.add('open');
  };

  const closeLogin = () => {
    if (loginModal) loginModal.classList.remove('open');
  };

  document.querySelectorAll('.login-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      const mode = btn.getAttribute('data-login-mode') || 'retail';
      openLogin(mode, 'login');
    });
  });

  document.querySelectorAll('.signup-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      const mode = btn.getAttribute('data-signup-mode') || 'retail';
      openLogin(mode, 'signup');
    });
  });

  if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeLogin();
    });
  }

  const elTabRetail = document.getElementById('tabRetailBtn');
  const elTabCorp = document.getElementById('tabCorporateBtn');
  const elTabPartner = document.getElementById('tabPartnerBtn');

  if (elTabRetail) elTabRetail.addEventListener('click', () => switchLoginTab('retail'));
  if (elTabCorp) elTabCorp.addEventListener('click', () => switchLoginTab('corporate'));
  if (elTabPartner) elTabPartner.addEventListener('click', () => switchLoginTab('partner'));

  // --- C. REGULATORY & LEGAL COMPLIANCE MODAL ---
  const LEGAL_DOCS = {
    disclaimer: {
      title: "Regulatory & Investment Disclaimer",
      badge: "AMFI & APMI REGULATORY MANDATE",
      content: `
        <h4>Mutual Fund & Market Risk Disclosure</h4>
        <p>Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. 4X Wealth Financial Services operates strictly as an AMFI Registered Mutual Fund Distributor (ARN-268488) and APMI Registered PMS Desk (APRN00969).</p>
        <h4>No Guaranteed Returns</h4>
        <p>None of the investment products, calculators, or market signals presented on this platform constitute a guarantee of principal capital or minimum periodic return. Asset allocation decisions should be made based on individual risk tolerance, investment horizon, and financial goals.</p>
        <h4>Portfolio Management & AIF Regulations</h4>
        <p>PMS investments are governed by SEBI (Portfolio Managers) Regulations 2020 with a minimum statutory investment threshold of ₹50 Lakhs. AIF Category I, II & III investments are governed by SEBI (Alternative Investment Funds) Regulations 2012 with a minimum statutory investment threshold of ₹1 Crore.</p>
      `
    },
    commission: {
      title: "Commission & Brokerage Disclosure",
      badge: "SEBI CIRCULAR COMPLIANCE",
      content: `
        <h4>AMFI Code of Conduct Compliance</h4>
        <p>In accordance with SEBI Circular No. SEBI/IMD/CIR No. 4/168230/09 and AMFI guidelines, 4X Wealth Financial Services discloses all transaction charges and trail commissions receivable from Asset Management Companies (AMCs) across regular mutual fund schemes.</p>
        <h4>Commission Schedule Overview</h4>
        <p>&bull; Equity & Growth Schemes: Trail commission ranging between 0.40% to 1.10% p.a.<br>
        &bull; Hybrid & Multi-Asset Schemes: Trail commission ranging between 0.35% to 0.90% p.a.<br>
        &bull; Debt & Fixed Income Schemes: Trail commission ranging between 0.10% to 0.50% p.a.<br>
        &bull; Liquid & Overnight Funds: Trail commission ranging between 0.05% to 0.15% p.a.</p>
        <p>Detailed AMC-wise commission sheets are furnished to clients annually and available on request.</p>
      `
    },
    privacy: {
      title: "Client Data Privacy Policy",
      badge: "DPDP ACT 2023 & IT ACT COMPLIANT",
      content: `
        <h4>Commitment to Data Security</h4>
        <p>4X Wealth Financial Services is committed to safeguarding client confidentiality. All PAN, KYC, financial holding, and bank communication records are encrypted with 256-bit SSL protocols.</p>
        <h4>Use of Personal Data</h4>
        <p>Client information collected is utilized exclusively for KYC compliance, portfolio reporting, AMFI/SEBI regulatory audits, and providing requested wealth services. We do not sell, rent, or monetize client personal data to third-party advertisers under any circumstances.</p>
      `
    },
    terms: {
      title: "Terms & Conditions of Service",
      badge: "LEGAL USER AGREEMENT",
      content: `
        <h4>Website Usage & Intellectual Property</h4>
        <p>The content, calculators, quant algorithms, research commentary, and visual layouts on this portal are the proprietary intellectual property of 4X Wealth Financial Services. Unauthorized scraping, reproduction, or distribution is strictly prohibited.</p>
        <h4>Informational & Advisory Boundaries</h4>
        <p>Digital calculators and wealth simulators provide indicative projections based on mathematical assumptions and user-entered variables. These do not constitute personalized tax or legal advice.</p>
      `
    },
    sid: {
      title: "SID / SAI / KIM Scheme Documents",
      badge: "SCHEME DISCLOSURES",
      content: `
        <h4>Statutory Scheme Information Access</h4>
        <p>Investors are advised to review the Scheme Information Document (SID), Statement of Additional Information (SAI), and Key Information Memorandum (KIM) before investing in any mutual fund or PMS mandate.</p>
        <p>All official SID, SAI, and KIM documents for partnered AMCs are available on the respective AMC websites and AMFI India portal (amfiindia.com). Our advisors provide physical and digital copies upon request.</p>
      `
    },
    grievance: {
      title: "Investor Grievance Redressal Mechanism",
      badge: "3-LEVEL ESCALATION MATRIX",
      content: `
        <h4>Level 1: Client Relations Desk</h4>
        <p>Email: support@4xwealth.com | Phone: +91 98200 00000 | Response Time: Within 24-48 Business Hours.</p>
        <h4>Level 2: Principal Compliance Officer</h4>
        <p>Email: compliance@4xwealth.com | Address: 4X Wealth Financial Services, Thane, Mumbai (HQ), Maharashtra, India | Resolution Time: Within 7 Business Days.</p>
        <h4>Level 3: Regulatory SCORES Portal</h4>
        <p>If unresolved, investors may escalate grievances directly to SEBI through the SCORES portal at <strong>https://scores.gov.in</strong> or the SMART ODR platform at <strong>https://smartodr.in</strong>.</p>
      `
    },
    charter: {
      title: "AMFI & SEBI Investor Charter",
      badge: "RIGHTS & DUTIES OF INVESTORS",
      content: `
        <h4>Rights of the Investor</h4>
        <p>&bull; Right to receive fair, transparent, and non-discriminatory service.<br>
        &bull; Right to transparent disclosure of fees, commissions, and risk factors.<br>
        &bull; Right to periodic portfolio account statements and audited holding reports.<br>
        &bull; Right to prompt grievance redressal within stipulated regulatory timelines.</p>
        <h4>Duties of the Investor</h4>
        <p>&bull; Provide accurate KYC documents, valid PAN, and updated bank records.<br>
        &bull; Deal only through registered intermediaries with verified ARN/APRN credentials.<br>
        &bull; Read scheme riskometers and asset allocation limits prior to transaction execution.</p>
      `
    }
  };

  function openLegalModal(docKey) {
    const doc = LEGAL_DOCS[docKey] || LEGAL_DOCS.disclaimer;
    let modal = document.getElementById('legalModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'legal-modal';
      modal.id = 'legalModal';
      modal.innerHTML = `
        <div class="legal-modal-card">
          <button class="login-close" id="legalModalClose"><i class="fa-solid fa-xmark"></i></button>
          <div class="legal-modal-header">
            <span class="section-tag-badge" id="legalModalBadge" style="margin-bottom: 8px;"></span>
            <h3 id="legalModalTitle"></h3>
          </div>
          <div class="legal-modal-body" id="legalModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('#legalModalClose')) {
          modal.classList.remove('open');
        }
      });
    }

    document.getElementById('legalModalBadge').textContent = doc.badge;
    document.getElementById('legalModalTitle').textContent = doc.title;
    document.getElementById('legalModalBody').innerHTML = doc.content;
    modal.classList.add('open');
  }

  // Bind all legal links across the page
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;
    const text = target.textContent.trim().toLowerCase();
    
    if (text.includes('disclaimer') || text.includes('regulatory disclaimer')) {
      e.preventDefault();
      openLegalModal('disclaimer');
    } else if (text.includes('commission')) {
      e.preventDefault();
      openLegalModal('commission');
    } else if (text.includes('privacy')) {
      e.preventDefault();
      openLegalModal('privacy');
    } else if (text.includes('terms')) {
      e.preventDefault();
      openLegalModal('terms');
    } else if (text.includes('sid') || text.includes('sai') || text.includes('kim')) {
      e.preventDefault();
      openLegalModal('sid');
    } else if (text.includes('grievance') || text.includes('redressal')) {
      e.preventDefault();
      openLegalModal('grievance');
    } else if (text.includes('charter')) {
      e.preventDefault();
      openLegalModal('charter');
    } else if (text.includes('arn registration')) {
      e.preventDefault();
      openLegalModal('disclaimer');
    } else if (text.includes('forms & download') || text.includes('forms & downloads')) {
      e.preventDefault();
      alert("4X Wealth Document Vault: Client KYC Forms, Nominee Update Forms, and AMFI Transfer Requests are available by emailing support@4xwealth.com.");
    } else if (text.includes('thane, mumbai') || text.includes('support terminal')) {
      e.preventDefault();
      const consult = document.getElementById('consultation-section') || document.querySelector('footer');
      if (consult) consult.scrollIntoView({ behavior: 'smooth' });
    } else if (text.includes('reset key') || text.includes('forgot password')) {
      e.preventDefault();
      alert("Password Reset: A secure verification OTP and link have been dispatched to your registered email/mobile.");
    }
  });

  // --- D. MOBILE DRAWER & NAVBAR INTERACTION ---
  const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const openMobileMenu = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
  };
  const closeMobileMenu = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
  };
  if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openMobileMenu);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.sk-drawer-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Dropdown hover & click behavior: Allow direct navigation on page links
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    const triggerLink = trigger.querySelector('.sk-nav-link');
    trigger.addEventListener('mouseenter', () => trigger.classList.add('active'));
    trigger.addEventListener('mouseleave', () => trigger.classList.remove('active'));
    
    if (triggerLink) {
      triggerLink.addEventListener('click', (e) => {
        const href = triggerLink.getAttribute('href');
        // If it points to an anchor on same page, toggle or scroll
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        // If it points to another page (.html), let standard browser click proceed
      });
    }
  });

  // Close dropdown on submenu item click
  document.querySelectorAll('.dropdown-link, .mega-link').forEach(link => {
    link.addEventListener('click', (e) => {
      dropdownTriggers.forEach(t => t.classList.remove('active'));
    });
  });

  // Close dropdowns on click outside
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-trigger')) {
      dropdownTriggers.forEach(t => t.classList.remove('active'));
    }
  });

  // Dedicated Book Consultation / Anchor Smooth Scroll Handler
  document.querySelectorAll('a[href*="#consultation-section"], .book-consult-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      const target = document.getElementById('consultation-section');
      const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
      if (target && (isHomePage || href === '#consultation-section')) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, '#consultation-section');
        }
      }
    });
  });

  // CTA consultation submit response
  const consultForm = document.getElementById('consultationForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Consultation Request Logged! An AMFI Registered partner will contact you shortly to schedule your wealth review.");
      consultForm.reset();
    });
  }

  // ==========================================
  // 12. ATRIUM SCENE DRAWING LOOP (2D CANVAS)
  // ==========================================
  const atriumCanvas = document.getElementById('atriumCanvas');
  const actx = atriumCanvas ? atriumCanvas.getContext('2d') : null;
  let aW, aH, aDPR;

  if (atriumCanvas && actx) {
    function resizeAtrium() {
      if (!atriumCanvas || !actx) return;
      aDPR = Math.min(window.devicePixelRatio || 1, 2);
      aW = atriumCanvas.clientWidth = atriumCanvas.offsetWidth;
      aH = atriumCanvas.clientHeight = atriumCanvas.offsetHeight;
      atriumCanvas.width = aW * aDPR;
      atriumCanvas.height = aH * aDPR;
      actx.setTransform(aDPR, 0, 0, aDPR, 0, 0);
    }
    window.addEventListener('resize', resizeAtrium);
    resizeAtrium();

    function drawAtrium(t) {
      if (!atriumCanvas || !actx) return;
      actx.clearRect(0, 0, aW, aH);
      
      // Sky gradient (Soft logo-complementary ice blue)
      const skyGrd = actx.createLinearGradient(0, 0, 0, aH * 0.4);
      skyGrd.addColorStop(0, '#f0f4f8');
      skyGrd.addColorStop(1, '#e5edf5');
      actx.fillStyle = skyGrd;
      actx.fillRect(0, 0, aW, aH * 0.42);

      // Distant glass mullions (subtle blue lines)
      actx.strokeStyle = 'rgba(0, 122, 255, 0.05)';
      actx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (aW / 10) * i;
        actx.beginPath();
        actx.moveTo(x, 0);
        actx.lineTo(x * 0.85 + aW * 0.075, aH * 0.42);
        actx.stroke();
      }

      // Sunlight column (Updated from yellow to brand pink)
      const sunX = aW * 0.62 + Math.sin(t * 0.00006) * 30;
      const sunGrd = actx.createRadialGradient(sunX, -40, 0, sunX, -40, aH * 0.9);
      sunGrd.addColorStop(0, 'rgba(255, 230, 240, 0.75)');
      sunGrd.addColorStop(0.35, 'rgba(255, 45, 85, 0.15)');
      sunGrd.addColorStop(1, 'rgba(255, 45, 85, 0)');
      actx.fillStyle = sunGrd;
      actx.fillRect(0, 0, aW, aH * 0.7);

      // Marble floor (Cool ice-blue/slate)
      const floorY = aH * 0.42;
      const floorGrd = actx.createLinearGradient(0, floorY, 0, aH);
      floorGrd.addColorStop(0, '#e5edf5');
      floorGrd.addColorStop(1, '#d5e0eb');
      actx.fillStyle = floorGrd;
      actx.fillRect(0, floorY, aW, aH - floorY);

      // Marble veining (Subtle blue)
      actx.strokeStyle = 'rgba(0, 122, 255, 0.06)';
      actx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        actx.beginPath();
        const sx = (i * 137) % aW;
        const sy = floorY + 20 + ((i * 53) % (aH - floorY - 20));
        actx.moveTo(sx, sy);
        actx.bezierCurveTo(sx + 80, sy + 10, sx + 140, sy - 14, sx + 240, sy + 8);
        actx.stroke();
      }
      
      // Floor reflection of sunlight column (Updated from yellow to brand pink)
      const reflGrd = actx.createLinearGradient(sunX - 80, floorY, sunX + 80, aH);
      reflGrd.addColorStop(0, 'rgba(255, 255, 255, 0)');
      reflGrd.addColorStop(0.5, 'rgba(255, 45, 85, 0.2)');
      reflGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
      actx.fillStyle = reflGrd;
      actx.beginPath();
      actx.moveTo(sunX - 70, floorY);
      actx.lineTo(sunX + 70, floorY);
      actx.lineTo(sunX + 140, aH);
      actx.lineTo(sunX - 140, aH);
      actx.closePath();
      actx.fill();

      // Vertical glass wall reflections (gorgeous bands)
      actx.globalAlpha = 0.5;
      for (let i = 0; i < 5; i++) {
        const bx = aW * 0.08 + i * aW * 0.21 + Math.sin(t * 0.00004 + i) * 6;
        const bg = actx.createLinearGradient(bx, 0, bx + 40, 0);
        bg.addColorStop(0, 'rgba(255, 255, 255, 0)');
        bg.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
        bg.addColorStop(1, 'rgba(255, 255, 255, 0)');
        actx.fillStyle = bg;
        actx.fillRect(bx, 0, 40, floorY);
      }
      actx.globalAlpha = 1;

      // Framing tree silhouettes (slate grey trees)
      drawTree(aW * 0.06, floorY, 1.0, 0.1);
      drawTree(aW * 0.94, floorY, -1.0, 0.08);

      requestAnimationFrame(drawAtrium);
    }

    function drawTree(x, floorY, dir, alpha) {
      if (!actx) return;
      actx.save();
      actx.globalAlpha = alpha;
      actx.fillStyle = '#475569';
      actx.beginPath();
      actx.ellipse(x, floorY - 160, 46, 90, 0, 0, Math.PI * 2);
      actx.fill();
      actx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      actx.fillRect(x - 4, floorY - 70, 8, 72);
      actx.restore();
    }
    requestAnimationFrame(drawAtrium);
  }

  // ==========================================
  // 13. LIGHT RAYS CANVAS DRAWING LOOP
  // ==========================================
  const rayCanvas = document.getElementById('rayCanvas');
  const rctx = rayCanvas ? rayCanvas.getContext('2d') : null;

  if (rayCanvas && rctx) {
    function sizeRays() {
      if (!rayCanvas) return;
      rayCanvas.width = rayCanvas.clientWidth * 1.5;
      rayCanvas.height = rayCanvas.clientHeight * 1.5;
    }
    window.addEventListener('resize', sizeRays);
    sizeRays();

    function drawRays(t) {
      if (!rayCanvas || !rctx) return;
      const w = rayCanvas.width;
      const h = rayCanvas.height;
      rctx.clearRect(0, 0, w, h);
      
      const originX = w * 0.62;
      const originY = -20;
      rctx.save();
      for (let i = 0; i < 6; i++) {
        const spread = 0.09 + i * 0.02;
        const angle = -Math.PI / 2 + (i - 2.5) * spread + Math.sin(t * 0.00008 + i) * 0.01;
        const len = h * 1.3;
        const x2 = originX + Math.cos(angle) * len;
        const y2 = originY + Math.sin(angle) * len + len;
        
        const grd = rctx.createLinearGradient(originX, originY, x2, y2);
        grd.addColorStop(0, 'rgba(0, 122, 255, 0.08)');
        grd.addColorStop(1, 'rgba(0, 122, 255, 0)');
        rctx.fillStyle = grd;
        rctx.beginPath();
        rctx.moveTo(originX - 4, originY);
        rctx.lineTo(originX + 4, originY);
        rctx.lineTo(x2 + 40, y2);
        rctx.lineTo(x2 - 40, y2);
        rctx.closePath();
        rctx.fill();
      }
      rctx.restore();
      requestAnimationFrame(drawRays);
    }
    requestAnimationFrame(drawRays);
  }

  // ==========================================
  // 14. WALKING FIGURE CYCLE LOOP
  // ==========================================
  let walkT = 0;
  function animateWalker() {
    const legL = document.getElementById('legL');
    const legR = document.getElementById('legR');
    const armL = document.getElementById('armL');
    const armR = document.getElementById('armR');
    const walker = document.getElementById('walker');
    if (!legL || !legR || !armL || !armR || !walker) return;

    walkT += 0.05;
    const swing = Math.sin(walkT) * 16;
    legL.setAttribute('transform', `rotate(${swing} 51 148)`);
    legR.setAttribute('transform', `rotate(${-swing} 68 148)`);
    armL.setAttribute('transform', `rotate(${-swing * 0.8} 40 78)`);
    armR.setAttribute('transform', `rotate(${swing * 0.8} 80 78)`);
    
    const bob = Math.abs(Math.sin(walkT)) * 2;
    walker.setAttribute('transform', `translate(0 ${-bob})`);
    requestAnimationFrame(animateWalker);
  }
  animateWalker();

  // ==========================================
  // 15. DRAW GROWTH SPARKLINE GRAPH
  // ==========================================
  const drawSparkline = () => {
    const sparkline = document.getElementById('growthSparkline');
    if (sparkline) {
      const sctx = sparkline.getContext('2d');
      if (sctx) {
        sctx.strokeStyle = '#007aff'; // Brand blue sparkline
        sctx.lineWidth = 2.5;
        sctx.beginPath();
        sctx.moveTo(0, 30);
        sctx.bezierCurveTo(60, 10, 120, 40, 180, 15);
        sctx.bezierCurveTo(240, -5, 270, 20, 300, 5);
        sctx.stroke();
      }
    }
  };
  drawSparkline();

  // ==========================================
  // 16. NUMERICAL COUNTUP MATHS
  // ==========================================
  function countUp(id, target, suffix, decimals, plus, prefix) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const dur = 1600;
    
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      const cur = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (prefix || '') + (plus ? '+' : '') + cur.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ==========================================
  // 17. SCROLLTRIGGER FADE-OUTS ON ATRIUM
  // ==========================================
  if (document.getElementById('hero-section') && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to('#atriumCanvas, #rayCanvas, #figureWrap, #p1, #p2, #p3, #p4, .hero-copy, #heroStats, #scrollCue', {
      opacity: 0,
      y: -40,
      stagger: 0.01,
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom 40%',
        scrub: true
      }
    });
  }

  // Overwrite entrance sequence to trigger atrium panels & counters
  initializeEntranceAnimations = () => {
    // Fade in Atrium panels
    document.querySelectorAll('.glass-panel').forEach(p => p.classList.add('in'));
    const statsEl = document.getElementById('heroStats');
    if (statsEl) statsEl.classList.add('in');

    // Run counters
    countUp('gv1', 12.4, '%', 1, true);
    countUp('gv4', 1.8, '%', 1, true);
    countUp('s1', 14.2, 'B', 1, false, '$');
    countUp('s2', 27, ' YRS', 0);
    countUp('gv2', 91, '% confidence', 0);

    // Run core copy GSAP animations
    if (typeof gsap !== 'undefined') {
      if (document.querySelector('.hero-copy .eyebrow')) {
        gsap.from('.hero-copy .eyebrow', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
      }
      if (document.querySelector('.hero-copy .headline .line span')) {
        gsap.from('.hero-copy .headline .line span', { y: '100%', duration: 1.2, ease: 'power4.out', stagger: 0.15 });
      }
      if (document.querySelector('.hero-copy .hero-sub')) {
        gsap.from('.hero-copy .hero-sub', { opacity: 0, y: 30, duration: 1, delay: 0.5, ease: 'power3.out' });
      }
      if (document.querySelector('.hero-copy .hero-cta')) {
        gsap.from('.hero-copy .hero-cta', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: 'power3.out' });
      }
      if (document.querySelector('.header-wrapper')) {
        gsap.from('.header-wrapper', { y: -100, opacity: 0, duration: 1.2, ease: 'power4.out' });
      }
    }
  };

  // ==========================================
  // 14. LATEST BLOGS MODAL CONTROLS
  // ==========================================
  const blogModal = document.getElementById('blogModal');
  const blogModalClose = document.getElementById('blogModalClose');
  const blogArticleTitle = document.getElementById('blogArticleTitle');
  const blogArticleMeta = document.getElementById('blogArticleMeta');
  const blogArticleBody = document.getElementById('blogArticleBody');

  const blogContents = {
    "mutual-funds": {
      category: "Mutual Funds",
      title: "What is a Mutual Fund?",
      body: `
        <p>A mutual fund is a professionally managed investment fund that pools money from many investors to purchase securities. These securities include equity shares, bonds, short-term debt, and other assets. The primary advantage of a mutual fund is diversification: by spreading capital across dozens or hundreds of different companies, mutual funds dilute the impact of any single asset class downturn.</p>
        <h4>How do Mutual Funds Work?</h4>
        <p>When you invest in a mutual fund, you purchase shares or units of the fund. Each unit represents a proportional ownership interest in the fund's underlying assets and the income it generates. The price of a mutual fund unit is known as its Net Asset Value (NAV), calculated at the end of each trading day based on the market value of the fund's investments.</p>
        <h4>Active vs. Passive Mandates</h4>
        <ul>
          <li><strong>Active Funds:</strong> Managed by professional fund managers who actively analyze markets, balance assets, and select specific companies to outperform baseline benchmark indices (e.g. NIFTY 50).</li>
          <li><strong>Passive Funds (ETFs/Index):</strong> Replicate benchmark portfolios directly, matching baseline index returns at lower expense ratios.</li>
        </ul>
        <h4>Direct vs. Regular Plans</h4>
        <p>Mutual funds are distributed via Direct plans (purchased directly from the AMC, with lower expense ratios) or Regular plans (distributed through certified distributors like ARN partners, which include structured investment advice and portfolio reviews).</p>
      `
    },
    "compounding": {
      category: "General",
      title: "Difference between SIP, SWP and STP: When to Use Which?",
      body: `
        <p>Navigating systematic financial planning requires understanding the three core routing mechanisms: Systematic Investment Plans (SIP), Systematic Withdrawal Plans (SWP), and Systematic Transfer Plans (STP). Each serves a distinct phase of your wealth cycle.</p>
        <h4>1. Systematic Investment Plan (SIP)</h4>
        <p>SIP is the vehicle for capital accumulation. It allows you to invest a fixed sum of money at regular intervals (monthly, weekly) into a mutual fund. By committing a fixed sum, you practice <strong>rupee cost averaging</strong>: buying more units when prices are low and fewer units when prices are high, eliminating the need to time volatile markets.</p>
        <h4>2. Systematic Withdrawal Plan (SWP)</h4>
        <p>SWP is the vehicle for tax-efficient cash flow creation. Instead of withdrawing a lump sum, you set a fixed monthly payout. The AMC redeems equivalent mutual fund units to provide this income. Unlike dividends or interest which are taxed at slab rates, SWP redemptions are subject to capital gains tax, making it highly efficient for retirement income.</p>
        <h4>3. Systematic Transfer Plan (STP)</h4>
        <p>STP is the vehicle for systematic capital migration. If you receive a lump sum (e.g., land sale, corporate bonus), investing it all at once into equities exposes you to timing risk. Instead, you park the capital in a low-risk liquid/debt fund, and set an STP to transfer a fixed amount into equity funds every month, balancing growth and security.</p>
      `
    },
    "growth": {
      category: "General",
      title: "How Compounding Works: Making Time Your Wealth Accelerator",
      body: `
        <p>Compounding is the process where the earnings generated by an investment are reinvested to generate additional earnings over time. Unlike simple interest which only pays yields on the initial principal, compound growth generates interest on interest, creating an exponential growth trajectory.</p>
        <h4>The Mathematical Formula</h4>
        <p>The future value of compound interest is represented by the formula:</p>
        <p style="text-align: center; font-family: monospace; font-size: 16px; margin: 1rem 0;">A = P * (1 + r)^n</p>
        <p>Where <em>P</em> is your principal, <em>r</em> is the periodic growth rate, and <em>n</em> is the number of periods. Because <em>n</em> is an exponent, time is the single most powerful multiplier of compounding.</p>
        <h4>The Cost of Delay</h4>
        <p>Consider two investors, A and B, who both target a 12% annual return:</p>
        <ul>
          <li><strong>Investor A:</strong> Starts a monthly SIP of ₹10,000 at age 25. By age 55 (30 years horizon), they have invested ₹36 Lakhs. Their final future value is approximately <strong>₹3.5 Crores</strong>.</li>
          <li><strong>Investor B:</strong> Starts the same monthly SIP of ₹10,000 at age 35. By age 55 (20 years horizon), they have invested ₹24 Lakhs. Their final future value is approximately <strong>₹1.0 Crore</strong>.</li>
        </ul>
        <p>For just 10 years of delay, Investor B receives less than one-third of the final wealth of Investor A. Start early, stay invested, and let compounding execute the growth.</p>
      `
    }
  };

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      const data = blogContents[blogId];
      if (data && blogModal) {
        if (blogArticleMeta) blogArticleMeta.textContent = data.category.toUpperCase();
        if (blogArticleTitle) blogArticleTitle.textContent = data.title;
        if (blogArticleBody) blogArticleBody.innerHTML = data.body;
        blogModal.classList.add('open');
      }
    });
  });

  if (blogModalClose && blogModal) {
    blogModalClose.addEventListener('click', () => {
      blogModal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === blogModal) {
      blogModal.classList.remove('open');
    }
  });

  // ==========================================
  // 15. DEDICATED AUTH PAGE NAVIGATION (LOGIN & SIGN UP)
  // ==========================================
  document.querySelectorAll('.signup-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'signup.html';
    });
  });

  document.querySelectorAll('.login-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  });

  // ==========================================
  // 12. SCROLL TO TOP FLOATING BUTTON
  // ==========================================
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 16. BOOK CONSULTATION & CONSULTATION SECTION SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href*="#consultation-section"], .book-consult-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href') || '';
      const targetId = 'consultation-section';
      const targetEl = document.getElementById(targetId);
      
      // If we are already on index.html or the page containing #consultation-section
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle direct hash navigation on page load
  if (window.location.hash === '#consultation-section') {
    setTimeout(() => {
      const targetEl = document.getElementById('consultation-section');
      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  }

  const x4ChatLoader = document.createElement('script');
  x4ChatLoader.src = 'chatbot.js?v=143.0';
  x4ChatLoader.defer = true;
  document.body.appendChild(x4ChatLoader);
});

