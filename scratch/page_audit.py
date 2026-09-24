import glob
import re
import os

pages = [
    'index.html', 'about.html', 'solutions.html', 'mutual-funds.html', 'stocks.html', 
    'pms.html', 'aif.html', 'sif-tracker.html', 'bonds.html', 'unlisted-shares.html', 
    'gift-city.html', 'retirement-planning.html', 'goal-planning.html', 'tax-planning.html', 
    'corporate-wealth.html', 'nri-services.html', 'insurance.html', 'etfs.html', 
    'hedge-lab.html', 'calculators.html', 'blogs.html', 'login.html', 'signup.html'
]

buzzwords = [
    'neural', 'quantum', 'synergy', 'hyper', 'revolutionary', 'unleash', 'cutting-edge', 
    'disrupt', 'game-changer', 'futuristic', 'supercharge', 'turbo', 'paradigm', 'magic'
]

print("=== PAGE BY PAGE AUDIT ===")
for p in pages:
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Title
    title_m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    title = title_m.group(1) if title_m else 'No title'
    
    # Sections count & IDs
    sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', content)
    
    # Check buzzwords
    found_buzz = []
    for b in buzzwords:
        matches = re.findall(rf'\b{b}\w*\b', content, re.IGNORECASE)
        if matches:
            found_buzz.append(f"{b} ({len(matches)})")
            
    # Check forms
    forms = len(re.findall(r'<form', content))
    # Check tables
    tables = len(re.findall(r'<table', content))
    # Check canvas / webgl
    canvas = len(re.findall(r'<canvas', content))
    
    print(f"\n--- {p} ({title}) ---")
    print(f"  Sections: {len(sections)} -> {sections}")
    print(f"  Buzzwords found: {', '.join(found_buzz) if found_buzz else 'None (Clean)'}")
    print(f"  Forms: {forms}, Tables: {tables}, Canvas: {canvas}")
