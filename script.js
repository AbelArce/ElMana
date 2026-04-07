// ===== CONFIGURACIÓN =====
const WHATSAPP_NUMBER = ''; // Reemplazar con número real
const DAYS_OF_WEEK = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

// ===== VARIABLES GLOBALES =====
let configData = null;
let menuData = null;
let horariosData = null;
let promotionsData = null;
let currentDay = null;
let currentService = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Determinar día actual
        currentDay = getCurrentDay();
        
        // Cargar datos
        await Promise.all([
            loadConfig(),
            loadMenu(),
            loadHorarios(),
            loadPromotions()
        ]);
        
        // Detectar día y servicio actual
        detectCurrentDayAndService();
        
        // Configurar tabs de servicios
        setupServiceTabs();
        
        // Mostrar servicio actual
        showService(currentService);
        
        console.log('Aplicación inicializada correctamente');
        console.log('Día actual:', currentDay);
        console.log('Servicio actual:', currentService);
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

// ===== FUNCIONES PRINCIPALES =====

// Obtener día actual en español
function getCurrentDay() {
    const today = new Date();
    return DAYS_OF_WEEK[today.getDay()];
}

// Obtener servicio actual según horario
function getCurrentService() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Definir rangos de tiempo en minutos
    const breakfastStart = 8 * 60;     // 8:00 AM
    const breakfastEnd = 11 * 60;      // 11:00 AM
    const lunchStart = 11.5 * 60;      // 11:30 AM
    const lunchEnd = 17 * 60;          // 5:00 PM
    const dinnerStart = 17 * 60;      // 5:00 PM
    const dinnerEnd = 23.5 * 60;       // 11:30 PM
    
    // Determinar servicio según hora y día
    if (currentTimeInMinutes >= breakfastStart && currentTimeInMinutes < breakfastEnd) {
        return 'desayuno';
    } else if (currentTimeInMinutes >= lunchStart && currentTimeInMinutes < lunchEnd) {
        return 'menu';
    } else if (currentTimeInMinutes >= dinnerStart && currentTimeInMinutes < dinnerEnd) {
        // La cena solo está disponible viernes, sábado y domingo
        if (['viernes', 'sabado', 'domingo'].includes(currentDay)) {
            return 'cena';
        } else {
            return 'menu'; // Si no es día de cena, mostrar menú
        }
    } else {
        // Fuera de horario, mostrar desayuno si es muy temprano, o menú si es tarde
        return currentTimeInMinutes < breakfastStart ? 'desayuno' : 'menu';
    }
}

// Cargar configuración desde JSON
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        configData = await response.json();
        console.log('Configuración cargada:', configData);
        updatePageWithConfig();
    } catch (error) {
        console.error('Error al cargar la configuración:', error);
        // Usar configuración por defecto
        configData = {
            restaurante: {
                nombre: "El Maná",
                whatsapp: "",
                direccion: ""
            },
            ubicacion: {
                maps_url: "",
                maps_embed: ""
            },
            imagenes: {
                hero: "https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible",
                restaurante: "https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible",
                fallback: "https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible"
            }
        };
    }
}

// Cargar promociones desde JSON
async function loadPromotions() {
    try {
        const response = await fetch('promociones.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        promotionsData = await response.json();
        console.log('Promociones cargadas:', promotionsData);
        renderPromotions();
    } catch (error) {
        console.error('Error al cargar las promociones:', error);
        // Ocultar sección de promociones si hay error
        hidePromotionsSection();
    }
}

// Renderizar promociones
function renderPromotions() {
    const promotionsGrid = document.getElementById('promotions-grid');
    const promotionsSection = document.getElementById('promociones');
    
    if (!promotionsData || !promotionsData.promociones || promotionsData.promociones.length === 0) {
        hidePromotionsSection();
        return;
    }
    
    let promotionsHTML = '';
    
    promotionsData.promociones.forEach(promo => {
        const hasOriginalPrice = promo.precio_original && promo.precio_original.trim() !== '';
        const buttonText = promo.id === 'descuento-familia' ? 'Reservar' : 'Pedir Ahora';
        
        promotionsHTML += `
            <div class="promotion-card">
                <div class="promotion-image">
                    <img src="${promo.imagen || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible'}" alt="${promo.nombre}">
                </div>
                <div class="promotion-content">
                    <h3>${promo.nombre}</h3>
                    <p>${promo.descripcion}</p>
                    <div class="promotion-price">
                        ${hasOriginalPrice ? `<span class="original-price">S/. ${promo.precio_original}</span>` : ''}
                        <span class="current-price">${promo.precio_actual.startsWith('S/.') ? promo.precio_actual : (promo.precio_actual.includes('%') ? promo.precio_actual : `S/. ${promo.precio_actual}`)}</span>
                    </div>
                    <a href="#" class="btn btn-primary" target="_blank" data-promo-id="${promo.id}" data-message="${promo.whatsapp_message}">${buttonText}</a>
                </div>
            </div>
        `;
    });
    
    promotionsGrid.innerHTML = promotionsHTML;
    
    // Agregar event listeners a los botones de promociones
    const promoButtons = promotionsGrid.querySelectorAll('.btn');
    promoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const promoId = btn.dataset.promoId;
            const message = btn.dataset.message;
            orderPromotion(promoId, message);
        });
    });
}

