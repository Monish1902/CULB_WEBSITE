/* ==========================================================================
   Kreatorz Robotics Club - Dynamic Renderer JS
   Connects localStorage KreatorzStore to HTML page views
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderDynamicPages();
});

// Re-render if data store updates
window.addEventListener('kreatorzDataUpdated', () => {
  renderDynamicPages();
});

function renderDynamicPages() {
  if (!window.KreatorzStore) return;

  // Always update global site name and branding across headers/footers
  updateAllBrandingInUI();

  const path = window.location.pathname;

  // 1. HOME PAGE
  if (path.endsWith('/') || path.endsWith('index.html')) {
    renderHomePage();
  }

  // 2. PROJECTS PAGE
  if (path.includes('projects.html')) {
    renderProjectsPage();
  }

  // 3. TEAM PAGE
  if (path.includes('team.html')) {
    renderTeamPage();
  }

  // 4. ACHIEVEMENTS PAGE
  if (path.includes('achievements.html')) {
    renderAchievementsPage();
  }

  // 5. BLOGS PAGE
  if (path.includes('blogs.html')) {
    renderBlogsPage();
  }

  // 6. ABOUT PAGE
  if (path.includes('about.html')) {
    renderAboutPage();
  }

  // 7. CONTACT PAGE
  if (path.includes('contact.html')) {
    renderContactPage();
  }
}

/* --- Render Functions --- */

function renderHomePage() {
  const homeData = KreatorzStore.getHome();
  const siteImages = KreatorzStore.getSiteImages ? KreatorzStore.getSiteImages() : {};
  const projects = KreatorzStore.getProjects();

  // Initialize Hero Banner Slideshow
  initHeroSlideshow();

  const labImgEl = document.getElementById('home-lab-img');
  if (labImgEl && siteImages.labImg) {
    labImgEl.src = siteImages.labImg;
  }

  // Hero title & text
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1 && homeData.heroTitle) {
    heroH1.textContent = homeData.heroTitle;
  }

  const heroP = document.querySelector('.hero-content p');
  if (heroP && homeData.heroSubtitle) {
    heroP.textContent = homeData.heroSubtitle;
  }

  // Stats
  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer && homeData.stats && homeData.stats.length) {
    statsContainer.innerHTML = homeData.stats.map(s => `
      <div class="stat-card">
        <div class="stat-num">${escapeHtml(s.number)}</div>
        <div class="stat-label">${escapeHtml(s.label)}</div>
      </div>
    `).join('');
  }

  // Featured Projects Grid (show top 3)
  const featuredGrid = document.getElementById('featured-projects-grid') || document.querySelector('.featured-projects-grid');
  if (featuredGrid && projects.length) {
    const featuredList = projects.slice(0, 3);
    featuredGrid.innerHTML = featuredList.map(p => `
      <div class="nb-card" style="display: flex; flex-direction: column; height: 100%;">
        <div style="height: 200px; margin: -1.5rem -1.5rem 1.25rem -1.5rem; overflow: hidden; border-bottom: var(--border-width) solid var(--border-dark); position: relative;">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; right: 10px; background-color: ${p.badgeColor || '#2D5BFF'}; color: #fff; padding: 0.2rem 0.6rem; font-weight: 900; font-size: 0.7rem; border: var(--border-width) solid var(--border-dark); box-shadow: 2px 2px 0px #000;">
            ${escapeHtml(p.categoryLabel || p.category)}
          </span>
        </div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; text-transform: uppercase;">${escapeHtml(p.title)}</h3>
        <p style="font-size: 0.9rem; color: #444; flex-grow: 1; margin-bottom: 1rem;">${escapeHtml(p.summary)}</p>
        <a href="${escapeHtml(p.detailLink || 'projects.html')}" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem;">VIEW BUILD SPECS →</a>
      </div>
    `).join('');
  }
}

