import http.server
import socketserver
import threading
import time
import json
import sys
import os
import math
import requests

PORT = 8000

# Project root is one directory above this script
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = PROJECT_ROOT

# NSE symbol mapping: display name -> NSE ticker
TICKER_MAP = {
    "RELIANCE":     "RELIANCE",
    "TCS":          "TCS",
    "HDFC BANK":    "HDFCBANK",
    "INFOSYS":      "INFY",
    "ICICI BANK":   "ICICIBANK",
    "SBI":          "SBIN",
    "ADANI PORTS":  "ADANIPORTS",
    "TATA MOTORS":  "TATAMOTORS",
    "L&T":          "LT",
    "ITC":          "ITC",
    "BHARTI AIRTEL":"BHARTIARTL",
    "KOTAK BANK":   "KOTAKBANK",
    "AXIS BANK":    "AXISBANK",
    "HUL":          "HINDUNILVR",
    "BAJAJ FINANCE":"BAJFINANCE",
    "M&M":          "M&M",
    "NTPC":         "NTPC",
    "HCL TECH":     "HCLTECH",
    "MARUTI":       "MARUTI",
    "SUN PHARMA":   "SUNPHARMA",
    "TITAN":        "TITAN",
    "ULTRATECH":    "ULTRACEMCO",
    "POWER GRID":   "POWERGRID",
    "COAL INDIA":   "COALINDIA",
    "TATA STEEL":   "TATASTEEL",
    "ASIAN PAINTS": "ASIANPAINT",
    "JSW STEEL":    "JSWSTEEL",
    "HINDALCO":     "HINDALCO",
    "GRASIM":       "GRASIM",
    "LTI MINDTREE": "LTIM",
}

# yfinance fallback symbols
YF_MAP = {
    "RELIANCE":     "RELIANCE.NS",
    "TCS":          "TCS.NS",
    "HDFC BANK":    "HDFCBANK.NS",
    "INFOSYS":      "INFY.NS",
    "ICICI BANK":   "ICICIBANK.NS",
    "SBI":          "SBIN.NS",
    "ADANI PORTS":  "ADANIPORTS.NS",
    "TATA MOTORS":  "TATAMOTORS.BO",
    "L&T":          "LT.NS",
    "ITC":          "ITC.NS",
    "BHARTI AIRTEL":"BHARTIARTL.NS",
    "KOTAK BANK":   "KOTAKBANK.NS",
    "AXIS BANK":    "AXISBANK.NS",
    "HUL":          "HINDUNILVR.NS",
    "BAJAJ FINANCE":"BAJFINANCE.NS",
    "M&M":          "M&M.NS",
    "NTPC":         "NTPC.NS",
    "HCL TECH":     "HCLTECH.NS",
    "MARUTI":       "MARUTI.NS",
    "SUN PHARMA":   "SUNPHARMA.NS",
    "TITAN":        "TITAN.NS",
    "ULTRATECH":    "ULTRACEMCO.NS",
    "POWER GRID":   "POWERGRID.NS",
    "COAL INDIA":   "COALINDIA.NS",
    "TATA STEEL":   "TATASTEEL.NS",
    "ASIAN PAINTS": "ASIANPAINT.NS",
    "JSW STEEL":    "JSWSTEEL.NS",
    "HINDALCO":     "HINDALCO.NS",
    "GRASIM":       "GRASIM.NS",
    "LTI MINDTREE": "LTIM.NS",
}

NSE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
    "Connection": "keep-alive",
}

nse_session = None

def get_nse_session():
    global nse_session
    if nse_session is None:
        nse_session = requests.Session()
        try:
            nse_session.get("https://www.nseindia.com", headers=NSE_HEADERS, timeout=10)
            time.sleep(1)
        except Exception as e:
            print(f"NSE session init error: {e}")
    return nse_session

def safe_float(val, fallback=0.0):
    try:
        f = float(str(val).replace(',', '').strip())
        if math.isnan(f) or math.isinf(f):
            return fallback
        return round(f, 2)
    except Exception:
        return fallback