// Ocultar sección de promociones
function hidePromotionsSection() {
    const promotionsSection = document.getElementById('promociones');
    if (promotionsSection) {
        promotionsSection.style.display = 'none';
    }
}

// Pedir promoción
function orderPromotion(promoId, message) {
    const whatsappNumber = window.CONFIG_WHATSAPP_NUMBER || WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Cargar menú desde JSON
async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        menuData = await response.json();
        console.log('Menú cargado:', menuData);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
        throw error;
    }
}

// Cargar horarios desde JSON
async function loadHorarios() {
    try {
        const response = await fetch('horarios.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        horariosData = await response.json();
        console.log('Horarios cargados:', horariosData);
    } catch (error) {
        console.error('Error al cargar los horarios:', error);
        // Usar horarios por defecto si hay error
        horariosData = {
            desayuno: { dias: DAYS_OF_WEEK, horario: "8:00 AM - 11:00 AM", descripcion: "Desayunos tradicionales" },
            menu: { dias: DAYS_OF_WEEK, horario: "11:30 AM - 5:00 PM", descripcion: "Menú ejecutivo" },
            cena: { dias: ["viernes", "sabado", "domingo"], horario: "5:00 PM - 11:30 PM", descripcion: "Especialidades nocturnas" }
        };
    }
}

// Configurar navegación móvil
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Actualizar página con configuración
function updatePageWithConfig() {
    if (!configData) return;
    
    // Obtener número de WhatsApp desde configuración
    const whatsappNumber = configData.restaurante?.whatsapp || WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    
    // Actualizar versión en footer
    const versionElement = document.getElementById('version-info');
    if (versionElement && configData.version) {
        const version = configData.version;
        versionElement.innerHTML = `v${version.numero} (${version.fecha})`;
    }
    
    // Actualizar meta tags
    const titleElement = document.getElementById('page-title');
    const descriptionElement = document.getElementById('page-description');
    const keywordsElement = document.getElementById('page-keywords');
    
    if (titleElement && configData.seo?.title) {
        titleElement.textContent = configData.seo.title;
        document.title = configData.seo.title;
    }
    
    if (descriptionElement && configData.seo?.description) {
        descriptionElement.content = configData.seo.description;
    }
    
    if (keywordsElement && configData.seo?.keywords) {
        keywordsElement.content = configData.seo.keywords;
    }
    
    // Actualizar todos los enlaces de WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href="#"]');
    whatsappLinks.forEach(link => {
        if (link.id && (link.id.includes('whatsapp') || link.id.includes('hero') || link.id.includes('contacto') || link.id.includes('location'))) {
            link.href = whatsappUrl;
        }
    });
    
    // Actualizar enlaces específicos por ID
    const heroWhatsappLink = document.getElementById('hero-whatsapp');
    const locationWhatsappLink = document.getElementById('location-whatsapp');
    const contactoWhatsappLink = document.getElementById('contacto-whatsapp');
    
    if (heroWhatsappLink) heroWhatsappLink.href = whatsappUrl;
    if (locationWhatsappLink) locationWhatsappLink.href = whatsappUrl;
    if (contactoWhatsappLink) contactoWhatsappLink.href = whatsappUrl;
    
    // Actualizar dirección
    const direccionElement = document.getElementById('direccion');
    const footerDireccionElement = document.getElementById('footer-direccion');
    const contactoDireccionElement = document.getElementById('contacto-direccion');
    const direccion = configData.restaurante?.direccion || 'Dirección no disponible';
    
    if (direccionElement) direccionElement.textContent = direccion;
    if (footerDireccionElement) footerDireccionElement.textContent = direccion;
    if (contactoDireccionElement) contactoDireccionElement.textContent = direccion;
    
    // Actualizar WhatsApp en footer
    const footerWhatsappElement = document.getElementById('footer-whatsapp');
    if (footerWhatsappElement) {
        footerWhatsappElement.textContent = `+51 ${whatsappNumber.substring(2)}`;
    }
    
    // Actualizar mapa
    const mapsLink = document.getElementById('maps-link');
    const mapsIframe = document.getElementById('maps-iframe');
    
    if (mapsLink && configData.ubicacion?.maps_url) {
        mapsLink.href = configData.ubicacion.maps_url;
    }
    
    if (mapsIframe && configData.ubicacion?.maps_embed) {
        mapsIframe.src = configData.ubicacion.maps_embed;
    }
    
    // Actualizar imágenes dinámicamente
    const aboutImage = document.getElementById('about-img');
    const promoComboImage = document.getElementById('promo-combo-img');
    const promoBebidasImage = document.getElementById('promo-bebidas-img');
    const promoFamiliaImage = document.getElementById('promo-familia-img');
    
    const imageUrl = configData.imagenes?.restaurante || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible';
    
    if (aboutImage) aboutImage.src = imageUrl;
    if (promoComboImage) promoComboImage.src = imageUrl;
    if (promoBebidasImage) promoBebidasImage.src = imageUrl;
    if (promoFamiliaImage) promoFamiliaImage.src = imageUrl;
    
    // Actualizar imagen de fallback
    const fallbackImageUrl = configData.imagenes?.fallback || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible';
    
    // Actualizar variable global para uso en otras funciones
    window.CONFIG_FALLBACK_IMAGE = fallbackImageUrl;
    window.CONFIG_WHATSAPP_NUMBER = whatsappNumber;
}

// Configurar tabs de servicios
function setupServiceTabs() {
    const serviceButtons = document.querySelectorAll('.service-tab-btn');
    
    serviceButtons.forEach(btn => {
        const service = btn.dataset.service;
        
        // Marcar servicio actual
        if (service === currentService) {
            btn.classList.add('current');
        }
        
        btn.addEventListener('click', () => {
            // Remover clase active y current de todos los botones
            serviceButtons.forEach(b => {
                b.classList.remove('active', 'current');
            });
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Mostrar servicio seleccionado
            showService(service);
        });
    });
    
    // Activar automáticamente el tab del servicio actual
    const currentTab = document.querySelector(`.service-tab-btn[data-service="${currentService}"]`);
    if (currentTab) {
        currentTab.classList.add('active');
    }
}

// Mostrar servicio específico
function showService(service) {
    // Actualizar información del servicio
    updateServiceInfo(service);
    
    // Mostrar/ocultar galería de días según el servicio
    const daysGallery = document.getElementById('days-gallery');
    
    if (service === 'desayuno' || service === 'cena') {
        // Ocultar galería de días para desayuno y cena
        daysGallery.style.display = 'none';
        showServiceMenu(service);
    } else {
        // Mostrar galería de días para menú del día
        daysGallery.style.display = 'flex';
        setupDaysGallery();
        showDayMenuMenu(currentDay);
    }
}

// Configurar galería de días
function setupDaysGallery() {
    const daysGallery = document.getElementById('days-gallery');
    
    if (!menuData || !menuData.menu) {
        daysGallery.innerHTML = '<p>No hay menú disponible</p>';
        return;
    }
    
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    let galleryHTML = '';
    
    days.forEach(day => {
        if (menuData.menu[day]) {
            const isToday = day === currentDay;
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            
            galleryHTML += `
                <div class="day-card ${isToday ? 'today' : ''} ${day === currentDay ? 'active' : ''}" data-day="${day}">
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${menuData.menu[day].length} platos</div>
                </div>
            `;
        }
    });
    
    daysGallery.innerHTML = galleryHTML;
    
    // Agregar event listeners a las tarjetas de días
    const dayCards = daysGallery.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        card.addEventListener('click', () => {
            const day = card.dataset.day;
            
            // Remover clase active de todas las tarjetas
            dayCards.forEach(c => c.classList.remove('active'));
            
            // Agregar clase active a la tarjeta clickeada
            card.classList.add('active');
            
            // Mostrar menú del día seleccionado
            showDayMenuMenu(day);
        });
    });
}

