// ==========================================================================
// CONVERGE 2025: RULEBOOK PUBLICATION DESIGN
// Portfolio Interactions — Rehan Jose (rehanjose.com)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Minimal Scroll Progress Line
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 2. 3D Book Interactive Parallax & View Toggle
  const scene = document.getElementById('heroScene');
  const book = document.getElementById('bookObject');
  const toggleBtn = document.getElementById('toggleBookPerspective');

  let isFlattened = false;

  if (scene && book) {
    scene.addEventListener('mousemove', (e) => {
      if (isFlattened) return;
      const rect = scene.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotY = -20 + (x / rect.width) * 32;
      const rotX = 15 - (y / rect.height) * 22;

      book.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(2deg)`;
    });

    scene.addEventListener('mouseleave', () => {
      if (isFlattened) return;
      book.style.transform = `rotateX(15deg) rotateY(-20deg) rotateZ(2deg)`;
    });
  }

  if (toggleBtn && book) {
    toggleBtn.addEventListener('click', () => {
      isFlattened = !isFlattened;
      if (isFlattened) {
        book.classList.add('book-flattened');
        toggleBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          3D Perspective View
        `;
      } else {
        book.classList.remove('book-flattened');
        toggleBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
          Flat Cover View
        `;
      }
    });
  }

  // 3. Lightbox Inspection Modal
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  const inspectables = document.querySelectorAll('[data-inspect-src]');
  let currentIndex = 0;
  const inspectList = Array.from(inspectables);

  function openModal(index) {
    if (!modal || !modalImg) return;
    currentIndex = index;
    const el = inspectList[index];
    const src = el.getAttribute('data-inspect-src');
    const caption = el.getAttribute('data-inspect-caption') || 'Publication Spread';

    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = caption;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  inspectList.forEach((el, idx) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight' && inspectList.length > 0) openModal((currentIndex + 1) % inspectList.length);
    if (e.key === 'ArrowLeft' && inspectList.length > 0) openModal((currentIndex - 1 + inspectList.length) % inspectList.length);
  });

  // 4. Subtle Reveal Animations
  const revealTargets = document.querySelectorAll('.editorial-spread-frame, .stat-strip, .identity-story-card, .apparel-tile, .icon-stamp-box');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
