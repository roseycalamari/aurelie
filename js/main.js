/**
 * ============================================================
 * KINÉ, PREV'ACTION - MAIN JAVASCRIPT
 * Vanilla JS for language switching and UI interactions
 * ============================================================
 */

(function() {
    'use strict';

    // ==================== DOM ELEMENTS ====================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const langBtns = document.querySelectorAll('.lang-btn');
    const currentYearEl = document.getElementById('current-year');
    const backToTopBtn = document.getElementById('back-to-top');

    // Current language state
    let currentLang = 'fr';

    // ==================== INITIALIZATION ====================
    function init() {
        setCurrentYear();
        initScrollHeader();
        initMobileMenu();
        initLanguageSwitcher();
        initSmoothScroll();
        initIntersectionObserver();
        initTouchSupport();
        initBackToTop();
    }

    // ==================== SET CURRENT YEAR ====================
    /**
     * Sets the current year in the footer copyright
     */
    function setCurrentYear() {
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }

    // ==================== SCROLL HEADER ====================
    /**
     * Adds shadow to header on scroll and shows/hides back to top button
     */
    function initScrollHeader() {
        function handleScroll() {
            const scrollY = window.scrollY;
            
            // Header shadow
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top button visibility
            if (backToTopBtn) {
                if (scrollY > 400) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        }

        // Initial check
        handleScroll();

        // Throttled scroll listener using requestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ==================== MOBILE MENU ====================
    /**
     * Handles mobile navigation menu toggle
     */
    function initMobileMenu() {
        // Open menu
        if (navToggle) {
            navToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                openMenu();
            });
        }

        // Close menu
        if (navClose) {
            navClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close menu on nav link click
        navLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on click outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Prevent scrolling when menu is open
        function openMenu() {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            navClose.focus();
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
    }

    // ==================== LANGUAGE SWITCHER ====================
    /**
     * Handles language switching between FR and EN
     * Content is stored in data-fr and data-en attributes
     */
    function initLanguageSwitcher() {
        langBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const lang = this.dataset.lang;
                
                if (lang === currentLang) return;
                
                currentLang = lang;
                
                // Update active button state
                langBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                // Update HTML lang attribute
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
        // Select all elements with data-fr and data-en attributes
        const translatableElements = document.querySelectorAll('[data-fr][data-en]');
        
        translatableElements.forEach(function(el) {
            const translation = el.dataset[lang];
            
            if (translation) {
                // Check if it's an input element (button, etc.)
                if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                    el.textContent = translation;
                } 
                // Check if element contains HTML (like <br> tags)
                else if (translation.includes('<br>') || translation.includes('<')) {
                    el.innerHTML = translation;
                } 
                // Regular text content
                else {
                    el.textContent = translation;
                }
            }
        });
    }

    // ==================== SMOOTH SCROLL ====================
    /**
     * Handles smooth scrolling to anchor links with header offset
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== INTERSECTION OBSERVER ====================
    /**
     * Adds animation classes when sections come into view
     */
    function initIntersectionObserver() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) return;

        const sections = document.querySelectorAll('section');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // ==================== TOUCH SUPPORT ====================
    /**
     * Improves touch interactions on mobile devices
     */
    function initTouchSupport() {
        // Add touch-friendly class to body
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }

        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('.btn, .lang-btn, .nav__toggle, .nav__close, .back-to-top');
        buttons.forEach(function(btn) {
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }

    // ==================== BACK TO TOP ====================
    /**
     * Handles smooth scroll back to top
     */
    function initBackToTop() {
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for performance optimization
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} - Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // ==================== VIEWPORT HEIGHT FIX ====================
    /**
     * Fixes 100vh on mobile browsers (accounts for URL bar)
     */
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set on load and resize
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 100));

    // ==================== RUN INITIALIZATION ====================
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