function renderProjectsPage() {
  const projects = KreatorzStore.getProjects();
  const container = document.getElementById('projects-grid-container');
  
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem;" class="nb-card"><h3>No projects created yet.</h3><p>Use the Admin Panel to add new robotics builds!</p></div>`;
    return;
  }

  container.innerHTML = projects.map((p, index) => {
    // Alternating layout: index 0 (Block 1) = Text Left, Image Right; index 1 (Block 2) = Image Left, Text Right (reverse)
    const isReverse = index % 2 === 1;
    const badgeBg = p.badgeColor || '#2D5BFF';

    return `
      <div class="project-alt-block ${isReverse ? 'reverse' : ''} reveal">
        <div class="project-alt-img-wrap">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <span class="project-alt-badge" style="background-color: ${badgeBg};">
            ${escapeHtml(p.categoryLabel || p.category || 'PROJECT')}
          </span>
        </div>

        <div class="project-alt-content">
          <div class="project-alt-eyebrow">// FEATURED BUILD 0${index + 1}</div>
          <h3 class="project-alt-title">${escapeHtml(p.title)}</h3>
          <p class="project-alt-desc">${escapeHtml(p.summary)}</p>

          ${p.specs && p.specs.length ? `
            <div class="project-alt-specs">
              ${p.specs.map(s => `
                <div class="project-alt-spec-item">
                  <label>${escapeHtml(s.label)}</label>
                  <span>${escapeHtml(s.value)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <a href="${escapeHtml(p.detailLink || '#')}" class="btn btn-primary">
              EXPLORE TECHNICAL SPECS →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Trigger scroll observer for new reveal elements
  if (window.initScrollAnimations) {
    window.initScrollAnimations();
  }
}

function renderTeamPage() {
  const team = KreatorzStore.getTeam();
  const grid = document.getElementById('team-grid-container');

  if (!grid) return;

  if (!team.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;" class="nb-card"><h3>No team members listed yet.</h3></div>`;
    return;
  }

  grid.innerHTML = team.map(m => `
    <div class="nb-card" style="display: flex; flex-direction: column; text-align: center;">
      <div style="width: 130px; height: 130px; margin: 0 auto 1.25rem; border-radius: 50%; border: var(--border-width) solid var(--border-dark); overflow: hidden; box-shadow: 3px 3px 0px #0D0D0D;">
        <img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="font-size: 0.75rem; font-weight: 900; color: var(--electric-blue); text-transform: uppercase; margin-bottom: 0.2rem;">${escapeHtml(m.division || '')}</div>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem; text-transform: uppercase;">${escapeHtml(m.name)}</h3>
      <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: #555; margin-bottom: 0.75rem; text-transform: uppercase;">${escapeHtml(m.role)} • ${escapeHtml(m.year || '')}</div>
      <p style="font-size: 0.88rem; color: #444; margin-top: auto; line-height: 1.4;">${escapeHtml(m.bio)}</p>
    </div>
  `).join('');
}

function renderAchievementsPage() {
  const achievements = KreatorzStore.getAchievements();
  const grid = document.getElementById('achievements-grid-container');

  if (!grid) return;

  if (!achievements.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;" class="nb-card"><h3>No achievements logged yet.</h3></div>`;
    return;
  }

  grid.innerHTML = achievements.map(a => `
    <div class="nb-card" style="display: flex; flex-direction: column; position: relative;">
      ${a.image ? `
        <div style="height: 180px; margin: -1.5rem -1.5rem 1rem -1.5rem; overflow: hidden; border-bottom: var(--border-width) solid var(--border-dark);">
          <img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <span style="background-color: ${a.badgeColor || '#2D5BFF'}; color: #FFF; padding: 0.25rem 0.6rem; font-weight: 900; font-size: 0.75rem; border: var(--border-width) solid var(--border-dark); box-shadow: 2px 2px 0px #000;">
          ${escapeHtml(a.rank || 'PODIUM')}
        </span>
        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: var(--text-dark);">${escapeHtml(a.year)}</span>
      </div>

      <h3 style="font-size: 1.3rem; margin-bottom: 0.3rem; text-transform: uppercase;">${escapeHtml(a.title)}</h3>
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--electric-blue); text-transform: uppercase; margin-bottom: 1rem;">${escapeHtml(a.competition)}</div>
      <p style="font-size: 0.92rem; color: #333; line-height: 1.5;">${escapeHtml(a.description)}</p>
    </div>
  `).join('');
}

function renderBlogsPage() {
  const blogs = KreatorzStore.getBlogs();
  const grid = document.getElementById('blogs-grid-container');

  if (!grid) return;

  if (!blogs.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem;" class="nb-card"><h3>No blog dispatches published yet.</h3></div>`;
    return;
  }

  grid.innerHTML = blogs.map(b => `
    <div class="nb-card blog-card-item" data-category="${escapeHtml(b.category || 'all')}" style="display: flex; flex-direction: column;">
      <div style="height: 200px; margin: -1.5rem -1.5rem 1.25rem -1.5rem; overflow: hidden; border-bottom: var(--border-width) solid var(--border-dark); position: relative;">
        <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" style="width: 100%; height: 100%; object-fit: cover;" />
        <span style="position: absolute; top: 10px; right: 10px; background-color: var(--electric-blue); color: #fff; padding: 0.2rem 0.6rem; font-weight: 900; font-size: 0.7rem; border: var(--border-width) solid var(--border-dark); box-shadow: 2px 2px 0px #000;">
          ${escapeHtml(b.categoryLabel || b.category)}
        </span>
      </div>

      <div style="font-size: 0.8rem; font-weight: 700; color: #666; margin-bottom: 0.4rem;">
        BY ${escapeHtml(b.author).toUpperCase()} • ${escapeHtml(b.date).toUpperCase()}
      </div>

      <h3 style="font-size: 1.25rem; margin-bottom: 0.6rem; text-transform: uppercase;">${escapeHtml(b.title)}</h3>
      <p style="font-size: 0.9rem; color: #333; margin-bottom: 1.25rem; flex-grow: 1;">${escapeHtml(b.snippet)}</p>

      <button onclick="openBlogModal('${escapeHtml(b.id)}')" class="btn btn-secondary" style="width: 100%;">READ FULL DISPATCH →</button>
    </div>
  `).join('');
}

function renderAboutPage() {
  const about = KreatorzStore.getAbout();
  const siteImages = KreatorzStore.getSiteImages ? KreatorzStore.getSiteImages() : {};

  const originImgEl = document.getElementById('about-origin-img');
  if (originImgEl && siteImages.aboutOriginImg) {
    originImgEl.src = siteImages.aboutOriginImg;
  }

  // Hero
  const heroH1 = document.querySelector('.page-hero-banner h1');
  if (heroH1 && about.heroTitle) heroH1.textContent = about.heroTitle;

  const heroP = document.querySelector('.page-hero-banner p');
  if (heroP && about.heroSubtitle) heroP.textContent = about.heroSubtitle;

  // Vision
  const visionP = document.getElementById('about-vision-text');
  if (visionP && about.visionText) visionP.textContent = about.visionText;

  // Milestones Timeline
  const timelineContainer = document.getElementById('milestones-timeline-container');
  if (timelineContainer && about.milestones && about.milestones.length) {
    timelineContainer.innerHTML = about.milestones.map(m => `
      <div class="nb-card" style="margin-bottom: 1.5rem; border-left: 6px solid var(--electric-blue);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--electric-blue);">${escapeHtml(m.year)}</span>
          <span style="font-weight: 900; font-size: 0.8rem; text-transform: uppercase;">MILESTONE</span>
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem; text-transform: uppercase;">${escapeHtml(m.title)}</h3>
        <p style="font-size: 0.9rem; color: #444;">${escapeHtml(m.desc)}</p>
      </div>
    `).join('');
  }
}

function renderContactPage() {
  const contact = KreatorzStore.getContact();

  const emailEl = document.getElementById('contact-disp-email');
  if (emailEl && contact.email) emailEl.textContent = contact.email;

  const phoneEl = document.getElementById('contact-disp-phone');
  if (phoneEl && contact.phone) phoneEl.textContent = contact.phone;

  const hoursEl = document.getElementById('contact-disp-hours');
  if (hoursEl && contact.hours) hoursEl.textContent = contact.hours;

  const addressEl = document.getElementById('contact-disp-address');
  if (addressEl && contact.address) addressEl.textContent = contact.address;

  // Intercept Contact Form to log into Admin Inbox
  const contactForm = document.getElementById('contact-form');
  if (contactForm && !contactForm.dataset.boundAdminStore) {
    contactForm.dataset.boundAdminStore = "true";
    contactForm.addEventListener('submit', (e) => {
      const name = contactForm.querySelector('input[type="text"]')?.value || 'Anonymous';
      const email = contactForm.querySelector('input[type="email"]')?.value || '';
      const message = contactForm.querySelector('textarea')?.value || '';

      if (window.KreatorzStore) {
        KreatorzStore.addMessage({ name, email, message });
      }
    });
  }
}

// Global Blog Reader Modal
window.openBlogModal = function(id) {
  const blogs = KreatorzStore.getBlogs();
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;

  let modal = document.getElementById('blog-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blog-reader-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 800px; width: 92%; max-height: 85vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: var(--border-width) solid var(--border-dark); padding-bottom: 0.75rem;">
          <span id="blog-modal-category" class="eyebrow-tag"></span>
          <button id="blog-modal-close-x" style="background: none; border: none; font-size: 1.5rem; font-weight: 900; cursor: pointer;">✕</button>
        </div>
        <div style="height: 250px; overflow: hidden; border: var(--border-width) solid var(--border-dark); margin-bottom: 1.25rem;">
          <img id="blog-modal-img" src="" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h2 id="blog-modal-title" style="font-size: 1.8rem; text-transform: uppercase; margin-bottom: 0.5rem;"></h2>
        <div id="blog-modal-meta" style="font-size: 0.85rem; font-weight: 700; color: #666; margin-bottom: 1.5rem;"></div>
        <div id="blog-modal-content" style="font-size: 1rem; line-height: 1.7; color: #222; margin-bottom: 2rem;"></div>
        <button id="blog-modal-close-btn" class="btn btn-primary" style="width: 100%;">CLOSE DISPATCH</button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#blog-modal-close-btn');
    const closeX = modal.querySelector('#blog-modal-close-x');
    const closeFn = () => modal.classList.remove('active');
    closeBtn.addEventListener('click', closeFn);
    closeX.addEventListener('click', closeFn);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFn();
    });
  }

  document.getElementById('blog-modal-category').textContent = blog.categoryLabel || blog.category || 'ARTICLE';
  document.getElementById('blog-modal-img').src = blog.image;
  document.getElementById('blog-modal-title').textContent = blog.title;
  document.getElementById('blog-modal-meta').textContent = `WRITTEN BY ${blog.author.toUpperCase()} • PUBLISHED ON ${blog.date.toUpperCase()}`;
  document.getElementById('blog-modal-content').innerHTML = blog.content || `<p>${escapeHtml(blog.snippet)}</p>`;

  setTimeout(() => modal.classList.add('active'), 10);
};

