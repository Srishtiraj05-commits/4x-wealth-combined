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
  // 4. BLOG CONTENT DATABASE (INSTITUTIONAL SDE GRADE)
  // ==========================================
  const blogContents = {
    "mutual-funds": {
      category: "Mutual Funds",
      title: "What is a Mutual Fund? Active Alpha vs. Index Replication",
      body: `
        <p>A mutual fund is an institutional pooled investment vehicle regulated by SEBI under the Mutual Funds Regulations, 1996. It aggregates capital from individual and corporate investors to deploy across a diversified basket of exchange-listed equities, debt instruments, and money-market securities.</p>
        
        <h4>1. Operational Architecture & Daily NAV Mechanics</h4>
        <p>When capital is invested in a mutual fund scheme, investors are allotted fractional units based on the prevailing <strong>Net Asset Value (NAV)</strong> calculated at the close of each trading day:</p>
        <div style="background: #F8FAFC; border: 1px solid #BAE6FD; padding: 14px 18px; border-radius: 10px; font-family: var(--font-mono); font-size: 13px; color: #0F172A; margin: 1.2rem 0;">
          NAV = [Total Market Value of Assets + Current Receivables - Liabilities & Accrued Expenses] / Total Units Outstanding
        </div>
        <p>This daily mark-to-market structure guarantees full fiduciary transparency, third-party custodian custody (via SEBI-registered custodians), and daily liquidity under T+2/T+1 settlement cycles.</p>

        <h4>2. Active Management vs. Passive Index Replication</h4>
        <ul>
          <li><strong>Active Mandates:</strong> Research teams perform bottom-up fundamental diligence and macroeconomic factor screening to achieve positive <em>alpha</em> (excess return over benchmark indices like NIFTY 50 TRI or BSE 500 TRI).</li>
          <li><strong>Passive Index & ETF Mandates:</strong> Rule-based replication tracking an underlying index with minimized tracking error and compressed total expense ratios (TER).</li>
        </ul>

        <h4>3. Direct Plans vs. Regular Distribution Channels</h4>
        <p>Mutual funds operate under two execution formats: Direct plans (for self-directed algorithmic execution) and Regular plans (distributed through certified AMFI ARN partners who provide asset allocation advisory, quarterly rebalancing, tax-harvesting, and disciplined risk-regime management).</p>
      `
    },
    "compounding": {
      category: "Compounding & SIP",
      title: "SIP vs. SWP vs. STP: Capital Accumulation, Migration & Harvest",
      body: `
        <p>Institutional portfolio engineering utilizes three core programmatic cash-flow mechanisms to automate capital deployment, risk hedging, and tax-efficient drawdown across market cycles.</p>
        
        <h4>1. Systematic Investment Plan (SIP) — Capital Accumulation</h4>
        <p>SIP enforces programmatic dollar-cost (rupee-cost) averaging by deploying a fixed capital quantum at defined intervals (monthly/weekly). When markets experience volatility drawdowns, the fixed installment purchases a larger quantity of fund units at lower NAVs, mathematically reducing the weighted average acquisition cost without requiring speculative market timing.</p>

        <h4>2. Systematic Transfer Plan (STP) — Volatility-Shielded Migration</h4>
        <p>When substantial liquid liquidity is realized (e.g. business exits, real estate monetization, annual bonuses), deploying a single lump sum directly into equity assets exposes capital to peak-cycle risk. STP solves this by parking the capital in low-volatility overnight/liquid debt schemes and systematically migrating tranches into diversified equities over 6–24 months.</p>

        <h4>3. Systematic Withdrawal Plan (SWP) — Tax-Efficient Harvesting</h4>
        <p>SWP automates predictable cash flows for retirement or passive income mandates. Rather than liquidating arbitrary blocks or receiving dividend distributions taxed at marginal slab rates (up to 39%), SWP redeems units proportionally. Under Indian income tax law, redemptions are subject to Long-Term/Short-Term Capital Gains rules, allowing significant annual capital tax shields.</p>
      `
    },
    "growth": {
      category: "Quant Formula",
      title: "The Compounding Equation: Mathematical Time Horizon Model",
      body: `
        <p>Compounding is the exponential engine of long-term wealth creation. In simple interest regimes, returns are linear; in compound regimes, realized returns are reinvested to produce secondary and tertiary returns, generating a convex growth curve.</p>
        
        <h4>1. Mathematical Proof of Convexity</h4>
        <p>The standard future value formulation for continuous systematic compounding is:</p>
        <div style="background: #090D16; color: #38BDF8; border: 1px solid #BAE6FD; padding: 16px 20px; border-radius: 10px; font-family: var(--font-mono); font-size: 14px; margin: 1.2rem 0; text-align: center;">
          FV = P &times; [ ( (1 + r)^n - 1 ) / r ] &times; (1 + r)
        </div>
        <p>Because the variable <em>n</em> (time periods) is in the exponent, increasing the time horizon by a factor of 2 can multiply the cumulative output by a factor of 4x to 8x.</p>

        <h4>2. Quantitative Cost of Delayed Execution</h4>
        <p>Consider an identical monthly commitment of ₹25,000 at a modeled CAGR of 12.5%:</p>
        <ul>
          <li><strong>Investor A (Start Age 25, 35-Yr Horizon):</strong> Total Invested = ₹1.05 Cr &bull; Final Portfolio Value = <strong>₹16.85 Crores</strong></li>
          <li><strong>Investor B (Start Age 35, 25-Yr Horizon):</strong> Total Invested = ₹75.0 Lakhs &bull; Final Portfolio Value = <strong>₹4.74 Crores</strong></li>
        </ul>
        <p>A 10-year delay requires a sacrifice of over ₹12 Crores in cumulative terminal wealth. In portfolio mathematics, starting early dominates nominal return variation.</p>
      `
    },
    "nps": {
      category: "Retirement & NPS",
      title: "Understanding NPS: Fiduciary Tax Optimization & Pension Shell",
      body: `
        <p>The National Pension System (NPS) is an institutional long-term retirement framework established under the Pension Fund Regulatory and Development Authority (PFRDA) Act, 2013. It offers the lowest asset management expense ratio globally (approx. 0.03% to 0.09% p.a.).</p>
        
        <h4>1. Dual-Tier Account Architecture</h4>
        <ul>
          <li><strong>Tier-1 (Retirement Locked):</strong> Mandatory lock-in until age 60 with structured withdrawal rules. Offers exclusive tax incentives under Section 80CCD(1) and Section 80CCD(1B).</li>
          <li><strong>Tier-2 (Unrestricted Liquidity):</strong> Voluntary investment account without lock-in or exit penalties, providing seamless withdrawals similar to open-ended mutual funds.</li>
        </ul>

        <h4>2. Triple Tax Advantage (E-E-E Regime)</h4>
        <p>Contributions to NPS qualify for up to ₹1.5 Lakhs under Section 80CCD(1) plus an exclusive additional deduction of ₹50,000 under Section 80CCD(1B), resulting in up to ₹15,600 annual net tax savings for individuals in the highest 30% (+ cess) bracket. At age 60, 60% of the corpus is 100% tax-free upon lumpsum withdrawal, with the remaining 40% converted into a lifelong pension annuity.</p>
      `
    },
    "pms": {
      category: "PMS Desk",
      title: "PMS vs. Mutual Funds: Strategic High-Ticket Allocation (₹50L+)",
      body: `
        <p>For High-Net-Worth Individuals (HNIs) and family offices, evaluating Portfolio Management Services (PMS) versus Mutual Funds requires examining regulatory thresholds, beneficial asset ownership, and strategy customization.</p>
        
        <h4>1. Structural & Legal Distinctions</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 1.2rem 0; font-size: 13.5px;">
          <thead>
            <tr style="background: #F0F8FF; border-bottom: 2px solid #BAE6FD;">
              <th style="padding: 10px; text-align: left; font-family: var(--font-mono);">Parameter</th>
              <th style="padding: 10px; text-align: left; font-family: var(--font-mono);">Mutual Funds</th>
              <th style="padding: 10px; text-align: left; font-family: var(--font-mono);">Discretionary PMS</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px; font-weight: 700;">Min Ticket Size</td>
              <td style="padding: 10px;">₹500 (SIP)</td>
              <td style="padding: 10px; font-weight: 700; color: #0077FF;">₹50 Lakhs (SEBI Mandate)</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px; font-weight: 700;">Ownership</td>
              <td style="padding: 10px;">Pooled Units in Trust</td>
              <td style="padding: 10px;">Direct Demat Shares under PoA</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px; font-weight: 700;">Customization</td>
              <td style="padding: 10px;">Uniform Scheme Mandate</td>
              <td style="padding: 10px;">Bespoke Filters / Sector Exclusions</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: 700;">Tax Recognition</td>
              <td style="padding: 10px;">Internal churn untaxed</td>
              <td style="padding: 10px;">Direct capital gains per trade</td>
            </tr>
          </tbody>
        </table>

        <h4>2. Strategy Selection Framework</h4>
        <p>Mutual funds provide optimal tax shielding for aggressive active churn, while PMS is ideally suited for concentrated alpha strategies (15–25 high-conviction stocks) and direct demat corporate action benefits.</p>
      `
    },
    "debt": {
      category: "Fixed Income",
      title: "Debt Instruments & Corporate FDs: Building a Resilient Shield",
      body: `
        <p>Fixed-income instruments form the sovereign ballast of an institutional wealth portfolio, providing contractual cash-flow certainty, capital preservation, and drawdown mitigation during equity volatility shocks.</p>
        
        <h4>1. Credit Spread Optimization & Rating Tiers</h4>
        <p>Fixed income allocations are structured across three credit categories:</p>
        <ul>
          <li><strong>Sovereign & G-Secs:</strong> Zero default risk backed by the Government of India, offering benchmark risk-free rate structures and duration matching.</li>
          <li><strong>CRISIL/ICRA AAA Corporate Deposits:</strong> High-grade institutional fixed deposits offering 70–120 bps spreads over bank deposits with rigorous balance sheet covenants.</li>
          <li><strong>Target Maturity Debt Index Funds:</strong> Passively managed roll-down duration funds locking in prevailing yields to maturity (YTM) while eliminating interest rate timing risk.</li>
        </ul>

        <h4>2. Fiduciary Risk Controls</h4>
        <p>At 4X Wealth, fixed-income mandates adhere strictly to high-quality credit guidelines: zero exposure to unrated or speculative-grade paper, rigorous duration monitoring against RBI monetary policy cycles, and programmatic rebalancing into equity during severe market corrections.</p>
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

  const openBlogArticle = (blogId) => {
    const data = blogContents[blogId];
    if (data && blogModal) {
      if (blogArticleMeta) blogArticleMeta.textContent = (data.category || '').toUpperCase();
      if (blogArticleTitle) blogArticleTitle.textContent = data.title || '';
      if (blogArticleBody) {
        blogArticleBody.innerHTML = `
          ${data.body || ''}
          <div style="margin-top: 2.2rem; padding: 1.5rem; background: #F0F8FF; border: 1px solid #BAE6FD; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-weight: 800; font-size: 15px; color: #0F172A;">Need customized guidance on this strategy?</div>
              <div style="font-size: 13px; color: #64748B;">Connect directly with 4X Wealth certified fiduciary advisors.</div>
            </div>
            <a href="index.html#consultation-section" class="btn-primary clickable" style="padding: 9px 18px; font-size: 13px; text-decoration: none;">
              <span>Book Fiduciary Consultation</span> <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
      }
      blogModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBlogArticle = () => {
    if (blogModal) {
      blogModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      if (blogId) openBlogArticle(blogId);
    });
  });

  if (blogModalClose) {
    blogModalClose.addEventListener('click', closeBlogArticle);
  }

  window.addEventListener('click', (e) => {
    if (blogModal && e.target === blogModal) {
      closeBlogArticle();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal && blogModal.classList.contains('open')) {
      closeBlogArticle();
    }
  });

  // ==========================================
  // 6. REAL-TIME SEARCH & CATEGORY PILL FILTERS
  // ==========================================
  const blogSearch = document.getElementById('blogSearch');
  const filterPills = document.querySelectorAll('.blog-filter-pill');
  let currentFilter = 'all';

  const filterCards = () => {
    const query = blogSearch ? (blogSearch.value || '').toLowerCase().trim() : '';
    document.querySelectorAll('.blog-card').forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const titleEl = card.querySelector('h3');
      const tagEl = card.querySelector('.blog-sde-tag');
      const excerptEl = card.querySelector('.blog-excerpt');
      
      const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
      const tagText = tagEl ? tagEl.textContent.toLowerCase() : '';
      const excerptText = excerptEl ? excerptEl.textContent.toLowerCase() : '';
      
      const matchesSearch = !query || titleText.includes(query) || tagText.includes(query) || excerptText.includes(query);
      const matchesCategory = currentFilter === 'all' || cardCategory === currentFilter;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter') || 'all';
        filterCards();
      });
    });
  }

  if (blogSearch) {
    blogSearch.addEventListener('input', filterCards);
  }

  // Smooth scroll if URL has #reports
  if (window.location.hash === '#reports') {
    setTimeout(() => {
      const reportsEl = document.getElementById('reports');
      if (reportsEl) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = reportsEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 250);
  }

});