// Actualizar información del servicio
function updateServiceInfo(service) {
    const serviceInfo = document.getElementById('service-info');
    
    if (!horariosData || !horariosData[service]) {
        serviceInfo.innerHTML = '';
        return;
    }
    
    const serviceData = horariosData[service];
    const isAvailable = serviceData.dias.includes(currentDay);
    
    let availabilityText = '';
    if (!isAvailable) {
        if (service === 'cena') {
            availabilityText = `<p style="color: var(--color-warm-light);">⚠️ La cena solo está disponible viernes, sábado y domingo</p>`;
        }
    }
    
    serviceInfo.innerHTML = `
        <h3>${getServiceDisplayName(service)}</h3>
        <p><strong>Horario:</strong> ${serviceData.horario}</p>
        <p>${serviceData.descripcion}</p>
        ${availabilityText}
    `;
}

// Mostrar menú de servicio (desayuno o cena)
function showServiceMenu(service) {
    const container = document.getElementById('menu-container');
    
    if (!menuData || !menuData[service]) {
        container.innerHTML = `
            <div class="no-menu">
                <h3>Menú no disponible</h3>
                <p>Lo sentimos, no hay platos disponibles para ${getServiceDisplayName(service)}.</p>
            </div>
        `;
        return;
    }
    
    const dishes = menuData[service];
    const isCurrent = service === currentService;
    
    container.innerHTML = dishes.map(dish => createDishCard(dish, isCurrent)).join('');
    
    // Agregar animación de entrada
    const cards = container.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Mostrar menú del día (para servicio de menú)
function showDayMenuMenu(day) {
    const container = document.getElementById('menu-container');
    
    if (!menuData || !menuData[day]) {
        container.innerHTML = `
            <div class="no-menu">
                <h3>Menú no disponible hoy</h3>
                <p>Lo sentimos, no hay platos disponibles para ${getDayDisplayName(day)}.</p>
            </div>
        `;
        return;
    }
    
    // Primero mostrar tabs de días
    const dayTabs = DAYS_OF_WEEK.map(d => `
        <button class="tab-btn ${d === day ? 'active' : ''}" data-day="${d}">
            ${getDayDisplayName(d)}
        </button>
    `).join('');
    
    container.innerHTML = `
        <div class="menu-tabs">
            ${dayTabs}
        </div>
        <div class="menu-dishes">
            ${menuData[day].map(dish => createDishCard(dish, true)).join('')}
        </div>
    `;
    
    // Configurar tabs de días
    setupDayTabs();
    
    // Agregar animación de entrada
    const cards = container.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Configurar tabs de días (para menú del día)
function setupDayTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        const day = btn.dataset.day;
        
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Mostrar menú del día seleccionado
            showDayDishes(day);
        });
    });
}

