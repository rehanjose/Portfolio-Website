// --- THEME TOGGLE (init before anything else to avoid FOUC) ---
(function () {
    // If on an individual project case study page, always remain in dark mode
    if (window.location.pathname.includes('/projects/') && !window.location.pathname.endsWith('projects.html')) {
        document.documentElement.removeAttribute('data-theme');
        return;
    }
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Preload alternate backdrop assets to make theme switching instant
    try {
        const bgLight = new Image();
        bgLight.src = 'Homepage%20Assets/NETBACKDROPBLACK.png';
        const bgDark = new Image();
        bgDark.src = 'Homepage%20Assets/netbackdrop.png';
        const bgLightLogo = new Image();
        bgLightLogo.src = 'Homepage%20Assets/rehanlogoblack.png';
    } catch (e) {}
})();

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// --- PRELOADER LOGIC ---
// Flag to easily toggle preloader on/off (set to true whenever you want to re-enable it)
const ENABLE_PRELOADER = false;
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const skipButton = document.getElementById('skip-button');

if (ENABLE_PRELOADER && preloader && mainContent) {
    const lines = [
        "I'm Rehan.",
        "It's <span style='color: #ef4444'>not</span> Rehaaaaaaaaan.",
        "It's Rehan."
    ];

    let animationComplete = false;

    function playLine(text, duration) {
        return new Promise((resolve) => {
            const el = document.createElement('div');
            el.className = 'loader-text';
            el.innerHTML = text;
            preloader.appendChild(el);

            // Animate IN
            requestAnimationFrame(() => el.classList.add('text-enter'));

            // Wait, then Animate OUT
            setTimeout(() => {
                el.classList.remove('text-enter');
                el.classList.add('text-exit');

                // Cleanup after exit animation (Matches CSS 0.5s)
                setTimeout(() => {
                    el.remove();
                    resolve();
                }, 500);
            }, duration);
        });
    }

    function finishPreloader() {
        if (animationComplete) return;
        animationComplete = true;

        // Hide skip button
        if (skipButton) {
            skipButton.style.opacity = '0';
            setTimeout(() => skipButton.remove(), 300);
        }

        // Finish preloader
        if (preloader) {
            preloader.style.pointerEvents = 'none';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }

        // Reveal Site
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        document.body.style.overflow = 'auto';
    }

    async function runSequence() {
        await playLine(lines[0], 600);   // Fast Intro
        await playLine(lines[1], 900);   // Just enough to read the joke
        await playLine(lines[2], 600);   // Fast confirm

        finishPreloader();
    }

    // Skip button handler
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            finishPreloader();
        });
    }

    // Start Sequence or Skip if already seen
    if (sessionStorage.getItem('preloaderDone')) {
        if (preloader) preloader.remove();
        if (skipButton) skipButton.remove();
        if (mainContent) mainContent.classList.add('visible');
        document.body.style.overflow = 'auto';
        animationComplete = true;
    } else {
        runSequence();
        sessionStorage.setItem('preloaderDone', 'true');
    }
} else {
    // When preloader is disabled or not present, reveal site immediately and remove any preloader elements
    if (preloader) preloader.remove();
    if (skipButton) skipButton.remove();
    if (mainContent) mainContent.classList.add('visible');
    document.body.style.overflow = 'auto';
}

// Clock
setInterval(() => {
    const now = new Date();
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}, 1000);

// Mobile Menu Toggle
var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
var mobileMenu = document.getElementById('mobile-menu');
var mobileMenuClose = document.getElementById('mobile-menu-close');
var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reinitialize Lucide icons in the mobile menu
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on nav links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
}

// --- THEME TOGGLE WITH CIRCULAR RIPPLE REVEAL ---
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('portfolio-theme', theme);

    // Swap src for any standalone nav-logo images
    document.querySelectorAll('.nav-logo:not(.nav-logo--dark):not(.nav-logo--light)').forEach(img => {
        img.src = theme === 'light' ? 'Homepage%20Assets/rehanlogoblack.png' : 'Homepage%20Assets/logo.png';
    });
}

function toggleThemeWithRipple(e, btn) {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';

    // Calculate origin coordinates from the clicked button
    const rect = btn.getBoundingClientRect();
    const x = e && typeof e.clientX === 'number' && e.clientX > 0
        ? e.clientX
        : rect.left + rect.width / 2;
    const y = e && typeof e.clientY === 'number' && e.clientY > 0
        ? e.clientY
        : rect.top + rect.height / 2;

    // Radius to reach the farthest corner of the screen plus safety margin
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    ) + 30;

    // Native View Transitions API (Chrome 111+, Edge 111+, Safari 18+)
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable internal CSS background/text fades during snapshot so the new state renders instantly crisp
        document.documentElement.classList.add('no-theme-transition');

        const transition = document.startViewTransition(() => {
            applyTheme(nextTheme);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 350,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });

        transition.finished.finally(() => {
            document.documentElement.classList.remove('no-theme-transition');
        });
        return;
    }

    // High-performance circular ripple fallback for browsers without View Transitions
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ripple = document.createElement('div');
        ripple.className = 'theme-transition-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.setProperty('--end-radius', `${endRadius}px`);
        ripple.style.backgroundColor = nextTheme === 'light' ? '#f5f3eb' : '#000000';
        document.body.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.classList.add('is-animating');
            applyTheme(nextTheme);
        });

        setTimeout(() => {
            ripple.classList.add('is-fading');
            setTimeout(() => ripple.remove(), 250);
        }, 280);
        return;
    }

    // Immediate fallback for users who prefer reduced motion
    applyTheme(nextTheme);
}

document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleThemeWithRipple(e, btn);
    });
});

// Photo Click - Wave Emoji Animation (REMOVED)

// --- SCROLL-BASED ACTIVE SECTION HIGHLIGHTING ---
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Find which section is currently in view
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200; // Offset for navbar height
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // If we're at the very top, highlight home
    if (scrollPosition < 100) {
        currentSection = 'home';
    }

    // Update active class on nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Run on scroll with debouncing
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavLink, 10);
});

