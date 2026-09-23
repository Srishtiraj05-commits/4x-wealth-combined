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
    { symbol: "RELIANCE", name: "Reliance", price: 1322.0, change: 1.5, logo: "R" },
    { symbol: "TCS", name: "Tcs", price: 2304.0, change: -0.69, logo: "T" },
    { symbol: "HDFC BANK", name: "Hdfc Bank", price: 712.1, change: 0.77, logo: "H" },
    { symbol: "INFOSYS", name: "Infosys", price: 1134.0, change: -0.03, logo: "I" },
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
  // 4. BLOG CONTENT DATABASE
  // ==========================================
  const blogContents = {
    "mutual-funds": {
      category: "Mutual Funds",
      title: "What is a Mutual Fund?",
      body: `
        <p>A mutual fund is a professionally managed investment fund that pools money from many investors to purchase securities. These securities include equity shares, bonds, short-term debt, and other assets. The primary advantage of a mutual fund is diversification: by spreading capital across dozens or hundreds of different companies, mutual funds dilute the impact of any single asset class downturn.</p>
        <h4>How do Mutual Funds Work?</h4>
        <p>When you invest in a mutual fund, you purchase shares or units of the fund. Each unit represents a proportional ownership interest in the fund's underlying assets and the income it generates. The Net Asset Value (NAV) represents the cumulative per-unit market value of the fund's portfolio and is calculated at the close of every business day.</p>
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
    },
    "nps": {
      category: "Retirement",
      title: "Understanding NPS: How to Maximize Tax-Savings and Pension Yields",
      body: `
        <p>The National Pension System (NPS) is a voluntary, long-term retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA). It is designed to enable systematic savings during your working life, mapping to a stable pension shell at retirement.</p>
        <h4>Tier 1 vs. Tier 2 Accounts</h4>
        <ul>
          <li><strong>Tier 1 Account:</strong> The core pension account with tax-saving benefits. Withdrawals are locked until age 60, except in specific conditional cases. Contributions are eligible for deductions under Section 80C and an additional ₹50,000 deduction under Section 80CCD(1B).</li>
          <li><strong>Tier 2 Account:</strong> A voluntary savings account that allows unrestricted withdrawals, behaving similarly to a mutual fund but without tax deductions.</li>
        </ul>
        <h4>Active vs. Auto Choices</h4>
        <p>Investors can opt for the <strong>Active Choice</strong> (specifying allocation split across Equities, Corporate Debt, Government Bonds, and Alternative Assets up to 75% limit) or <strong>Auto Choice</strong> (Life Cycle funds that automatically reduce equity exposures as you age).</p>
      `
    },
    "pms": {
      category: "Advanced",
      title: "PMS vs. Mutual Funds: Which Investment Route Fits Your Portfolio?",
      body: `
        <p>For high-net-worth investors, choosing between Portfolio Management Services (PMS) and Mutual Funds represents a critical strategic decision. Both routes invest in equities but differ in tick size, customization, and legal structure.</p>
        <h4>Key Technical Differences</h4>
        <ul>
          <li><strong>Minimum Ticket Size:</strong> Mutual funds allow micro-SIP investments starting at ₹500, whereas PMS requires a regulatory minimum entry ticket of ₹50 Lakhs.</li>
          <li><strong>Ownership of Securities:</strong> Mutual fund investors own units of a pooled fund, whereas PMS clients hold direct stock shares inside a personal Demat account mapped under a Power of Attorney (PoA).</li>
          <li><strong>Customization:</strong> PMS portfolios can be tailored to exclude specific sectors (e.g. ESG filters, promoter lock-ins), while mutual funds operate strict uniform portfolios for all unit-holders.</li>
        </ul>
        <h4>Tax Implication</h4>
        <p>Mutual funds do not trigger capital gains tax when the fund manager rotates stock positions inside the fund. In a PMS, every buy/sell trade executed by the manager is a transaction on your personal Demat, triggering capital gains liability for that financial year.</p>
      `
    },
    "debt": {
      category: "Bonds",
      title: "Debt & Corporate FDs: Building a Resilient Fixed-Income Shell",
      body: `
        <p>Fixed-income securities represent the stabilizing layer of a well-balanced wealth portfolio. While equities generate long-term capital compounding, debt instruments provide yield stability, capital protection, and liquid dry powder to deploy during market corrections.</p>
        <h4>Corporate Fixed Deposits (FDs)</h4>
        <p>Unlike bank FDs, corporate FDs are unsecured deposits raised by financial institutions and manufacturing conglomerates. They offer higher interest rates than bank FDs. However, they carry credit risk. Investors must monitor credit ratings (e.g., AAA rating from CRISIL/ICRA indicates the highest safety check).</p>
        <h4>Debt Mutual Funds vs. Direct Bonds</h4>
        <p>Debt mutual funds invest in a diversified basket of commercial papers, treasury bills, and government bonds. They eliminate default risk of individual companies via massive diversification. Direct bonds allow you to lock in specific coupons, but demand higher initial capital outlays.</p>
      `
    }
  };

  // ==========================================
  // 5. MODAL TRIGGER EVENT BINDINGS
  // ==========================================
  const blogModal = document.getElementById('blogModal');
  const blogModalClose = document.getElementById('blogModalClose');
  const blogArticleTitle = document.getElementById('blogArticleTitle');
  const blogArticleMeta = document.getElementById('blogArticleMeta');
  const blogArticleBody = document.getElementById('blogArticleBody');

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      const data = blogContents[blogId];
      if (data && blogModal) {
        if (blogArticleMeta) blogArticleMeta.textContent = (data.category || '').toUpperCase();
        if (blogArticleTitle) blogArticleTitle.textContent = data.title || '';
        if (blogArticleBody) blogArticleBody.innerHTML = data.body || '';
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
    if (blogModal && e.target === blogModal) {
      blogModal.classList.remove('open');
    }
  });

  // ==========================================
  // 6. REAL-TIME SEARCH TEXT FILTER
  // ==========================================
  const blogSearch = document.getElementById('blogSearch');
  if (blogSearch) {
    blogSearch.addEventListener('input', (e) => {
      const query = (e.target.value || '').toLowerCase().trim();
      document.querySelectorAll('.blog-card').forEach(card => {
        const titleEl = card.querySelector('h3');
        const badgeEl = card.querySelector('.blog-category-badge');
        const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        const categoryText = badgeEl ? badgeEl.textContent.toLowerCase() : '';
        
        if (titleText.includes(query) || categoryText.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ==========================================
  // 7. CARD ENTRANCE ANIMATIONS
  // ==========================================
  if (typeof gsap !== 'undefined') {
    const blogCards = document.querySelectorAll('.blog-card');
    if (blogCards.length > 0) {
      gsap.from(blogCards, {
        opacity: 0,
        y: 25,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)'
      });
    }
    const reportCards = document.querySelectorAll('.report-card');
    if (reportCards.length > 0) {
      gsap.from(reportCards, {
        opacity: 0,
        y: 25,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.2,
        ease: 'back.out(1.4)'
      });
    }
  }

});
