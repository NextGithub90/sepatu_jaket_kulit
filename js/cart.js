// Shopping Cart Logic

let cart = [];

// Initialize cart from LocalStorage
function initCart() {
    const savedCart = localStorage.getItem('solusibooth_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartBadge();
    
    // If on checkout page, render items
    if (document.getElementById('checkout-items-container')) {
        renderCheckout();
    }
}

// Update the badge counter in the header
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        // Simple animation
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
    });
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.qty += product.qty;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('solusibooth_cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Alert user
    alert(`Berhasil menambahkan ${product.qty}x ${product.name} ke keranjang!`);
}

// Format number to IDR
function formatRupiah(number) {
    return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Parse Rupiah string to number (e.g. "Rp 350.000" -> 350000)
function parseRupiah(str) {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

// Render checkout items
function renderCheckout() {
    const container = document.getElementById('checkout-items-container');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="color: var(--text-gray); text-align: center; padding: 20px 0;">Keranjang Anda kosong.</p>';
        subtotalEl.textContent = 'Rp0';
        totalEl.textContent = 'Rp0';
        document.getElementById('btn-buat-pesanan').disabled = true;
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        const itemHTML = `
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center;">
                <div style="position: relative;">
                    <div style="width: 60px; height: 60px; background: var(--bg-alt); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain; mix-blend-mode: multiply;">
                    </div>
                    <span style="position: absolute; top: -8px; right: -8px; background: var(--text-dark); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${item.qty}</span>
                </div>
                <div style="flex: 1;">
                    <h5 style="font-size: 14px; margin-bottom: 5px;">${item.name}</h5>
                    <div style="color: var(--text-gray); font-size: 13px;">${formatRupiah(item.price)}</div>
                </div>
                <div style="font-weight: 700; color: var(--primary);">
                    ${formatRupiah(itemTotal)}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
    
    subtotalEl.textContent = formatRupiah(subtotal);
    totalEl.textContent = formatRupiah(subtotal); // assuming free shipping
    
    // Enable button
    document.getElementById('btn-buat-pesanan').disabled = false;
}

// Generate WhatsApp Message
function processOrder(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert("Keranjang Anda kosong!");
        return;
    }
    
    // Get form data
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const namaDepan = document.getElementById('fname').value;
    const namaBelakang = document.getElementById('lname').value;
    const nama = `${namaDepan} ${namaBelakang}`.trim();
    
    const negara = document.getElementById('country').value;
    const alamat = document.getElementById('address').value;
    const alamat2 = document.getElementById('address2').value;
    const kota = document.getElementById('city').value;
    const provinsi = document.getElementById('province').value;
    const kodePos = document.getElementById('zip').value;
    const telepon = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const catatan = document.getElementById('notes').value;
    
    // Get Payment Method
    const paymentMethods = document.getElementsByName('payment_method');
    let paymentMethod = 'Transfer Bank';
    for (const rb of paymentMethods) {
        if (rb.checked) {
            paymentMethod = rb.value;
            break;
        }
    }
    
    // Format Products
    let orderText = `*HALO ADMIN SOLUSI BOOTH*\nSaya ingin membuat pesanan baru:\n\n*DETAIL PESANAN:*\n`;
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        orderText += `${index + 1}. ${item.qty}x ${item.name} (${formatRupiah(item.price)})\n   *Subtotal:* ${formatRupiah(itemTotal)}\n`;
    });
    
    orderText += `\n*Total Pembayaran: ${formatRupiah(subtotal)}*\n`;
    orderText += `*Metode Pembayaran:* ${paymentMethod}\n\n`;
    
    orderText += `*DATA PENGIRIMAN:*\n`;
    orderText += `Nama: ${nama}\n`;
    orderText += `Telepon: ${telepon}\n`;
    if(email) orderText += `Email: ${email}\n`;
    orderText += `Alamat: ${alamat} ${alamat2 ? ', ' + alamat2 : ''}\n`;
    orderText += `Kota/Kab: ${kota}\n`;
    orderText += `Provinsi: ${provinsi}\n`;
    orderText += `Kode Pos: ${kodePos}\n`;
    orderText += `Negara: ${negara}\n\n`;
    
    if (catatan) {
        orderText += `*Catatan Tambahan:*\n${catatan}\n\n`;
    }
    
    orderText += `Mohon segera diproses. Terima kasih!`;
    
    // Encode for URL
    const encodedText = encodeURIComponent(orderText);
    const waNumber = '6281330701235';
    
    // Clear cart
    localStorage.removeItem('solusibooth_cart');
    
    // Redirect
    window.location.href = `https://wa.me/${waNumber}?text=${encodedText}`;
}

// Event Listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // Add to cart buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Try to find closest product card to get data, or use data attributes
            const card = btn.closest('.product-card-modern') || btn.closest('.product-detail-container');
            
            let id = btn.getAttribute('data-id') || Date.now().toString(); // fallback ID
            let name = btn.getAttribute('data-name');
            let price = btn.getAttribute('data-price');
            let image = btn.getAttribute('data-image');
            let qty = 1;
            
            if (card && !name) {
                // Scrape from card if data attributes are missing
                const nameEl = card.querySelector('h3 a') || card.querySelector('h1');
                const priceEl = card.querySelector('.price-new') || card.querySelector('.product-price-detail .price-discount');
                const imgEl = card.querySelector('img');
                
                if (nameEl) name = nameEl.textContent;
                if (priceEl) price = parseRupiah(priceEl.textContent);
                if (imgEl) image = imgEl.src;
            } else if (price) {
                price = parseInt(price);
            }
            
            // Check for explicit quantity input (like on detail page)
            if (card) {
                const qtyInput = card.querySelector('.qty-input');
                if (qtyInput) qty = parseInt(qtyInput.value) || 1;
            }
            
            if (name && price && image) {
                addToCart({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    qty: qty
                });
            } else {
                console.error("Could not find product data");
            }
        });
    });
    
    // Checkout form submit
    const btnBuatPesanan = document.getElementById('btn-buat-pesanan');
    if (btnBuatPesanan) {
        btnBuatPesanan.addEventListener('click', processOrder);
    }
});