// Initial call to set the active link on page load
updateActiveNavLink();

// --- HERO SECTION SCROLL ANIMATIONS ---
const heroSection = document.querySelector('.hero-section');
const heroWelcomeLeft = document.querySelector('.hero-welcome-left');
const heroSkillsLeft = document.querySelector('.hero-skills-left');
const heroQuoteRight = document.querySelector('.hero-quote-right');
const heroNameRight = document.querySelector('.hero-name-right');
const heroImage = document.querySelector('.hero-image');

function updateHeroAnimations() {
    if (!heroSection) return;

    const scrollPosition = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Calculate progress (0 to 1) based on how much of hero section is scrolled
    // Start animating when we start scrolling, complete by the time we're halfway through hero section
    const progress = Math.min(scrollPosition / (heroHeight * 0.5), 1);

    // Calculate movement distances (in pixels)
    const moveDistance = progress * 300; // Move up to 300px
    const opacity = 1 - progress; // Fade out as we scroll

    // Left side elements - move left and fade out
    if (heroWelcomeLeft) {
        heroWelcomeLeft.style.transform = `translateX(-${moveDistance}px)`;
        heroWelcomeLeft.style.opacity = opacity;
    }

    if (heroSkillsLeft) {
        heroSkillsLeft.style.transform = `translateX(-${moveDistance}px)`;
        heroSkillsLeft.style.opacity = opacity;
    }

    // Right side elements - move right and fade out
    if (heroQuoteRight) {
        heroQuoteRight.style.transform = `translateX(${moveDistance}px)`;
        heroQuoteRight.style.opacity = opacity;
    }

    if (heroNameRight) {
        heroNameRight.style.transform = `translateX(${moveDistance}px)`;
        heroNameRight.style.opacity = opacity;
    }

    // Center image - move up and fade out
    if (heroImage) {
        const imageMove = progress * 200; // Move up by 200px
        const imageOpacity = 1 - (progress * 0.5); // Fade to 50% opacity
        heroImage.style.transform = `translateY(-${imageMove}px)`;
        heroImage.style.opacity = imageOpacity;
    }
}

// Run on scroll with requestAnimationFrame for smooth performance
let rafId = null;
window.addEventListener('scroll', () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
        updateHeroAnimations();
        rafId = null;
    });
});

// Initial call
updateHeroAnimations();

// --- PROJECT STATUS TOGGLE (REAL vs CONCEPT) ---
const statusToggleBtns = document.querySelectorAll('.status-toggle-btn');

function initProjectStatusToggle() {
    if (!statusToggleBtns.length) return;

    let currentStatus = 'real'; // Default to 'real'

    function applyStatusFilter(status) {
        currentStatus = status;

        statusToggleBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-status') === status;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Only filter cards that aren't permanently hidden (AlexaBot, Beyond Jerseys, Graduation Showcase)
        const landingCards = Array.from(document.querySelectorAll('.project-card')).filter(card => {
            return !card.classList.contains('hidden');
        });

        landingCards.forEach(card => {
            const cardStatus = card.getAttribute('data-status');
            const shouldShow = (status === 'all' || cardStatus === status);

            if (shouldShow) {
                card.classList.remove('status-hidden');
                card.style.display = 'flex';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px) scale(0.98)';
                setTimeout(() => {
                    if (card.getAttribute('data-status') !== currentStatus && currentStatus !== 'all') {
                        card.classList.add('status-hidden');
                        card.style.display = 'none';
                    }
                }, 250);
            }
        });

        setTimeout(() => {
            if (typeof refreshProjectStacking === 'function') {
                refreshProjectStacking();
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 260);
    }

    statusToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            if (status === currentStatus) {
                // If clicked again, toggle to show both statuses
                applyStatusFilter('all');
                statusToggleBtns.forEach(b => b.classList.remove('active'));
            } else {
                applyStatusFilter(status);
            }
        });
    });

    // Initialize with default
    applyStatusFilter('real');
}

// Run status toggle init
initProjectStatusToggle();

// --- ABOUT SECTION SCROLL ANIMATION & PROJECTS TRANSITION ---
const aboutSection = document.getElementById('about');
const aboutContainer = document.querySelector('.about-container');
const aboutText = document.getElementById('about-text');
const aboutLink = document.getElementById('about-link');

// Pre-define random scattering values for consistent animation
const letterPhysics = [];

