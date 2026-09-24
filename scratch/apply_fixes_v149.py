import glob
import re

print("Applying v149.0 refinements...")

# 1. REMOVE SIF SCREENER "NEW" BADGE ACROSS ALL HTML FILES & ADD DIRECT CHATBOT SCRIPT
html_files = sorted(glob.glob('*.html'))

for f in html_files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Remove nav-badge-new
    content = re.sub(r'<span class=["\']nav-badge-new["\'][^>]*>NEW</span>\s*', '', content)
    
    # Ensure chatbot.js is directly included before </body>
    if 'chatbot.js' not in content:
        content = content.replace('</body>', '  <!-- 4X Chatbot Assistant -->\n  <script src="chatbot.js?v=149.0"></script>\n</body>')
    else:
        content = re.sub(r'chatbot\.js\?v=\d+(\.\d+)?', 'chatbot.js?v=149.0', content)

    # Bump version
    content = re.sub(r'v=\d+(\.\d+)?', 'v=149.0', content)

    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(content)
    print(f"Updated HTML file: {f}")

print("HTML files updated.")
