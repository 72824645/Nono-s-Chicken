document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(productos);
    configurarFiltros();
    configurarCarritoModal();
    configurarCheckoutWhatsApp();
    configurarMenuMobile();
    configurarBuscador();
    verificarHorarioAtencion();
    actualizarCarritoUI();
});

function renderizarProductos(lista) {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No se encontraron productos.</p>`;
        return;
    }

    grid.innerHTML = lista.map(p => `
        <div class="producto-card" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.2">
            <div class="producto-img-container">
                <span class="producto-badge">${p.badge}</span>
                <img src="${p.imagen}" alt="${p.nombre}">
            </div>
            <div class="producto-info">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <div class="producto-footer">
                    <span class="precio">S/ ${p.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${p.id})">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Inicializar el efecto 3D en las tarjetas
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".producto-card"));
    }
}

function configurarFiltros() {
    const botones = document.querySelectorAll('.filter-btn');
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const categoria = btn.getAttribute('data-filter');
            if (categoria === 'todos') {
                renderizarProductos(productos);
            } else {
                const filtrados = productos.filter(p => p.categoria === categoria);
                renderizarProductos(filtrados);
            }
        });
    });
}

function configurarBuscador() {
    const inputSearch = document.getElementById('search-input');
    if (!inputSearch) return;

    inputSearch.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        const filtrados = productos.filter(p => 
            p.nombre.toLowerCase().includes(termino) || 
            p.descripcion.toLowerCase().includes(termino)
        );
        renderizarProductos(filtrados);
    });
}

function verificarHorarioAtencion() {
    const badgeStatus = document.getElementById('store-status');
    if (!badgeStatus) return;

    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const tiempoDecimal = hora + minutos / 60;

    // Horario: 8:30 PM (20.5) hasta las 12:30 AM (0.5 de la madrugada)
    const abierto = (tiempoDecimal >= 20.5 || tiempoDecimal < 0.5);

    if (abierto) {
        badgeStatus.className = "status-badge open";
        badgeStatus.innerHTML = `<i class="fas fa-circle" style="font-size: 8px;"></i> ¡Abierto ahora! (Atendemos hasta las 12:30 a.m.)`;
    } else {
        badgeStatus.className = "status-badge closed";
        badgeStatus.innerHTML = `<i class="fas fa-circle" style="font-size: 8px;"></i> Cerrado temporalmente (Horario: 8:30 p.m. - 12:30 a.m.)`;
    }
}

function configurarCarritoModal() {
    const btnCarrito = document.getElementById('btn-carrito');
    const closeCart = document.getElementById('close-cart');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');

    if (!btnCarrito || !cartModal) return;

    const toggleCart = () => {
        cartModal.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    };

    btnCarrito.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
}

function configurarCheckoutWhatsApp() {
    const btnWhatsApp = document.getElementById('checkout-whatsapp');
    if (!btnWhatsApp) return;

    btnWhatsApp.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de realizar el pedido.');
            return;
        }

        let mensaje = `Hola *Nono's Chicken & Burger*, deseo realizar el siguiente pedido:\n\n`;
        carrito.forEach(item => {
            mensaje += `• ${item.cantidad}x ${item.nombre} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
        });

        const total = calcularTotal();
        mensaje += `\n*Total a Pagar: S/ ${total.toFixed(2)}*\n`;
        mensaje += `\n_Método de pago: Yape o Efectivo_`;
        mensaje += `\n_Dirección / Recojo en local: Benjamin Doig Lossio Mz C Lt 3, Pucusana._`;

        const telefono = '51993523805'; // Sra. Marita
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });
}

function configurarMenuMobile() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar');

    if (!mobileMenu || !navbar) return;

    mobileMenu.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}