if (aboutText && aboutSection && aboutContainer) {
    // 1. Split text into individual letters wrapped in spans, grouped by word
    const textContent = aboutText.innerText;
    const words = textContent.trim().split(/\s+/);

    aboutText.innerHTML = '';
    words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'about-word';

        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'about-letter';
            letterSpan.innerHTML = word[i];
            wordSpan.appendChild(letterSpan);

            // Generate random physics for the "pop out / scramble" effect
            letterPhysics.push({
                x: (Math.random() - 0.5) * 200, // random X spread (-100vw to 100vw later)
                y: (Math.random() - 0.5) * 200, // random Y spread
                z: Math.random() * 500 + 100,   // random Z depth
                rotateX: (Math.random() - 0.5) * 720,
                rotateY: (Math.random() - 0.5) * 720,
                rotateZ: (Math.random() - 0.5) * 720,
                scale: Math.random() * 3 + 1
            });
        }

        aboutText.appendChild(wordSpan);
        aboutText.appendChild(document.createTextNode(' '));
    });

    const letterElements = document.querySelectorAll('.about-letter');

    // 2. Scroll listener for highlighting, scrambling, & projects transition
    function updateAboutAnimation() {
        if (!aboutSection || !aboutContainer) return;

        const scrollPosition = window.pageYOffset;
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // If we're past the about section, maintain the hidden scrambled state
        if (scrollPosition > sectionTop + sectionHeight) {
            aboutContainer.style.opacity = 0;
            aboutContainer.style.pointerEvents = 'none';
        }

        // Only run animation math if we are near or in the about section
        if (scrollPosition > sectionTop - viewportHeight && scrollPosition <= sectionTop + sectionHeight) {

            const stickyScrollDistance = sectionHeight - viewportHeight;
            let progress = 0;

            if (stickyScrollDistance > 0) {
                progress = (scrollPosition - sectionTop) / stickyScrollDistance;
            } else {
                progress = 1;
            }

            progress = Math.max(0, Math.min(1, progress));

            // Phase 1: Reading (0% to 70%)
            const readingProgress = Math.min(1, progress / 0.7);
            const lettersToHighlight = Math.ceil(readingProgress * letterElements.length);

            // Phase 2: Scramble & Pop Out (70% to 100%)
            const scrambleProgress = Math.max(0, (progress - 0.7) / 0.3); // 0 to 1

            // The "Get to Know Me" button appears during the reading phase
            // and fades out as the letters scatter
            if (aboutLink) {
                if (readingProgress > 0) {
                    aboutLink.classList.add('visible');
                    
                    if (scrambleProgress > 0) {
                        // Fade out the button as text scatters
                        let linkOpacity = 1 - (scrambleProgress * 2);
                        if (linkOpacity < 0) linkOpacity = 0;
                        aboutLink.style.opacity = linkOpacity;
                        aboutLink.style.pointerEvents = linkOpacity > 0 ? 'auto' : 'none';
                    } else {
                        // Fully visible while lighting up
                        aboutLink.style.opacity = '';
                        aboutLink.style.pointerEvents = '';
                    }
                } else {
                    aboutLink.classList.remove('visible');
                    aboutLink.style.opacity = '';
                    aboutLink.style.pointerEvents = '';
                }
            }

            // Ease the scramble progress using cubic-bezier like curve for explosive start
            const easedScramble = scrambleProgress === 0 ? 0 : 1 - Math.pow(1 - scrambleProgress, 3);

            // Apply transforms to each letter
            letterElements.forEach((letter, index) => {
                // Highlighting Logic
                if (index < lettersToHighlight && scrambleProgress === 0) {
                    letter.classList.add('highlighted');
                } else {
                    letter.classList.remove('highlighted');
                }

                // Scrambling Logic
                if (scrambleProgress > 0) {
                    const physics = letterPhysics[index];

                    // Multiply physics by eased scramble progress
                    const tx = physics.x * easedScramble;
                    const ty = physics.y * easedScramble;
                    const tz = physics.z * easedScramble;
                    const rx = physics.rotateX * easedScramble;
                    const ry = physics.rotateY * easedScramble;
                    const rz = physics.rotateZ * easedScramble;

                    // Maintain highlighted color during scramble
                    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                    letter.style.color = isLight ? 'rgba(17,17,17,1)' : 'rgba(255,255,255,1)';
                    letter.style.textShadow = `0 0 15px var(--highlight-glow)`;

                    // Apply huge 3D transform
                    letter.style.transform = `
                        translate3d(${tx}vw, ${ty}vh, ${tz}px) 
                        rotateX(${rx}deg) 
                        rotateY(${ry}deg) 
                        rotateZ(${rz}deg)
                    `;
                } else {
                    // Reset to normal
                    letter.style.transform = 'translateZ(0)';
                    letter.style.color = '';
                    letter.style.textShadow = '';
                }
            });

            // Fade out the whole container near the end of the scramble
            if (scrambleProgress > 0.6) {
                const fadeOut = 1 - ((scrambleProgress - 0.6) / 0.4);
                aboutContainer.style.opacity = fadeOut;
                aboutContainer.style.pointerEvents = 'none';
            } else {
                aboutContainer.style.opacity = 1;
                aboutContainer.style.pointerEvents = 'auto';
            }
        }
    }

    // Add to scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateAboutAnimation();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateAboutAnimation();
}


// --- CONTACT SECTION ANIMATIONS (INTERSECTION OBSERVER) ---
const contactObserverOptions = {
    root: null,
    rootMargin: '0px', // Trigger normally without strict margin to avoid bottom elements getting stuck
    threshold: 0.1
};

const contactSectionInfo = document.getElementById('contact');
const elementsToReveal = document.querySelectorAll('#contact .reveal-up');

