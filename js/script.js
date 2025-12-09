document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Hamburger untuk Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // 2. Galeri Gambar di Halaman Detail Produk
    if (document.querySelector('.product-gallery')) {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.src;
            });
        });
    }

    // 3. FUNGSI FILTER HARGA
    const priceSlider = document.getElementById('price-slider');
    const priceValueSpan = document.getElementById('price-value');
    const productGrid = document.getElementById('product-grid');
    if (priceSlider && productGrid) {
        priceSlider.addEventListener('input', () => {
            const maxPrice = parseInt(priceSlider.value);
            const formattedPrice = new Intl.NumberFormat('id-ID').format(maxPrice);
            priceValueSpan.textContent = `Rp 50.000 - Rp ${formattedPrice}`;
            const productCards = productGrid.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const priceElement = card.querySelector('.price');
                const priceText = priceElement.textContent.replace('Rp ', '').replace(/\./g, '');
                const productPrice = parseInt(priceText);
                if (productPrice <= maxPrice) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==========================================================
    // 4. SISTEM KERANJANG BELANJA BARU (MODAL & DETAIL ITEM)
    // ==========================================================

    let cart = new Map(); // Menggunakan Map untuk menyimpan data keranjang

    // Elemen-elemen DOM
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const floatingCart = document.getElementById('floating-cart');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const viewCartButton = document.getElementById('view-cart-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceSpan = document.getElementById('cart-total-price');

    // Fungsi untuk menambah item ke keranjang
    const addItemToCart = (product) => {
        if (cart.has(product.name)) {
            // Jika produk sudah ada, tambah kuantitasnya
            cart.get(product.name).quantity++;
        } else {
            // Jika produk baru, tambahkan ke Map
            cart.set(product.name, { ...product, quantity: 1 });
        }
        updateCartUI();
    };

    // Fungsi untuk merender/menampilkan item di dalam modal
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; // Kosongkan kontainer
        if (cart.size === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Keranjang Anda kosong.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${item.priceText} x ${item.quantity}</p>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    };

    // Fungsi untuk memperbarui semua tampilan UI keranjang
    const updateCartUI = () => {
        // Tampilkan floating bar jika ada item di keranjang
        if (cart.size > 0) {
            floatingCart.classList.add('visible');
        } else {
            floatingCart.classList.remove('visible');
        }

        // Hitung total item
        let totalItems = 0;
        let totalPrice = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.priceValue * item.quantity;
        });
        
        // Update teks di floating bar
        cartItemCountSpan.textContent = `Lihat Keranjang (${totalItems} Item)`;
        
        // Update total harga di modal
        cartTotalPriceSpan.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}`;

        // Render ulang item di dalam modal
        renderCartItems();
    };

    // Fungsi untuk membuka & menutup modal
    const openModal = () => {
        cartModalOverlay.classList.add('visible');
        cartModal.classList.add('visible');
    };
    const closeModal = () => {
        cartModalOverlay.classList.remove('visible');
        cartModal.classList.remove('visible');
    };

    // Event Listener untuk tombol "Tambah"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const priceText = productCard.querySelector('.price').textContent;
            
            const product = {
                name: productCard.querySelector('h3').textContent,
                priceText: priceText,
                priceValue: parseInt(priceText.replace('Rp ', '').replace(/\./g, '')),
                image: productCard.querySelector('img').src,
            };
            
            addItemToCart(product);
        });
    });

    // Event listeners untuk modal
    viewCartButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    cartModalOverlay.addEventListener('click', closeModal);

    // Inisialisasi tampilan awal
    updateCartUI();
    
    console.log("Sistem keranjang belanja detail berhasil dimuat!");
});