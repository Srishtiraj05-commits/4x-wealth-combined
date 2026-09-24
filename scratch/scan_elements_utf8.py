import glob
import re

html_files = sorted(glob.glob('*.html'))
prod_files = [f for f in html_files if not f.startswith('hero-')]

out = []

for pf in prod_files:
    with open(pf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Custom cursor
    has_cursor = 'cursor-ring' in content
    
    # 2. Extract section headers, titles, cards
    headers = re.findall(r'<div class=["\']section-header[^"\']*["\']>(.*?)</div>', content, re.DOTALL)
    
    # 3. Gold dividers
    gold_dividers = len(re.findall(r'gold-divider', content))
    
    # 4. Unicode symbols in body (excluding navbar/ticker)
    body_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
    body_symbols = []
    body_icons = []
    if body_match:
        btext = body_match.group(1)
        body_symbols = re.findall(r'[▲▼●◆■★✦⚡✨🚀🛡️🎯]', btext)
        body_icons = re.findall(r'<i\s+class=["\']([^"\']+)["\']', btext)
        body_icons = [i for i in body_icons if 'chevron' not in i and 'arrow' not in i]

    out.append(f"PAGE: {pf}")
    out.append(f"  - Spotlight / Custom Cursor: {'YES' if has_cursor else 'NO'}")
    out.append(f"  - Gold Dividers with Diamonds: {gold_dividers}")
    out.append(f"  - Body Decorative Icons (FontAwesome): {len(body_icons)} -> {list(set(body_icons))[:6]}")
    out.append(f"  - Body Decorative Unicode Symbols: {len(body_symbols)} -> {list(set(body_symbols))}")
    out.append("")

with open('scratch/detailed_elements_audit.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print("Elements audit written to scratch/detailed_elements_audit.txt")