// Assign transition delays in advance
elementsToReveal.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.15}s`;
});

const contactObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger all internal elements when the section enters viewport
            elementsToReveal.forEach(el => {
                el.classList.add('is-visible');
            });
            observer.unobserve(entry.target);
        }
    });
}, contactObserverOptions);

if (contactSectionInfo) {
    contactObserver.observe(contactSectionInfo);
}

// --- DYNAMIC COLOR-MATCHED GLOW FOR PROJECT CARDS ---
function getDominantColor(img) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Sample a small version for performance
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0, g = 0, b = 0, count = 0;
        // Sample every 4th pixel for speed
        for (let i = 0; i < data.length; i += 16) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        return `${r}, ${g}, ${b}`;
    } catch (e) {
        return null;
    }
}

function applyGlowColors() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const img = card.querySelector('.project-image-wrapper img');
        const fallbackColor = card.getAttribute('data-glow');
        const glowOverride = card.hasAttribute('data-glow-override');

        const applyColor = (rgb) => {
            card.style.setProperty('--glow-color', `rgba(${rgb}, 0.3)`);
        };

        // If override is set, always use data-glow (skip canvas sampling)
        if (glowOverride) {
            if (fallbackColor) applyColor(fallbackColor);
            return;
        }

        if (img) {
            if (img.complete && img.naturalWidth > 0) {
                const rgb = getDominantColor(img);
                if (rgb) applyColor(rgb);
                else if (fallbackColor) applyColor(fallbackColor);
            } else {
                img.addEventListener('load', () => {
                    const rgb = getDominantColor(img);
                    if (rgb) applyColor(rgb);
                    else if (fallbackColor) applyColor(fallbackColor);
                });
                // Fallback while loading
                if (fallbackColor) applyColor(fallbackColor);
            }
        } else if (fallbackColor) {
            // No image yet (placeholder) — use data-glow attribute color
            applyColor(fallbackColor);
        }
    });
}

// --- COMING SOON MODAL & TRACKING ---
function trackProjectView(projectLabel, onComplete) {
    const done = typeof onComplete === 'function' ? onComplete : () => { };

    if (typeof gtag !== 'function') {
        done();
        return;
    }

    let callbackCalled = false;
    const safeDone = () => {
        if (callbackCalled) return;
        callbackCalled = true;
        done();
    };

    try {
        gtag('event', 'project_view', {
            event_category: 'portfolio',
            event_label: projectLabel,
            transport_type: 'beacon',
            event_callback: safeDone
        });
    } catch (e) {
        safeDone();
        return;
    }

    setTimeout(safeDone, 200);
}

function openProjectWithTracking(url, projectLabel) {
    if (!url) return;
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'project_view', {
                event_category: 'portfolio',
                event_label: projectLabel || url,
                transport_type: 'beacon'
            });
        } catch (e) {
            console.warn('Analytics tracking error:', e);
        }
    }
    window.location.href = url;
}

function showComingSoonTracked(title, text) {
    showComingSoon(title, text);
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'project_view', {
                event_category: 'portfolio',
                event_label: title,
                transport_type: 'beacon'
            });
        } catch (e) {}
    }
}

function showComingSoon(title, text) {
    const modal = document.getElementById('coming-soon-modal');
    const modalTitle = document.getElementById('cs-modal-title');
    const modalText = document.getElementById('cs-modal-text');

    if (modal && modalTitle && modalText && title && text) {
        modalTitle.innerText = title;
        modalText.innerText = text;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else if (modal) {
        // Fallback for no arguments
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeComingSoon() {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openDinelyModal() {
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'project_view', {
                event_category: 'portfolio',
                event_label: 'Dinely In-Progress Modal',
                transport_type: 'beacon'
            });
        } catch (e) {}
    }
    const modal = document.getElementById('dinely-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function closeDinelyModal() {
    const modal = document.getElementById('dinely-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openMparivahanModal() {
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'project_view', {
                event_category: 'portfolio',
                event_label: 'mParivahan In-Progress Modal',
                transport_type: 'beacon'
            });
        } catch (e) {}
    }
    const modal = document.getElementById('mparivahan-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function closeMparivahanModal() {
    const modal = document.getElementById('mparivahan-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openAccessibilityModal() {
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'project_view', {
                event_category: 'portfolio',
                event_label: 'Accessibility in Exams In-Progress Modal',
                transport_type: 'beacon'
            });
        } catch (e) {}
    }
    const modal = document.getElementById('accessibility-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function closeAccessibilityModal() {
    const modal = document.getElementById('accessibility-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function goToContactFromModal(source) {
    closeMparivahanModal();
    closeDinelyModal();
    closeAccessibilityModal();
    closeComingSoon();
    
    if (typeof gtag === 'function') {
        gtag('event', 'contact_click', {
            event_category: 'modal_cta',
            event_label: source || 'modal'
        });
    }

    const contactEl = document.getElementById('contact');
    if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'index.html#contact';
    }
}

// --- INTERACTIVE STORYBOARD / COMIC MODAL ---
const STORY_PROJECTS = {
    eravathody: {
        title: "Eravathody Handloom Weavers",
        badge: "STORYBOARD",
        caseStudyUrl: "projects/EravathodyWeavers/eravathody.html",
        trackingLabel: "Eravathody Handloom Weavers",
        frames: Array.from({ length: 9 }, (_, i) => encodeURI(`Stories/Story-Eravathody Weavers/Frame ${i + 1}.png`))
    },
    dinely: {
        title: "Dinely",
        badge: "STORYBOARD",
        caseStudyUrl: "projects/Dinely/dinely.html",
        trackingLabel: "Dinely",
        frames: Array.from({ length: 15 }, (_, i) => encodeURI(`Stories/Story-Dinely/Frame ${i + 10}.png`))
    },
    reflexlabs: {
        title: "ReflexLabs AI",
        badge: "STORYBOARD",
        caseStudyUrl: "projects/ReflexLabsAIreal/real.html",
        trackingLabel: "ReflexLabs AI",
        frames: Array.from({ length: 8 }, (_, i) => encodeURI(`Stories/Story-reflexlabs/Frame ${i + 25}.png`))
    },
    stryde: {
        title: "STRYDE",
        badge: "STORYBOARD",
        caseStudyUrl: "projects/Stryde/stryde.html",
        trackingLabel: "STRYDE",
        frames: Array.from({ length: 12 }, (_, i) => encodeURI(`Stories/Story-Stryde/Frame ${i + 33}.png`))
    }
};

let activeStoryKey = null;
let activeStoryIndex = 0;
const storyPreloadCache = new Map();

function preloadStoryImage(src) {
    if (!src) return Promise.resolve();
    if (storyPreloadCache.has(src)) {
        return storyPreloadCache.get(src);
    }
    const promise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
    storyPreloadCache.set(src, promise);
    return promise;
}

function preloadStoryNeighbors(projectKey, centerIndex) {
    const project = STORY_PROJECTS[projectKey];
    if (!project) return;
    // Immediately preload current, next 2, and previous 1 frame
    const priorityIndices = [centerIndex, centerIndex + 1, centerIndex + 2, centerIndex - 1];
    priorityIndices.forEach((idx) => {
        if (idx >= 0 && idx < project.frames.length) {
            preloadStoryImage(project.frames[idx]);
        }
    });
    // Queue remaining frames in idle time
    setTimeout(() => {
        project.frames.forEach((src) => preloadStoryImage(src));
    }, 150);
}

function ensureStoryModal() {
    let modal = document.getElementById('story-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'story-modal';
    modal.className = 'story-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Project Storyboard');
    modal.onclick = () => closeStoryModal();

    modal.innerHTML = `
        <div class="story-modal-dialog" onclick="event.stopPropagation()">
            <button type="button" class="story-close-btn" onclick="closeStoryModal()" aria-label="Close storyboard">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="story-progress-bar" id="story-progress-bar" role="tablist" aria-label="Story progress"></div>
            <div class="story-stage" id="story-stage">
                <button type="button" class="story-tap-zone story-tap-zone--prev" id="story-tap-prev" onclick="prevStoryFrame()" aria-label="Previous frame"></button>
                <button type="button" class="story-tap-zone story-tap-zone--next" id="story-tap-next" onclick="nextStoryFrame()" aria-label="Next frame"></button>
                <div class="story-stage-loader"><div class="story-spinner"></div></div>
                <img src="" alt="Project Storyboard Frame" class="story-frame-img" id="story-frame-img" draggable="false">
            </div>
            <div class="story-footer">
                <div class="story-nav-row">
                    <button type="button" class="story-nav-btn" id="story-prev-btn" onclick="prevStoryFrame()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <span>Back</span>
                    </button>
                    <span class="story-counter" id="story-counter">01 / 09</span>
                    <button type="button" class="story-nav-btn" id="story-next-btn" onclick="nextStoryFrame()">
                        <span>Next</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
                <button type="button" class="story-case-study-btn" id="story-case-study-btn" onclick="goToStoryCaseStudy()">
                    <span class="story-skip-pill" id="story-skip-pill">SKIP</span>
                    <span>View Detailed Case Study</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    initStoryTouchGestures(modal);
    return modal;
}

