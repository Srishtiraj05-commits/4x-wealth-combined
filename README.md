# 4X Wealth — Combined Build

This folder combines the backend logic from `4x-wealth-animated/backend` with the dark blue/gold frontend from `4x-wealth-v2`.

## Folder Layout

```
4x-wealth-combined/
├── index.html              # Landing page
├── style.css, script.js    # Global styles & scripts
├── *.html, *.js            # Other frontend pages
├── atrium.html             # Self-contained cinematic landing page
├── sif-screener.html       # Full SIF screener (legacy blue/white theme)
├── style-v1.css            # Legacy stylesheet for sif-screener.html
├── libs/                   # Animation/UI libraries
├── stocks_data.json        # Live stock ticker cache
├── sif_data.json           # SIF scheme dataset
├── backend/
│   ├── server.py           # Dev HTTP server + stock daemon + SIF init
│   ├── fetch_stocks.py     # Standalone yfinance stock fetcher (optional)
│   └── fetch_sif_data.py   # SIF NAV/factsheet synchronizer
├── .github/workflows/
│   └── update-sif-data.yml # Daily SIF data GitHub Action
├── netlify.toml            # Netlify hosting config
└── requirements.txt        # Python dependencies
```

## Quick Start

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the local server:
   ```bash
   cd backend
   python server.py
   ```

3. Open http://localhost:8000 in your browser.

## What Was Merged

- **Frontend:** Copied from `4x-wealth-v2` (dark navy + champagne gold theme). Includes `gift-city.html` and `unlisted-shares.html`.
- **Backend:** Based on `4x-wealth-animated/backend/server.py` (NSE API → nsepython → yfinance with price cache). Added SIF initialization from `fetch_sif_data.py`.
- **SIF sync:** `fetch_sif_data.py` is copied from the inner root and hardened (deterministic ISIN, dynamic reference date, retry logic).

## Known Issues Fixed in This Merge

- Removed hardcoded Windows screenshot path from `server.py`.
- Removed in-place regex rewriting of `.js` source files; prices are served via `stocks_data.json` only.
- Deterministic ISIN generation for SIF schemes.
- Replaced hardcoded `2026-08-25` reference date with today's date.
- Added `requirements.txt`.

## Notes

- Do not run `server.py` and `fetch_stocks.py` at the same time — both write `stocks_data.json`.
- `fetch_stocks.py` is kept as a lightweight standalone utility but only covers 8 tickers.
- `atrium.html` is self-contained and keeps its own light theme.
- `sif-screener.html` uses `style-v1.css` (the legacy blue/white stylesheet) so the full screener renders correctly while the rest of the site stays on the dark theme.