// Mostrar platos de un día específico
function showDayDishes(day) {
    const dishesContainer = document.querySelector('.menu-dishes');
    
    if (!menuData || !menuData[day]) {
        dishesContainer.innerHTML = `
            <div class="no-menu">
                <h3>Menú no disponible</h3>
                <p>No hay platos disponibles para ${getDayDisplayName(day)}.</p>
            </div>
        `;
        return;
    }
    
    dishesContainer.innerHTML = menuData[day].map(dish => createDishCard(dish, false)).join('');
    
    // Agregar animación de entrada
    const cards = dishesContainer.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Crear tarjeta de plato
function createDishCard(dish, isToday) {
    return `
        <div class="menu-card ${isToday ? 'today' : ''}" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
            <div class="menu-image-container">
                <img src="${dish.imagen}" alt="${dish.nombre}" class="menu-image" 
                     onerror="this.src=window.CONFIG_FALLBACK_IMAGE || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Imagen+no+disponible'">
            </div>
            <div class="menu-content">
                <h3 class="menu-title">${dish.nombre}</h3>
                <p class="menu-description">${dish.descripcion}</p>
                <div class="menu-price">S/. ${dish.precio}</div>
                <div class="menu-buttons">
                    <button class="btn btn-primary" onclick="orderDish('${dish.nombre}', '${dish.descripcion}', '${dish.precio}', '${dish.imagen}')">
                        Pedir este plato
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Pedir plato por WhatsApp
function orderDish(name, description, price, image) {
    // Usar número de WhatsApp desde configuración global
    const whatsappNumber = window.CONFIG_WHATSAPP_NUMBER || WHATSAPP_NUMBER;
    const message = `Hola, quiero pedir:

🍽️ ${name}
📝 ${description}
💰 S/. ${price}

📸 ${image}

📍 Para recojo`;
    
    // Codificar el mensaje correctamente para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Registrar evento de analytics (si está disponible)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'order_attempt', {
            'event_category': 'engagement',
            'event_label': name,
            'value': parseFloat(price)
        });
    }
}

// ===== FUNCIONES AUXILIARES =====

// Obtener nombre para mostrar del día
function getDayDisplayName(day) {
    const dayNames = {
        'lunes': 'Lunes',
        'martes': 'Martes',
        'miercoles': 'Miércoles',
        'jueves': 'Jueves',
        'viernes': 'Viernes',
        'sabado': 'Sábado',
        'domingo': 'Domingo'
    };
    return dayNames[day] || day;
}

// Obtener nombre para mostrar del servicio
function getServiceDisplayName(service) {
    const serviceNames = {
        'desayuno': 'Desayuno',
        'menu': 'Menú del Día',
        'cena': 'Cena'
    };
    return serviceNames[service] || service;
}

// Mostrar mensaje de error
function showError(message) {
    const container = document.getElementById('menu-container');
    container.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Recargar página</button>
        </div>
    `;
}

// ===== ANIMACIONES AL SCROLL =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll(
        '.section-header, .menu-card, .promotion-card, .about-content, .location-content, .contact-item'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ===== UTILIDADES =====

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cambiar estilo de navbar al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Preload de imágenes
function preloadImages() {
    if (!menuData) return;
    
    Object.values(menuData).forEach(dishes => {
        dishes.forEach(dish => {
            const img = new Image();
            img.src = dish.imagen;
        });
    });
}

// Lazy loading para imágenes
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada no manejada:', e.reason);
});

