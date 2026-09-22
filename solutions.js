document.addEventListener('DOMContentLoaded', () => {
  const productsData = {
    'mutual-funds': {
      category: 'INVESTMENTS',
      title: 'Mutual Funds Portfolio Suite',
      subtitle: 'Institutional asset allocation across equity, debt, hybrid, and thematic mutual fund schemes managed by top SEBI-regulated asset managers.',
      minInv: '₹500 / mo',
      cagr: '12% - 18% p.a.',
      risk: 'Quantitative Shield',
      features: [
        { icon: 'fa-chart-pie', title: 'Diversified Growth', desc: 'Spread capital across large-cap, mid-cap, and small-cap leaders to maximize risk-adjusted CAGR.' },
        { icon: 'fa-seedling', title: 'Automated SIP', desc: 'Seamless monthly systematic investment plans with optional annual step-up allocations.' },
        { icon: 'fa-shield-halved', title: 'Risk Rebalancing', desc: 'Dynamic asset rebalancing between equity and debt assets based on macroeconomic volatility.' },
        { icon: 'fa-file-invoice-dollar', title: 'ELSS Tax Benefits', desc: 'Save up to ₹46,800 annually under Section 80C with 3-year lock-in ELSS funds.' }
      ]
    },
    'stocks': {
      category: 'INVESTMENTS',
      title: 'Direct Stocks & Equities Analytics',
      subtitle: 'Real-time equity market analysis, fundamental ratios, balance sheet health indicators, and momentum alerts for high-conviction direct stock portfolios.',
      minInv: '₹5,000',
      cagr: '15% - 25% p.a.',
      risk: 'High Growth / Equity',
      features: [
        { icon: 'fa-arrow-trend-up', title: 'Fundamental Ingestion', desc: 'Real-time balance sheet scanning for debt-to-equity ratios, ROE, and quarterly earnings surprises.' },
        { icon: 'fa-bolt', title: 'Momentum Signals', desc: 'Algorithmic breakdown of price action, moving average crossovers, and volume spikes.' },
        { icon: 'fa-layer-group', title: 'Sectoral Allocation', desc: 'Strategic exposure across BFSI, IT, Healthcare, Capital Goods, and Green Energy sectors.' },
        { icon: 'fa-chart-line', title: 'Risk & Drawdown Limits', desc: 'Strict stop-loss parameters and position sizing rules to shield capital during market corrections.' }
      ]
    },
    'etfs': {
      category: 'INVESTMENTS',
      title: 'Exchange Traded Funds (ETFs) & Index Tracking',
      subtitle: 'Low-cost passive investment structures tracking Nifty 50, Nifty Next 50, Nasdaq 100, and Gold ETFs with ultra-low expense ratios.',
      minInv: '₹1,000',
      cagr: '11% - 15% p.a.',
      risk: 'Market Index Risk',
      features: [
        { icon: 'fa-percent', title: 'Ultra-Low Cost', desc: 'Expense ratios as low as 0.05% p.a., maximizing net investor returns over long horizons.' },
        { icon: 'fa-coins', title: 'Gold & Silver ETFs', desc: 'Sovereign-backed digital gold asset allocation for portfolio inflation hedging.' },
        { icon: 'fa-globe', title: 'Global Indices Exposure', desc: 'Direct access to US Tech and global market leaders through domestic index funds.' },
        { icon: 'fa-scale-balanced', title: 'Zero Tracking Error', desc: 'Automated liquid arbitrage execution minimizing deviation from benchmark market indices.' }
      ]
    },
    'bonds': {
      category: 'INVESTMENTS',
      title: 'Corporate Bonds & High-Yield Fixed Income',
      subtitle: 'Institutional AAA/AA+ rated corporate bonds, sovereign government securities (G-Secs), and RBI bonds delivering predictable, fixed quarterly cash flows.',
      minInv: '₹10,000',
      cagr: '8.5% - 11% p.a.',
      risk: 'Low / Capital Protected',
      features: [
        { icon: 'fa-building-columns', title: 'AAA Rated Securities', desc: 'Rigorous credit screening focusing on top-tier corporate issuers and public sector undertakings.' },
        { icon: 'fa-hand-holding-dollar', title: 'Predictable Income', desc: 'Fixed monthly, quarterly, or annual coupon payouts ideal for regular cash flow requirements.' },
        { icon: 'fa-shield-heart', title: 'Capital Preservation', desc: 'Low-volatility debt instruments preserving principal while outperforming standard bank FDs.' },
        { icon: 'fa-rotate-left', title: 'Secondary Market Liquidity', desc: 'Ability to trade and liquidate bond holdings on stock exchanges prior to maturity date.' }
      ]
    },
    'retirement-planning': {
      category: 'WEALTH',
      title: 'Institutional Retirement & Pension Corpus Suite',
      subtitle: 'Comprehensive lifetime wealth modeling adjusting for long-term inflation, healthcare escalations, and guaranteed post-retirement pension cash flows.',
      minInv: '₹5,000 / mo',
      cagr: 'Corpus Driven',
      risk: 'Inflation Shielded',
      features: [
        { icon: 'fa-umbrella', title: 'Inflation-Adjusted Corpus', desc: 'Calculates true future expense burdens accounting for 6%-7% annual cost-of-living inflation.' },
        { icon: 'fa-landmark', title: 'National Pension Scheme (NPS)', desc: 'Tier-1 & Tier-2 NPS allocations with extra tax deduction under Section 80CCD(1B).' },
        { icon: 'fa-hand-holding-dollar', title: 'SWP Cash Flow Ladder', desc: 'Systematic withdrawal strategies generating tax-efficient monthly income after retirement.' },
        { icon: 'fa-heart-pulse', title: 'Healthcare Reserve Buffer', desc: 'Segregated high-liquidity capital pool dedicated to late-life medical emergencies.' }
      ]
    },
    'goal-planning': {
      category: 'WEALTH',
      title: 'Target-Driven Financial Goal Planning',
      subtitle: 'Structured goal mapping for child higher education, home purchasing, sabbatical funds, and family wealth accumulation targets.',
      minInv: '₹2,500 / mo',
      cagr: 'Goal Matched',
      risk: 'Timeline Aligned',
      features: [
        { icon: 'fa-bullseye', title: 'Time-Bound Allocation', desc: 'Short-term (<3 yrs), medium-term (3-7 yrs), and long-term (7+ yrs) asset class segregation.' },
        { icon: 'fa-graduation-cap', title: 'Child Education Corpus', desc: 'Inflation-adjusted global college tuition modeling with automated asset de-risking as target approaches.' },
        { icon: 'fa-house', title: 'Real Estate Down Payment', desc: 'Dedicated debt-heavy accumulation strategy safeguarding initial house purchase capital.' },
        { icon: 'fa-sliders', title: 'Dynamic Horizon Glidepath', desc: 'Automatically shifts allocations from equity to fixed income as goal target date nears.' }
      ]
    },
    'tax-planning': {
      category: 'WEALTH',
      title: 'Tax Optimization & ELSS Compliance Wrappers',
      subtitle: 'Strategic tax harvesting under Section 80C, capital gains tax optimization (LTCG/STCG), and tax-free dividend reinvestment strategies.',
      minInv: '₹500 / mo',
      cagr: '14% - 18% p.a.',
      risk: 'Section 80C Compliant',
      features: [
        { icon: 'fa-file-invoice-dollar', title: 'Section 80C Maximum Tax Saver', desc: 'Invest up to ₹1.5 Lakh in top ELSS funds with shortest lock-in period (3 years) among 80C options.' },
        { icon: 'fa-scissors', title: 'LTCG Tax Harvesting', desc: 'Systematic booking of up to ₹1.25 Lakh long-term capital gains per year tax-free under current tax laws.' },
        { icon: 'fa-magnifying-glass-dollar', title: 'New vs. Old Tax Regime Analysis', desc: 'Personalized mathematical calculator determining optimal tax regime for maximum post-tax wealth.' },
        { icon: 'fa-building', title: 'Corporate Salary Tax Shields', desc: 'Structuring NPS corporate co-contributions and reimbursement allowances for maximum take-home salary.' }
      ]
    },
    'insurance': {
      category: 'WEALTH',
      title: 'Comprehensive Insurance & Asset Cover Shield',
      subtitle: 'Pure term life insurance, super top-up health insurance, and critical illness shields protecting family financial independence.',
      minInv: '₹800 / mo',
      cagr: 'Protection Only',
      risk: 'Full Capital Shield',
      features: [
        { icon: 'fa-shield-halved', title: 'Pure Term Life Cover', desc: 'High sum assured (₹1 Cr to ₹5 Cr+) life cover securing dependents against unforeseen life risks.' },
        { icon: 'fa-notes-medical', title: 'Super Top-Up Health Shield', desc: 'Extensive cashless hospitalization cover with high deductible optimization for affordable premiums.' },
        { icon: 'fa-heart-circle-check', title: 'Critical Illness Rider', desc: 'Lump-sum payout upon diagnosis of major illnesses to cover specialized treatment and income loss.' },
        { icon: 'fa-award', title: '99%+ Claim Settlement Ratio', desc: 'Selecting top insurers with verified claim settlement track records and dedicated claim assistance.' }
      ]
    },
    'pms': {
      category: 'ADVANCED',
      title: 'Portfolio Management Services (PMS)',
      subtitle: 'Custom institutional equity portfolios managed directly by SEBI-registered portfolio managers focusing on high-conviction growth opportunities.',
      minInv: '₹50,00,000',
      cagr: '18% - 28% p.a.',
      risk: 'High Conviction / Alpha',
      features: [
        { icon: 'fa-briefcase', title: 'Bespoke Active Management', desc: 'Direct ownership of individual stocks held in client Demat account with customized risk mandates.' },
        { icon: 'fa-eye', title: 'Full Transparency & Reporting', desc: 'Real-time trade reporting, monthly holding statements, and direct interaction with portfolio fund managers.' },
        { icon: 'fa-filter-circle-dollar', title: 'Concentrated High-Alpha Bets', desc: 'Focused 15-25 stock portfolios eliminating benchmark index clutter to generate superior outperformance.' },
        { icon: 'fa-user-shield', title: 'SEBI Institutional Compliance', desc: 'Strict regulatory oversight, independent audit trails, and SEBI-mandated minimum ticket sizes.' }
      ]
    },
    'aif': {
      category: 'ADVANCED',
      title: 'Alternative Investment Funds (AIF Category I, II & III)',
      subtitle: 'Exclusive private equity, venture debt, long-short hedge funds, and structured credit funds for Ultra-HNIs and family offices.',
      minInv: '₹1,00,00,000',
      cagr: '20% - 32% p.a.',
      risk: 'Alternative / Uncorrelated',
      features: [
        { icon: 'fa-vault', title: 'Uncorrelated Alternative Yields', desc: 'Exposure to private markets, unlisted pre-IPO tech firms, and private credit insulated from stock market swings.' },
        { icon: 'fa-scale-unbalanced-flip', title: 'Cat-3 Long-Short Hedge Strategies', desc: 'Derivatives-based hedging strategies designed to generate positive returns in both bull and bear markets.' },
        { icon: 'fa-building-shield', title: 'Private Credit & Real Estate Debt', desc: 'High-yield secured debt instruments providing 14%-18% IRR with collateral security backing.' },
        { icon: 'fa-user-lock', title: 'Family Office Customized Mandates', desc: 'Custom pool structures tailored for family office liquidity schedules and multi-generational succession.' }
      ]
    },
    'corporate-wealth': {
      category: 'ADVANCED',
      title: 'Corporate Treasury & Cash Optimization',
      subtitle: 'Liquidity management, overnight liquid fund allocations, commercial papers, and yield enhancement for corporate treasuries and MSMEs.',
      minInv: '₹10,00,000',
      cagr: '6.5% - 8.5% p.a.',
      risk: 'Ultra-Low / Liquid',
      features: [
        { icon: 'fa-landmark', title: 'T+1 Liquidity Management', desc: 'Overnight and liquid mutual fund structures providing immediate redemption turnarounds for operating cash.' },
        { icon: 'fa-money-bill-transfer', title: 'Commercial Papers & CD Desk', desc: 'Direct placement in top corporate commercial papers (CPs) and Bank Certificates of Deposit (CDs).' },
        { icon: 'fa-calculator', title: 'Post-Tax Treasury Yield Optimization', desc: 'Arbitrage fund placements offering tax-efficient equity-taxation treatment for corporate surplus cash.' },
        { icon: 'fa-handshake-simple', title: 'Dedicated Treasury Advisor', desc: 'Single point institutional contact for daily liquidity deployment, reporting, and board compliance.' }
      ]
    },
    'nri-services': {
      category: 'ADVANCED',
      title: 'NRI Global Wealth & Cross-Border Mandates',
      subtitle: 'Seamless NRE/NRO investment accounts, FEMA compliance, DTAA tax optimization, and repatriable wealth structures for Non-Resident Indians.',
      minInv: '₹2,00,000',
      cagr: 'USD / INR Hedged',
      risk: 'Global Cross-Border',
      features: [
        { icon: 'fa-globe', title: 'NRE & NRO Account Integration', desc: 'Seamless onboarding for US, UK, UAE, Singapore, and global NRIs with full 100% repatriability assistance.' },
        { icon: 'fa-passport', title: 'FEMA & Tax Compliance Wrapper', desc: 'Complete Double Taxation Avoidance Agreement (DTAA) guidance preventing double tax deduction.' },
        { icon: 'fa-arrow-right-left', title: 'FX Currency Hedging Analysis', desc: 'Evaluating INR growth vs USD/EUR/AED depreciation to ensure positive net hard-currency returns.' },
        { icon: 'fa-laptop-code', title: '100% Digital Onboarding & KYC', desc: 'Paperless online video KYC and digital portfolio management accessible anywhere in the world.' }
      ]
    }
  };

  const updateProductView = (prodKey) => {
    let cleanKey = (prodKey || 'mutual-funds').toString().replace('#', '');
    const data = productsData[cleanKey] || productsData['mutual-funds'];

    // Update active button in pill bar
    document.querySelectorAll('.calc-pill-link').forEach(btn => {
      if (btn.getAttribute('data-product') === cleanKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update detail elements
    const badgeEl = document.getElementById('solCategoryBadge');
    const titleEl = document.getElementById('solTitle');
    const subTitleEl = document.getElementById('solSubtitle');
    const minInvEl = document.getElementById('solMinInv');
    const cagrEl = document.getElementById('solCagr');
    const riskEl = document.getElementById('solRisk');
    const gridEl = document.getElementById('solFeaturesGrid');
    const ctaTitleEl = document.getElementById('solCtaTitle');

    if (badgeEl) badgeEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (subTitleEl) subTitleEl.textContent = data.subtitle;
    if (minInvEl) minInvEl.textContent = data.minInv;
    if (cagrEl) cagrEl.textContent = data.cagr;
    if (riskEl) riskEl.textContent = data.risk;
    if (ctaTitleEl) ctaTitleEl.textContent = `Structure your ${data.title} mandate`;

    if (gridEl && data.features) {
      gridEl.innerHTML = data.features.map(f => `
        <div class="sol-feature-box">
          <i class="fa-solid ${f.icon || 'fa-chart-pie'}"></i>
          <h4>${f.title || ''}</h4>
          <p>${f.desc || ''}</p>
        </div>
      `).join('');
    }
  };

  // Add click handlers on top pill buttons
  document.querySelectorAll('.calc-pill-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodKey = btn.getAttribute('data-product');
      if (prodKey) {
        updateProductView(prodKey);
        try {
          history.pushState(null, null, `solutions.html?product=${prodKey}`);
        } catch (e) {
          // Fallback if local file protocol blocks pushState
        }
      }
    });
  });

  // Check URL parameters or hash on page load
  const urlParams = new URLSearchParams(window.location.search);
  const hashVal = window.location.hash.replace('#', '');
  const initialProd = urlParams.get('product') || hashVal || 'mutual-funds';
  updateProductView(initialProd);

  // Sync on browser forward/backward navigation
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    const currentProd = params.get('product') || hash || 'mutual-funds';
    updateProductView(currentProd);
  });
});