function initStoryTouchGestures(modal) {
    const stage = modal.querySelector('#story-stage');
    if (!stage || stage.dataset.touchBound === 'true') return;
    stage.dataset.touchBound = 'true';

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    stage.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        isSwiping = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!isSwiping || !e.touches || e.touches.length !== 1) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    }, { passive: true });

    stage.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            if (dx < 0) {
                nextStoryFrame();
            } else {
                prevStoryFrame();
            }
        }
    }, { passive: true });
}

function renderStoryFrame(direction) {
    const project = STORY_PROJECTS[activeStoryKey];
    if (!project) return;

    const modal = ensureStoryModal();
    const total = project.frames.length;
    const idx = Math.max(0, Math.min(activeStoryIndex, total - 1));
    activeStoryIndex = idx;

    const titleEl = modal.querySelector('#story-project-title');
    const badgeEl = modal.querySelector('#story-badge');
    const counterEl = modal.querySelector('#story-counter');
    const progressEl = modal.querySelector('#story-progress-bar');
    const stageEl = modal.querySelector('#story-stage');
    const imgEl = modal.querySelector('#story-frame-img');
    const prevBtn = modal.querySelector('#story-prev-btn');
    const nextBtn = modal.querySelector('#story-next-btn');
    const tapPrev = modal.querySelector('#story-tap-prev');
    const tapNext = modal.querySelector('#story-tap-next');
    const caseStudyBtn = modal.querySelector('#story-case-study-btn');

    if (titleEl) titleEl.textContent = project.title;
    if (badgeEl) badgeEl.textContent = project.badge || 'STORYBOARD';
    if (counterEl) {
        const curStr = String(idx + 1).padStart(2, '0');
        const totStr = String(total).padStart(2, '0');
        counterEl.textContent = `${curStr} / ${totStr}`;
    }

    // Build or update progress segments
    if (progressEl) {
        if (progressEl.children.length !== total) {
            progressEl.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const seg = document.createElement('button');
                seg.type = 'button';
                seg.className = 'story-progress-segment';
                seg.setAttribute('aria-label', `Go to frame ${i + 1}`);
                seg.onclick = () => goToStoryFrame(i);
                progressEl.appendChild(seg);
            }
        }
        Array.from(progressEl.children).forEach((seg, i) => {
            seg.classList.toggle('is-completed', i < idx);
            seg.classList.toggle('is-active', i === idx);
        });
    }

    const isFirst = idx === 0;
    const isLast = idx === total - 1;

    if (prevBtn) prevBtn.disabled = isFirst;
    if (nextBtn) nextBtn.disabled = isLast;
    if (tapPrev) tapPrev.disabled = isFirst;
    if (tapNext) tapNext.disabled = isLast;

    if (caseStudyBtn) {
        caseStudyBtn.classList.toggle('is-final-frame', isLast);
    }

    const targetSrc = project.frames[idx];
    if (imgEl && stageEl) {
        const animClass = direction === 'prev' ? 'is-switching-prev' : (direction === 'next' ? 'is-switching-next' : '');
        if (animClass) {
            imgEl.classList.remove('is-switching-next', 'is-switching-prev');
            imgEl.classList.add(animClass);
        }

        stageEl.classList.add('is-loading');
        preloadStoryImage(targetSrc).then(() => {
            if (STORY_PROJECTS[activeStoryKey] !== project || activeStoryIndex !== idx) return;
            imgEl.src = targetSrc;
            imgEl.alt = `${project.title} — Storyboard Frame ${idx + 1} of ${total}`;
            stageEl.classList.remove('is-loading');
            requestAnimationFrame(() => {
                imgEl.classList.remove('is-switching-next', 'is-switching-prev');
            });
        });
    }

    preloadStoryNeighbors(activeStoryKey, idx);
}

function openStoryModal(projectKey) {
    const project = STORY_PROJECTS[projectKey];
    if (!project) return;

    activeStoryKey = projectKey;
    activeStoryIndex = 0;

    const modal = ensureStoryModal();
    initStoryTouchGestures(modal);
    renderStoryFrame(null);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof gtag === 'function') {
        try {
            gtag('event', 'story_open', {
                event_category: 'portfolio_story',
                event_label: project.trackingLabel || project.title,
                transport_type: 'beacon'
            });
        } catch (e) {}
    }
}

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    activeStoryKey = null;
}

function nextStoryFrame() {
    if (!activeStoryKey) return;
    const project = STORY_PROJECTS[activeStoryKey];
    if (!project) return;
    if (activeStoryIndex < project.frames.length - 1) {
        activeStoryIndex += 1;
        renderStoryFrame('next');
    }
}

