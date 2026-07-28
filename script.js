
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
    modalDesc.innerHTML = desc;

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
    const whatsappUrl = `https://wa.me/573332464187?text=${encodedMessage}`;
    
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


document.getElementById('modal-description').innerHTML = descripcion;

// ==========================================
// MODAL LEGAL Y DE POLÍTICAS (NORMATIVA COLOMBIA)
// ==========================================
const legalModal = document.getElementById('legalModal');
const legalTitle = document.getElementById('legalTitle');
const legalBody = document.getElementById('legalBody');

const legalContentData = {
    terminos: {
        title: "Términos y Condiciones de Uso - SANBREI",
        text: `Bienvenido a <b>SANBREI</b>. Al utilizar nuestra tienda virtual y realizar pedidos a través de WhatsApp, aceptas los presentes términos. Los precios indicados en la tienda están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda. Las ofertas y descuentos tienen vigencia limitada o hasta agotar existencias. Nos reservamos el derecho de rechazar o cancelar pedidos por motivos de seguridad o disponibilidad de inventario.`
    },
    privacidad: {
        title: "Política de Privacidad y Habeas Data (Ley 1581 de 2012)",
        text: `En cumplimiento de la Ley 1581 de 2012 sobre protección de datos personales, en <b>SANBREI</b> garantizamos que los datos personales (nombre, teléfono, dirección) proporcionados al realizar un pedido por WhatsApp serán tratados de manera confidencial y exclusivamente para gestionar la entrega de tus productos, facturación y atención al cliente. Tus datos nunca serán vendidos ni compartidos con terceros con fines comerciales no autorizados. Tienes derecho a conocer, actualizar, rectificar o solicitar la supresión de tus datos escribiéndonos directamente.`
    },
    legal: {
        title: "Derechos del Consumidor - Ley 1480 de 2011",
        text: `Conforme a la normatividad colombiana (Estatuto del Consumidor - Ley 1480 de 2011):<br><br>
        • <b>Garantía Legal:</b> Todos nuestros productos cuentan con garantía por defectos de fabricación. El tiempo de garantía se especifica en las características del producto.<br>
        • <b>Derecho de Retracto:</b> En las ventas a distancia (como nuestra tienda online), los consumidores podrán ejercer el derecho de retracto dentro de los <b>5 (cinco) días hábiles</b> siguientes a la entrega del bien, debiendo devolver el producto en las mismas condiciones en las que lo recibió.<br>
        • <b>Reversión de Pagos:</b> Aplica cuando sea objeto de fraude, corresponda a un producto no solicitado o el producto no sea entregado puntualmente, conforme a los canales legales establecidos.`
    }
};

function openLegalModal(type) {
    const data = legalContentData[type];
    if (data) {
        legalTitle.innerText = data.title;
        legalBody.innerHTML = data.text;
        legalModal.classList.add('active');
    }
}

function closeLegalModal() {
    legalModal.classList.remove('active');
}

// Cierre del modal legal haciendo clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target == legalModal) {
        closeLegalModal();
    }
});