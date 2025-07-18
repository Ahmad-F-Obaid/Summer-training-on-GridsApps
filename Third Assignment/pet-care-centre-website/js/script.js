/**
 * PetCare Centre - Enhanced JavaScript Functionality
 * This file contains additional JavaScript features for improved user experience
 */

// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Enhanced Navigation
class EnhancedNavigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('nav a');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffect();
        this.setupActiveLink();
        this.setupKeyboardNavigation();
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.mobileMenuBtn.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !this.mobileMenu.classList.contains('hidden')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
        this.mobileMenuBtn.setAttribute('aria-expanded', 
            this.mobileMenu.classList.contains('hidden') ? 'false' : 'true'
        );
    }

    closeMobileMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    setupScrollEffect() {
        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 50) {
                this.nav.classList.add('shadow-lg');
            } else {
                this.nav.classList.remove('shadow-lg');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('text-pet-blue', 'bg-blue-100');
                link.classList.remove('text-gray-700');
            }
        });
    }

    setupKeyboardNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
}

// Form Enhancement
class FormEnhancement {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupValidation();
        this.setupRealTimeValidation();
        this.setupAccessibility();
    }

    setupValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', utils.debounce(() => {
                this.clearFieldError(input);
            }, 300));
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Phone validation
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id || 'error-' + field.name);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupAccessibility() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const label = this.form.querySelector(`label[for="${input.id}"]`);
            if (label && !input.getAttribute('aria-labelledby')) {
                input.setAttribute('aria-labelledby', label.id || 'label-' + input.name);
            }
        });
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            this.form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Focus on success message for screen readers
            successMessage.setAttribute('tabindex', '-1');
            successMessage.focus();
        }
    }
}

// Gallery Enhancement
class GalleryEnhancement {
    constructor() {
        this.gallery = document.getElementById('gallery-grid');
        this.filterButtons = document.querySelectorAll('.gallery-filter');
        this.modal = document.getElementById('imageModal');
        
        if (this.gallery) {
            this.init();
        }
    }

    init() {
        this.setupFiltering();
        this.setupModal();
        this.setupKeyboardNavigation();
    }

    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterGallery(filter);
                this.updateActiveFilter(button);
            });
        });
    }

    filterGallery(filter) {
        const items = this.gallery.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const shouldShow = filter === 'all' || item.classList.contains(filter);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active', 'bg-pet-blue', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        activeButton.classList.add('active', 'bg-pet-blue', 'text-white');
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
    }

    setupModal() {
        if (!this.modal) return;

        const galleryItems = this.gallery.querySelectorAll('.gallery-item');
        const closeBtn = this.modal.querySelector('#closeModal');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openModal(item);
            });
        });

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking backdrop
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal(item) {
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const emoji = item.querySelector('.text-6xl').textContent;
        
        this.modal.querySelector('#modalTitle').textContent = title;
        this.modal.querySelector('#modalContent').textContent = emoji;
        this.modal.querySelector('#modalDescription').textContent = description;
        
        this.modal.classList.remove('hidden');
        this.modal.querySelector('#closeModal').focus();
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
}

// Animation Enhancement
class AnimationEnhancement {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupParallaxEffect();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-animate');
                    
                    element.classList.add('animate__animated', `animate__${animation}`);
                    observer.unobserve(element);
                }
            });
        }, this.observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'));
                    
                    this.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, this.observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }

    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }
}

// Performance Optimization
class PerformanceOptimization {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

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

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupPreloading() {
        // Preload critical resources
        const criticalResources = [
            'https://cdn.tailwindcss.com'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'script';
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Accessibility Enhancement
class AccessibilityEnhancement {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupKeyboardNavigation();
    }

    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only focus:not-sr-only';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content id if it doesn't exist
        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    setupFocusManagement() {
        // Focus management for modal dialogs
        const modals = document.querySelectorAll('[role="dialog"]');
        
        modals.forEach(modal => {
            modal.addEventListener('show', () => {
                this.trapFocus(modal);
            });
        });
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    setupAriaLabels() {
        // Add aria-labels to buttons without text
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                const icon = button.querySelector('svg, i');
                if (icon) {
                    button.setAttribute('aria-label', 'Button');
                }
            }
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedNavigation();
    new FormEnhancement('contactForm');
    new GalleryEnhancement();
    new AnimationEnhancement();
    new PerformanceOptimization();
    new AccessibilityEnhancement();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedNavigation,
        FormEnhancement,
        GalleryEnhancement,
        AnimationEnhancement,
        PerformanceOptimization,
        AccessibilityEnhancement,
        utils
    };
}
