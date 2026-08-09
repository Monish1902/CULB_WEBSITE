/* ==========================================================================
   Kreatorz Robotics Club - Master UI & Interactions JS
   ========================================================================== */

import '../css/styles.css';
import '../css/three-showcase.css';
import './data-store.js';
import './render-store.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  if (window.renderDynamicPages) {
    window.renderDynamicPages();
  } else if (window.updateAllBrandingInUI) {
    window.updateAllBrandingInUI();
  }
  initNavbar();
  initActiveNav();
  initScrollReveal();
  initBlogFilters();
  initAccordions();
  initForms();
  initSmoothScroll();
  initMagneticDotsBackground();
}

/* 1. Mobile Menu & Sticky Navbar */
function initNavbar() {
  const navbar = document.querySelector('.sticky-navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* 2. Highlight Active Nav Link */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    link.classList.remove('active');

    // Handle root index or specific HTML files
    if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
      if (href === 'index.html' || href === './' || href === '/') {
        link.classList.add('active');
      }
    } else if (href !== '#' && currentPath.includes(href.replace('./', ''))) {
      link.classList.add('active');
    }
  });
}

/* 3. Scroll Reveal via Intersection Observer */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* 4. Blog Category Filter Pills */
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card-item');

  if (!filterBtns.length || !blogCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      // Filter cards
      blogCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. FAQ Accordion Toggle */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 6. Form Handling & Success Modal */
function initForms() {
  const joinForm = document.getElementById('join-lab-form');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showSuccessModal(
        'APPLICATION RECEIVED!',
        'Thank you for applying to Kreatorz! Our team will review your application and contact you for workshop orientation.'
      );
      joinForm.reset();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showSuccessModal(
        'MESSAGE TRANSMITTED!',
        'Your message has been dispatched to the Kreatorz technical advisory board. Expect a response within 24 hours.'
      );
      contactForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showSuccessModal(
        'SUBSCRIBED TO WORKBENCH INTEL!',
        'You are now on the official dispatch list. Look out for build logs, hardware teardowns, and event announcements.'
      );
      newsletterForm.reset();
    });
  }
}

function showSuccessModal(title, message) {
  let modalOverlay = document.getElementById('custom-success-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'custom-success-modal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚙️</div>
        <h3 id="modal-title" style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.75rem; text-transform: uppercase; color: var(--text-dark);"></h3>
        <p id="modal-message" style="margin-bottom: 1.5rem; color: #444444; font-size: 0.95rem;"></p>
        <button id="modal-close-btn" class="btn btn-primary" style="width: 100%;">ACKNOWLEDGE & CLOSE</button>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('#modal-close-btn');
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  
  // Trigger animation
  setTimeout(() => {
    modalOverlay.classList.add('active');
  }, 10);
}

/* 7. Smooth Scroll Helper */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* 8. Interactive Magnetic Grey Dotted Background Canvas */
function initMagneticDotsBackground() {
  if (document.getElementById('bg-magnetic-dots')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'bg-magnetic-dots';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    background: transparent;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dots = [];

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovered: false
  };

  const SPACING = 30;
  const MAGNET_RADIUS = 180;
  const MAX_PULL = 55;
  const BASE_DOT_RADIUS = 2.4;
  const MAX_DOT_RADIUS = 4.8;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createDots();
  }

  function createDots() {
    dots = [];
    const cols = Math.ceil(width / SPACING) + 2;
    const rows = Math.ceil(height / SPACING) + 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const baseX = i * SPACING - (SPACING / 2);
        const baseY = j * SPACING - (SPACING / 2);

        dots.push({
          gridX: baseX,
          gridY: baseY,
          x: baseX,
          y: baseY,
          radius: BASE_DOT_RADIUS,
          alpha: 0.65
        });
      }
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isHovered = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.isHovered = false;
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;

    const centerX = width / 2;
    const centerY = height / 2;
    const offsetX = mouse.isHovered ? (mouse.x - centerX) * 0.025 : 0;
    const offsetY = mouse.isHovered ? (mouse.y - centerY) * 0.025 : 0;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      const anchorX = dot.gridX + offsetX;
      const anchorY = dot.gridY + offsetY;

      let targetX = anchorX;
      let targetY = anchorY;
      let targetRadius = BASE_DOT_RADIUS;
      let targetAlpha = 0.65;
      let targetColor = 'gray'; // 'gray' or 'blue'

      if (mouse.isHovered) {
        const dx = mouse.x - anchorX;
        const dy = mouse.y - anchorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNET_RADIUS && dist > 0.1) {
          const factor = Math.pow(1 - dist / MAGNET_RADIUS, 1.8);
          const pull = factor * MAX_PULL;
          const angle = Math.atan2(dy, dx);

          targetX = anchorX + Math.cos(angle) * pull;
          targetY = anchorY + Math.sin(angle) * pull;

          targetRadius = BASE_DOT_RADIUS + factor * (MAX_DOT_RADIUS - BASE_DOT_RADIUS);
          targetAlpha = 0.75 + factor * 0.25;
          targetColor = 'blue';
        }
      }

      dot.x += (targetX - dot.x) * 0.14;
      dot.y += (targetY - dot.y) * 0.14;
      dot.radius += (targetRadius - dot.radius) * 0.14;
      dot.alpha += (targetAlpha - dot.alpha) * 0.14;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);

      if (targetColor === 'blue') {
        // Vibrant electric blue when attracted
        ctx.fillStyle = `rgba(45, 91, 255, ${dot.alpha})`;
      } else {
        // Crisp dark charcoal grey dots
        ctx.fillStyle = `rgba(18, 18, 18, ${dot.alpha})`;
      }
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
