/* ==========================================================================
   PORTFOLIO DATA — Sincronización con localStorage (gestionado en admin.html)
   ========================================================================== */
const _DEFAULT_ITEMS = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : [];

function _getPortfolioItems() {
    return _DEFAULT_ITEMS;
}

function _renderPortfolioGrid() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    const items = _getPortfolioItems().sort((a, b) => a.order - b.order);
    const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='400' height='225' fill='%231a1f35'/%3E%3Ctext x='200' y='120' font-size='14' fill='%235c6480' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

    grid.innerHTML = items.map(item => `
        <div class="portfolio-item" data-category="${_esc(item.category)}"
             style="transition: opacity 0.35s ease, transform 0.35s ease;">
            <div class="portfolio-card"
                 data-video-type="${_esc(item.videoType)}"
                 data-video-src="${_esc(item.videoSrc)}">
                <div class="portfolio-thumbnail">
                    <img src="${_esc(item.thumbnail)}"
                         alt="${_esc(item.title)}"
                         class="thumbnail-img"
                         onerror="this.src='${FALLBACK}'">
                    <div class="card-overlay">
                        <span class="play-btn"><i data-lucide="play"></i></span>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="project-tag">${_esc(item.tag)}</span>
                    <h3 class="project-title">${_esc(item.title)}</h3>
                    <p class="project-desc">${_esc(item.description)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function _esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function _initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const group = track ? track.querySelector('.testimonials-group') : null;
    if (!track || !group) return;

    // Duplicar grupo para bucle infinito perfecto si solo existe uno
    if (track.children.length === 1) {
        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    }
}

/* ==========================================================================
   MAIN — DOMContentLoaded
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizar portafolio desde localStorage (antes de Lucide)
    _renderPortfolioGrid();

    // 2. Inicializar carrusel automático de testimonios (clonación para loop infinito)
    _initTestimonialsCarousel();

    // 3. Initialize Lucide Icons (incluye los íconos recién creados y clonados)
    lucide.createIcons();

    /* ==========================================================================
       MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevents scrolling behind menu
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile nav when clicking outside of it
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('open')) {
            if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    /* ==========================================================================
       STICKY HEADER & SCROLL HIGHLIGHT
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(7, 10, 19, 0.95)';
        } else {
            navbar.style.padding = '0';
            navbar.style.background = 'rgba(7, 10, 19, 0.75)';
        }

        // Scroll highlight nav items
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       PORTFOLIO FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            const portfolioGrid = document.querySelector('.portfolio-grid');
            if (portfolioGrid) {
                portfolioGrid.setAttribute('data-active-filter', filterValue);
            }

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                // Reset animations/display
                item.style.transform = 'scale(0.85)';
                item.style.opacity = '0';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        // Trigger reflow
                        item.offsetHeight;
                        item.style.transform = 'scale(1)';
                        item.style.opacity = '1';
                    } else {
                        item.style.display = 'none';
                    }
                }, 200); // Small timeout to match scaling animations transition
            });
        });
    });

    /* ==========================================================================
       DYNAMIC VIDEO LIGHTBOX MODAL (Soporte integrado para YouTube)
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const mediaContainer = document.getElementById('modal-media-container');

    // Helper: extrae el ID del video de YouTube desde cualquier formato de URL o ID directo
    function parseYouTubeId(input) {
        if (!input) return '';
        const str = input.trim();
        // youtu.be/<id>
        let match = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // youtube.com/watch?v=<id> o ?...&v=<id>
        match = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // youtube.com/shorts/<id>
        match = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // youtube.com/embed/<id>
        match = str.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // youtube.com/live/<id>
        match = str.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
        // Si ya es un ID de 11 caracteres
        if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
        return '';
    }

    // Helper: extrae el ID del video de cualquier formato de URL de Dailymotion (compatibilidad)
    function parseDailymotionId(input) {
        if (!input) return '';
        let match = input.match(/dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/);
        if (match) return match[1];
        match = input.match(/dai\.ly\/([a-zA-Z0-9]+)/);
        if (match) return match[1];
        if (/^[a-zA-Z0-9]+$/.test(input.trim())) return input.trim();
        return input;
    }

    /* ------------------------------------------------------------------
       CLICK HANDLER — abre el modal con el reproductor al hacer click
    ------------------------------------------------------------------ */
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.portfolio-card, .showcase-card');
        if (!card) return;

        let videoType = card.getAttribute('data-video-type') || 'youtube';
        let videoSrc = card.getAttribute('data-video-src') || 'https://youtu.be/KwEudPJSdHQ';

        mediaContainer.innerHTML = ''; // Limpiar contenido previo

        // Si es enlace a TikTok, abrir directamente en nueva pestaña para mejor experiencia
        if (videoSrc.includes('tiktok.com')) {
            window.open(videoSrc, '_blank', 'noopener,noreferrer');
            return;
        }

        const ytId = parseYouTubeId(videoSrc);

        if (videoType === 'youtube' || ytId) {
            const videoId = ytId || videoSrc;
            mediaContainer.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    style="width:100%;height:100%;position:absolute;top:0;left:0;"
                    title="Reproductor de Video YouTube">
                </iframe>
            `;
        } else if (videoType === 'dailymotion') {
            const dmId = parseDailymotionId(videoSrc);
            mediaContainer.innerHTML = `
                <iframe
                    src="https://www.dailymotion.com/embed/video/${dmId}?autoplay=1&mute=0&ui-highlight=9b59b6&ui-logo=0"
                    frameborder="0"
                    allowfullscreen
                    allow="autoplay; fullscreen"
                    style="width:100%;height:100%;position:absolute;top:0;left:0;"
                    title="Dailymotion Video Player">
                </iframe>
            `;
        } else if (videoType === 'direct') {
            mediaContainer.innerHTML = `
                <video controls autoplay name="media">
                    <source src="${videoSrc}" type="video/mp4">
                    Tu navegador no soporta reproducción de videos HTML5.
                </video>
            `;
        } else {
            window.open(videoSrc, '_blank', 'noopener,noreferrer');
            return;
        }

        // Abrir modal
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        mediaContainer.innerHTML = ''; // Detiene el audio y video inmediatamente
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Cerrar modal al hacer click fuera del contenido (overlay)
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }

    // Tecla Escape para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simple visual loading effect
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;

            // Simulate form submission and redirect to WhatsApp
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                // Show success status
                formStatus.className = 'form-status success';
                formStatus.innerText = '¡Redirigiendo a WhatsApp...!';

                // Format message for WhatsApp
                const name = data['name'] || '';
                const email = data['email'] || '';
                const projectType = data['project-type'] || '';
                const message = data['message'] || '';

                let formattedType = projectType;
                if (projectType === 'youtube') formattedType = 'Videos Largos (YouTube)';
                else if (projectType === 'shorts') formattedType = 'Cortos (Reels / TikTok)';
                else if (projectType === 'comercial') formattedType = 'Comercial / Promo';
                else if (projectType === 'otro') formattedType = 'Otro';

                const text = `Hola Beymar, mi nombre es ${name} (${email}). Me interesa un proyecto de tipo: ${formattedType}. Detalles: ${message}`;
                const waUrl = `https://wa.me/59175254640?text=${encodeURIComponent(text)}`;

                // Open WhatsApp in a new tab
                window.open(waUrl, '_blank');

                // Clear fields
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerText = '';
                    formStatus.className = 'form-status';
                }, 5000);

            }, 1000); // Simulated delay
        });
    }
});