// ===== PERFORMANCE =====

// Debounce function para optimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos de scroll
const debouncedScroll = debounce(() => {
    // Lógica de scroll optimizada
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===== ACCESIBILIDAD =====

// Manejo de teclado para navegación
document.addEventListener('keydown', function(e) {
    // Escape para cerrar menú móvil
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Focus management para accesibilidad
function setupAccessibility() {
    // Asegurar que los botones sean accesibles
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Añadir atributos ARIA a los tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn, index) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', btn.classList.contains('active'));
        btn.setAttribute('aria-controls', `menu-panel-${index}`);
    });
}

// Inicializar accesibilidad
setupAccessibility();

// ===== FUNCIONES DE DEBUG =====

// Función para recargar menú (útil para desarrollo)
function reloadMenu() {
    Promise.all([
        loadMenu(),
        loadHorarios()
    ]).then(() => {
        currentService = getCurrentService();
        showService(currentService);
        console.log('Menú y horarios recargados');
        console.log('Servicio actual:', currentService);
    }).catch(error => {
        console.error('Error al recargar menú:', error);
    });
}

// Exponer funciones útiles globalmente para debugging
window.ElMana = {
    reloadMenu,
    getCurrentDay,
    getCurrentService,
    getServiceDisplayName,
    orderDish,
    menuData: () => menuData,
    horariosData: () => horariosData
};

// ===== INITIALIZATION COMPLETE =====
console.log('🍽️ El Maná - Sistema de pedidos listo');
console.log('📅 Día actual:', getDayDisplayName(currentDay));
console.log('⏰ Servicio actual:', getServiceDisplayName(currentService));
