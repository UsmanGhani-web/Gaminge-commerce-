// Simple Mobile Navigation - Backup Solution
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple mobile navigation initializing...');
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('navToggle found:', !!navToggle);
    console.log('navMenu found:', !!navMenu);
    
    if (navToggle && navMenu) {
        // Toggle mobile menu
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile toggle clicked!');
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('navToggle active:', navToggle.classList.contains('active'));
            console.log('navMenu active:', navMenu.classList.contains('active'));
            console.log('navMenu left position:', navMenu.style.left);
            console.log('navMenu z-index:', navMenu.style.zIndex);
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('Mobile menu opened - body scroll disabled');
            } else {
                document.body.style.overflow = '';
                console.log('Mobile menu closed - body scroll enabled');
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log('Simple mobile navigation setup complete!');
    } else {
        console.log('Mobile navigation elements not found!');
    }
}); 