def fetch_nse_quote(nse_symbol):
    """Fetch real-time quote from NSE official API"""
    try:
        session = get_nse_session()
        url = f"https://www.nseindia.com/api/quote-equity?symbol={requests.utils.quote(nse_symbol)}"
        resp = session.get(url, headers=NSE_HEADERS, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            price_info = data.get('priceInfo', {})
            ltp = safe_float(price_info.get('lastPrice', 0))
            vwap = safe_float(price_info.get('vwap', ltp))
            prev_close = safe_float(price_info.get('previousClose', ltp))
            pchange = safe_float(price_info.get('pChange', 0))
            if ltp > 0:
                print(f"[NSE API] {nse_symbol}: Rs.{ltp:.2f} ({pchange:+.2f}%)")
                return ltp, vwap, pchange
        elif resp.status_code in (401, 403):
            global nse_session
            nse_session = None
    except Exception as e:
        print(f"[NSE API Error] {nse_symbol}: {e}")
    return None, None, None

def fetch_yfinance_quote(display_name):
    """Fallback: fetch from yfinance"""
    try:
        import yfinance as yf
        yf_sym = YF_MAP.get(display_name)
        if not yf_sym:
            return None, None, None
        ticker = yf.Ticker(yf_sym)
        info = ticker.fast_info
        ltp = safe_float(getattr(info, 'last_price', 0) or getattr(info, 'regular_market_price', 0))
        prev = safe_float(getattr(info, 'previous_close', 0))
        if ltp > 0:
            pchange = ((ltp - prev) / prev * 100) if prev > 0 else 0.0
            print(f"[yfinance] {yf_sym}: Rs.{ltp:.2f} ({pchange:+.2f}%)")
            return ltp, ltp, round(pchange, 2)
    except Exception as e:
        print(f"[yfinance Error] {display_name}: {e}")
    return None, None, None

def fetch_nsepython_quote(nse_symbol):
    """Try nsepython as second fallback"""
    try:
        import nsepython
        q = nsepython.nse_eq(nse_symbol)
        if isinstance(q, dict) and 'priceInfo' in q:
            ltp = safe_float(q['priceInfo'].get('lastPrice', 0))
            vwap = safe_float(q['priceInfo'].get('vwap', ltp))
            pchange = safe_float(q['priceInfo'].get('pChange', 0))
            if ltp > 0:
                print(f"[nsepython] {nse_symbol}: Rs.{ltp:.2f} ({pchange:+.2f}%)")
                return ltp, vwap, pchange
    except Exception as e:
        print(f"[nsepython Error] {nse_symbol}: {e}")
    return None, None, None

# Cache: store last known good prices
_price_cache = {}

def stock_worker():
    print("=" * 60)
    print("Live NSE Stock Worker started. Fetching real prices...")
    print("Refresh interval: 10 seconds per cycle")
    print("=" * 60)

    while True:
        try:
            stock_payload = []
            for display_name, nse_sym in TICKER_MAP.items():
                ltp, vwap, pchange = None, None, None

                # Method 1: NSE official API
                ltp, vwap, pchange = fetch_nse_quote(nse_sym)

                # Method 2: nsepython
                if ltp is None or ltp <= 0:
                    ltp, vwap, pchange = fetch_nsepython_quote(nse_sym)

                # Method 3: yfinance
                if ltp is None or ltp <= 0:
                    ltp, vwap, pchange = fetch_yfinance_quote(display_name)

                # Use cache if all methods failed
                if ltp is None or ltp <= 0:
                    cached = _price_cache.get(display_name)
                    if cached:
                        ltp, vwap, pchange = cached
                        print(f"[CACHE] {display_name}: Rs.{ltp:.2f}")
                    else:
                        ltp, vwap, pchange = 0.0, 0.0, 0.0
                        print(f"[UNAVAILABLE] {display_name}: No data")

                # Update cache with latest good price
                if ltp and ltp > 0:
                    _price_cache[display_name] = (ltp, vwap, pchange)

                stock_payload.append({
                    "symbol": display_name,
                    "name": display_name.title(),
                    "price": safe_float(ltp),
                    "vwap": safe_float(vwap if vwap else ltp),
                    "change": safe_float(pchange),
                    "logo": display_name[0]
                })

            # Write to project root
            json_path = os.path.join(DATA_DIR, "stocks_data.json")
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(stock_payload, f, indent=2, ensure_ascii=False)
            print(f"[OK] stocks_data.json updated -- {len(stock_payload)} stocks @ {time.strftime('%H:%M:%S')}")

        except Exception as e:
            print(f"[Worker Error] {e}")

        time.sleep(10)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"HTTP Server: {self.address_string()} - {format % args}")

def start_server():
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"\n{'='*55}")
        print(f" 4X WEALTH SERVER RUNNING: http://localhost:{PORT}")
        print(f" SIF TRACKER: http://localhost:{PORT}/sif-tracker.html")
        print(f"{'='*55}\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()

if __name__ == "__main__":
    # Ensure SIF dataset is generated on startup
    try:
        sys.path.insert(0, os.path.dirname(__file__))
        import fetch_sif_data
        fetch_sif_data.sync_sif_dataset(os.path.join(DATA_DIR, "sif_data.json"))
        print("Server: Initialized SIF dataset (sif_data.json).")
    except Exception as e:
        print("Server error initializing SIF dataset:", e)

    # Start stock worker as daemon thread
    t = threading.Thread(target=stock_worker, daemon=True)
    t.start()

    # Start local HTTP server
    start_server()
