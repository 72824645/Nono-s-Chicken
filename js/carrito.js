let carrito = JSON.parse(localStorage.getItem('nonos_carrito')) || [];

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const index = carrito.findIndex(item => item.id === id);
    if (index > -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarritoUI();
    mostrarNotificacion(`¡${producto.nombre} agregado!`);
}

function cambiarCantidad(id, cambio) {
    const index = carrito.findIndex(item => item.id === id);
    if (index > -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
    }
    guardarCarrito();
    actualizarCarritoUI();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
}

function guardarCarrito() {
    localStorage.setItem('nonos_carrito', JSON.stringify(carrito));
}

function calcularTotal() {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function actualizarCarritoUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    if (!cartCount || !cartItemsContainer || !cartTotalAmount) return;

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Tu carrito está vacío</p>`;
        cartTotalAmount.textContent = "S/ 0.00";
        return;
    }

    let html = '';
    carrito.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="qty-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="eliminarDelCarrito(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalAmount.textContent = `S/ ${calcularTotal().toFixed(2)}`;
}

function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #e50914;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}