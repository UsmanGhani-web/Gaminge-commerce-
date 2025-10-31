// Bulletproof Mobile Navigation - This WILL work!
console.log('Mobile navigation script loading...');

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('Page loaded, setting up mobile navigation...');
    setupMobileNavigation();
});

// Also try on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, setting up mobile navigation...');
    setupMobileNavigation();
});

function setupMobileNavigation() {
    console.log('Setting up mobile navigation...');
    
    // Find the mobile navigation elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('navToggle found:', !!navToggle);
    console.log('navMenu found:', !!navMenu);
    
    if (!navToggle || !navMenu) {
        console.error('Mobile navigation elements not found!');
        return;
    }
    
    // Remove any existing event listeners
    const newNavToggle = navToggle.cloneNode(true);
    const newNavMenu = navMenu.cloneNode(true);
    
    navToggle.parentNode.replaceChild(newNavToggle, navToggle);
    navMenu.parentNode.replaceChild(newNavMenu, navMenu);
    
    // Update references
    const toggle = newNavToggle;
    const menu = newNavMenu;
    
    console.log('Elements cloned and ready');
    
    // Add click event to toggle button
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Mobile toggle clicked!');
        
        // Toggle active class
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Force the menu to be visible
        if (menu.classList.contains('active')) {
            menu.style.left = '0';
            menu.style.zIndex = '9999';
            menu.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Mobile menu opened');
        } else {
            menu.style.left = '-100%';
            menu.style.zIndex = '1';
            document.body.style.overflow = '';
            console.log('Mobile menu closed');
        }
    });
    
    // Close menu when clicking on navigation links
    const navLinks = menu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Navigation link clicked, closing menu');
            toggle.classList.remove('active');
            menu.classList.remove('active');
            menu.style.left = '-100%';
            menu.style.zIndex = '1';
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            if (menu.classList.contains('active')) {
                console.log('Clicking outside, closing menu');
                toggle.classList.remove('active');
                menu.classList.remove('active');
                menu.style.left = '-100%';
                menu.style.zIndex = '1';
                document.body.style.overflow = '';
            }
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (menu.classList.contains('active')) {
                console.log('Window resized, closing menu');
                toggle.classList.remove('active');
                menu.classList.remove('active');
                menu.style.left = '-100%';
                menu.style.zIndex = '1';
                document.body.style.overflow = '';
            }
        }
    });
    
    console.log('Mobile navigation setup complete!');
    
    // Test the setup
    console.log('Testing mobile navigation...');
    console.log('Toggle element:', toggle);
    console.log('Menu element:', menu);
    console.log('Toggle classes:', toggle.className);
    console.log('Menu classes:', menu.className);
} 