import glob
import re

print("Bumping to v150.0...")

html_files = sorted(glob.glob('*.html'))

for f in html_files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Bump all version queries to v=150.0
    content = re.sub(r'(\.css|\.js|\.png)\?v=\d+(\.\d+)?', r'\1?v=150.0', content)
    content = re.sub(r'script\.js\?v=\d+(\.\d+)?', 'script.js?v=150.0', content)
    content = re.sub(r'style\.css\?v=\d+(\.\d+)?', 'style.css?v=150.0', content)
    content = re.sub(r'chatbot\.js\?v=\d+(\.\d+)?', 'chatbot.js?v=150.0', content)
    content = re.sub(r'logo\.png\?v=\d+(\.\d+)?', 'logo.png?v=150.0', content)

    with open(f, 'w', encoding='utf-8') as fh:
        fh.write(content)
    print(f"Updated: {f}")

# Also check in script.js and chatbot.js if there are any self version queries
for js_f in ['script.js', 'chatbot.js']:
    with open(js_f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    c = re.sub(r'(\.css|\.js|\.png)\?v=\d+(\.\d+)?', r'\1?v=150.0', c)
    with open(js_f, 'w', encoding='utf-8') as fh:
        fh.write(c)
    print(f"Updated {js_f}")

print("Done v150.0 bump.")
