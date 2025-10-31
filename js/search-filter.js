// Search and Filter System for GamingTech Pro
class SearchFilterSystem {
    constructor() {
        this.init();
    }

    init() {
        // Initialize search and filter functionality
        this.setupProductSearch();
        this.setupComponentSearch();
        this.setupGlobalSearch();
        this.setupFilterEvents();
    }

    // Setup product search functionality
    setupProductSearch() {
        const searchInput = document.getElementById('product-search');
        const searchBtn = document.getElementById('search-btn');
        const categoryFilter = document.querySelectorAll('.category-btn');
        const priceFilter = document.getElementById('price-filter');
        const ratingFilter = document.getElementById('rating-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const resultsCount = document.getElementById('results-count');
        const activeFilters = document.getElementById('active-filters');

        if (searchInput && searchBtn) {
            // Search on input change
            searchInput.addEventListener('input', () => this.filterProducts());
            
            // Search on button click
            searchBtn.addEventListener('click', () => this.filterProducts());
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterProducts();
                }
            });
        }

        // Category filter buttons
        if (categoryFilter.length > 0) {
            categoryFilter.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    categoryFilter.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    btn.classList.add('active');
                    this.filterProducts();
                });
            });
        }

        // Price and rating filters
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.filterProducts());
        }
        if (ratingFilter) {
            ratingFilter.addEventListener('change', () => this.filterProducts());
        }

        // Clear filters button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearProductFilters());
        }
    }

    // Setup component search functionality
    setupComponentSearch() {
        const searchInput = document.getElementById('component-search');
        const searchBtn = document.getElementById('component-search-btn');
        const priceFilter = document.getElementById('component-price-filter');
        const typeFilter = document.getElementById('component-type-filter');
        const clearFiltersBtn = document.getElementById('clear-component-filters');
        const resultsCount = document.getElementById('component-results-count');
        const activeFilters = document.getElementById('component-active-filters');

        if (searchInput && searchBtn) {
            // Search on input change
            searchInput.addEventListener('input', () => this.filterComponents());
            
            // Search on button click
            searchBtn.addEventListener('click', () => this.filterComponents());
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterComponents();
                }
            });
        }

        // Component filters
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.filterComponents());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterComponents());
        }

        // Clear filters button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearComponentFilters());
        }
    }

    // Setup global search in navbar
    setupGlobalSearch() {
        const globalSearch = document.getElementById('global-search');
        const globalSearchBtn = document.getElementById('search-btn');

        if (globalSearch && globalSearchBtn) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performGlobalSearch();
                }
            });

            globalSearchBtn.addEventListener('click', () => {
                this.performGlobalSearch();
            });

            // Also search on input for real-time results
            globalSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                if (searchTerm.length > 2) {
                    this.showSearchResults(searchTerm);
                } else if (searchTerm.length === 0) {
                    this.hideSearchResults();
                }
            });
        }
    }

    // Hide search results
    hideSearchResults() {
        const resultsOverlay = document.getElementById('search-results-overlay');
        if (resultsOverlay) {
            resultsOverlay.style.display = 'none';
        }
    }

    // Setup filter event listeners
    setupFilterEvents() {
        // Listen for tab changes in components page
        const componentTabs = document.querySelectorAll('.tab-btn');
        if (componentTabs.length > 0) {
            componentTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    componentTabs.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Show corresponding content
                    const tabContents = document.querySelectorAll('.tab-content');
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    const targetContent = document.getElementById(tab.dataset.tab + '-content');
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                    
                    // Re-filter components after tab change
                    this.filterComponents();
                });
            });
        }
    }

    // Filter products based on search and filters
    filterProducts() {
        const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
        const priceRange = document.getElementById('price-filter')?.value || '';
        const ratingFilter = document.getElementById('rating-filter')?.value || '';
        
        const products = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        let activeFilters = [];

        products.forEach(product => {
            let shouldShow = true;

            // Search term filter
            if (searchTerm) {
                const productName = product.querySelector('h3')?.textContent.toLowerCase() || '';
                const productDesc = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
                
                if (!productName.includes(searchTerm) && !productDesc.includes(searchTerm)) {
                    shouldShow = false;
                }
                activeFilters.push(`Search: "${searchTerm}"`);
            }

            // Category filter
            if (activeCategory !== 'all') {
                const productCategory = product.dataset.category;
                if (productCategory !== activeCategory) {
                    shouldShow = false;
                }
                activeFilters.push(`Category: ${activeCategory}`);
            }

            // Price filter
            if (priceRange) {
                const priceText = product.querySelector('.product-price')?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                
                switch (priceRange) {
                    case '0-50':
                        if (price > 50) shouldShow = false;
                        break;
                    case '50-100':
                        if (price < 50 || price > 100) shouldShow = false;
                        break;
                    case '100-200':
                        if (price < 100 || price > 200) shouldShow = false;
                        break;
                    case '200+':
                        if (price < 200) shouldShow = false;
                        break;
                }
                activeFilters.push(`Price: ${priceRange}`);
            }

            // Rating filter
            if (ratingFilter) {
                const ratingText = product.querySelector('.product-rating span')?.textContent || '';
                const rating = parseFloat(ratingText.replace(/[^0-9.]/g, ''));
                
                switch (ratingFilter) {
                    case '4+':
                        if (rating < 4) shouldShow = false;
                        break;
                    case '4.5+':
                        if (rating < 4.5) shouldShow = false;
                        break;
                    case '5':
                        if (rating < 5) shouldShow = false;
                        break;
                }
                activeFilters.push(`Rating: ${ratingFilter}`);
            }

            // Show/hide product
            if (shouldShow) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Update results info
        this.updateProductResults(visibleCount, products.length, activeFilters);
    }

    // Filter components based on search and filters
    filterComponents() {
        const searchTerm = document.getElementById('component-search')?.value.toLowerCase() || '';
        const priceRange = document.getElementById('component-price-filter')?.value || '';
        const typeFilter = document.getElementById('component-type-filter')?.value || '';
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || '';
        
        const components = document.querySelectorAll('.component-item');
        let visibleCount = 0;
        let activeFilters = [];

        components.forEach(component => {
            let shouldShow = true;

            // Search term filter
            if (searchTerm) {
                const componentName = component.querySelector('h3')?.textContent.toLowerCase() || '';
                const componentSpecs = component.querySelector('.component-specs')?.textContent.toLowerCase() || '';
                
                if (!componentName.includes(searchTerm) && !componentSpecs.includes(searchTerm)) {
                    shouldShow = false;
                }
                activeFilters.push(`Search: "${searchTerm}"`);
            }

            // Price filter
            if (priceRange) {
                const priceText = component.querySelector('.component-price')?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                
                switch (priceRange) {
                    case '0-100':
                        if (price > 100) shouldShow = false;
                        break;
                    case '100-300':
                        if (price < 100 || price > 300) shouldShow = false;
                        break;
                    case '300-500':
                        if (price < 300 || price > 500) shouldShow = false;
                        break;
                    case '500+':
                        if (price < 500) shouldShow = false;
                        break;
                }
                activeFilters.push(`Price: ${priceRange}`);
            }

            // Type filter
            if (typeFilter) {
                const componentType = component.closest('.tab-content')?.id?.replace('-content', '') || '';
                if (componentType !== typeFilter) {
                    shouldShow = false;
                }
                activeFilters.push(`Type: ${typeFilter}`);
            }

            // Tab filter
            if (activeTab) {
                const componentTab = component.closest('.tab-content')?.id?.replace('-content', '') || '';
                if (componentTab !== activeTab) {
                    shouldShow = false;
                }
            }

            // Show/hide component
            if (shouldShow) {
                component.style.display = 'block';
                visibleCount++;
            } else {
                component.style.display = 'none';
            }
        });

        // Update results info
        this.updateComponentResults(visibleCount, components.length, activeFilters);
    }

    // Perform global search
    performGlobalSearch() {
        const searchTerm = document.getElementById('global-search')?.value.toLowerCase() || '';
        
        if (!searchTerm.trim()) return;

        // Store search term for use on other pages
        localStorage.setItem('global_search_term', searchTerm);
        
        // Show search results immediately if on products page
        if (window.location.pathname.includes('products.html') || window.location.pathname.includes('products')) {
            this.filterProducts();
        } else {
            // Redirect to products page with search
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    // Show search results overlay
    showSearchResults(searchTerm) {
        console.log('Showing search results for:', searchTerm);
        
        // Create or update search results overlay
        let resultsOverlay = document.getElementById('search-results-overlay');
        
        if (!resultsOverlay) {
            resultsOverlay = document.createElement('div');
            resultsOverlay.id = 'search-results-overlay';
            resultsOverlay.className = 'search-results-overlay';
            document.body.appendChild(resultsOverlay);
        }

        // Get all searchable content
        const allProducts = this.getAllSearchableContent();
        console.log('Found searchable items:', allProducts.length);
        
        const filteredResults = this.filterSearchResults(allProducts, searchTerm);
        console.log('Filtered results:', filteredResults.length);

        // Update overlay content
        resultsOverlay.innerHTML = this.createSearchResultsHTML(filteredResults, searchTerm);
        resultsOverlay.style.display = 'block';

        // Add close functionality
        const closeBtn = resultsOverlay.querySelector('.close-search-results');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                resultsOverlay.style.display = 'none';
            });
        }

        // Close on outside click
        resultsOverlay.addEventListener('click', (e) => {
            if (e.target === resultsOverlay) {
                resultsOverlay.style.display = 'none';
            }
        });
    }

    // Get all searchable content from the page
    getAllSearchableContent() {
        const searchableItems = [];
        
        // Get products
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const name = product.querySelector('h3')?.textContent || '';
            const description = product.querySelector('.product-description')?.textContent || '';
            const price = product.querySelector('.product-price')?.textContent || '';
            const category = product.dataset.category || '';
            const rating = product.querySelector('.product-rating span')?.textContent || '';
            
            searchableItems.push({
                type: 'product',
                element: product,
                name: name,
                description: description,
                price: price,
                category: category,
                rating: rating,
                searchText: `${name} ${description} ${category}`.toLowerCase()
            });
        });

        // Get components
        const components = document.querySelectorAll('.component-item');
        components.forEach(component => {
            const name = component.querySelector('h3')?.textContent || '';
            const specs = component.querySelector('.component-specs')?.textContent || '';
            const price = component.querySelector('.component-price')?.textContent || '';
            
            searchableItems.push({
                type: 'component',
                element: component,
                name: name,
                description: specs,
                price: price,
                category: 'Component',
                rating: '',
                searchText: `${name} ${specs}`.toLowerCase()
            });
        });

        return searchableItems;
    }

    // Filter search results
    filterSearchResults(items, searchTerm) {
        if (!searchTerm.trim()) return items;
        
        return items.filter(item => 
            item.searchText.includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Create search results HTML
    createSearchResultsHTML(results, searchTerm) {
        if (results.length === 0) {
            return `
                <div class="search-results-content">
                    <div class="search-results-header">
                        <h3>Search Results for "${searchTerm}"</h3>
                        <button class="close-search-results">&times;</button>
                    </div>
                    <div class="search-results-body">
                        <p class="no-results">No results found for "${searchTerm}"</p>
                        <p class="search-tips">Try different keywords or check spelling</p>
                    </div>
                </div>
            `;
        }

        const resultsHTML = results.map(item => `
            <div class="search-result-item" data-type="${item.type}">
                <div class="result-item-header">
                    <h4>${item.name}</h4>
                    <span class="result-type ${item.type}">${item.type}</span>
                </div>
                <div class="result-item-content">
                    <p class="result-description">${item.description}</p>
                    <div class="result-meta">
                        <span class="result-price">${item.price}</span>
                        ${item.rating ? `<span class="result-rating">${item.rating}</span>` : ''}
                        <span class="result-category">${item.category}</span>
                    </div>
                </div>
                <button class="view-item-btn" onclick="window.searchFilterSystem.scrollToItem('${item.name}')">
                    View Item
                </button>
            </div>
        `).join('');

        return `
            <div class="search-results-content">
                <div class="search-results-header">
                    <h3>Search Results for "${searchTerm}" (${results.length} found)</h3>
                    <button class="close-search-results">&times;</button>
                </div>
                <div class="search-results-body">
                    ${resultsHTML}
                </div>
            </div>
        `;
    }

    // Scroll to item
    scrollToItem(itemName) {
        const items = document.querySelectorAll('.product-card, .component-item');
        for (let item of items) {
            const name = item.querySelector('h3')?.textContent;
            if (name === itemName) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Highlight the item briefly
                item.style.boxShadow = '0 0 20px var(--neon-blue)';
                setTimeout(() => {
                    item.style.boxShadow = '';
                }, 2000);
                break;
            }
        }
    }

    // Update product results display
    updateProductResults(visibleCount, totalCount, activeFilters) {
        const resultsCount = document.getElementById('results-count');
        const activeFiltersSpan = document.getElementById('active-filters');
        
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} of ${totalCount} products`;
        }
        
        if (activeFiltersSpan) {
            if (activeFilters.length > 0) {
                const uniqueFilters = [...new Set(activeFilters)];
                activeFiltersSpan.textContent = `Filters: ${uniqueFilters.join(', ')}`;
            } else {
                activeFiltersSpan.textContent = '';
            }
        }
    }

    // Update component results display
    updateComponentResults(visibleCount, totalCount, activeFilters) {
        const resultsCount = document.getElementById('component-results-count');
        const activeFiltersSpan = document.getElementById('component-active-filters');
        
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} of ${totalCount} components`;
        }
        
        if (activeFiltersSpan) {
            if (activeFilters.length > 0) {
                const uniqueFilters = [...new Set(activeFilters)];
                activeFiltersSpan.textContent = `Filters: ${uniqueFilters.join(', ')}`;
            } else {
                activeFiltersSpan.textContent = '';
            }
        }
    }

    // Clear all product filters
    clearProductFilters() {
        const searchInput = document.getElementById('product-search');
        const priceFilter = document.getElementById('price-filter');
        const ratingFilter = document.getElementById('rating-filter');
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        if (searchInput) searchInput.value = '';
        if (priceFilter) priceFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        
        // Reset category buttons
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        if (categoryBtns[0]) categoryBtns[0].classList.add('active');
        
        // Show all products
        this.filterProducts();
    }

    // Clear all component filters
    clearComponentFilters() {
        const searchInput = document.getElementById('component-search');
        const priceFilter = document.getElementById('component-price-filter');
        const typeFilter = document.getElementById('component-type-filter');
        
        if (searchInput) searchInput.value = '';
        if (priceFilter) priceFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        
        // Show all components
        this.filterComponents();
    }

    // Check for URL search parameters
    checkUrlSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        
        if (searchTerm) {
            // Auto-fill search input
            const searchInput = document.getElementById('product-search') || document.getElementById('component-search');
            if (searchInput) {
                searchInput.value = searchTerm;
                // Trigger search
                if (searchInput.id === 'product-search') {
                    this.filterProducts();
                } else {
                    this.filterComponents();
                }
            }
        }
    }
}

// Initialize search and filter system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchFilterSystem = new SearchFilterSystem();
    
    // Check for URL search parameters
    if (window.searchFilterSystem) {
        window.searchFilterSystem.checkUrlSearch();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchFilterSystem;
} 