document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
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
       DYNAMIC VIDEO LIGHTBOX MODAL
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const mediaContainer = document.getElementById('modal-media-container');
    const portfolioCards = document.querySelectorAll('.portfolio-card, .showcase-card');

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            // Retrieve video data parameters
            // If it's the hero showcase card, we can hardcode or default to a standard placeholder video
            let videoType = card.getAttribute('data-video-type') || 'youtube';
            let videoSrc = card.getAttribute('data-video-src') || 'https://youtu.be/dQw4w9WgXcQ?si=5CL4OvqdjkRU7er7';

            mediaContainer.innerHTML = ''; // Clear previous content

            if (videoType === 'youtube') {
                window.open(videoSrc, '_blank', 'noopener,noreferrer');
                return;
            } else if (videoType === 'direct') {
                mediaContainer.innerHTML = `
        <video controls autoplay name="media">
            <source src="${videoSrc}" type="video/mp4">
            Tu navegador no soporta reproducción de videos HTML5.
        </video>
    `;
            } else if (videoType === 'direct') {
                // For direct mp4 video references
                mediaContainer.innerHTML = `
                    <video controls autoplay name="media">
                        <source src="${videoSrc}" type="video/mp4">
                        Tu navegador no soporta reproducción de videos HTML5.
                    </video>
                `;
            }

            // Open modal
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevents scrolling while watching
        });
    });

    function closeModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Timeout to allow transitions to complete before removing the element src (preventing audio leaks)
        setTimeout(() => {
            mediaContainer.innerHTML = '';
        }, 300);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside content (overlay)
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }

    // Keyboard ESC key to close modal
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
