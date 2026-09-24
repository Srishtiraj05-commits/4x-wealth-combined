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
        const href = triggerLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
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
    
    if (st > 40) {
      if (siteHeader) siteHeader.classList.add('scrolled');
    } else {
      if (siteHeader) siteHeader.classList.remove('scrolled');
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
          renderMovers(tickerData);
        });
    };

    // Initial load
    loadRealtimeStocks();

    // Poll for updates every 3 seconds for live sync
    setInterval(loadRealtimeStocks, 3000);
  }

  // ==========================================
  // 4. MODULE HOVER/CLICK INTERACTION DATA
  // ==========================================
  const moduleData = {
    portfolio: {
      title: "PORTFOLIO OPTIMIZATION",
      desc: "Black-Litterman mathematical optimization balances systemic allocation weightings across 18 capital nodes with factor risk budgeting.",
      activation: "ACTIVE & REGULATED",
      load: "MULTI-ASSET"
    },
    risk: {
      title: "RISK ENGINE & STRESS-TESTING",
      desc: "Stochastic Monte Carlo simulators stress-test volatility matrices and CVaR tail vectors against active multi-asset regulatory profiles.",
      activation: "ACTIVE & REGULATED",
      load: "100K+ PATHS"
    },
    forecast: {
      title: "VALUATION & MACRO REGIMES",
      desc: "Multi-horizon valuation modeling, yield curve trajectory assessments, and sector momentum metrics to identify emerging risk-reward asymmetry.",
      activation: "ACTIVE & REGULATED",
      load: "MULTI-HORIZON"
    },
    alternative: {
      title: "FUNDAMENTAL & GOVERNANCE SCREENING",
      desc: "Rigorous diligence frameworks parsing statutory corporate filings, institutional quarterly earnings, management governance, and balance sheet quality.",
      activation: "ACTIVE & REGULATED",
      load: "CONTINUOUS"
    }
  };

  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const infoActivation = document.getElementById('infoActivation');
  const infoLoad = document.getElementById('infoLoad');
  const moduleNodes = document.querySelectorAll('.module-node');

  const updateModuleInfo = (moduleKey) => {
    const data = moduleData[moduleKey];
    if (data) {
      if (infoTitle) infoTitle.innerHTML = `<i class="fa-solid fa-microchip" style="color: #0077FF;"></i> ${data.title}`;
      if (infoDesc) infoDesc.textContent = data.desc;
      if (infoActivation) infoActivation.textContent = data.activation;
      if (infoLoad) infoLoad.textContent = data.load;
    }
  };

  moduleNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      moduleNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const moduleKey = node.getAttribute('data-module');
      updateModuleInfo(moduleKey);
    });

    node.addEventListener('click', () => {
      moduleNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const moduleKey = node.getAttribute('data-module');
      updateModuleInfo(moduleKey);
    });
  });

  // ==========================================
  // 5. DYNAMIC OSCILLOSCOPE WAVEFORM VISUALIZER
  // ==========================================
  const oscCanvas = document.getElementById('labOscilloscope');
  if (oscCanvas) {
    const ctx = oscCanvas.getContext('2d');
    let phase = 0;
    
    const drawWave = () => {
      const w = oscCanvas.width = oscCanvas.offsetWidth;
      const h = oscCanvas.height = oscCanvas.offsetHeight;
      
      ctx.clearRect(0, 0, w, h);
      
      // Grid lines
      ctx.strokeStyle = 'rgba(0, 163, 255, 0.08)';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Sine Wave 1 (Cyan)
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0077FF';
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x * 0.03) + phase) * 28 + Math.cos((x * 0.015) + phase * 0.7) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sine Wave 2 (Electric Sky Blue)
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(0, 198, 255, 0.6)';
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x * 0.02) - phase * 1.2) * 20 + Math.sin((x * 0.05) + phase) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Scan dot
      const dotX = (phase * 60) % w;
      const dotY = h / 2 + Math.sin((dotX * 0.03) + phase) * 28 + Math.cos((dotX * 0.015) + phase * 0.7) * 12;
      ctx.fillStyle = '#00C6FF';
      ctx.shadowColor = '#0077FF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      phase += 0.03;
      requestAnimationFrame(drawWave);
    };

    drawWave();
  }

});
