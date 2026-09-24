import glob
import re
import os

pages = [
    'index.html', 'about.html', 'solutions.html', 'mutual-funds.html', 
    'stocks.html', 'pms.html', 'aif.html', 'sif-tracker.html', 
    'unlisted-shares.html', 'bonds.html', 'insurance.html', 'gift-city.html', 
    'corporate-wealth.html', 'tax-planning.html', 'goal-planning.html', 
    'retirement-planning.html', 'nri-services.html', 'etfs.html', 
    'calculators.html', 'blogs.html', 'hedge-lab.html', 'atrium.html', 
    'login.html', 'signup.html'
]

output_lines = []

for p in pages:
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', content)
    
    # 1. Headings with symbols/emojis
    headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', content, re.DOTALL)
    heading_symbols = []
    for h in headings:
        clean_h = re.sub(r'<[^>]+>', ' ', h)
        clean_h = ' '.join(clean_h.split())
        # Find emojis and decorative symbols
        syms = re.findall(r'[\u2600-\u26FF\u2700-\u27BF\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\u25A0-\u25FF\u2B00-\u2BFF\u25CF\u25C6\u25B2\u25BC\u2192\u2191\u2193\u25BA\u2714\u2713\u2716\u2728\u26A1\u26A0\u2705\u274C\u2728\u2757\u2753]', clean_h)
        if syms:
            heading_symbols.append((clean_h[:70], list(set(syms))))
    
    # 2. Section tags / badges with emojis/symbols (e.g., .section-tag, .badge, etc.)
    badges = re.findall(r'class=["\'][^"\']*(?:section-tag|hero-ivory-badge|metric-pill|tag|badge|gold-tag)[^"\']*["\'][^>]*>(.*?)<', content)
    badge_symbols = []
    for b in badges:
        clean_b = b.strip()
        syms = re.findall(r'[\u2600-\u26FF\u2700-\u27BF\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\u25A0-\u25FF\u2B00-\u2BFF\u25CF\u25C6\u25B2\u25BC\u2192\u2191\u2193\u25BA\u2714\u2713\u2716\u2728\u26A1\u26A0\u2705\u274C\u2728\u2757\u2753]', clean_b)
        if syms:
            badge_symbols.append((clean_b, list(set(syms))))

    # 3. AI buzzwords / exaggerated tech slang
    buzzwords = re.findall(r'(?i)\b(neural\s+engine|quantum|deep\s+alpha|ultra-high|supercharged|automated\s+god-mode|hyper-growth|unstoppable|matrix|ai\s+hedge\s+lab|ai\s+wealth\s+bot|neural\s+matrix)\b', content)

    # 4. FontAwesome icons in body (excluding navbar and footer)
    # Extract main content
    main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
    body_fa_icons = []
    if main_match:
        main_content = main_match.group(1)
        fa_icons = re.findall(r'<i\s+class=["\']fa[srlbd]?\s+fa-([^"\']+)["\']', main_content)
        body_fa_icons = list(set(fa_icons))
    
    # 5. Check cursor / spotlight
    has_cursor = 'cursor-ring' in content or 'cursor-dot' in content or 'spotlight' in content
    
    # 6. Check inline styles
    inline_styles_count = len(re.findall(r'style=["\']', content))

    output_lines.append(f"PAGE: {p}")
    output_lines.append(f"  Sections ({len(sections)}): {', '.join(sections[:6])}{'...' if len(sections)>6 else ''}")
    output_lines.append(f"  Custom Cursor/Spotlight: {'YES' if has_cursor else 'NO'}")
    output_lines.append(f"  Inline style attributes: {inline_styles_count}")
    if heading_symbols:
        output_lines.append(f"  Heading Symbols ({len(heading_symbols)}):")
        for h, s in heading_symbols[:3]:
            output_lines.append(f"    - \"{h}\" -> symbols: {s}")
    if badge_symbols:
        output_lines.append(f"  Badge Symbols ({len(badge_symbols)}):")
        for b, s in badge_symbols[:3]:
            output_lines.append(f"    - \"{b}\" -> symbols: {s}")
    if buzzwords:
        output_lines.append(f"  Buzzwords: {list(set(buzzwords))}")
    if body_fa_icons:
        output_lines.append(f"  Body FA Icons ({len(body_fa_icons)}): {body_fa_icons[:8]}...")
    output_lines.append("")

with open('scratch/audit_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print("Audit written to scratch/audit_results.txt")
