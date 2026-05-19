import os

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Link cart icon (no tooltip)
    if '<a href="#" class="icon-link">\n                    <i class="ph ph-shopping-cart"></i>' in content:
        content = content.replace('<a href="#" class="icon-link">\n                    <i class="ph ph-shopping-cart"></i>', '<a href="checkout.html" class="icon-link">\n                    <i class="ph ph-shopping-cart"></i>')
    
    # Link cart icon (with tooltip)
    if '<a href="#" class="icon-link tooltip-wrap" data-tooltip="Keranjang">' in content:
        content = content.replace('<a href="#" class="icon-link tooltip-wrap" data-tooltip="Keranjang">', '<a href="checkout.html" class="icon-link tooltip-wrap" data-tooltip="Keranjang">')

    # Cart button in grids
    content = content.replace('<button class="action-btn"><i class="ph ph-shopping-cart"></i></button>', '<button class="action-btn add-to-cart-btn"><i class="ph ph-shopping-cart"></i></button>')

    # Add to cart button in detail page
    if '<button class="btn btn-primary" style="flex: 1; font-size: 16px; padding: 0 30px; border-radius: 8px;">\n                        <i class="ph ph-shopping-cart"' in content:
        content = content.replace('<button class="btn btn-primary" style="flex: 1; font-size: 16px; padding: 0 30px; border-radius: 8px;">\n                        <i class="ph ph-shopping-cart"', '<button class="btn btn-primary add-to-cart-btn" style="flex: 1; font-size: 16px; padding: 0 30px; border-radius: 8px;">\n                        <i class="ph ph-shopping-cart"')

    # Inject js
    if '<script src="js/cart.js"></script>' not in content:
        content = content.replace('<script src="js/main.js"></script>', '<script src="js/main.js"></script>\n    <script src="js/cart.js"></script>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in ['index.html', 'toko.html', 'tentang-kami.html', 'kontak.html', 'product-detail.html']:
    if os.path.exists(f):
        update_file(f)

print("Updates completed")
