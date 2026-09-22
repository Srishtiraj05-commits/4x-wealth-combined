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
      setTimeout(() => searchInput.focus(), 100);
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
      if (isInitialRender || marqueeTrack.children.length === 0) {
        let htmlContent = '';
        data.forEach(stock => {
          const isPositive = stock.change >= 0;
          const cardClass = isPositive ? 'positive' : 'negative';
          const arrow = isPositive ? '▲' : '▼';
          const sign = isPositive ? '+' : '';
          
          htmlContent += `
            <div class="stock-card ${cardClass}" data-ticker-symbol="${stock.symbol}">
              <div class="stock-logo-container">${stock.logo}</div>
              <span class="stock-symbol">${stock.name}</span>
              <span class="stock-price">₹${stock.price.toFixed(2)}</span>
              <span class="stock-change">${arrow} ${sign}${stock.change.toFixed(2)}%</span>
            </div>
            <span class="marquee-separator">✦</span>
          `;
        });
        marqueeTrack.innerHTML = htmlContent + htmlContent;
        isInitialRender = false;
      } else {
        data.forEach(stock => {
          const isPositive = stock.change >= 0;
          const arrow = isPositive ? '▲' : '▼';
          const sign = isPositive ? '+' : '';
          const newPriceText = `₹${stock.price.toFixed(2)}`;
          const newChangeText = `${arrow} ${sign}${stock.change.toFixed(2)}%`;
          
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
  // 4. TAB CONTROLS PANEL SWITCHER
  // ==========================================
  const tabButtons = document.querySelectorAll('.calc-tab-btn');
  const panes = document.querySelectorAll('.calc-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panes
      panes.forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(`pane-${tabId}`);
      if (activePane) {
        activePane.classList.add('active');
        // Trigger calculate loop of active pane
        triggerCalculation(tabId);
      }
    });
  });

  // Helper currency formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    }).format(val).replace('.00', '');
  };

  const triggerCalculation = (type) => {
    if (type === 'sip') calculateSIP();
    if (type === 'lumpsum') calculateLumpsum();
    if (type === 'swp') calculateSWP();
    if (type === 'emi') calculateEMI();
    if (type === 'retirement') calculateRetirement();
    if (type === 'fire') calculateFIRE();
  };

  // ==========================================
  // 5. MATHS PIPELINE FOR SIP CALCULATOR
  // ==========================================
  const sipAmtInput = document.getElementById('sip-amount');
  const sipAmtNum = document.getElementById('sip-amount-num');
  const sipRateInput = document.getElementById('sip-rate');
  const sipRateNum = document.getElementById('sip-rate-num');
  const sipYearsInput = document.getElementById('sip-years');
  const sipYearsNum = document.getElementById('sip-years-num');
  const sipStepupInput = document.getElementById('sip-stepup');
  const sipStepupNum = document.getElementById('sip-stepup-num');
  const sipStepupGroup = document.getElementById('sip-stepup-group');

  const sipTypeRegular = document.getElementById('sipTypeRegular');
  const sipTypeStepUp = document.getElementById('sipTypeStepUp');

  let currentSipType = 'regular'; // 'regular' or 'stepup'

  if (sipTypeRegular && sipTypeStepUp) {
    sipTypeRegular.addEventListener('click', () => {
      currentSipType = 'regular';
      sipTypeRegular.classList.add('active');
      sipTypeRegular.style.background = 'var(--champagne)';
      sipTypeRegular.style.color = 'var(--black)';
      sipTypeRegular.style.borderColor = 'var(--champagne)';

      sipTypeStepUp.classList.remove('active');
      sipTypeStepUp.style.background = 'rgba(255,255,255,0.05)';
      sipTypeStepUp.style.color = 'var(--white)';
      sipTypeStepUp.style.borderColor = 'rgba(255,255,255,0.15)';

      if (sipStepupGroup) sipStepupGroup.style.display = 'none';
      calculateSIP();
    });

    sipTypeStepUp.addEventListener('click', () => {
      currentSipType = 'stepup';
      sipTypeStepUp.classList.add('active');
      sipTypeStepUp.style.background = 'var(--champagne)';
      sipTypeStepUp.style.color = 'var(--black)';
      sipTypeStepUp.style.borderColor = 'var(--champagne)';

      sipTypeRegular.classList.remove('active');
      sipTypeRegular.style.background = 'rgba(255,255,255,0.05)';
      sipTypeRegular.style.color = 'var(--white)';
      sipTypeRegular.style.borderColor = 'rgba(255,255,255,0.15)';

      if (sipStepupGroup) sipStepupGroup.style.display = 'flex';
      calculateSIP();
    });
  }

  const syncSipInputs = (rangeEl, numEl) => {
    if (!rangeEl || !numEl) return;
    rangeEl.addEventListener('input', () => {
      numEl.value = rangeEl.value;
      calculateSIP();
    });
    rangeEl.addEventListener('change', () => {
      numEl.value = rangeEl.value;
      calculateSIP();
    });
    numEl.addEventListener('input', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calculateSIP();
      }
    });
    numEl.addEventListener('change', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calculateSIP();
      }
    });
  };

  syncSipInputs(sipAmtInput, sipAmtNum);
  syncSipInputs(sipRateInput, sipRateNum);
  syncSipInputs(sipYearsInput, sipYearsNum);
  syncSipInputs(sipStepupInput, sipStepupNum);

  const formatCompactCurrency = (val) => {
    const abs = Math.abs(val);
    if (abs >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (abs >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    } else if (abs >= 1000) {
      return `₹${(val / 1000).toFixed(0)}k`;
    } else {
      return `₹${Math.round(val)}`;
    }
  };

  const renderValueBadge = (svgId, badgeId, x, y, textStr, colorHex) => {
    const svgEl = document.getElementById(svgId);
    if (!svgEl) return;
    let group = document.getElementById(badgeId);
    if (!group) {
      group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('id', badgeId);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('rx', '4');
      rect.setAttribute('ry', '4');
      rect.setAttribute('fill', '#ffffff');
      rect.setAttribute('stroke-width', '1.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('font-family', "'IBM Plex Mono', monospace");
      text.setAttribute('font-size', '10.5');
      text.setAttribute('font-weight', '700');
      text.setAttribute('dominant-baseline', 'middle');

      group.appendChild(rect);
      group.appendChild(text);
      svgEl.appendChild(group);
    }

    const rectNode = group.querySelector('rect');
    const textNode = group.querySelector('text');

    rectNode.setAttribute('stroke', colorHex);
    textNode.setAttribute('fill', colorHex);
    textNode.textContent = textStr;

    const charCount = textStr.length;
    const boxW = charCount * 7.2 + 12;
    const boxH = 20;

    let posX = x - boxW / 2;
    if (posX < 8) posX = 8;
    if (posX + boxW > 492) posX = 492 - boxW;

    let posY = y - 26;
    if (posY < 5) posY = y + 8;

    rectNode.setAttribute('x', posX.toFixed(1));
    rectNode.setAttribute('y', posY.toFixed(1));
    rectNode.setAttribute('width', boxW.toFixed(1));
    rectNode.setAttribute('height', boxH.toString());

    textNode.setAttribute('x', (posX + 6).toFixed(1));
    textNode.setAttribute('y', (posY + boxH / 2 + 1).toFixed(1));
  };

  const syncGenericInputPair = (rangeEl, numEl, calcFn) => {
    if (!rangeEl || !numEl) return;
    rangeEl.addEventListener('input', () => {
      numEl.value = rangeEl.value;
      calcFn();
    });
    rangeEl.addEventListener('change', () => {
      numEl.value = rangeEl.value;
      calcFn();
    });
    numEl.addEventListener('input', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calcFn();
      }
    });
    numEl.addEventListener('change', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calcFn();
      }
    });
  };

  const renderGraphAxes = (svgId, maxVal, maxYears) => {
    const svgEl = document.getElementById(svgId);
    if (!svgEl) return;

    let axesGroup = document.getElementById(`${svgId}-axes`);
    if (!axesGroup) {
      axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      axesGroup.setAttribute('id', `${svgId}-axes`);
      axesGroup.setAttribute('class', 'chart-axes');
      svgEl.insertBefore(axesGroup, svgEl.firstChild);
    }
    axesGroup.innerHTML = '';

    const width = 500, height = 160;

    // Y-Axis Ticks
    const yTicks = [
      { y: 22, val: maxVal },
      { y: 85, val: maxVal / 2 },
      { y: 148, val: 0 }
    ];

    yTicks.forEach(t => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '10');
      text.setAttribute('y', t.y.toString());
      text.setAttribute('font-family', "'IBM Plex Mono', monospace");
      text.setAttribute('font-size', '9');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', '#94a3b8');
      text.textContent = formatCompactCurrency(t.val);
      axesGroup.appendChild(text);
    });

    // X-Axis Year Ticks
    const yearSteps = 4;
    for (let s = 0; s <= yearSteps; s++) {
      const yrVal = Math.round((s / yearSteps) * maxYears);
      const posX = (s / yearSteps) * (width - 60) + 30;

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', posX.toFixed(1));
      text.setAttribute('y', (height - 4).toString());
      text.setAttribute('font-family', "'IBM Plex Mono', monospace");
      text.setAttribute('font-size', '9.5');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', '#64748b');
      text.setAttribute('text-anchor', s === yearSteps ? 'end' : s === 0 ? 'start' : 'middle');
      text.textContent = `${yrVal} Yrs`;
      axesGroup.appendChild(text);
    }
  };

  const makeGraphInteractive = (svgId, yearRangeInput, calcFn) => {
    const svgEl = document.getElementById(svgId);
    if (!svgEl || !yearRangeInput) return;

    let isDragging = false;

    const handlePointer = (e) => {
      const rect = svgEl.getBoundingClientRect();
      if (rect.width <= 0) return;
      const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const minY = parseFloat(yearRangeInput.min) || 1;
      const maxY = parseFloat(yearRangeInput.max) || 30;
      const step = parseFloat(yearRangeInput.step) || 1;
      
      const rawVal = minY + xPct * (maxY - minY);
      const roundedVal = Math.round(rawVal / step) * step;
      const clampedVal = Math.max(minY, Math.min(maxY, roundedVal));

      if (parseFloat(yearRangeInput.value) !== clampedVal) {
        yearRangeInput.value = clampedVal;
        yearRangeInput.dispatchEvent(new Event('input'));
      }
    };

    svgEl.style.cursor = 'crosshair';
    svgEl.addEventListener('pointerdown', (e) => {
      isDragging = true;
      try { svgEl.setPointerCapture(e.pointerId); } catch(err){}
      handlePointer(e);
    });
    svgEl.addEventListener('pointermove', (e) => {
      if (isDragging) handlePointer(e);
    });
    svgEl.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { svgEl.releasePointerCapture(e.pointerId); } catch(err){}
    });
  };

  const setupHoverTooltip = (svgId, label1Name, color1, label2Name, color2) => {
    const svgEl = document.getElementById(svgId);
    if (!svgEl) return;

    let hoverGroup = document.getElementById(`${svgId}-hover-group`);
    if (!hoverGroup) {
      hoverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      hoverGroup.setAttribute('id', `${svgId}-hover-group`);
      hoverGroup.style.opacity = '0';
      hoverGroup.style.pointerEvents = 'none';

      // Crosshair line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('id', `${svgId}-crosshair`);
      line.setAttribute('y1', '10');
      line.setAttribute('y2', '150');
      line.setAttribute('stroke', '#64748b');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '3 3');

      // Highlight dots
      const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot1.setAttribute('id', `${svgId}-hover-dot1`);
      dot1.setAttribute('r', '5');
      dot1.setAttribute('fill', color1);
      dot1.setAttribute('stroke', '#ffffff');
      dot1.setAttribute('stroke-width', '2');

      const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot2.setAttribute('id', `${svgId}-hover-dot2`);
      dot2.setAttribute('r', '5');
      dot2.setAttribute('fill', color2);
      dot2.setAttribute('stroke', '#ffffff');
      dot2.setAttribute('stroke-width', '2');

      // Tooltip Card Group
      const card = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      card.setAttribute('id', `${svgId}-tooltip-card`);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('rx', '6');
      rect.setAttribute('ry', '6');
      rect.setAttribute('fill', '#0f172a');
      rect.setAttribute('opacity', '0.94');
      rect.setAttribute('stroke', '#334155');
      rect.setAttribute('stroke-width', '1');

      const tTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tTitle.setAttribute('id', `${svgId}-t-title`);
      tTitle.setAttribute('font-family', "'IBM Plex Mono', monospace");
      tTitle.setAttribute('font-size', '10.5');
      tTitle.setAttribute('font-weight', '700');
      tTitle.setAttribute('fill', '#f8fafc');

      const tVal1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tVal1.setAttribute('id', `${svgId}-t-val1`);
      tVal1.setAttribute('font-family', "'IBM Plex Mono', monospace");
      tVal1.setAttribute('font-size', '10');
      tVal1.setAttribute('font-weight', '600');
      tVal1.setAttribute('fill', color1);

      const tVal2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tVal2.setAttribute('id', `${svgId}-t-val2`);
      tVal2.setAttribute('font-family', "'IBM Plex Mono', monospace");
      tVal2.setAttribute('font-size', '10');
      tVal2.setAttribute('font-weight', '600');
      tVal2.setAttribute('fill', color2);

      card.appendChild(rect);
      card.appendChild(tTitle);
      card.appendChild(tVal1);
      if (label2Name) card.appendChild(tVal2);

      hoverGroup.appendChild(line);
      hoverGroup.appendChild(dot1);
      if (label2Name) hoverGroup.appendChild(dot2);
      hoverGroup.appendChild(card);

      svgEl.appendChild(hoverGroup);
    }

    const onPointerMove = (e) => {
      if (!svgEl._chartData || !svgEl._chartData.series) return;
      const rect = svgEl.getBoundingClientRect();
      if (rect.width <= 0) return;
      const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      const series = svgEl._chartData.series;
      const totalPoints = series.length;
      if (totalPoints === 0) return;

      const idx = Math.min(totalPoints - 1, Math.max(0, Math.round(xPct * (totalPoints - 1))));
      const dataPt = series[idx];
      if (!dataPt) return;

      hoverGroup.style.opacity = '1';

      const line = document.getElementById(`${svgId}-crosshair`);
      const dot1 = document.getElementById(`${svgId}-hover-dot1`);
      const dot2 = document.getElementById(`${svgId}-hover-dot2`);
      const tTitle = document.getElementById(`${svgId}-t-title`);
      const tVal1 = document.getElementById(`${svgId}-t-val1`);
      const tVal2 = document.getElementById(`${svgId}-t-val2`);
      const cardRect = hoverGroup.querySelector('rect');

      line.setAttribute('x1', dataPt.x.toFixed(1));
      line.setAttribute('x2', dataPt.x.toFixed(1));

      dot1.setAttribute('cx', dataPt.x.toFixed(1));
      dot1.setAttribute('cy', dataPt.y1.toFixed(1));

      if (dot2 && dataPt.y2 !== undefined) {
        dot2.setAttribute('cx', dataPt.x.toFixed(1));
        dot2.setAttribute('cy', dataPt.y2.toFixed(1));
      }

      const strTitle = isNaN(dataPt.year) ? 'Estimate' : `Year ${dataPt.year}`;
      const strVal1 = `${label1Name}: ${formatCompactCurrency(dataPt.val1)}`;
      const strVal2 = label2Name ? `${label2Name}: ${formatCompactCurrency(dataPt.val2)}` : '';

      tTitle.textContent = strTitle;
      tVal1.textContent = strVal1;
      if (tVal2 && strVal2) tVal2.textContent = strVal2;

      const maxStrLen = Math.max(strTitle.length, strVal1.length, strVal2.length);
      const cardW = maxStrLen * 7.2 + 18;
      const cardH = label2Name ? 54 : 38;

      let cardX = dataPt.x + 12;
      if (cardX + cardW > 490) cardX = dataPt.x - cardW - 12;
      let cardY = 20;

      cardRect.setAttribute('x', cardX.toFixed(1));
      cardRect.setAttribute('y', cardY.toFixed(1));
      cardRect.setAttribute('width', cardW.toFixed(1));
      cardRect.setAttribute('height', cardH.toString());

      tTitle.setAttribute('x', (cardX + 8).toFixed(1));
      tTitle.setAttribute('y', (cardY + 14).toFixed(1));

      tVal1.setAttribute('x', (cardX + 8).toFixed(1));
      tVal1.setAttribute('y', (cardY + 30).toFixed(1));

      if (tVal2 && label2Name) {
        tVal2.setAttribute('x', (cardX + 8).toFixed(1));
        tVal2.setAttribute('y', (cardY + 44).toFixed(1));
      }
    };

    const onPointerLeave = () => {
      hoverGroup.style.opacity = '0';
    };

    svgEl.addEventListener('pointermove', onPointerMove);
    svgEl.addEventListener('pointerleave', onPointerLeave);
  };

  const buildSmoothCurve = (pts) => {
    if (!pts || pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = (p0.x + (p1.x - p0.x) * 0.45).toFixed(1);
      const cp1y = p0.y.toFixed(1);
      const cp2x = (p0.x + (p1.x - p0.x) * 0.55).toFixed(1);
      const cp2y = p1.y.toFixed(1);
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
    return d;
  };

  const calculateSIP = () => {
    if (!sipAmtInput) return;
    const P = Math.max(0, parseFloat(sipAmtInput.value) || 0);
    const annualRate = Math.max(0, parseFloat(sipRateInput.value) || 0);
    const r = annualRate / 100 / 12;
    const years = Math.max(1, parseInt(sipYearsInput.value) || 1);
    const totalMonths = years * 12;
    const stepUpPercent = currentSipType === 'stepup' ? Math.max(0, parseFloat(sipStepupInput ? sipStepupInput.value : 0) || 0) : 0;

    let invested = 0;
    let total = 0;

    if (currentSipType === 'stepup' && stepUpPercent > 0) {
      // Step-Up SIP Cashflow Simulation
      let monthlyDeposit = P;
      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          invested += monthlyDeposit;
          const monthsRemaining = totalMonths - ((y - 1) * 12 + m) + 1;
          if (r > 0) {
            total += monthlyDeposit * Math.pow(1 + r, monthsRemaining);
          } else {
            total += monthlyDeposit;
          }
        }
        monthlyDeposit *= (1 + stepUpPercent / 100);
      }
    } else {
      // Standard Regular SIP Annuity Due Formula
      invested = P * totalMonths;
      if (r > 0) {
        total = P * ((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r);
      } else {
        total = invested;
      }
    }

    const gained = Math.max(0, total - invested);

    const elInvested = document.getElementById('sipResult-invested');
    const elGained = document.getElementById('sipResult-gained');
    const elTotal = document.getElementById('sipResult-total');

    if (elInvested) elInvested.textContent = formatCurrency(invested);
    if (elGained) elGained.textContent = formatCurrency(gained);
    if (elTotal) elTotal.textContent = formatCurrency(total);

    // Plot SIP curves
    const width = 500, height = 160;
    let ptsInvested = [], ptsTotal = [];
    let curInvArr = [], curTotArr = [];

    for (let i = 0; i <= years; i++) {
      let curInv = 0;
      let curTot = 0;

      if (i === 0) {
        curInv = 0;
        curTot = 0;
      } else if (currentSipType === 'stepup' && stepUpPercent > 0) {
        let deposit = P;
        const monthsPassed = i * 12;
        for (let y = 1; y <= i; y++) {
          for (let m = 1; m <= 12; m++) {
            curInv += deposit;
            const currentMonthIdx = (y - 1) * 12 + m;
            const remainingInYearI = monthsPassed - currentMonthIdx + 1;
            if (r > 0) {
              curTot += deposit * Math.pow(1 + r, remainingInYearI);
            } else {
              curTot += deposit;
            }
          }
          deposit *= (1 + stepUpPercent / 100);
        }
      } else {
        const monthsPassed = i * 12;
        curInv = P * monthsPassed;
        if (r > 0) {
          curTot = P * ((Math.pow(1 + r, monthsPassed) - 1) / r) * (1 + r);
        } else {
          curTot = curInv;
        }
      }

      curInvArr.push(curInv);
      curTotArr.push(curTot);

      const x = (i / years) * width;
      const safeTotal = total > 0 ? total : 1;
      const yInv = height - (curInv / safeTotal) * (height - 30) - 15;
      const yTot = height - (curTot / safeTotal) * (height - 30) - 15;

      ptsInvested.push({ x: x, y: yInv });
      ptsTotal.push({ x: x, y: yTot });
    }

    const pathInv = buildSmoothCurve(ptsInvested);
    const pathTot = buildSmoothCurve(ptsTotal);

    const chartInv = document.getElementById('sipChart-invested');
    const chartTot = document.getElementById('sipChart-total');
    const chartInvArea = document.getElementById('sipChart-invested-area');
    const chartTotArea = document.getElementById('sipChart-total-area');
    const dotInv = document.getElementById('sipChart-dot-inv');
    const dotTot = document.getElementById('sipChart-dot-tot');
    const badge = document.getElementById('sipChart-badge');

    if (chartInv) chartInv.setAttribute('d', pathInv);
    if (chartTot) chartTot.setAttribute('d', pathTot);
    if (chartInvArea) chartInvArea.setAttribute('d', `${pathInv} L ${width},${height} L 0,${height} Z`);
    if (chartTotArea) chartTotArea.setAttribute('d', `${pathTot} L ${width},${height} L 0,${height} Z`);

    if (ptsInvested.length > 0 && dotInv) {
      const last = ptsInvested[ptsInvested.length - 1];
      dotInv.setAttribute('cx', last.x.toFixed(1));
      dotInv.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('sipChart', 'sip-badge-inv', last.x, last.y, formatCompactCurrency(invested), '#d97706');
    }
    if (ptsTotal.length > 0 && dotTot) {
      const last = ptsTotal[ptsTotal.length - 1];
      dotTot.setAttribute('cx', last.x.toFixed(1));
      dotTot.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('sipChart', 'sip-badge-tot', last.x, last.y, formatCompactCurrency(total), '#007aff');
    }
    if (badge && invested > 0) {
      const mult = (total / invested).toFixed(1);
      badge.textContent = `${mult}x Growth`;
    }

    const sipSvg = document.getElementById('sipChart');
    if (sipSvg) {
      sipSvg._chartData = {
        series: ptsTotal.map((pt, i) => ({
          year: i,
          x: pt.x,
          y1: pt.y,
          y2: ptsInvested[i] ? ptsInvested[i].y : pt.y,
          val1: curTotArr[i],
          val2: curInvArr[i]
        }))
      };
    }

    renderGraphAxes('sipChart', total, years);
  };

  // ==========================================
  // 6. MATHS PIPELINE FOR LUMPSUM CALCULATOR
  // ==========================================
  const lumpAmtInput = document.getElementById('lump-amount');
  const lumpRateInput = document.getElementById('lump-rate');
  const lumpYearsInput = document.getElementById('lump-years');

  const calculateLumpsum = () => {
    if (!lumpAmtInput) return;
    const P = parseFloat(lumpAmtInput.value);
    const R = parseFloat(lumpRateInput.value) / 100;
    const t = parseInt(lumpYearsInput.value);

    const invested = P;
    const total = P * Math.pow(1 + R, t);
    const gained = Math.max(0, total - invested);

    const elInv = document.getElementById('lumpResult-invested');
    const elGain = document.getElementById('lumpResult-gained');
    const elTot = document.getElementById('lumpResult-total');

    if (elInv) elInv.textContent = formatCurrency(invested);
    if (elGain) elGain.textContent = formatCurrency(gained);
    if (elTot) elTot.textContent = formatCurrency(total);

    // Plot Lumpsum curves
    const width = 500, height = 160;
    let ptsInvested = [], ptsTotal = [];
    for (let i = 0; i <= t; i++) {
      const curInv = P;
      const curTot = P * Math.pow(1 + R, i);
      const x = (i / t) * width;
      const yInv = height - (curInv / total) * (height - 30) - 15;
      const yTot = height - (curTot / total) * (height - 30) - 15;

      ptsInvested.push({ x: x, y: yInv });
      ptsTotal.push({ x: x, y: yTot });
    }

    const pathInv = buildSmoothCurve(ptsInvested);
    const pathTot = buildSmoothCurve(ptsTotal);

    const chartInv = document.getElementById('lumpChart-invested');
    const chartTot = document.getElementById('lumpChart-total');
    const chartInvArea = document.getElementById('lumpChart-invested-area');
    const chartTotArea = document.getElementById('lumpChart-total-area');
    const dotInv = document.getElementById('lumpChart-dot-inv');
    const dotTot = document.getElementById('lumpChart-dot-tot');
    const badge = document.getElementById('lumpChart-badge');

    if (chartInv) chartInv.setAttribute('d', pathInv);
    if (chartTot) chartTot.setAttribute('d', pathTot);
    if (chartInvArea) chartInvArea.setAttribute('d', `${pathInv} L ${width},${height} L 0,${height} Z`);
    if (chartTotArea) chartTotArea.setAttribute('d', `${pathTot} L ${width},${height} L 0,${height} Z`);

    if (ptsInvested.length > 0 && dotInv) {
      const last = ptsInvested[ptsInvested.length - 1];
      dotInv.setAttribute('cx', last.x.toFixed(1));
      dotInv.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('lumpChart', 'lump-badge-inv', last.x, last.y, formatCompactCurrency(invested), '#d97706');
    }
    if (ptsTotal.length > 0 && dotTot) {
      const last = ptsTotal[ptsTotal.length - 1];
      dotTot.setAttribute('cx', last.x.toFixed(1));
      dotTot.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('lumpChart', 'lump-badge-tot', last.x, last.y, formatCompactCurrency(total), '#007aff');
    }
    if (badge && invested > 0) {
      const mult = (total / invested).toFixed(1);
      badge.textContent = `${mult}x Growth`;
    }

    const lumpSvg = document.getElementById('lumpChart');
    if (lumpSvg) {
      const curInvArr = ptsInvested.map(() => P);
      const curTotArr = ptsTotal.map((_, i) => P * Math.pow(1 + R, i));
      lumpSvg._chartData = {
        series: ptsTotal.map((pt, i) => ({
          year: i,
          x: pt.x,
          y1: pt.y,
          y2: ptsInvested[i] ? ptsInvested[i].y : pt.y,
          val1: curTotArr[i],
          val2: curInvArr[i]
        }))
      };
    }

    renderGraphAxes('lumpChart', total, t);
  };

  if (lumpAmtInput) {
    [lumpAmtInput, lumpRateInput, lumpYearsInput].forEach(inp => {
      inp.addEventListener('input', calculateLumpsum);
    });
  }

  // ==========================================
  // 6.5. MATHS PIPELINE FOR SWP CALCULATOR
  // ==========================================
  const swpAmtInput = document.getElementById('swp-amount');
  const swpAmtNum = document.getElementById('swp-amount-num');
  const swpWithdrawInput = document.getElementById('swp-withdraw');
  const swpWithdrawNum = document.getElementById('swp-withdraw-num');
  const swpRateInput = document.getElementById('swp-rate');
  const swpRateNum = document.getElementById('swp-rate-num');
  const swpYearsInput = document.getElementById('swp-years');
  const swpYearsNum = document.getElementById('swp-years-num');

  const syncSwpInputs = (rangeEl, numEl) => {
    if (!rangeEl || !numEl) return;
    rangeEl.addEventListener('input', () => {
      numEl.value = rangeEl.value;
      calculateSWP();
    });
    rangeEl.addEventListener('change', () => {
      numEl.value = rangeEl.value;
      calculateSWP();
    });
    numEl.addEventListener('input', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calculateSWP();
      }
    });
    numEl.addEventListener('change', () => {
      if (numEl.value !== '') {
        rangeEl.value = numEl.value;
        calculateSWP();
      }
    });
  };

  syncSwpInputs(swpAmtInput, swpAmtNum);
  syncSwpInputs(swpWithdrawInput, swpWithdrawNum);
  syncSwpInputs(swpRateInput, swpRateNum);
  syncSwpInputs(swpYearsInput, swpYearsNum);

  const calculateSWP = () => {
    if (!swpAmtInput) return;
    const initialCorpus = Math.max(0, parseFloat(swpAmtInput.value) || 0);
    const monthlyWithdrawal = Math.max(0, parseFloat(swpWithdrawInput.value) || 0);
    const r = Math.max(0, parseFloat(swpRateInput.value) || 0) / 100 / 12;
    const years = Math.max(1, parseInt(swpYearsInput.value) || 1);
    const totalMonths = years * 12;

    let balance = initialCorpus;
    let totalWithdrawn = 0;

    for (let m = 1; m <= totalMonths; m++) {
      if (balance <= 0) {
        balance = 0;
        break;
      }
      const interest = balance * r;
      balance += interest;
      const payout = Math.min(balance, monthlyWithdrawal);
      totalWithdrawn += payout;
      balance -= payout;
    }

    const elInvested = document.getElementById('swpResult-invested');
    const elWithdrawn = document.getElementById('swpResult-withdrawn');
    const elTotal = document.getElementById('swpResult-total');

    if (elInvested) elInvested.textContent = formatCurrency(initialCorpus);
    if (elWithdrawn) elWithdrawn.textContent = formatCurrency(totalWithdrawn);
    if (elTotal) elTotal.textContent = formatCurrency(balance);

    // Plot SWP curves
    const width = 500, height = 160;
    let ptsRemaining = [], ptsWithdrawn = [];
    let curBal = initialCorpus;
    let curWithdrawnAcc = 0;
    const maxVal = Math.max(initialCorpus, balance, totalWithdrawn, 1) * 1.12;

    ptsRemaining.push({ x: 0, y: height - (curBal / maxVal) * (height - 35) - 15 });
    ptsWithdrawn.push({ x: 0, y: height - 15 });

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        if (curBal > 0) {
          const interest = curBal * r;
          curBal += interest;
          const payout = Math.min(curBal, monthlyWithdrawal);
          curWithdrawnAcc += payout;
          curBal -= payout;
        }
      }

      const x = (y / years) * width;
      const yRem = height - (Math.max(0, curBal) / maxVal) * (height - 35) - 15;
      const yWith = height - (curWithdrawnAcc / maxVal) * (height - 35) - 15;

      ptsRemaining.push({ x: x, y: yRem });
      ptsWithdrawn.push({ x: x, y: yWith });
    }

    const pathRem = buildSmoothCurve(ptsRemaining);
    const pathWith = buildSmoothCurve(ptsWithdrawn);

    const chartRem = document.getElementById('swpChart-remaining');
    const chartWith = document.getElementById('swpChart-withdrawn');
    const chartRemArea = document.getElementById('swpChart-remaining-area');
    const chartWithArea = document.getElementById('swpChart-withdrawn-area');
    const dotRem = document.getElementById('swpChart-dot-rem');
    const dotWith = document.getElementById('swpChart-dot-with');
    const badge = document.getElementById('swpChart-badge');

    if (chartRem) chartRem.setAttribute('d', pathRem);
    if (chartWith) chartWith.setAttribute('d', pathWith);
    if (chartRemArea) chartRemArea.setAttribute('d', `${pathRem} L ${width},${height} L 0,${height} Z`);
    if (chartWithArea) chartWithArea.setAttribute('d', `${pathWith} L ${width},${height} L 0,${height} Z`);

    if (ptsRemaining.length > 0 && dotRem) {
      const last = ptsRemaining[ptsRemaining.length - 1];
      dotRem.setAttribute('cx', last.x.toFixed(1));
      dotRem.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('swpChart', 'swp-badge-rem', last.x, last.y, `Corpus: ${formatCompactCurrency(balance)}`, '#007aff');
    }
    if (ptsWithdrawn.length > 0 && dotWith) {
      const last = ptsWithdrawn[ptsWithdrawn.length - 1];
      dotWith.setAttribute('cx', last.x.toFixed(1));
      dotWith.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('swpChart', 'swp-badge-with', last.x, last.y, `Withdrawn: ${formatCompactCurrency(totalWithdrawn)}`, '#ea580c');
    }
    if (badge) {
      if (balance > 0) {
        badge.textContent = `Corpus Active (${formatCompactCurrency(balance)} Left)`;
        badge.style.color = '#007aff';
        badge.style.borderColor = '#bae6fd';
        badge.style.background = '#f0f7ff';
      } else {
        badge.textContent = `Corpus Exhausted`;
        badge.style.color = '#dc2626';
        badge.style.borderColor = '#fecaca';
        badge.style.background = '#fef2f2';
      }
    }

    const swpSvg = document.getElementById('swpChart');
    if (swpSvg) {
      let curB = initialCorpus;
      let curW = 0;
      let curBArr = [initialCorpus];
      let curWArr = [0];
      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          if (curB > 0) {
            const interest = curB * r;
            curB += interest;
            const payout = Math.min(curB, monthlyWithdrawal);
            curW += payout;
            curB -= payout;
          }
        }
        curBArr.push(Math.max(0, curB));
        curWArr.push(curW);
      }
      swpSvg._chartData = {
        series: ptsRemaining.map((pt, i) => ({
          year: i,
          x: pt.x,
          y1: pt.y,
          y2: ptsWithdrawn[i] ? ptsWithdrawn[i].y : pt.y,
          val1: curBArr[i],
          val2: curWArr[i]
        }))
      };
    }

    renderGraphAxes('swpChart', maxVal, years);
  };

  // ==========================================
  // 7. MATHS PIPELINE FOR EMI CALCULATOR
  // ==========================================
  const emiAmtInput = document.getElementById('emi-amount');
  const emiRateInput = document.getElementById('emi-rate');
  const emiYearsInput = document.getElementById('emi-years');

  const calculateEMI = () => {
    if (!emiAmtInput || !emiRateInput || !emiYearsInput) return;
    const P = Math.max(0, parseFloat(emiAmtInput.value) || 0);
    const r = Math.max(0, parseFloat(emiRateInput.value) || 0) / 12 / 100;
    const yearsVal = Math.max(1, parseInt(emiYearsInput.value) || 1);
    const n = yearsVal * 12;

    const elValAmt = document.getElementById('emiVal-amount');
    const elValRate = document.getElementById('emiVal-rate');
    const elValYears = document.getElementById('emiVal-years');
    if (elValAmt) elValAmt.textContent = formatCurrency(P);
    if (elValRate) elValRate.textContent = `${emiRateInput.value}%`;
    if (elValYears) elValYears.textContent = `${yearsVal} Years`;

    let emi = P / n; // default if rate is 0
    if (r > 0) {
      emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    const totalRepayment = emi * n;
    const totalInterest = Math.max(0, totalRepayment - P);

    const elMonthly = document.getElementById('emiResult-monthly');
    const elInterest = document.getElementById('emiResult-interest');
    const elTotal = document.getElementById('emiResult-total');

    if (elMonthly) elMonthly.textContent = formatCurrency(emi);
    if (elInterest) elInterest.textContent = formatCurrency(totalInterest);
    if (elTotal) elTotal.textContent = formatCurrency(totalRepayment);

    // Plot amortization curve (Principal remaining over time vs interest)
    const width = 500, height = 160;
    let ptsPrincipal = [], ptsInterest = [];
    let remainingPrincipal = P;
    let cumulativeInterest = 0;

    for (let i = 0; i <= n; i++) {
      if (i > 0) {
        const monthlyInterest = remainingPrincipal * r;
        const monthlyPrincipal = emi - monthlyInterest;
        remainingPrincipal = Math.max(0, remainingPrincipal - monthlyPrincipal);
        cumulativeInterest += monthlyInterest;
      }
      
      const x = (i / n) * width;
      const yPrin = height - (P > 0 ? (remainingPrincipal / P) * (height - 30) : 0) - 15;
      const yInt = height - (totalInterest > 0 ? (cumulativeInterest / totalInterest) * (height - 35) : 0) - 15;

      ptsPrincipal.push({ x: x, y: yPrin });
      ptsInterest.push({ x: x, y: yInt });
    }

    const pathPrin = buildSmoothCurve(ptsPrincipal);
    const pathInt = buildSmoothCurve(ptsInterest);

    const chartPrin = document.getElementById('emiChart-principal');
    const chartTot = document.getElementById('emiChart-total');
    const chartPrinArea = document.getElementById('emiChart-principal-area');
    const chartTotArea = document.getElementById('emiChart-total-area');
    const dotPrin = document.getElementById('emiChart-dot-prin');
    const dotTot = document.getElementById('emiChart-dot-tot');
    const badge = document.getElementById('emiChart-badge');

    if (chartPrin) chartPrin.setAttribute('d', pathPrin);
    if (chartTot) chartTot.setAttribute('d', pathInt);
    if (chartPrinArea) chartPrinArea.setAttribute('d', `${pathPrin} L ${width},${height} L 0,${height} Z`);
    if (chartTotArea) chartTotArea.setAttribute('d', `${pathInt} L ${width},${height} L 0,${height} Z`);

    if (ptsPrincipal.length > 0 && dotPrin) {
      const last = ptsPrincipal[ptsPrincipal.length - 1];
      dotPrin.setAttribute('cx', last.x.toFixed(1));
      dotPrin.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('emiChart', 'emi-badge-prin', last.x, last.y, `Bal: ${formatCompactCurrency(remainingPrincipal)}`, '#007aff');
    }
    if (ptsInterest.length > 0 && dotTot) {
      const last = ptsInterest[ptsInterest.length - 1];
      dotTot.setAttribute('cx', last.x.toFixed(1));
      dotTot.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('emiChart', 'emi-badge-int', last.x, last.y, `Int: ${formatCompactCurrency(totalInterest)}`, '#ea580c');
    }
    if (badge && P > 0) {
      badge.textContent = `Interest: ${((totalInterest/P)*100).toFixed(0)}% of loan`;
    }

    const emiSvg = document.getElementById('emiChart');
    if (emiSvg) {
      let remP = P;
      let cumI = 0;
      let remPArr = [P];
      let cumIArr = [0];
      for (let i = 1; i <= n; i++) {
        const monthlyInterest = remP * r;
        const monthlyPrincipal = emi - monthlyInterest;
        remP = Math.max(0, remP - monthlyPrincipal);
        cumI += monthlyInterest;
        remPArr.push(remP);
        cumIArr.push(cumI);
      }
      emiSvg._chartData = {
        series: ptsPrincipal.map((pt, i) => ({
          year: Math.round((i / n) * (n / 12)),
          x: pt.x,
          y1: pt.y,
          y2: ptsInterest[i] ? ptsInterest[i].y : pt.y,
          val1: remPArr[i],
          val2: cumIArr[i]
        }))
      };
    }

    renderGraphAxes('emiChart', P, yearsVal);
  };

  if (emiAmtInput) {
    [emiAmtInput, emiRateInput, emiYearsInput].filter(Boolean).forEach(inp => {
      inp.addEventListener('input', calculateEMI);
    });
  }

  // ==========================================
  // 8. MATHS PIPELINE FOR RETIREMENT PLANNER
  // ==========================================
  const retCurrentInput = document.getElementById('ret-current');
  const retRetireInput = document.getElementById('ret-retire');
  const retExpensesInput = document.getElementById('ret-expenses');
  const retInflationInput = document.getElementById('ret-inflation');

  const calculateRetirement = () => {
    if (!retCurrentInput || !retRetireInput || !retExpensesInput || !retInflationInput) return;
    
    // Safety check: planned retirement age must be > current age
    let currentAge = parseInt(retCurrentInput.value) || 30;
    let retireAge = parseInt(retRetireInput.value) || 60;
    if (retireAge <= currentAge) {
      retireAge = currentAge + 1;
      retRetireInput.value = retireAge;
      const numInput = document.getElementById('ret-retire-num');
      if (numInput) numInput.value = retireAge;
    }

    const expToday = Math.max(0, parseFloat(retExpensesInput.value) || 0);
    const inflation = Math.max(0, parseFloat(retInflationInput.value) || 0) / 100;
    const yearsToRetire = Math.max(1, retireAge - currentAge);
    const lifeExpectancy = 85; // Standard cap
    const yearsInRetire = Math.max(1, lifeExpectancy - retireAge);

    const elValCur = document.getElementById('retVal-current');
    const elValRet = document.getElementById('retVal-retire');
    const elValExp = document.getElementById('retVal-expenses');
    const elValInf = document.getElementById('retVal-inflation');
    if (elValCur) elValCur.textContent = `${currentAge} Years`;
    if (elValRet) elValRet.textContent = `${retireAge} Years`;
    if (elValExp) elValExp.textContent = formatCurrency(expToday);
    if (elValInf) elValInf.textContent = `${retInflationInput.value}%`;

    // 1. Inflation adjusted expenses at retirement
    const expAtRetire = expToday * Math.pow(1 + inflation, yearsToRetire);
    
    // 2. Target Pension Corpus Needed
    const netRealReturn = 0.01887;
    let targetCorpus = expAtRetire * 12 * yearsInRetire;
    if (netRealReturn > 0) {
      targetCorpus = expAtRetire * 12 * (1 - Math.pow(1 + netRealReturn, -yearsInRetire)) / netRealReturn;
    }

    // 3. Monthly SIP needed today
    const eqRate = 0.12 / 12;
    const months = yearsToRetire * 12;
    let sipNeeded = targetCorpus / months;
    if (eqRate > 0) {
      sipNeeded = targetCorpus / (((Math.pow(1 + eqRate, months) - 1) / eqRate) * (1 + eqRate));
    }

    const elExpRetire = document.getElementById('retResult-expRetire');
    const elSip = document.getElementById('retResult-sip');
    const elCorpus = document.getElementById('retResult-corpus');
    if (elExpRetire) elExpRetire.textContent = formatCurrency(expAtRetire);
    if (elSip) elSip.textContent = formatCurrency(sipNeeded);
    if (elCorpus) elCorpus.textContent = formatCurrency(targetCorpus);

    // Plot Retirement trends
    const width = 500, height = 160;
    let ptsInf = [], ptsCorp = [];
    for (let i = 0; i <= yearsToRetire; i++) {
      const curExp = expToday * Math.pow(1 + inflation, i);
      let curSav = 0;
      if (eqRate > 0 && i > 0) {
        curSav = sipNeeded * (((Math.pow(1 + eqRate, i * 12) - 1) / eqRate) * (1 + eqRate));
      }
      
      const x = (i / yearsToRetire) * width;
      const yInf = height - (expAtRetire > 0 ? (curExp / expAtRetire) * (height - 35) : 0) - 15;
      const yCorp = height - (targetCorpus > 0 ? (curSav / targetCorpus) * (height - 30) : 0) - 15;

      ptsInf.push({ x: x, y: yInf });
      ptsCorp.push({ x: x, y: yCorp });
    }

    const pathInf = buildSmoothCurve(ptsInf);
    const pathCorp = buildSmoothCurve(ptsCorp);

    const chartInf = document.getElementById('retChart-inflation');
    const chartCorp = document.getElementById('retChart-corpus');
    const chartInfArea = document.getElementById('retChart-inflation-area');
    const chartCorpArea = document.getElementById('retChart-corpus-area');
    const dotInf = document.getElementById('retChart-dot-inf');
    const dotCorp = document.getElementById('retChart-dot-corp');

    if (chartInf) chartInf.setAttribute('d', pathInf);
    if (chartCorp) chartCorp.setAttribute('d', pathCorp);
    if (chartInfArea) chartInfArea.setAttribute('d', `${pathInf} L ${width},${height} L 0,${height} Z`);
    if (chartCorpArea) chartCorpArea.setAttribute('d', `${pathCorp} L ${width},${height} L 0,${height} Z`);

    if (ptsInf.length > 0 && dotInf) {
      const last = ptsInf[ptsInf.length - 1];
      dotInf.setAttribute('cx', last.x.toFixed(1));
      dotInf.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('retChart', 'ret-badge-inf', last.x, last.y, `Exp: ${formatCompactCurrency(expAtRetire)}`, '#ea580c');
    }
    if (ptsCorp.length > 0 && dotCorp) {
      const last = ptsCorp[ptsCorp.length - 1];
      dotCorp.setAttribute('cx', last.x.toFixed(1));
      dotCorp.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('retChart', 'ret-badge-corp', last.x, last.y, `Target: ${formatCompactCurrency(targetCorpus)}`, '#007aff');
    }

    renderGraphAxes('retChart', targetCorpus, yearsToRetire);

    const retSvg = document.getElementById('retChart');
    if (retSvg) {
      let expArr = [];
      let savArr = [];
      for (let i = 0; i <= yearsToRetire; i++) {
        const curExp = expToday * Math.pow(1 + inflation, i);
        let curSav = 0;
        if (eqRate > 0 && i > 0) {
          curSav = sipNeeded * (((Math.pow(1 + eqRate, i * 12) - 1) / eqRate) * (1 + eqRate));
        }
        expArr.push(curExp);
        savArr.push(curSav);
      }
      retSvg._chartData = {
        series: ptsCorp.map((pt, i) => ({
          year: currentAge + i,
          x: pt.x,
          y1: pt.y,
          y2: ptsInf[i] ? ptsInf[i].y : pt.y,
          val1: savArr[i],
          val2: expArr[i]
        }))
      };
    }
  };

  if (retCurrentInput) {
    [retCurrentInput, retRetireInput, retExpensesInput, retInflationInput].filter(Boolean).forEach(inp => {
      inp.addEventListener('input', calculateRetirement);
    });
  }

  // ==========================================
  // 9. MATHS PIPELINE FOR FIRE CALCULATOR
  // ==========================================
  const fireExpInput = document.getElementById('fire-expenses');
  const fireWealthInput = document.getElementById('fire-wealth');
  const fireSwrInput = document.getElementById('fire-swr');

  const calculateFIRE = () => {
    if (!fireExpInput || !fireWealthInput || !fireSwrInput) return;
    const exp = Math.max(0, parseFloat(fireExpInput.value) || 0);
    const wealth = Math.max(0, parseFloat(fireWealthInput.value) || 0);
    const swrVal = parseFloat(fireSwrInput.value) || 4;
    const swr = Math.max(0.001, swrVal / 100);

    const elValExp = document.getElementById('fireVal-expenses');
    const elValWealth = document.getElementById('fireVal-wealth');
    const elValSwr = document.getElementById('fireVal-swr');
    if (elValExp) elValExp.textContent = formatCurrency(exp);
    if (elValWealth) elValWealth.textContent = formatCurrency(wealth);
    if (elValSwr) elValSwr.textContent = `${fireSwrInput.value}%`;

    const targetFIRE = exp / swr;
    const deficit = Math.max(0, targetFIRE - wealth);
    const ratio = targetFIRE > 0 ? Math.min(100, (wealth / targetFIRE) * 100) : 100;

    const elResNumber = document.getElementById('fireResult-number');
    const elResDeficit = document.getElementById('fireResult-deficit');
    const elResRatio = document.getElementById('fireResult-ratio');
    if (elResNumber) elResNumber.textContent = formatCurrency(targetFIRE);
    if (elResDeficit) elResDeficit.textContent = formatCurrency(deficit);
    if (elResRatio) elResRatio.textContent = `${ratio.toFixed(1)}% Ready`;

    // Plot FIRE comparison bar/curve
    const width = 500, height = 160;
    const yTarget = height - 100;
    const currentRatio = targetFIRE > 0 ? Math.min(1, wealth / targetFIRE) : 1;

    let ptsCur = [];
    const steps = 10;
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * width;
      const progressFactor = Math.pow(s / steps, 1.2);
      const y = height - (currentRatio * progressFactor) * (height - 40) - 15;
      ptsCur.push({ x: x, y: y });
    }

    const pathCur = buildSmoothCurve(ptsCur);
    const pathTar = `M 0,${yTarget} L ${width},${yTarget}`;

    const chartTar = document.getElementById('fireChart-target');
    const chartCur = document.getElementById('fireChart-current');
    const chartTarArea = document.getElementById('fireChart-target-area');
    const chartCurArea = document.getElementById('fireChart-current-area');
    const dotCur = document.getElementById('fireChart-dot-cur');
    const badge = document.getElementById('fireChart-badge');

    if (chartTar) chartTar.setAttribute('d', pathTar);
    if (chartCur) chartCur.setAttribute('d', pathCur);
    if (chartTarArea) chartTarArea.setAttribute('d', `M 0,${yTarget} L ${width},${yTarget} L ${width},${height} L 0,${height} Z`);
    if (chartCurArea) chartCurArea.setAttribute('d', `${pathCur} L ${width},${height} L 0,${height} Z`);

    if (ptsCur.length > 0 && dotCur) {
      const last = ptsCur[ptsCur.length - 1];
      dotCur.setAttribute('cx', last.x.toFixed(1));
      dotCur.setAttribute('cy', last.y.toFixed(1));
      renderValueBadge('fireChart', 'fire-badge-cur', last.x, last.y, `Wealth: ${formatCompactCurrency(wealth)}`, '#007aff');
      renderValueBadge('fireChart', 'fire-badge-tar', 450, yTarget, `Target: ${formatCompactCurrency(targetFIRE)}`, '#94a3b8');
    }
    if (badge) {
      badge.textContent = `${ratio.toFixed(0)}% FIRE Target`;
    }

    const fireSvg = document.getElementById('fireChart');
    if (fireSvg) {
      fireSvg._chartData = {
        series: ptsCur.map((pt, i) => ({
          year: Math.round((i / steps) * 30),
          x: pt.x,
          y1: pt.y,
          val1: Math.round(wealth * Math.pow(i / steps, 1.2)),
          val2: targetFIRE
        }))
      };
    }

    renderGraphAxes('fireChart', targetFIRE, 30);
  };

  if (fireExpInput) {
    [fireExpInput, fireWealthInput, fireSwrInput].filter(Boolean).forEach(inp => {
      inp.addEventListener('input', calculateFIRE);
    });
  }

  // Sync input pairs across all calculator tabs
  syncGenericInputPair(lumpAmtInput, document.getElementById('lump-amount-num'), calculateLumpsum);
  syncGenericInputPair(lumpRateInput, document.getElementById('lump-rate-num'), calculateLumpsum);
  syncGenericInputPair(lumpYearsInput, document.getElementById('lump-years-num'), calculateLumpsum);

  syncGenericInputPair(emiAmtInput, document.getElementById('emi-amount-num'), calculateEMI);
  syncGenericInputPair(emiRateInput, document.getElementById('emi-rate-num'), calculateEMI);
  syncGenericInputPair(emiYearsInput, document.getElementById('emi-years-num'), calculateEMI);

  syncGenericInputPair(retCurrentInput, document.getElementById('ret-current-num'), calculateRetirement);
  syncGenericInputPair(retRetireInput, document.getElementById('ret-retire-num'), calculateRetirement);
  syncGenericInputPair(retExpensesInput, document.getElementById('ret-expenses-num'), calculateRetirement);
  syncGenericInputPair(retInflationInput, document.getElementById('ret-inflation-num'), calculateRetirement);

  syncGenericInputPair(fireExpInput, document.getElementById('fire-expenses-num'), calculateFIRE);
  syncGenericInputPair(fireWealthInput, document.getElementById('fire-wealth-num'), calculateFIRE);
  syncGenericInputPair(fireSwrInput, document.getElementById('fire-swr-num'), calculateFIRE);

  // Make all 6 SVG charts clickable and draggable
  makeGraphInteractive('sipChart', sipYearsInput, calculateSIP);
  makeGraphInteractive('lumpChart', lumpYearsInput, calculateLumpsum);
  makeGraphInteractive('swpChart', swpYearsInput, calculateSWP);
  makeGraphInteractive('emiChart', emiYearsInput, calculateEMI);
  makeGraphInteractive('retChart', retRetireInput, calculateRetirement);
  makeGraphInteractive('fireChart', fireWealthInput, calculateFIRE);

  // Setup hover tooltips on all 6 SVG charts
  setupHoverTooltip('sipChart', 'Future Value', '#007aff', 'Invested', '#d97706');
  setupHoverTooltip('lumpChart', 'Future Value', '#007aff', 'Invested', '#d97706');
  setupHoverTooltip('swpChart', 'Remaining Corpus', '#007aff', 'Withdrawn', '#ea580c');
  setupHoverTooltip('emiChart', 'Loan Balance', '#007aff', 'Interest Paid', '#ea580c');
  setupHoverTooltip('retChart', 'Savings Corpus', '#007aff', 'Inflation Expenses', '#ea580c');
  setupHoverTooltip('fireChart', 'Wealth Progress', '#007aff', 'FIRE Target', '#94a3b8');

  // Trigger initial calculate loops on DOM load
  calculateSIP();
  calculateLumpsum();
  calculateSWP();
  calculateEMI();
  calculateRetirement();
  calculateFIRE();

});
