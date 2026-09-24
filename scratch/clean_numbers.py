import glob
import re

html_files = glob.glob('*.html')
modified_count = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content

    # 1. Clean mega menu headers: <h4>01 / Invest</h4> -> <h4>Invest</h4>
    content = re.sub(r'<h4>\s*\d{2}\s*/\s*', '<h4>', content)

    # 2. Clean section-tag, section-tag-badge, pillar-header-badge, approach-badge-num:
    content = re.sub(r'(<span[^>]*class=["\'][^"\']*(?:section-tag|section-tag-badge|pillar-header-badge|approach-badge-num|diligence-node-badge)[^"\']*["\'][^>]*>)\s*\d{2}\s*/\s*', r'\1', content)

    # 3. Clean section titles with "01. ", "02. ", etc.:
    content = re.sub(r'(<h2[^>]*class=["\'][^"\']*section-title[^"\']*["\'][^>]*>)\s*\d{2}\.\s*', r'\1', content)

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        modified_count += 1
        print(f"Updated: {filepath}")

print(f"Total files updated: {modified_count}")