let heroSlideshowTimer = null;
let currentHeroSlideIndex = 0;

function initHeroSlideshow() {
  const container = document.getElementById('home-hero-slideshow');
  if (!container) return;

  const slides = KreatorzStore.getHeroSlides ? KreatorzStore.getHeroSlides() : [];
  if (!slides || !slides.length) return;

  // Clear existing timer
  if (heroSlideshowTimer) {
    clearInterval(heroSlideshowTimer);
    heroSlideshowTimer = null;
  }

  currentHeroSlideIndex = 0;

  // Build Slideshow HTML (Clean slideshow without buttons, counters, or overlay dots)
  container.innerHTML = `
    <!-- Slide Images Layer -->
    <div id="hero-slides-wrapper" style="position: relative; width: 100%; height: 100%;">
      ${slides.map((url, i) => `
        <div class="hero-slide-item" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: ${i === 0 ? '1' : '0'}; transition: opacity 0.8s ease-in-out; z-index: ${i === 0 ? '2' : '1'};">
          <img src="${escapeHtml(url)}" alt="Kreatorz Hero Slide ${i + 1}" style="width: 100%; height: 100%; object-fit: cover; display: block;" referrerPolicy="no-referrer" />
        </div>
      `).join('')}
    </div>
  `;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentHeroSlideIndex = index;

    const slideItems = container.querySelectorAll('.hero-slide-item');
    slideItems.forEach((item, idx) => {
      if (idx === currentHeroSlideIndex) {
        item.style.opacity = '1';
        item.style.zIndex = '2';
      } else {
        item.style.opacity = '0';
        item.style.zIndex = '1';
      }
    });
  }

  function nextSlide() {
    goToSlide(currentHeroSlideIndex + 1);
  }

  function startAutoplay() {
    if (heroSlideshowTimer) clearInterval(heroSlideshowTimer);
    heroSlideshowTimer = setInterval(nextSlide, 3500);
  }

  if (slides.length > 1) {
    startAutoplay();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* --- Global Branding / Site Name Renderer --- */
function updateAllBrandingInUI() {
  if (!window.KreatorzStore || !KreatorzStore.getSiteInfo) return;
  const siteInfo = KreatorzStore.getSiteInfo();
  const siteName = siteInfo.siteName || "Kreatorz";
  const siteIcon = siteInfo.siteIcon || "K";

  // 1. Navbar Brand Logos (text & icon badge)
  document.querySelectorAll('.brand-logo').forEach(logoEl => {
    const iconSpan = logoEl.querySelector('.brand-logo-icon');
    const textSpan = logoEl.querySelector('span:not(.brand-logo-icon)');
    if (iconSpan) iconSpan.textContent = siteIcon;
    if (textSpan) textSpan.textContent = siteName.toUpperCase();
  });

  // 2. Admin Header Title & Login Card Header
  const adminHeaderTitle = document.getElementById('admin-header-title');
  if (adminHeaderTitle) {
    adminHeaderTitle.textContent = `${siteName.toUpperCase()} ADMIN CENTER`;
  }

  // 3. Footer Copyright
  const footerCopyright = document.querySelector('.footer-bottom div:first-child');
  if (footerCopyright) {
    footerCopyright.textContent = `© ${new Date().getFullYear()} ${siteName} Robotics Club, MVGR CE. All rights reserved.`;
  }
}
window.updateAllBrandingInUI = updateAllBrandingInUI;
