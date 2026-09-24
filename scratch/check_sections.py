import subprocess
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def analyze_file(content_str, label):
    print(f"=== {label} ===")
    sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', content_str)
    print("Section IDs:", sections)
    
    headings = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', content_str)
    print(f"Total Headings: {len(headings)}")
    for h in headings:
        clean_h = re.sub(r'<[^>]+>', '', h).strip()
        if clean_h:
            print(f"  - {clean_h}")

# Current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    analyze_file(f.read(), "CURRENT index.html")

# 3fbcefc
try:
    old_out = subprocess.check_output(['git', 'show', '3fbcefc:index.html'], text=True, encoding='utf-8')
    analyze_file(old_out, "COMMIT 3fbcefc:index.html")
except Exception as e:
    print(e)
