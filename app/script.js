
let cart = [];
let currentModalProduct = {};
let currentImages = [];
let currentIndex = 0;
let quantity = 1;

const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const carouselDots = document.getElementById('carouselDots');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');

function openModal(images, title, price, desc) {
    currentImages = images;
    currentIndex = 0;
    quantity = 1;
    document.getElementById('qtyValue').innerText = quantity;

    currentModalProduct = { title, price, desc };

    modalTitle.innerText = title;
    modalPrice.innerText = "COP " + price.toLocaleString();
    modalDesc.innerText = desc;

    updateGallery();
    modal.classList.add('active');
}

function updateGallery() {
    modalImage.src = currentImages[currentIndex];
    carouselDots.innerHTML = '';
    currentImages.forEach((img, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
        dot.onclick = () => { currentIndex = index; updateGallery(); };
        carouselDots.appendChild(dot);
    });
}

function closeModal() {
    modal.classList.remove('active');
}

function changeQty(amount) {
    quantity += amount;
    if (quantity < 1) quantity = 1;
    document.getElementById('qtyValue').innerText = quantity;
}

function toggleCart() {
    cartDrawer.classList.toggle('active');
}

function addToCartFromModal() {
    const existingItem = cart.find(item => item.title === currentModalProduct.title);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            title: currentModalProduct.title,
            price: currentModalProduct.price,
            quantity: quantity
        });
    }
    updateCartUI();
    closeModal();
    toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #777; text-align: center; margin-top: 20px;">Tu carrito está vacío.</p>';
        cartTotalPrice.innerText = 'COP 0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>Cant: ${item.quantity} x COP ${item.price.toLocaleString()}</p>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
    });

    cartTotalPrice.innerText = 'COP ' + total.toLocaleString();
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        event.preventDefault();
        return;
    }

    let message = "Hola, ¡quiero hacer el siguiente pedido desde la web! 📦:\n\n";
    let total = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        message += `- ${item.quantity}x ${item.title} (COP ${subtotal.toLocaleString()})\n`;
    });

    message += `\n*Total a pagar: COP ${total.toLocaleString()}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/573053798541?text=${encodedMessage}`;
    
    document.getElementById('whatsappCheckoutBtn').href = whatsappUrl;
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}


function filtrarProductos() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const title = card.querySelector('.product-title').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
