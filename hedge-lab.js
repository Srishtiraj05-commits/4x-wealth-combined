document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE DRAWER NAVIGATION MENU
  // ==========================================
  const menuTrigger = document.getElementById('mobileMenuTrigger');
  const drawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('mobileDrawerClose');
  const overlay = document.getElementById('mobileOverlay');

  if (menuTrigger && drawer && drawerClose && overlay) {
    const openMenu = () => {
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
    menuTrigger.addEventListener('click', openMenu);
    drawerClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.sk-drawer-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================
  // 1.5 DROPDOWN NAV PERSISTENCE
  // ==========================================
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    const triggerLink = trigger.querySelector('.sk-nav-link');
    trigger.addEventListener('mouseenter', () => {
      trigger.classList.add('active');
    });
    trigger.addEventListener('mouseleave', () => {
      trigger.classList.remove('active');
    });
    if (triggerLink) {
      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = trigger.classList.contains('active');
        dropdownTriggers.forEach(t => t.classList.remove('active'));
        if (!isActive) {
          trigger.classList.add('active');
        }
      });
    }
  });

  document.querySelectorAll('.dropdown-link, .mega-link').forEach(link => {
    link.addEventListener('click', (e) => {
      dropdownTriggers.forEach(t => t.classList.remove('active'));
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      }
    });
  });

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-trigger')) {
      dropdownTriggers.forEach(t => t.classList.remove('active'));
    }
  });

  window.addEventListener('scroll', () => {
    dropdownTriggers.forEach(t => t.classList.remove('active'));
  });

  // ==========================================
  // 2. SEARCH MODAL POPUP INDEXER
  // ==========================================
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('searchInput');

  if (searchTrigger && searchModal && searchClose) {
    searchTrigger.addEventListener('click', () => {
      searchModal.classList.add('open');
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });
    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('open');
    });
    window.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('open');
    });
  }

  // ==========================================
  // 3. CRYPTOGRAPHIC ACCESS GATE (CLIENT LOGIN)
  // Disappearing Navbar on Scroll (Visible only at top of page, disappears on scroll)
  const siteHeader = document.getElementById('mainHeader') || document.querySelector('.header-wrapper');

  const handleScrollNavbar = () => {
    const st = Math.max(window.pageYOffset || 0, window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
    
    if (st > 20) {
      if (siteHeader) siteHeader.classList.add('nav-hidden');
    } else {
      if (siteHeader) siteHeader.classList.remove('nav-hidden');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  document.addEventListener('scroll', handleScrollNavbar, { passive: true });

  const loginModal = document.getElementById('loginModal');
  const loginCloseBtn = document.getElementById('loginCloseBtn');
  const tabClientBtn = document.getElementById('tabClientBtn');
  const tabRetailBtn = document.getElementById('tabRetailBtn');
  const clientFormContainer = document.getElementById('clientFormContainer');
  const retailFormContainer = document.getElementById('retailFormContainer');

  const switchLoginTab = (mode) => {
    if (mode === 'retail') {
      if (tabRetailBtn) tabRetailBtn.classList.add('active');
      if (tabClientBtn) tabClientBtn.classList.remove('active');
      if (retailFormContainer) retailFormContainer.style.display = 'block';
      if (clientFormContainer) clientFormContainer.style.display = 'none';
    } else {
      if (tabClientBtn) tabClientBtn.classList.add('active');
      if (tabRetailBtn) tabRetailBtn.classList.remove('active');
      if (clientFormContainer) clientFormContainer.style.display = 'block';
      if (retailFormContainer) retailFormContainer.style.display = 'none';
    }
  };

  const openLogin = (mode = 'client') => {
    switchLoginTab(mode);
    if (loginModal) loginModal.classList.add('open');
  };

  const closeLogin = () => {
    if (loginModal) loginModal.classList.remove('open');
  };

  document.querySelectorAll('.login-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-login-mode') || 'client';
      openLogin(mode);
    });
  });

  if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);
  if (tabClientBtn) tabClientBtn.addEventListener('click', () => switchLoginTab('client'));
  if (tabRetailBtn) tabRetailBtn.addEventListener('click', () => switchLoginTab('retail'));

  const passSubmit = document.getElementById('clientPasscodeBtn');
  const passField = document.getElementById('clientPasscode');
  const passStatus = document.getElementById('clientPasscodeStatus');

  if (passSubmit && passField && passStatus) {
    passSubmit.addEventListener('click', () => {
      const code = passField.value.trim();
      if (!code) return;
      passStatus.textContent = 'CONNECTING SECURE PIPELINE...';
      passStatus.className = 'passphrase-status connecting';
      
      setTimeout(() => {
        if (code === '4xwealth' || code === '4XWEALTH') {
          passStatus.textContent = 'AUTHORIZATION GRANTED. REDIRECTING...';
          passStatus.className = 'passphrase-status success';
          setTimeout(() => {
            window.location.href = 'https://index.4xwealth.co.in/auth/login';
          }, 800);
        } else {
          passStatus.textContent = 'ACCESS SHIELD ENGAGED: INVALID PASSPHRASE KEY';
          passStatus.className = 'passphrase-status error';
        }
      }, 1200);
    });
  }

  // ==========================================
  // 3.5 LIVE MARKET TICKER SIMULATION & REAL-TIME LOAD
  // ==========================================
  const tickerData = [
    { symbol: "RELIANCE", name: "Reliance", price: 1322.0, change: 1.5, logo: "R" },
    { symbol: "TCS", name: "Tcs", price: 2304.0, change: -0.69, logo: "T" },
    { symbol: "HDFC BANK", name: "Hdfc Bank", price: 712.1, change: 0.77, logo: "H" },
    { symbol: "INFOSYS", name: "Infosys", price: 1130.0, change: -0.03, logo: "I" },
    { symbol: "ICICI BANK", name: "Icici Bank", price: 1423.2, change: -0.48, logo: "I" },
    { symbol: "SBI", name: "Sbi", price: 1016.1, change: -0.71, logo: "S" },
    { symbol: "ADANI PORTS", name: "Adani Ports", price: 1707.3, change: 0.05, logo: "A" },
    { symbol: "TATA MOTORS", name: "Tata Motors", price: 311.5, change: -0.16, logo: "T" },
    { symbol: "L&T", name: "L&T", price: 3964.1, change: -0.27, logo: "L" },
    { symbol: "ITC", name: "Itc", price: 264.1, change: 0.42, logo: "I" },
    { symbol: "BHARTI AIRTEL", name: "Bharti Airtel", price: 1840.0, change: -1.55, logo: "B" },
    { symbol: "KOTAK BANK", name: "Kotak Bank", price: 424.5, change: 0.8, logo: "K" },
    { symbol: "AXIS BANK", name: "Axis Bank", price: 1273.0, change: 0.47, logo: "A" },
    { symbol: "HUL", name: "Hul", price: 1973.4, change: 0.58, logo: "H" },
    { symbol: "BAJAJ FINANCE", name: "Bajaj Finance", price: 1060.5, change: 1.1, logo: "B" },
    { symbol: "M&M", name: "M&M", price: 3170.0, change: 0.63, logo: "M" },
    { symbol: "NTPC", name: "Ntpc", price: 332.5, change: 0.48, logo: "N" },
    { symbol: "HCL TECH", name: "Hcl Tech", price: 1293.4, change: -1.94, logo: "H" },
    { symbol: "MARUTI", name: "Maruti", price: 12694.0, change: -1.27, logo: "M" },
    { symbol: "SUN PHARMA", name: "Sun Pharma", price: 1899.0, change: -0.89, logo: "S" },
    { symbol: "TITAN", name: "Titan", price: 5020.0, change: -0.14, logo: "T" },
    { symbol: "ULTRATECH", name: "Ultratech", price: 11408.0, change: 1.18, logo: "U" },
    { symbol: "POWER GRID", name: "Power Grid", price: 266.0, change: 0.15, logo: "P" },
    { symbol: "COAL INDIA", name: "Coal India", price: 415.35, change: -1.12, logo: "C" },
    { symbol: "TATA STEEL", name: "Tata Steel", price: 188.79, change: 2.49, logo: "T" },
    { symbol: "ASIAN PAINTS", name: "Asian Paints", price: 2527.3, change: -0.56, logo: "A" },
    { symbol: "JSW STEEL", name: "Jsw Steel", price: 1325.0, change: 1.3, logo: "J" },
    { symbol: "HINDALCO", name: "Hindalco", price: 1011.0, change: 0.1, logo: "H" },
    { symbol: "GRASIM", name: "Grasim", price: 3322.0, change: 0.36, logo: "G" },
    { symbol: "LTI MINDTREE", name: "Lti Mindtree", price: 4554.0, change: -0.13, logo: "L" }
  ];

  const marqueeTrack = document.getElementById('marketMarqueeTrack');
  if (marqueeTrack) {
    let isInitialRender = true;

    const renderMovers = (data) => {
      if (!Array.isArray(data)) return;
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
              <div class="stock-logo-container">${stock.logo || '•'}</div>
              <span class="stock-symbol">${stock.name || stock.symbol || ''}</span>
              <span class="stock-price">₹${price.toFixed(2)}</span>
              <span class="stock-change">${arrow} ${sign}${change.toFixed(2)}%</span>
            </div>
            <span class="marquee-separator">✦</span>
          `;
        });
        marqueeTrack.innerHTML = htmlContent + htmlContent;
        isInitialRender = false;
      } else {
        data.forEach(stock => {
          if (!stock) return;
          const price = Number(stock.price) || 0;
          const change = Number(stock.change) || 0;
          const isPositive = change >= 0;
          const arrow = isPositive ? '▲' : '▼';
          const sign = isPositive ? '+' : '';
          const newPriceText = `₹${price.toFixed(2)}`;
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
            card.className = `stock-card ${isPositive ? 'positive' : 'negative'}`;
          });
        });
      }
    };

    const loadRealtimeStocks = () => {
      fetch('stocks_data.json?t=' + Date.now(), { cache: 'no-store' })
        .then(response => {
          if (!response.ok) throw new Error('File not found');
          return response.json();
        })
        .then(data => {
          renderMovers(data);
        })
        .catch(() => {
          renderMovers(tickerData);
        });
    };

    // Initial load
    loadRealtimeStocks();

    // Poll for updates every 3 seconds for live sync
    setInterval(loadRealtimeStocks, 3000);
  }

  // ==========================================
  // 4. MODULE HOVER INTERACTION DATA
  // ==========================================
  const moduleData = {
    portfolio: {
      title: "PORTFOLIO INTELLIGENCE",
      desc: "Black-Litterman mathematical optimization balances systemic allocation weightings across 18 capital nodes.",
      activation: "100% SECURE",
      load: "4.82 GFLOPS"
    },
    risk: {
      title: "RISK ENGINE",
      desc: "Stochastic Monte Carlo simulators stress-test volatility matrices against active regulatory profiles.",
      activation: "100% ONLINE",
      load: "12.04 GFLOPS"
    },
    forecast: {
      title: "MARKET FORECAST",
      desc: "LSTM recurrent neural networks evaluate historical structural nodes to determine near-term price patterns.",
      activation: "94.2% OPTIMAL",
      load: "22.50 GFLOPS"
    },
    alternative: {
      title: "ALTERNATIVE DATA",
      desc: "NLP spiders scrape global corporate press pipelines, sentiment feeds, and cargo shipping manifests.",
      activation: "88.6% MONITOR",
      load: "8.15 GFLOPS"
    }
  };

  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const infoActivation = document.getElementById('infoActivation');
  const infoLoad = document.getElementById('infoLoad');

  document.querySelectorAll('.module-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      const moduleKey = node.getAttribute('data-module');
      const data = moduleData[moduleKey];
      if (data) {
        if (infoTitle) infoTitle.textContent = data.title;
        if (infoDesc) infoDesc.textContent = data.desc;
        if (infoActivation) infoActivation.textContent = data.activation;
        if (infoLoad) infoLoad.textContent = data.load;
      }
    });

    node.addEventListener('mouseleave', () => {
      if (infoTitle) infoTitle.textContent = "QUANTITATIVE CORE";
      if (infoDesc) infoDesc.textContent = "Hover over or tap a neural module card to initialize diagnostics and check the real-time load parameters.";
      if (infoActivation) infoActivation.textContent = "100% ONLINE";
      if (infoLoad) infoLoad.textContent = "0.00 GFLOPS";
    });
  });

  // ==========================================
  // 5. LOCAL 3D CANVAS WEBGL INITIALIZER
  // ==========================================
  const canvas3d = document.getElementById('labCanvas3d');
  if (canvas3d && false) {
    const rect = canvas3d.parentElement.getBoundingClientRect();
    
    // Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas3d,
      alpha: true,
      antialias: true
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Glowing Central Core Mesh
    const coreGeo = new THREE.SphereGeometry(3.2, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x007aff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Outer neon particle cloud points
    const cloudGeo = new THREE.SphereGeometry(4.8, 18, 18);
    const cloudPoints = new THREE.Points(cloudGeo, new THREE.PointsMaterial({
      color: 0xff2d55,
      size: 0.08,
      transparent: true,
      opacity: 0.4
    }));
    scene.add(cloudPoints);

    // Module Floating Nodes
    const moduleCoords = [
      { x: -5.5, y: 3, z: -2, color: 0x007aff },  // Portfolio
      { x: 5.5, y: -2.5, z: 1, color: 0xff2d55 }, // Risk
      { x: -4, y: -4, z: -3, color: 0xff9500 },   // Forecast
      { x: 5, y: 4, z: -4, color: 0x34aadc }      // Alternative
    ];

    const nodeGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const nodesList = [];

    moduleCoords.forEach(coord => {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: coord.color,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(coord.x, coord.y, coord.z);
      scene.add(nodeMesh);
      nodesList.push(nodeMesh);

      // Connection lines
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(coord.x, coord.y, coord.z)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: coord.color,
        transparent: true,
        opacity: 0.25
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    });

    // Handle cursor interactive parallax movement
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      const containerRect = canvas3d.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;
      
      if (x >= 0 && x <= containerRect.width && y >= 0 && y <= containerRect.height) {
        targetMouseX = (x / containerRect.width - 0.5) * 4;
        targetMouseY = (y / containerRect.height - 0.5) * 4;
      }
    });

    // Resize handling
    window.addEventListener('resize', () => {
      const newRect = canvas3d.parentElement.getBoundingClientRect();
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newRect.width, newRect.height);
    });

    // 60FPS animation loop
    const clock = new THREE.Clock();
    const tick = () => {
      requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();

      // Core rotation
      coreMesh.rotation.y = elapsed * 0.12;
      coreMesh.rotation.z = elapsed * 0.05;
      cloudPoints.rotation.y = -elapsed * 0.08;

      // Module nodes local rotations
      nodesList.forEach((node, i) => {
        node.rotation.x = elapsed * 0.2 * (i % 2 === 0 ? 1 : -1);
        node.rotation.y = elapsed * 0.15;
      });

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Pan camera slightly based on mouse
      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera);
    };
    tick();
  }

});
