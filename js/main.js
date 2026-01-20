/**
 * ============================================================
 * KINÉ, PREV'ACTION - MAIN JAVASCRIPT
 * Smooth interactions, language switching, and animations
 * Vanilla JS - No frameworks or libraries
 * ============================================================
 */

(function() {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const elements = {
        // Header & Navigation
        header: document.getElementById('header'),
        menuToggle: document.getElementById('menu-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileLinks: document.querySelectorAll('.mobile-menu__link'),
        navLinks: document.querySelectorAll('.nav__link'),
        
        // Language
        langBtns: document.querySelectorAll('.lang-switch__btn'),
        
        // Accordions & Ateliers
        accordionItems: document.querySelectorAll('.accordion__item'),
        atelierCards: document.querySelectorAll('.atelier-card'),
        
        // Back to top
        backToTop: document.getElementById('back-to-top'),
        
        // Footer
        currentYear: document.getElementById('current-year'),
        
        // All translatable elements
        translatables: document.querySelectorAll('[data-fr][data-en]')
    };

    // Current language state
    let currentLang = 'fr';

    // ==================== INITIALIZATION ====================
    function init() {
        setCurrentYear();
        initHeader();
        initMobileMenu();
        initLanguageSwitcher();
        initSmoothScroll();
        initAccordions();
        initAtelierCards();
        initBackToTop();
        initRevealAnimations();
        initTouchOptimization();
        initLightbox();
    }

    // ==================== SET CURRENT YEAR ====================
    function setCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    // ==================== HEADER ====================
    /**
     * Handles header scroll effects
     */
    function initHeader() {
        let lastScrollY = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;
            
            // Add scrolled class for shadow
            if (scrollY > 50) {
                elements.header.classList.add('header--scrolled');
            } else {
                elements.header.classList.remove('header--scrolled');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }

        // Initial check
        updateHeader();

        // Throttled scroll listener
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ==================== MOBILE MENU ====================
    /**
     * Handles mobile menu toggle and interactions
     */
    function initMobileMenu() {
        if (!elements.menuToggle || !elements.mobileMenu) return;

        // Toggle menu
        elements.menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu on link click
        elements.mobileLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on click outside
        document.addEventListener('click', function(e) {
            if (elements.mobileMenu.classList.contains('active') && 
                !elements.mobileMenu.contains(e.target) && 
                !elements.menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    function toggleMenu() {
        const isOpen = elements.mobileMenu.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        elements.mobileMenu.classList.add('active');
        elements.menuToggle.classList.add('active');
        elements.menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        elements.mobileMenu.classList.remove('active');
        elements.menuToggle.classList.remove('active');
        elements.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // ==================== LANGUAGE SWITCHER ====================
    /**
     * Handles language switching between FR and EN
     */
    function initLanguageSwitcher() {
        elements.langBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const lang = this.dataset.lang;
                
                if (lang === currentLang) return;
                
                currentLang = lang;
                
                // Update active button state
                elements.langBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                // Update HTML lang attribute (triggers CSS language rules)
                document.documentElement.lang = lang;

                // Switch all translatable content
                switchLanguage(lang);
            });
        });
    }

    /**
     * Switches all text content to the selected language
     * @param {string} lang - Language code ('fr' or 'en')
     */
    function switchLanguage(lang) {
        elements.translatables.forEach(function(el) {
            const translation = el.dataset[lang];
            
            // Only update if translation exists and is not empty
            if (translation) {
                // Check if element contains HTML (like <br> tags)
                if (translation.includes('<br>') || translation.includes('<')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    }

    // ==================== SMOOTH SCROLL ====================
    /**
     * Handles smooth scrolling to anchor links
     */
    function initSmoothScroll() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        
        allLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    closeMenu();
                    
                    // Calculate offset
                    const headerHeight = elements.header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== ACCORDIONS (Why Invest Section) ====================
    /**
     * Handles accordion open/close with smooth animations
     */
    function initAccordions() {
        elements.accordionItems.forEach(function(item) {
            const header = item.querySelector('.accordion__header');
            const content = item.querySelector('.accordion__content');
            
            if (!header || !content) return;
            
            header.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close all other accordions (optional - comment out for multiple open)
                elements.accordionItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        const otherHeader = otherItem.querySelector('.accordion__header');
                        const otherContent = otherItem.querySelector('.accordion__content');
                        if (otherHeader && otherContent) {
                            otherHeader.setAttribute('aria-expanded', 'false');
                            otherContent.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current accordion
                this.setAttribute('aria-expanded', !isExpanded);
                content.classList.toggle('active');
            });
        });
    }

    // ==================== ATELIER CARDS ====================
    /**
     * Handles atelier card expansion
     */
    function initAtelierCards() {
        elements.atelierCards.forEach(function(card) {
            const toggle = card.querySelector('.atelier-card__toggle');
            const content = card.querySelector('.atelier-card__content');
            
            if (!toggle || !content) return;
            
            // Make entire header clickable
            const header = card.querySelector('.atelier-card__header');
            
            header.addEventListener('click', function() {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Close all other cards first
                elements.atelierCards.forEach(function(otherCard) {
                    if (otherCard !== card) {
                        const otherToggle = otherCard.querySelector('.atelier-card__toggle');
                        const otherContent = otherCard.querySelector('.atelier-card__content');
                        if (otherToggle && otherContent) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                            otherContent.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current card
                toggle.setAttribute('aria-expanded', !isExpanded);
                content.classList.toggle('active');
            });
        });
    }

    // ==================== BACK TO TOP ====================
    /**
     * Handles back to top button visibility and click
     */
    function initBackToTop() {
        if (!elements.backToTop) return;

        let ticking = false;

        function updateButton() {
            if (window.scrollY > 500) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
            ticking = false;
        }

        // Initial check
        updateButton();

        // Scroll listener
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateButton);
                ticking = true;
            }
        }, { passive: true });

        // Click handler
        elements.backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================== REVEAL ANIMATIONS ====================
    /**
     * Adds reveal animations when elements enter viewport
     */
    function initRevealAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;

        // Elements to animate
        const revealElements = document.querySelectorAll(
            '.section-label, .section-title, .about__image-wrapper, .about__text, .about__stats, ' +
            '.kine__card, .atelier-card, .gallery__item, .accordion__item, .contact__item, ' +
            '.contact__card, .hero__badge, .hero__title, .hero__description, .hero__cta, .hero__visual'
        );

        // Add reveal class
        revealElements.forEach(function(el) {
            el.classList.add('reveal');
        });

        // Observer options
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        // Create observer
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const siblings = Array.from(parent.children).filter(function(child) {
                            return child.classList.contains('reveal');
                        });
                        const index = siblings.indexOf(entry.target);
                        if (index > 0) {
                            entry.target.style.transitionDelay = (index * 80) + 'ms';
                        }
                    }
                    
                    entry.target.classList.add('visible');
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements
        revealElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ==================== TOUCH OPTIMIZATION ====================
    /**
     * Optimizes touch interactions for mobile
     */
    function initTouchOptimization() {
        // Add touch class to body
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }

        // Prevent double-tap zoom on buttons
        const interactiveElements = document.querySelectorAll(
            '.btn, .lang-switch__btn, .menu-toggle, .back-to-top, .accordion__header, .atelier-card__header'
        );
        
        interactiveElements.forEach(function(el) {
            el.addEventListener('touchend', function(e) {
                // Only prevent default if this is a tap (not a scroll)
                if (e.cancelable) {
                    e.preventDefault();
                    this.click();
                }
            }, { passive: false });
        });
    }

    // ==================== LIGHTBOX ====================
    /**
     * Handles image lightbox for gallery
     */
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.getElementById('lightbox-close');
        const galleryImages = document.querySelectorAll('[data-lightbox]');

        if (!lightbox || !lightboxImage || !lightboxClose) return;

        // Open lightbox on image click
        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                lightboxImage.src = this.src;
                lightboxImage.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox on close button click
        lightboxClose.addEventListener('click', closeLightbox);

        // Close lightbox on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close lightbox on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Clear image after transition
            setTimeout(function() {
                lightboxImage.src = '';
            }, 400);
        }
    }

    // ==================== VIEWPORT HEIGHT FIX ====================
    /**
     * Fixes 100vh on mobile browsers (accounts for URL bar)
     */
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Set on load and resize
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 100));

    // ==================== PAGE LOAD ANIMATION ====================
    /**
     * Triggers hero animations after page load
     */
    function initPageLoadAnimation() {
        // Add loaded class to body after a small delay
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 100);
    }

    // ==================== RUN INITIALIZATION ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initPageLoadAnimation();
        });
    } else {
        init();
        initPageLoadAnimation();
    }

})();
