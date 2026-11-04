// search.js
document.addEventListener('DOMContentLoaded', () => {
    // Determine base path to root based on current URL
    const isSubdir = /\/(about|contact|gallery|products|the\scraft|our\sweavers)\//i.test(decodeURIComponent(window.location.pathname));
    const basePath = isSubdir ? '../' : '';

    const searchDatabase = [
        { title: "Home", category: "Page", url: "index.html" },
        { title: "About Eravathody", category: "Page", url: "about/about.html" },
        { title: "The Craft (Winding, Warping, Dyeing, Weaving)", category: "Page", url: "the craft/craft.html" },
        { title: "Our Weavers & Artisans", category: "Page", url: "our weavers/weavers.html" },
        { title: "Products Collection", category: "Page", url: "products/products.html" },
        { title: "Gallery & Visual Journey", category: "Page", url: "gallery/gallery.html" },
        { title: "Contact Us & Location", category: "Page", url: "contact/contact.html" },
        
        { title: "Kasavu Saree – Half Fine Zari & Dyed Yarns", category: "Product", url: "products/products.html" },
        { title: "Kasavu Saree Premium – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Set Mundu – Half Fine Zari & Dyed Yarns", category: "Product", url: "products/products.html" },
        { title: "Set Mundu Premium – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Set Mundu – Half Fine Zari", category: "Product", url: "products/products.html" },
        { title: "Double Mundu – Dyed Yarn", category: "Product", url: "products/products.html" }
    ];

    const searchInput = document.querySelector('.header__search-input');
    const searchBarContainer = document.querySelector('.header__search-bar');
    
    if (searchInput && searchBarContainer) {
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';
        searchBarContainer.appendChild(dropdown);

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = '';
            
            if (query.length === 0) {
                dropdown.classList.remove('active');
                return;
            }

            const results = searchDatabase.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                results.forEach(item => {
                    const suggestion = document.createElement('a');
                    suggestion.className = 'search-suggestion-item';
                    suggestion.href = basePath + item.url;
                    
                    // Highlight matching text
                    const regex = new RegExp(`(${query})`, 'gi');
                    const highlightedTitle = item.title.replace(regex, '<span class="search-highlight">$1</span>');

                    suggestion.innerHTML = `
                        <div class="search-suggestion-title">${highlightedTitle}</div>
                        <div class="search-suggestion-category">${item.category}</div>
                    `;
                    
                    suggestion.addEventListener('click', () => {
                        dropdown.classList.remove('active');
                        searchInput.value = '';
                    });

                    dropdown.appendChild(suggestion);
                });
            } else {
                const noResults = document.createElement('div');
                noResults.className = 'search-suggestion-no-results';
                noResults.textContent = 'No matching items found.';
                dropdown.appendChild(noResults);
            }

            dropdown.classList.add('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchBarContainer.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // ==========================================
    // RESPONSIVE MOBILE NAVIGATION CONTROLLER
    // ==========================================
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.nav-menu');
    
    if (header && navMenu) {
        // Remove any old backdrop elements to prevent any screen blur
        document.querySelectorAll('.nav-backdrop').forEach(el => el.remove());

        // Ensure hamburger button exists
        let navToggle = document.getElementById('navToggle');
        if (!navToggle) {
            let headerActions = header.querySelector('.header__actions');
            if (!headerActions) {
                const headerSearch = header.querySelector('.header__search');
                headerActions = document.createElement('div');
                headerActions.className = 'header__actions';
                if (headerSearch) {
                    headerSearch.parentNode.insertBefore(headerActions, headerSearch);
                    headerActions.appendChild(headerSearch);
                } else {
                    header.appendChild(headerActions);
                }
            }
            navToggle = document.createElement('button');
            navToggle.id = 'navToggle';
            navToggle.className = 'nav-toggle';
            navToggle.setAttribute('type', 'button');
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = `
                <span class="nav-toggle__bar"></span>
                <span class="nav-toggle__bar"></span>
                <span class="nav-toggle__bar"></span>
            `;
            headerActions.appendChild(navToggle);
        }

        function openNav() {
            if (navToggle) {
                navToggle.classList.add('active');
                navToggle.setAttribute('aria-expanded', 'true');
            }
            navMenu.classList.add('active');
        }

        function closeNav() {
            if (navToggle) {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
            navMenu.classList.remove('active');
        }

        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (navMenu.classList.contains('active')) {
                    closeNav();
                } else {
                    openNav();
                }
            });
        }

        // Close dropdown when clicking a navigation link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeNav();
            });
        });

        // Close dropdown when clicking anywhere outside the header
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navMenu.classList.contains('active')) {
                closeNav();
            }
        });

        // Close dropdown on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNav();
            }
        });

        // Automatically close dropdown if window is resized above tablet breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
                closeNav();
            }
        });
    }
});