function prevStoryFrame() {
    if (!activeStoryKey) return;
    if (activeStoryIndex > 0) {
        activeStoryIndex -= 1;
        renderStoryFrame('prev');
    }
}

function goToStoryFrame(index) {
    if (!activeStoryKey) return;
    const project = STORY_PROJECTS[activeStoryKey];
    if (!project || index === activeStoryIndex) return;
    const dir = index > activeStoryIndex ? 'next' : 'prev';
    activeStoryIndex = index;
    renderStoryFrame(dir);
}

function goToStoryCaseStudy() {
    if (!activeStoryKey) return;
    const project = STORY_PROJECTS[activeStoryKey];
    if (!project) return;
    const url = project.caseStudyUrl;
    const label = project.trackingLabel || project.title;
    closeStoryModal();
    openProjectWithTracking(url, label);
}

// Warm-preload frame 1 of story projects on card hover / touchstart for instant modal opening
document.addEventListener('DOMContentLoaded', () => {
    Object.values(STORY_PROJECTS).forEach((proj) => {
        if (proj.frames && proj.frames[0]) {
            preloadStoryImage(proj.frames[0]);
        }
    });
});

// Close on Esc key & navigate story with Left / Right arrow keys
document.addEventListener('keydown', (e) => {
    const storyModal = document.getElementById('story-modal');
    const isStoryOpen = storyModal && storyModal.classList.contains('active');

    if (e.key === 'Escape') {
        if (isStoryOpen) {
            closeStoryModal();
            return;
        }
        closeComingSoon();
        closeExpModal();
        closeDinelyModal();
        closeMparivahanModal();
        closeAccessibilityModal();
    } else if (isStoryOpen) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextStoryFrame();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevStoryFrame();
        }
    }
});

// --- EXPERIENCE SECTION & DETAILS MODAL ---
const experienceData = {
    alramz: {
        company: "Al Ramz MEP Designs",
        logo: "experience%20logos/Al%20Ramz.png",
        initials: "AR",
        role: "Product Designer & Web Developer",
        type: "Freelance",
        period: "Sept. 2026",
        location: "Remote",
        certificate: false,
        workUrl: "https://www.alramzdesign.com/",
        highlights: [
            "Designed and developed a 0→1 responsive website based on client requirements.",
            "Created sitemap, user flows, and UI Design in Figma; developed using HTML, CSS & JavaScript.",
            "Managed deployment, domain, SSL, hosting, SEO optimization, and Google Analytics.",
            "Collaborated with the client through iterations to align the website with brand and business requirements."
        ]
    },
    xplor: {
        company: "Xplor AI Mobility",
        logo: "experience%20logos/xplor.png",
        initials: "XP",
        role: "Product Designer",
        type: "Summer Internship",
        period: "Jun. 2026 – Aug. 2026",
        location: "On-site",
        highlights: [
            "Worked within the Product Design team on Xplor's mobility platform, contributing to UX research, user testing, information architecture, interaction design, and UI across bus and metro experiences.",
            "Benchmarked 42 mobility, travel, and finance apps, analysing journey planning, transit discovery, and multimodal UX to identify opportunities for Xplor.",
            "Identified usability issues through existing-flow analysis and user-testing feedback, redesigning key journeys across search, bus discovery, schedules, account linking, and journey planning.",
            "Designed a Universal Search and Multimodal Journey experience exploring point-to-point travel combining bus, metro, walking, and first/last-mile connections across different journey scenarios.",
            "Redesigned the bus search, availability, cards, and schedules, improving information hierarchy and introducing relevant alternatives and a route-request flow to capture unmet transit demand.",
            "Collaborated with Product, Design, and Technology teams through design reviews, iteration, documentation, and handoff, while contributing to product QA and campaign-related UI/visual communication."
        ]
    },
    reflexlabs: {
        company: "ReflexLabs AI",
        logo: "experience%20logos/reflexlabs.png",
        initials: "RL",
        role: "UI/UX Designer",
        type: "Internship",
        period: "Nov. 2025",
        location: "Remote",
        highlights: [
            "Redesigned the ReflexLabs AI website with a cleaner structure and modern visual language.",
            "Ideated new design elements and created interactive components to enhance user engagement.",
            "Improved overall user flow, clarity, and brand experience."
        ]
    },
    nift: {
        company: "NIFT Kannur",
        logo: "experience%20logos/nift.png",
        initials: "NK",
        role: "Print & Graphic Team, Converge 2025",
        type: "Student Assistant",
        period: "Jun. 2025 – Sept. 2025",
        location: "On-site",
        highlights: [
            "Part of a 10-member core team developing the brand identity for Converge 2025 (Inter-NIFT annual event).",
            "Led design and production of the official Playbook, and created standees, direction boards, and visual assets using Adobe Creative Suite.",
            "Produced 40 custom mementos for SDAC delegates using laser etching (RDWorks V8), aligning with the event's visual identity."
        ]
    },
    inamigos: {
        company: "InAmigos Foundation",
        logo: "experience%20logos/Inamigos.png",
        initials: "IF",
        role: "Graphic Designer",
        type: "Internship",
        period: "Jun. 2025 – Jul. 2025",
        location: "Remote",
        highlights: [
            "Designed posters and visual content for social impact campaigns, including Project Bachpanshala.",
            "Created engaging reels to drive social media awareness and support the 'Join as a Volunteer' campaign.",
            "Explored and applied generative AI tools for video content creation and enhancement."
        ]
    }
};

