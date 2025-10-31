// Mobile Navigation Script - Works on all pages
class MobileNavigation {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupMobileNavigation());
        } else {
            this.setupMobileNavigation();
        }
    }

    setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        console.log('Setting up mobile navigation...');
        console.log('navToggle found:', !!navToggle);
        console.log('navMenu found:', !!navMenu);
        
        if (navToggle && navMenu) {
            // Remove any existing event listeners by cloning elements
            this.removeExistingListeners(navToggle, navMenu);
            
            // Add new event listeners
            this.addEventListeners(navToggle, navMenu);
            
            console.log('Mobile navigation setup complete!');
        } else {
            console.log('Mobile navigation elements not found!');
        }
    }

    removeExistingListeners(navToggle, navMenu) {
        // Clone elements to remove existing event listeners
        const newNavToggle = navToggle.cloneNode(true);
        const newNavMenu = navMenu.cloneNode(true);
        
        // Replace old elements with new ones
        navToggle.parentNode.replaceChild(newNavToggle, navToggle);
        navMenu.parentNode.replaceChild(newNavMenu, navMenu);
        
        // Update references
        this.navToggle = newNavToggle;
        this.navMenu = newNavMenu;
    }

    addEventListeners(navToggle, navMenu) {
        // Toggle mobile menu
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile toggle clicked!');
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize mobile navigation
let mobileNav;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileNav = new MobileNavigation();
    });
} else {
    mobileNav = new MobileNavigation();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
} 