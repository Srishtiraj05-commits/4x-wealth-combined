import re

# 1. CLEAN style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove cursor & spotlight definitions
css = re.sub(r'/\* ============ SPOTLIGHT & CURSOR[\s\S]*?@media \(hover: none\) \{\s*\.spotlight, \.cursor-ring, \.cursor-dot \{ display: none; \}\s*\}', '/* Native Clean Cursor Defaults */\n.clickable, a, button, input[type="submit"], input[type="button"] { cursor: pointer !important; }\nbody, html { cursor: default; }', css)

# Remove chipFloat animation
css = re.sub(r'animation:\s*chipFloat[^\n;]+;', '', css)
css = re.sub(r'@keyframes\s+chipFloat\s*\{[\s\S]*?\}', '', css)

# Remove barPulse animation
css = re.sub(r'animation:\s*barPulse[^\n;]+;', '', css)
css = re.sub(r'@keyframes\s+barPulse\s*\{[\s\S]*?\}', '', css)

# Remove gold-divider styles
css = re.sub(r'\.gold-divider-wrap\s*\{[\s\S]*?\.gold-divider-diamond\s*\{[\s\S]*?\}', '', css)

# Update version in style.css header
css = re.sub(r'Version:\s*\d+(\.\d+)?', 'Version: 146.0', css)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Cleaned style.css")

# 2. CLEAN script.js
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove Section 6 cursor / spotlight listeners
js = re.sub(r'// ==========================================\s*// 6\. SPOTLIGHT & CUSTOM CURSOR INTERACTS[\s\S]*?if \(spotlight \|\| cursorRing \|\| cursorDot\) \{[\s\S]*?\}\s*\}', '// 6. NATIVE POINTER HANDLING (Spotlight & Custom Cursor Removed for Institutional Performance)', js)

# Remove bouncy spring easing in entrance / scroll triggers
js = js.replace("ease: 'back.out(1.5)'", "ease: 'power2.out'")

# Update chatbot script version
js = re.sub(r'chatbot\.js\?v=\d+(\.\d+)?', 'chatbot.js?v=146.0', js)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Cleaned script.js")
