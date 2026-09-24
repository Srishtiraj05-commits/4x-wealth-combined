import glob
import re
import os

print("Starting Senior SDE Codebase Cleanup...")

html_files = sorted(glob.glob('*.html'))
prod_files = [f for f in html_files if not f.startswith('hero-')]

# 1. CLEAN HTML FILES
for filepath in prod_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content

    # A. Remove Custom Cursor & Spotlight elements
    content = re.sub(r'\s*<!-- Spotlight Glow & Custom Cursor -->\s*', '\n', content)
    content = re.sub(r'\s*<div class=["\']spotlight["\'][^>]*></div>', '', content)
    content = re.sub(r'\s*<div class=["\']cursor-ring["\'][^>]*></div>', '', content)
    content = re.sub(r'\s*<div class=["\']cursor-dot["\'][^>]*></div>', '', content)

    # B. Remove Gold Diamond Dividers
    content = re.sub(r'<div class=["\']gold-divider-wrap["\'][^>]*>[\s\S]*?</div>', '', content)

    # C. Replace Buzzwords in Nav & Content
    content = re.sub(r'Quant Core Neural Engine', 'Quantitative Factor Architecture', content)
    content = re.sub(r'QUANT CORE NEURAL ENGINE', 'QUANTITATIVE FACTOR ARCHITECTURE', content)
    content = re.sub(r'NEURAL PROCESSING CORE', 'QUANTITATIVE RESEARCH DESK', content)
    content = re.sub(r'Neural Processing Core', 'Quantitative Research Desk', content)
    content = re.sub(r'AI HEDGE LAB', 'INSTITUTIONAL QUANT LAB', content)
    content = re.sub(r'AI Hedge Lab', 'Institutional Research Lab', content)
    content = re.sub(r'Quantum Alpha Matrix', 'Factor Multi-Regime Matrix', content)
    content = re.sub(r'Autonomous Market Regime Analyzer', 'Multi-Asset Macro Regime Analysis', content)

    # D. Remove gimmicky FontAwesome icons from body (excluding navbars & ticker & primary button arrows)
    content = re.sub(r'<i class=["\']fa-solid fa-sparkles["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-rocket["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-vault["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-piggy-bank["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-fire-flame-curved["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-brain["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-satellite["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-atom["\'][^>]*></i>\s*', '', content)
    content = re.sub(r'<i class=["\']fa-solid fa-bolt["\'][^>]*></i>\s*', '', content)

    # E. Update version to v=146.0
    content = re.sub(r'v=\d+(\.\d+)?', 'v=146.0', content)

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath}")

print("HTML cleanup completed.")
