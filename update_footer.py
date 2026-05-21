import os

def update_footer_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the old and new footer links
    old_link = '<li><a href="terms-and-conditions.html">Syarat & Ketentuan</a></li>'
    new_links = '''<li><a href="terms-and-conditions.html">Syarat & Ketentuan</a></li>
                        <li><a href="privacy-policy.html">Kebijakan Privasi</a></li>
                        <li><a href="refund-policy.html">Kebijakan Pengembalian Dana</a></li>'''

    # Update only if the new links are not already there
    if '<li><a href="privacy-policy.html">Kebijakan Privasi</a></li>' not in content:
        content = content.replace(old_link, new_links)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Already updated {filepath}")

html_files = [
    'index.html',
    'toko.html',
    'tentang-kami.html',
    'kontak.html',
    'product-detail.html',
    'checkout.html',
    'terms-and-conditions.html'
]

for file in html_files:
    if os.path.exists(file):
        update_footer_links(file)
