import glob
import re

html_files = sorted(glob.glob('*.html'))
prod_files = [f for f in html_files if not f.startswith('hero-')]

for p in prod_files:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content

    # 1. Remove emojis and decorative symbols from headings (h1-h6) and badges
    # Keep standard text and basic punctuation
    def clean_heading_text(m):
        tag = m.group(1)
        attrs = m.group(2)
        inner = m.group(3)
        # Remove decorative emojis/symbols: ⚡✨🚀🛡️🎯💎★✦◆■
        clean_inner = re.sub(r'[⚡✨🚀🛡️🎯💎★✦◆■]', '', inner)
        # Clean extra double spaces
        clean_inner = re.sub(r'\s{2,}', ' ', clean_inner)
        return f'<{tag}{attrs}>{clean_inner}</{tag}>'

    content = re.sub(r'<(h[1-6])([^>]*)>([\s\S]*?)</\1>', clean_heading_text, content)

    # 2. Clean badges / pills
    def clean_badge(m):
        full = m.group(0)
        # remove emojis/symbols
        clean = re.sub(r'[⚡✨🚀🛡️🎯💎★✦◆■]', '', full)
        return clean

    content = re.sub(r'<span class=["\'][^"\']*(?:section-tag|hero-ivory-badge|metric-pill|tag|badge|gold-tag)[^"\']*["\'][^>]*>[\s\S]*?</span>', clean_badge, content)

    # 3. Clean button texts
    def clean_btn(m):
        full = m.group(0)
        clean = re.sub(r'[⚡✨🚀🛡️🎯💎★✦◆■]', '', full)
        return clean

    content = re.sub(r'<(?:a|button) class=["\'][^"\']*(?:btn|button|clickable)[^"\']*["\'][^>]*>[\s\S]*?</(?:a|button)>', clean_btn, content)

    # 4. Remove any remaining gold-divider-wrap
    content = re.sub(r'<div class=["\']gold-divider-wrap["\'][^>]*>[\s\S]*?</div>', '', content)

    # 5. Clean up any remaining cursor elements
    content = re.sub(r'<div class=["\'](?:spotlight|cursor-ring|cursor-dot)["\'][^>]*></div>', '', content)

    if content != orig:
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Deep cleaned: {p}")

print("Deep cleaning finished.")
