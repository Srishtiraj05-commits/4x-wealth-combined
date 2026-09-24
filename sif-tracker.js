/**
 * sif-tracker.js
 * 4X Wealth — Specialized Investment Funds (SIF) Screener & Analytics Engine
 * Complies with SEBI SIF Regulations & AMFI India Disclosures (ARN-268488)
 */

document.addEventListener('DOMContentLoaded', () => {
  let sifList = [];
  let selectedCategory = "ALL";
  let searchQuery = "";
  let selectedAmc = "ALL";
  let selectedHorizon = "SI";
  let sortField = "SI";
  let sortOrder = "desc";
  let compareSet = new Set();

  const defaultSifFallback = [
    {
      id: "sif-90",
      schemeCode: "SIF-90",
      isin: "INF281042SIF",
      schemeName: "qsif Active Asset Allocator Long-Short Fund - Growth Option - Direct Plan",
      fundName: "qsif Active Asset Allocator Long-Short Fund",
      amc: "Quant Mutual Fund",
      amcShort: "Quant",
      amcLogo: "Q",
      category: "Active Asset Allocator",
      plan: "Direct",
      option: "Growth",
      nav: 11.567,
      change: 1.4691,
      changePct: 14.55,
      returns: { "1M": 0.98, "3M": 12.98, "6M": 0.0, "YTD": 0.0, "SI": 15.67, "annualized": 52.45 },
      risk: { volatility: 7.45, sharpeRatio: 3.8, maxDrawdown: -1.87 },
      ter: 1.25,
      aum: 63.96,
      aumDisplay: "₹63.96 Cr",
      fundManager: "Sandeep Tandon · Jignesh Shah",
      benchmark: "40% NSE 500 TRI + 30% CRISIL Short Term Bond Fund Index",
      description: "To achieve long-term capital appreciation by dynamically allocating investments across multiple asset classes.",
      subscription: "Specified Transaction Periods",
      redemption: "Specified Transaction Periods",
      exitLoad: "1% ≤ 15 days · Nil thereafter",
      allocation: { longEquity: 75, shortDerivatives: 20, netEquity: 55, debtCash: 25, reits: 0 },
      topHoldings: [{ name: "Core Equity Basket (Long)", weight: 48.8, type: "Long" }]
    }
  ];

  // Load from sif_data.json (Live Synced Dataset)
  fetch('sif_data.json')
    .then(res => {
      if (!res.ok) throw new Error("Dataset not found");
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        sifList = data;
        initApp();
      } else {
        sifList = defaultSifFallback;
        initApp();
      }
    })
    .catch(err => {
      console.warn("Could not load sif_data.json, using fallback data:", err);
      sifList = defaultSifFallback;
      initApp();
    });

  function initApp() {
    populateAmcDropdown();
    updateKpis();
    renderTable();
    populateDirectCompareDropdowns();
  }

  // Populate dynamic AMC dropdown
  function populateAmcDropdown() {
    const amcSelect = document.getElementById('sifAmcFilter');
    if (!amcSelect) return;

    const uniqueAmcs = Array.from(new Set(sifList.map(f => f.amcShort).filter(Boolean))).sort();
    let opts = `<option value="ALL">All Asset Managers (${uniqueAmcs.length} AMCs)</option>`;
    uniqueAmcs.forEach(amc => {
      opts += `<option value="${amc}">${amc}</option>`;
    });
    amcSelect.innerHTML = opts;
    if (selectedAmc !== "ALL") {
      amcSelect.value = selectedAmc;
    }
  }

  function getCategoryClass(cat) {
    const map = {
      "Equity Long-Short": "sif-tag-equity-long-short",
      "Active Asset Allocator": "sif-tag-active-asset-allocator",
      "Equity Ex-Top 100": "sif-tag-ex-top-100-long-short",
      "Ex-Top 100 Long-Short": "sif-tag-ex-top-100-long-short",
      "Hybrid Long-Short": "sif-tag-hybrid-hedged",
      "Hybrid Hedged": "sif-tag-hybrid-hedged",
      "Sector Rotation": "sif-tag-sector-rotation"
    };
    return map[cat] || "sif-tag-equity-long-short";
  }

  function formatReturn(val) {
    if (val === undefined || val === null || val === "" || isNaN(Number(val))) {
      return `<span style="color:#94a3b8;">—</span>`;
    }
    const num = parseFloat(val);
    if (num === 0) {
      return `<span style="color:#64748b;">0.00%</span>`;
    }
    const isPos = num > 0;
    const sign = isPos ? '+' : '';
    const cls = isPos ? 'ret-pos' : 'ret-neg';
    return `<span class="ret-val ${cls}">${sign}${num.toFixed(2)}%</span>`;
  }

  function updateKpis() {
    const totalSifs = sifList.length;
    if (totalSifs === 0) return;
    const totalAum = sifList.reduce((acc, f) => acc + (f.aum || 0), 0);
    const avgSi = (sifList.reduce((acc, f) => acc + ((f.returns && f.returns['SI']) || 0), 0) / totalSifs).toFixed(1);
    
    const sortedBySi = [...sifList].sort((a, b) => (((b.returns && b.returns['SI']) || 0) - ((a.returns && a.returns['SI']) || 0)));
    const topGainer = sortedBySi[0];

    const kpiCount = document.getElementById('kpiTotalSifs');
    const kpiAum = document.getElementById('kpiTotalAum');
    const kpiAvg1Y = document.getElementById('kpiAvg1Y');
    const kpiTopPerformer = document.getElementById('kpiTopPerformer');

    if (kpiCount) kpiCount.textContent = totalSifs;
    if (kpiAum) kpiAum.textContent = `₹${totalAum.toFixed(1)} Cr`;
    if (kpiAvg1Y) kpiAvg1Y.textContent = `+${avgSi}%`;
    if (kpiTopPerformer && topGainer) {
      const topSi = (topGainer.returns && topGainer.returns['SI'] !== undefined) ? topGainer.returns['SI'] : '0.0';
      kpiTopPerformer.textContent = `${topGainer.amcShort || topGainer.amc || 'Fund'} (+${topSi}%)`;
    }
  }

  function renderTable() {
    const tableBody = document.getElementById('sifTableBody');
    if (!tableBody) return;

    let filtered = sifList.filter(item => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
      if (selectedAmc !== "ALL" && item.amcShort !== selectedAmc && item.amc !== selectedAmc) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = item.schemeName.toLowerCase().includes(q) || item.fundName.toLowerCase().includes(q);
        const matchAmc = item.amc.toLowerCase().includes(q) || item.amcShort.toLowerCase().includes(q);
        const matchManager = (item.fundManager || '').toLowerCase().includes(q);
        const matchCode = (item.schemeCode || '').toLowerCase().includes(q);
        const matchIsin = (item.isin || '').toLowerCase().includes(q);
        if (!matchName && !matchAmc && !matchManager && !matchCode && !matchIsin) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      let valA, valB;
      if (sortField === 'schemeName') {
        valA = a.schemeName.toLowerCase();
        valB = b.schemeName.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'nav') {
        valA = a.nav;
        valB = b.nav;
      } else if (sortField === 'sharpe') {
        valA = a.risk ? a.risk.sharpeRatio : 0;
        valB = b.risk ? b.risk.sharpeRatio : 0;
      } else if (sortField === 'ter') {
        valA = a.ter || 0;
        valB = b.ter || 0;
      } else if (sortField === 'aum') {
        valA = a.aum || 0;
        valB = b.aum || 0;
      } else {
        valA = (a.returns && a.returns[sortField] !== undefined) ? a.returns[sortField] : -999;
        valB = (b.returns && b.returns[sortField] !== undefined) ? b.returns[sortField] : -999;
      }
      return sortOrder === 'asc' ? (valA - valB) : (valB - valA);
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 3.5rem; color: #64748b;">
            <i class="fa-solid fa-folder-open" style="font-size: 2.2rem; margin-bottom: 0.8rem; display: block; opacity: 0.4;"></i>
            <div style="font-weight: 600; font-size: 15px; color: #334155;">No Specialized Investment Funds Found</div>
            <div style="font-size: 13px; margin-top: 4px;">Try modifying search keywords or resetting category filters.</div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(item => {
      const isChecked = compareSet.has(item.id) ? 'checked' : '';
      const changeNum = Number(item.change) || 0;
      const chgClass = changeNum >= 0 ? 'chg-up' : 'chg-down';
      const chgSign = changeNum >= 0 ? '+' : '';
      const navNum = Number(item.nav) || 0;
      const chgPct = Number(item.changePct) || 0;
      const retObj = item.returns || {};
      const aumText = item.aumDisplay || (item.aum ? `₹${Number(item.aum).toFixed(1)} Cr` : '—');

      return `
        <tr data-id="${item.id}">
          <td style="text-align: center;">
            <input type="checkbox" class="sif-compare-check" data-id="${item.id}" ${isChecked} title="Select to compare">
          </td>
          <td>
            <div class="sif-scheme-cell">
              <div class="sif-amc-avatar">${item.amcLogo || '•'}</div>
              <div class="sif-scheme-info">
                <div class="sif-scheme-title" onclick="openFactsheet('${item.id}')">${item.fundName || item.schemeName || 'Specialized Investment Fund'}</div>
                <div class="sif-scheme-meta">
                  <span style="font-weight: 600; color: #1e293b;">${item.amcShort || item.amc || 'AMC'}</span> •
                  <span class="sif-strategy-tag ${getCategoryClass(item.category)}">${item.category || 'Equity Long-Short'}</span> •
                  <span style="font-family: 'IBM Plex Mono'; font-size: 11px; color: #64748b;">${item.schemeCode || ''}</span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="nav-val">₹${navNum.toFixed(2)}</div>
            <span class="nav-chg ${chgClass}">${chgSign}${chgPct.toFixed(2)}%</span>
          </td>
          <td>${formatReturn(retObj['1M'])}</td>
          <td>${formatReturn(retObj['3M'])}</td>
          <td>${formatReturn(retObj['6M'])}</td>
          <td>${formatReturn(retObj['YTD'])}</td>
          <td><span style="font-weight: 700; color: #007aff;">${formatReturn(retObj['SI'])}</span></td>
          <td>
            <div style="font-weight: 600; font-family: 'IBM Plex Mono', monospace;">${item.risk ? item.risk.sharpeRatio : '1.45'}</div>
            <div style="font-size: 11px; color: #64748b;">Vol: ${item.risk ? item.risk.volatility : '10.5'}%</div>
          </td>
          <td>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 13px;">${item.ter || '0'}%</div>
            <div style="font-size: 11px; color: #64748b;">${aumText}</div>
          </td>
          <td>
            <div class="sif-action-btn-group">
              <button class="sif-btn-icon" title="Compare this fund" onclick="toggleCompareFromRow('${item.id}')" style="background: ${compareSet.has(item.id) ? '#007aff' : '#f1f5f9'}; color: ${compareSet.has(item.id) ? '#fff' : '#475569'};">
                <i class="fa-solid fa-scale-balanced"></i>
              </button>
              <button class="sif-btn-icon" title="View Fund Strategy" onclick="openFactsheet('${item.id}')">
                <i class="fa-solid fa-chart-pie"></i>
              </button>
              <button class="sif-btn-invest" onclick="openInvestModal('${item.id}')">
                Invest
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.sif-compare-check').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) {
          if (compareSet.size >= 4) {
            alert("You can compare up to 4 SIF funds simultaneously.");
            e.target.checked = false;
            return;
          }
          compareSet.add(id);
        } else {
          compareSet.delete(id);
        }
        updateCompareDock();
      });
    });
  }

  // Row-level compare toggle
  window.toggleCompareFromRow = function(id) {
    if (compareSet.has(id)) {
      compareSet.delete(id);
    } else {
      if (compareSet.size >= 4) {
        alert("You can compare up to 4 SIF funds simultaneously.");
        return;
      }
      compareSet.add(id);
    }
    renderTable();
    updateCompareDock();
  };

  function updateCompareDock() {
    const dock = document.getElementById('compareDock');
    const countEl = document.getElementById('compareCount');
    const chipsEl = document.getElementById('compareChips');
    if (!dock || !countEl || !chipsEl) return;

    countEl.textContent = compareSet.size;

    if (compareSet.size > 0) {
      dock.classList.add('visible');
      const selectedFunds = Array.from(compareSet).map(id => sifList.find(f => f.id === id)).filter(Boolean);
      chipsEl.innerHTML = selectedFunds.map(f => `
        <span class="sif-chip">
          ${f.fundName || f.schemeName}
          <i class="fa-solid fa-xmark" onclick="removeCompareItem('${f.id}')"></i>
        </span>
      `).join('');
    } else {
      dock.classList.remove('visible');
      chipsEl.innerHTML = '';
    }
  }

  window.removeCompareItem = function(id) {
    compareSet.delete(id);
    renderTable();
    updateCompareDock();
  };

  // Direct 2-SIF Selector Modal
  window.openDirectCompareModal = function() {
    // Close comparison matrix modal if already open
    const compModal = document.getElementById('compareModal');
    if (compModal) {
      compModal.classList.remove('open');
    }

    const modal = document.getElementById('directCompareModal');
    if (modal) {
      populateDirectCompareDropdowns();
      modal.classList.add('open');
    }
  };

  function populateDirectCompareDropdowns() {
    const selectA = document.getElementById('compareFundA');
    const selectB = document.getElementById('compareFundB');
    if (!selectA || !selectB || sifList.length === 0) return;

    const options = sifList.map(f => `<option value="${f.id}">${f.fundName || f.schemeName} (${f.amcShort || f.amc})</option>`).join('');
    selectA.innerHTML = options;
    selectB.innerHTML = options;

    const selectedArr = Array.from(compareSet);
    if (selectedArr.length >= 2) {
      selectA.value = selectedArr[0];
      selectB.value = selectedArr[1];
    } else if (selectedArr.length === 1) {
      selectA.value = selectedArr[0];
      if (sifList.length > 1) {
        selectB.selectedIndex = (sifList[0].id === selectedArr[0]) ? 1 : 0;
      }
    } else if (sifList.length > 1) {
      selectA.selectedIndex = 0;
      selectB.selectedIndex = 1;
    }
  }

  window.executeDirectCompare = function() {
    const selectA = document.getElementById('compareFundA');
    const selectB = document.getElementById('compareFundB');
    if (!selectA || !selectB) return;

    const idA = selectA.value;
    const idB = selectB.value;

    if (idA === idB) {
      alert("Please choose two different SIF schemes to compare.");
      return;
    }

    compareSet.clear();
    compareSet.add(idA);
    compareSet.add(idB);
    updateCompareDock();
    renderTable();

    const directModal = document.getElementById('directCompareModal');
    if (directModal) directModal.classList.remove('open');
    openCompareModal();
  };

  // Full Side-by-Side Comparison Modal
  window.openCompareModal = function() {
    if (compareSet.size < 2) {
      openDirectCompareModal();
      return;
    }
    const modal = document.getElementById('compareModal');
    const compareBody = document.getElementById('compareModalBody');
    if (!modal || !compareBody) return;

    const selectedFunds = Array.from(compareSet).map(id => sifList.find(f => f.id === id)).filter(Boolean);

    let html = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 22px; color: #0f172a; margin-bottom: 4px;">Head-to-Head SIF Comparison Matrix</h3>
          <p style="font-size: 13.5px; color: #64748b;">Comparing ${selectedFunds.length} Specialized Investment Funds across alpha, short hedging, Sharpe ratio, and TER.</p>
        </div>
        <button class="vg-btn vg-btn-outline" onclick="openDirectCompareModal()" style="font-size: 12px; padding: 6px 12px;">
          <i class="fa-solid fa-arrows-rotate"></i> Change Schemes
        </button>
      </div>

      <div style="overflow-x: auto;">
        <table class="sif-table" style="border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 8px;">
          <thead>
            <tr>
              <th style="width: 190px;">Metric</th>
              ${selectedFunds.map(f => `<th style="text-align: center; color: #007aff; font-size: 13px;">${f.fundName || f.schemeName}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>AMC & Category</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center;"><strong>${f.amcShort}</strong><br><span class="sif-strategy-tag ${getCategoryClass(f.category)}">${f.category}</span></td>`).join('')}
            </tr>
            <tr>
              <td><strong>Latest NAV</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 700; font-size: 15px;">₹${f.nav.toFixed(2)}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Since Inception Return</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 700; font-size: 15px; color: #007aff;">+${f.returns['SI']}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Annualized Return</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 700; font-size: 15px; color: #16a34a;">+${f.returns['annualized'] || f.returns['SI']}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>3-Month Return</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 600;">${f.returns['3M'] !== undefined ? (f.returns['3M'] >= 0 ? '+' : '') + f.returns['3M'] + '%' : '—'}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>1-Month Return</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 600;">${f.returns['1M'] !== undefined ? (f.returns['1M'] >= 0 ? '+' : '') + f.returns['1M'] + '%' : '—'}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Sharpe Ratio</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; font-weight: 700; color: #007aff; font-size: 15px;">${f.risk ? f.risk.sharpeRatio : '1.45'}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Annualized Volatility</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono';">${f.risk ? f.risk.volatility : '10.5'}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Max Drawdown</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono'; color: #dc2626; font-weight: 600;">${f.risk ? f.risk.maxDrawdown : '-4.5'}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Total Expense Ratio (TER)</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-family: 'IBM Plex Mono';">${f.ter}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Fund AUM</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-weight: 600;">${f.aumDisplay || `₹${f.aum.toFixed(1)} Cr`}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Net Equity Exposure</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-weight: 700; color: #007aff;">${f.allocation ? f.allocation.netEquity : 55}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Unhedged Short Exposure</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-weight: 600; color: #ff2d55;">${f.allocation ? f.allocation.shortDerivatives : 20}%</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Lead Portfolio Manager</strong></td>
              ${selectedFunds.map(f => `<td style="text-align: center; font-size: 12px;">${f.fundManager}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Comparative Canvas Chart -->
      <div style="margin-top: 2rem; background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 12px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="font-family: var(--font-heading); font-size: 15px; color: #0f172a;">Comparative Return Trajectory (Normalized Base 100)</h4>
          <span style="font-size: 11px; color: #64748b; font-family: 'IBM Plex Mono';">Daily Disclosed AMFI NAVs</span>
        </div>
        <canvas id="compareCanvasChart" width="700" height="240" style="width: 100%; height: 240px;"></canvas>
      </div>
    `;

    compareBody.innerHTML = html;
    modal.classList.add('open');

    setTimeout(() => {
      drawCompareChart(selectedFunds);
    }, 100);
  };

  function drawCompareChart(funds) {
    const canvas = document.getElementById('compareCanvasChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const colors = ['#007aff', '#ff2d55', '#10b981', '#f59e0b'];

    ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    funds.forEach((fund, idx) => {
      const history = fund.history || [];
      if (history.length < 2) return;

      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const baseNav = history[0].nav || 10.0;
      history.forEach((pt, pIdx) => {
        const normalized = (pt.nav / baseNav) * 100;
        const x = 50 + (pIdx / (history.length - 1)) * (width - 80);
        const y = (height - 30) - ((normalized - 90) / 35) * (height - 60);

        if (pIdx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = colors[idx % colors.length];
      ctx.font = '12px sans-serif';
      ctx.fillText(`■ ${fund.amcShort || fund.amc || 'Fund'}`, 60 + idx * 130, 20);
    });
  }

  // Open Factsheet Drawer Modal
  window.openFactsheet = function(id) {
    const item = sifList.find(f => f.id === id);
    if (!item) return;

    const modal = document.getElementById('factsheetModal');
    const body = document.getElementById('factsheetModalBody');
    if (!modal || !body) return;

    const alloc = item.allocation || { longEquity: 75, shortDerivatives: 20, netEquity: 55, debtCash: 25, reits: 0 };

    body.innerHTML = `
      <div style="border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 1.2rem;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span class="sif-strategy-tag ${getCategoryClass(item.category)}">${item.category || 'Specialized Strategy'}</span>
          <span style="font-size: 12px; color: #64748b; font-family: 'IBM Plex Mono';">Code: ${item.schemeCode || ''}</span>
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 22px; color: #0f172a; margin-bottom: 6px;">${item.schemeName || item.fundName || 'Fund Strategy'}</h2>
        <p style="font-size: 14px; color: #4e5d78;">${item.description || 'Specialized Investment Fund managed according to SEBI regulations.'}</p>
      </div>

      <div class="factsheet-grid">
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 15px; color: #0f172a; margin-bottom: 10px;">Asset Allocation & Strategy Breakdown</h4>
          <div class="allocation-meter-bar">
            <div class="alloc-seg-long" style="width: ${alloc.longEquity || 0}%;" title="Long Equity: ${alloc.longEquity || 0}%"></div>
            <div class="alloc-seg-short" style="width: ${alloc.shortDerivatives || 0}%;" title="Short Derivatives: ${alloc.shortDerivatives || 0}%"></div>
            <div class="alloc-seg-cash" style="width: ${alloc.debtCash || 0}%;" title="Debt/Cash: ${alloc.debtCash || 0}%"></div>
          </div>
          <div class="alloc-legend">
            <span><span class="alloc-legend-dot" style="background: #007aff;"></span>Long Equity (${alloc.longEquity || 0}%)</span>
            <span><span class="alloc-legend-dot" style="background: #ff2d55;"></span>Short Hedges (${alloc.shortDerivatives || 0}%)</span>
            <span><span class="alloc-legend-dot" style="background: #10b981;"></span>Cash/Debt (${alloc.debtCash || 0}%)</span>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="font-family: var(--font-heading); font-size: 15px; color: #0f172a; margin-bottom: 10px;">Key Strategy Parameters</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13.5px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Benchmark:</span>
                <span style="font-weight: 600; max-width: 60%; text-align: right;">${item.benchmark || 'NIFTY 500 TRI'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Minimum Mandate:</span>
                <span style="font-weight: 600; color: #007aff;">₹10,00,000 (SEBI SIF Mandate)</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Fund Managers:</span>
                <span style="font-weight: 600; max-width: 60%; text-align: right;">${item.fundManager || 'Asset Management Team'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Subscription / Redemption:</span>
                <span style="font-weight: 600;">${item.subscription || 'Daily'} / ${item.redemption || 'Daily'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Exit Load:</span>
                <span style="font-weight: 600;">${item.exitLoad || 'Nil'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Expense Ratio:</span>
                <span style="font-weight: 600;">${item.ter || '0.00'}%</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-family: var(--font-heading); font-size: 15px; color: #0f172a; margin-bottom: 10px;">Top Portfolio Holdings & Overlays</h4>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${(item.topHoldings || []).map(h => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8fafc; border-radius: 6px; font-size: 13px;">
                <span style="font-weight: 500;">${h.name}</span>
                <span style="font-family: 'IBM Plex Mono'; font-weight: 600; color: ${h.weight < 0 ? '#ff2d55' : '#007aff'};">${h.weight > 0 ? '+' : ''}${h.weight}%</span>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 1.5rem; text-align: right;">
            <button class="sif-btn-invest" style="padding: 10px 20px; font-size: 14px;" onclick="openInvestModal('${item.id}')">
              Schedule SIF Consultation with 4X Wealth
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  };

  // Open Lead Onboarding Modal
  window.openInvestModal = function(id) {
    const item = sifList.find(f => f.id === id);
    const modal = document.getElementById('investModal');
    const fundNameInput = document.getElementById('investFundName');
    if (!modal) return;
    if (fundNameInput && item) fundNameInput.value = item.schemeName;
    modal.classList.add('open');
  };

  // Close modals
  document.querySelectorAll('.sif-modal-close, .sif-modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('sif-modal-close')) {
        document.querySelectorAll('.sif-modal-overlay').forEach(m => m.classList.remove('open'));
      }
    });
  });

  // Filter Event Listeners
  document.querySelectorAll('.sif-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sif-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.getAttribute('data-category');
      renderTable();
    });
  });

  const searchInput = document.getElementById('sifSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTable();
    });
  }

  const amcSelect = document.getElementById('sifAmcFilter');
  if (amcSelect) {
    amcSelect.addEventListener('change', (e) => {
      selectedAmc = e.target.value;
      renderTable();
    });
  }

  const horizonSelect = document.getElementById('sifHorizonFilter');
  if (horizonSelect) {
    horizonSelect.addEventListener('change', (e) => {
      selectedHorizon = e.target.value;
      sortField = selectedHorizon;
      renderTable();
    });
  }

  const resetBtn = document.getElementById('sifResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedCategory = "ALL";
      searchQuery = "";
      selectedAmc = "ALL";
      selectedHorizon = "SI";
      sortField = "SI";
      sortOrder = "desc";
      if (searchInput) searchInput.value = "";
      if (amcSelect) amcSelect.value = "ALL";
      if (horizonSelect) horizonSelect.value = "SI";
      document.querySelectorAll('.sif-tab-btn').forEach(b => b.classList.remove('active'));
      const allTab = document.querySelector('.sif-tab-btn[data-category="ALL"]');
      if (allTab) allTab.classList.add('active');
      renderTable();
    });
  }

  document.querySelectorAll('.sif-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      if (sortField === field) {
        sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        sortField = field;
        sortOrder = 'desc';
      }
      renderTable();
    });
  });

  // ==========================================
  // LIVE MARKET TICKER TAPE
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

    loadRealtimeStocks();
    setInterval(loadRealtimeStocks, 10000);
  }

  // Mobile Drawer toggle
  const mobileTrigger = document.getElementById('mobileMenuTrigger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileDrawerClose');

  if (mobileTrigger && mobileDrawer && mobileOverlay) {
    mobileTrigger.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
    });
  }
  if (mobileClose && mobileDrawer && mobileOverlay) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
    });
  }
  if (mobileOverlay && mobileDrawer) {
    mobileOverlay.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
    });
  }
});
