import glob
import re

print("Cleaning duplicate navbar item across all HTML files...")

html_files = sorted(glob.glob('*.html'))

duplicate_pattern = re.compile(
    r'<!--\s*Institutional Research Lab\s*-->\s*<li class=["\']sk-nav-item dropdown-trigger["\']>\s*<a class=["\']sk-nav-link clickable["\'] href=["\']hedge-lab\.html[^>]*>Institutional Research Lab\s*<i class=["\']fa-solid fa-chevron-down["\']></i></a>\s*<ul class=["\']dropdown-menu["\']>.*?</ul>\s*</li>',
    re.DOTALL | re.IGNORECASE
)

for f in html_files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    new_content = duplicate_pattern.sub('', content)
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        print(f"Cleaned navbar in: {f}")
    else:
        print(f"Already clean or no match: {f}")

print("Navbar cleanup finished.")