function openExpModal(expId) {
    const data = experienceData[expId];
    if (!data) return;

    const modal = document.getElementById('experience-modal');
    const logoEl = document.getElementById('exp-modal-logo-img');
    const initialsEl = document.getElementById('exp-modal-initials');
    const companyEl = document.getElementById('exp-modal-company');
    const roleEl = document.getElementById('exp-modal-role');
    const periodEl = document.getElementById('exp-modal-period');
    const locationEl = document.getElementById('exp-modal-location');
    const typeEl = document.getElementById('exp-modal-type');
    const listEl = document.getElementById('exp-modal-list');

    if (logoEl && data.logo) {
        logoEl.src = data.logo;
        logoEl.alt = `${data.company} Logo`;
        logoEl.style.display = 'block';
        if (initialsEl) initialsEl.style.display = 'none';
    } else if (initialsEl) {
        initialsEl.textContent = data.initials;
        initialsEl.style.display = 'block';
        if (logoEl) logoEl.style.display = 'none';
    }

    if (companyEl) companyEl.textContent = data.company;
    if (roleEl) roleEl.textContent = data.role;
    if (periodEl) periodEl.textContent = data.period;
    if (locationEl) locationEl.textContent = data.location;
    if (typeEl) typeEl.textContent = data.type;

    if (listEl) {
        listEl.innerHTML = '';
        data.highlights.forEach(highlight => {
            const li = document.createElement('li');
            li.textContent = highlight;
            listEl.appendChild(li);
        });
    }

    const actionsWrap = modal ? modal.querySelector('.exp-modal-actions') : null;
    let workBtn = document.getElementById('exp-modal-work-btn');
    if (!workBtn && actionsWrap) {
        workBtn = document.createElement('a');
        workBtn.id = 'exp-modal-work-btn';
        workBtn.className = 'exp-modal-work-btn';
        workBtn.target = '_blank';
        workBtn.rel = 'noopener noreferrer';
        workBtn.innerHTML = `<span>View Work</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
        actionsWrap.insertBefore(workBtn, actionsWrap.firstChild);
    }
    if (workBtn) {
        if (data.workUrl) {
            workBtn.href = data.workUrl;
            workBtn.style.display = 'inline-flex';
        } else {
            workBtn.style.display = 'none';
        }
    }

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeExpModal() {
    const modal = document.getElementById('experience-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Bind clicks & keyboard events to experience cards
document.querySelectorAll('.experience-card').forEach(card => {
    const expId = card.getAttribute('data-exp-id');
    card.addEventListener('click', () => openExpModal(expId));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openExpModal(expId);
        }
    });
});

// --- EXPERIENCE SECTION SCROLL REVEAL ANIMATION ---
const expHeader = document.querySelector('#experience .projects-header-left, #experience .experience-header-wrapper');
const expCardElements = document.querySelectorAll('.experience-card');

// Observe the header separately
if (expHeader) {
    const headerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                expHeader.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.15
    });
    headerObserver.observe(expHeader);
}

// Observe each card individually so they reveal as they scroll into view
if (expCardElements.length > 0) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('is-visible');
                // Clear transitionDelay after animation finishes so hover is instant
                setTimeout(() => {
                    card.style.transitionDelay = '0ms';
                }, 750);
                observer.unobserve(card);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.1
    });

    expCardElements.forEach((card, index) => {
        // Stagger via transition-delay so each card slides in slightly after the previous
        card.style.transitionDelay = `${index * 90}ms`;
        cardObserver.observe(card);
    });
}

applyGlowColors();

// --- PROJECT CARDS SCROLL REVEAL & STACKING ANIMATION ---
const projectCardsReveal = document.querySelectorAll('.project-card');

const projectCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const allVisibleCards = Array.from(projectCardsReveal).filter(c => !c.classList.contains('hidden'));
            const cardIndex = allVisibleCards.indexOf(entry.target);
            const delay = cardIndex >= 0 ? Math.min(cardIndex * 100, 300) : 0;

            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, delay);

            projectCardObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
});

function getActiveProjectCards() {
    return Array.from(document.querySelectorAll('.projects-grid .project-card')).filter(c => {
        return !c.classList.contains('hidden') && !c.classList.contains('status-hidden');
    });
}

function refreshProjectStacking() {
    const visibleCards = getActiveProjectCards();
    visibleCards.forEach((card, i) => {
        card.style.setProperty('--card-index', i + 1);
        card.style.setProperty('--stack-offset', `${i * 12}px`);
        if (typeof projectCardObserver !== 'undefined') {
            projectCardObserver.observe(card);
        }
    });
    updateCardStacking();
}

// Scroll-driven card depth effect as cards stack over each other
function updateCardStacking() {
    const visibleCards = getActiveProjectCards();
    
    visibleCards.forEach((card, index) => {
        if (index < visibleCards.length - 1) {
            const nextCard = visibleCards[index + 1];
            const nextRect = nextCard.getBoundingClientRect();
            const currentStickyTop = 100 + index * 12;
            const triggerPoint = currentStickyTop + 250;
            
            if (nextRect.top < triggerPoint) {
                const progress = Math.min(1, Math.max(0, (triggerPoint - nextRect.top) / 350));
                const scale = 1 - (progress * 0.04);
                const brightness = 1 - (progress * 0.18);
                
                card.style.transform = `scale(${scale})`;
                card.style.filter = `brightness(${brightness})`;
            } else if (card.classList.contains('is-visible')) {
                card.style.transform = '';
                card.style.filter = '';
            }
        } else if (card.classList.contains('is-visible')) {
            card.style.transform = '';
            card.style.filter = '';
        }
    });
}

let isStackingTicking = false;
window.addEventListener('scroll', () => {
    if (!isStackingTicking) {
        requestAnimationFrame(() => {
            updateCardStacking();
            isStackingTicking = false;
        });
        isStackingTicking = true;
    }
}, { passive: true });
refreshProjectStacking();

// ============================================================
// --- CUSTOM MOUSE FOLLOWER BADGE (REFERENCE 2 INTERACTION) ---
// ============================================================
(function initCursorBadge() {
    // Only run on devices that support hover (desktop / mouse)
    if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        return;
    }

    // Ensure single instance of badge follower DOM element
    let badge = document.getElementById('custom-cursor-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'custom-cursor-badge';
        badge.className = 'cursor-badge-follower';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = '<span class="cursor-badge-text"></span>';
        document.body.appendChild(badge);
    }

    const badgeText = badge.querySelector('.cursor-badge-text');
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let isActive = false;
    let currentBadgeType = '';
    let currentText = '';
    let animFrameId = null;

    function getHoverConfig(target) {
        if (!target || !(target instanceof Element)) return null;

        // Never trigger cursor badges while preloader is active or main content is not revealed
        const activePreloader = document.getElementById('preloader');
        if (activePreloader && document.body.contains(activePreloader) && activePreloader.style.opacity !== '0') {
            return null;
        }
        const mainContentEl = document.getElementById('main-content');
        if (mainContentEl && !mainContentEl.classList.contains('visible')) {
            return null;
        }
        if (target.closest('.story-modal, .coming-soon-modal, .exp-modal-overlay, .floating-scroll-top-btn')) {
            return null;
        }

        // 1. Photo hover -> "It's me" (only on the actual profile photo)
        if (target.closest('.hero-image .photo-wrapper, .hero-image .profile-photo, .photo-wrapper, .profile-photo, [data-cursor="photo"], [data-cursor="me"]')) {
            return { text: "It's me", type: 'photo' };
        }

        // 2. About text statement -> "Know more"
        if (target.closest('.about-text, #about-text, [data-cursor="about"]')) {
            return { text: "Know more", type: 'about' };
        }

        // 3. Project card -> "View Case Study"
        if (target.closest('.project-card, .archive-card, [data-cursor="project"]')) {
            return { text: "View Case Study", type: 'project' };
        }

        // 4. Experience card -> "View Experience"
        if (target.closest('.experience-card, [data-cursor="experience"]')) {
            return { text: "View Experience", type: 'experience' };
        }

        // Generic support for custom data attributes
        const customEl = target.closest('[data-cursor-text]');
        if (customEl) {
            return {
                text: customEl.getAttribute('data-cursor-text'),
                type: customEl.getAttribute('data-cursor-type') || 'default'
            };
        }

        return null;
    }

    function updateBadgePosition() {
        const ease = 0.22;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        badge.style.setProperty('--x', `${currentX.toFixed(2)}px`);
        badge.style.setProperty('--y', `${currentY.toFixed(2)}px`);

        if (isActive || Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
            animFrameId = requestAnimationFrame(updateBadgePosition);
        } else {
            animFrameId = null;
        }
    }

    function setBadgeActive(config, x, y) {
        if (!config) return;

        // Offset slightly to the bottom right of the cursor pointer
        const offsetX = 14;
        const offsetY = 14;
        
        let posX = x + offsetX;
        let posY = y + offsetY;

        // Keep inside viewport bounds
        const badgeWidth = badge.offsetWidth || 120;
        const badgeHeight = badge.offsetHeight || 36;
        if (posX + badgeWidth > window.innerWidth - 12) {
            posX = x - badgeWidth - 10;
        }
        if (posY + badgeHeight > window.innerHeight - 12) {
            posY = y - badgeHeight - 10;
        }

        targetX = posX;
        targetY = posY;

        // First appearance snap
        if (!isActive) {
            currentX = targetX;
            currentY = targetY;
            badge.style.setProperty('--x', `${currentX}px`);
            badge.style.setProperty('--y', `${currentY}px`);
        }

        // Smooth text morph when changing target text
        if (currentText !== config.text) {
            currentText = config.text;
            if (badgeText) {
                badgeText.classList.add('is-changing');
                setTimeout(() => {
                    badgeText.textContent = currentText;
                    badgeText.classList.remove('is-changing');
                }, 60);
            }
        }

        // Update styling variant
        if (currentBadgeType !== config.type) {
            badge.classList.remove(
                'cursor-badge-follower--photo',
                'cursor-badge-follower--about',
                'cursor-badge-follower--project',
                'cursor-badge-follower--experience'
            );
            if (config.type) {
                badge.classList.add(`cursor-badge-follower--${config.type}`);
            }
            currentBadgeType = config.type;
        }

        if (!isActive) {
            isActive = true;
            badge.classList.remove('is-hiding');
            badge.classList.add('is-active');
        }

        if (!animFrameId) {
            animFrameId = requestAnimationFrame(updateBadgePosition);
        }
    }

    function setBadgeInactive() {
        if (!isActive) return;
        isActive = false;
        badge.classList.remove('is-active');
        badge.classList.add('is-hiding');
    }

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const config = getHoverConfig(e.target);
        if (config) {
            setBadgeActive(config, mouseX, mouseY);
        } else {
            setBadgeInactive();
        }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        setBadgeInactive();
    });

    window.addEventListener('scroll', () => {
        if (isActive) {
            setBadgeInactive();
        }
    }, { passive: true });
})();

// --- FLOATING BOTTOM-CENTER SCROLL TO TOP BUTTON (All Projects & Project Pages) ---
(function initFloatingScrollTopButton() {
    const isProjectsContext = () => {
        const path = (window.location.pathname || '').toLowerCase();
        return (
            path.includes('projects.html') ||
            path.includes('/projects/') ||
            Boolean(document.getElementById('archive-grid')) ||
            Boolean(document.querySelector('.project-details-page, .case-study-stage'))
        );
    };

    function setupScrollTopBtn() {
        if (!isProjectsContext()) return;
        let btn = document.getElementById('floating-scroll-top-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'floating-scroll-top-btn';
            btn.className = 'floating-scroll-top-btn';
            btn.setAttribute('aria-label', 'Scroll to top');
            btn.setAttribute('title', 'Back to top');
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            document.body.appendChild(btn);
        }

        const updateVisibility = () => {
            if (window.scrollY > 300) {
                btn.classList.add('is-visible');
            } else {
                btn.classList.remove('is-visible');
            }
        };

        window.addEventListener('scroll', updateVisibility, { passive: true });
        updateVisibility();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScrollTopBtn);
    } else {
        setupScrollTopBtn();
    }
})();



