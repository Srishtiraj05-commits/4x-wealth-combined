import glob
import re

html_files = sorted(glob.glob('*.html'))
prod_files = [f for f in html_files if not f.startswith('hero-')]

# Let's inspect animations in style.css and script.js
with open('style.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9_-]+)', css_content)

print(f"=== CSS Keyframe Animations ({len(keyframes)}) ===")
print(", ".join(keyframes))

# Let's inspect script.js for GSAP / requestAnimationFrame / mouse trackers
with open('script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

print("\n=== JS Animation & Effects Functions in script.js ===")
js_funcs = re.findall(r'(?:function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))', js_content)
flat_funcs = [a or b for a, b in js_funcs if a or b]
print(", ".join(flat_funcs[:30]))

# Let's inspect all decorative icons / symbols in HTML files by section
print("\n=== Detailed Decorative Elements Per Page ===")
for pf in prod_files:
    with open(pf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find all <i> tags
    icons = re.findall(r'<i\s+class=["\']([^"\']+)["\']', content)
    # filter out navbar dropdown chevrons
    non_nav_icons = [ic for ic in icons if 'chevron' not in ic and 'bars' not in ic and 'magnifying-glass' not in ic]
    
    # find all unicode bullet / star / symbol usages
    unicodes = re.findall(r'(&[#a-zA-Z0-9]+;|[▲▼●◆■★✦⚡✨🚀🛡️])', content)
    
    # find section tags like "01 / ...", "02 / ..." or gold highlights
    gold_highlights = len(re.findall(r'gold-highlight|gold-divider', content))
    
    print(f"File: {pf}")
    print(f"  - Non-nav icons: {len(non_nav_icons)} (Sample: {non_nav_icons[:5]})")
    print(f"  - Unicode symbols/entities: {len(unicodes)} (Sample: {unicodes[:6]})")
    print(f"  - Gold divider / highlights: {gold_highlights}")
