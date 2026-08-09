/* ==========================================================================
   Kreatorz Robotics Club - Admin Panel Controller JS
   ========================================================================== */

const ADMIN_ID = "Kreatroz";
const ADMIN_PASS = "We are Kreatorz!";

document.addEventListener('DOMContentLoaded', () => {
  if (window.updateAllBrandingInUI) {
    window.updateAllBrandingInUI();
  }
  initAdminAuth();
  initAdminTabs();
});

/* --------------------------------------------------------------------------
   1. AUTHENTICATION CONTROLLER
   -------------------------------------------------------------------------- */
function initAdminAuth() {
  const loginForm = document.getElementById('admin-login-form');
  const loginScreen = document.getElementById('admin-login-screen');
  const workspace = document.getElementById('admin-workspace');
  const headerActions = document.getElementById('admin-header-actions');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const errorMsg = document.getElementById('login-error-msg');

  // Check existing session
  if (sessionStorage.getItem('kreatorz_admin_auth') === 'true') {
    showWorkspace();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idInput = document.getElementById('login-id').value.trim();
      const passInput = document.getElementById('login-pass').value.trim();

      // Flexible check to match exact required ID 'Kreatroz' or case variants
      if ((idInput === ADMIN_ID || idInput.toLowerCase() === 'kreatroz' || idInput.toLowerCase() === 'kreatorz') && passInput === ADMIN_PASS) {
        sessionStorage.setItem('kreatorz_admin_auth', 'true');
        if (errorMsg) errorMsg.style.display = 'none';
        showWorkspace();
        showToast("WELCOME BACK, KREATROZ!");
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('kreatorz_admin_auth');
      loginScreen.style.display = 'block';
      workspace.style.display = 'none';
      headerActions.style.display = 'none';
      showToast("LOGGED OUT OF ADMIN PANEL");
    });
  }

  function showWorkspace() {
    loginScreen.style.display = 'none';
    workspace.style.display = 'block';
    headerActions.style.display = 'flex';
    loadAllAdminData();
  }
}

/* --------------------------------------------------------------------------
   2. TAB SWITCHER
   -------------------------------------------------------------------------- */
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-sidebar-link, .admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Highlight all matching buttons/links for this targetId
      document.querySelectorAll(`[data-tab="${targetId}"]`).forEach(el => el.classList.add('active'));
      
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        // Scroll to top of main area
        const mainArea = document.querySelector('.admin-main-area');
        if (mainArea) mainArea.scrollTop = 0;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. DATA LOADERS & FORM BINDINGS
   -------------------------------------------------------------------------- */
function loadAllAdminData() {
  if (!window.KreatorzStore) return;

  loadHomeTab();
  loadAboutTab();
  loadProjectsTab();
  loadTeamTab();
  loadAchievementsTab();
  loadBlogsTab();
  loadImagesTab();
  loadContactTab();
  initSystemTab();
}

/* --- HOME TAB --- */
function loadHomeTab() {
  const home = KreatorzStore.getHome();
  const siteImages = KreatorzStore.getSiteImages ? KreatorzStore.getSiteImages() : {};
  const siteInfo = KreatorzStore.getSiteInfo ? KreatorzStore.getSiteInfo() : { siteName: "Kreatorz", siteTagline: "ROBOTICS CLUB • MVGR CE", siteIcon: "K" };

  // 0. Website Name & Branding
  const siteNameInput = document.getElementById('site-branding-name');
  const siteIconInput = document.getElementById('site-branding-icon');
  const siteTaglineInput = document.getElementById('site-branding-tagline');

  if (siteNameInput) siteNameInput.value = siteInfo.siteName || 'Kreatorz';
  if (siteIconInput) siteIconInput.value = siteInfo.siteIcon || 'K';
  if (siteTaglineInput) siteTaglineInput.value = siteInfo.siteTagline || '';

  const formBranding = document.getElementById('form-site-branding');
  if (formBranding) {
    formBranding.onsubmit = (e) => {
      e.preventDefault();
      const newName = siteNameInput.value.trim() || 'Kreatorz';
      const newIcon = siteIconInput.value.trim() || 'K';
      const newTagline = siteTaglineInput.value.trim();

      KreatorzStore.updateSiteInfo({
        siteName: newName,
        siteIcon: newIcon,
        siteTagline: newTagline
      });

      showToast("WEBSITE NAME & BRANDING UPDATED!");
      if (window.updateAllBrandingInUI) {
        window.updateAllBrandingInUI();
      }
    };
  }

  // Render hero slideshow grid in Home tab
  renderHeroSlideshowAdmin();

  // Populate Home section photos
  const homeLabUrlInput = document.getElementById('home-tab-img-url-labImg');
  const homeLabPrevImg = document.getElementById('home-tab-img-prev-labImg');
  if (homeLabUrlInput) homeLabUrlInput.value = siteImages.labImg || '';
  if (homeLabPrevImg) homeLabPrevImg.src = siteImages.labImg || '';

  // Attach listener for file uploader on home tab
  document.querySelectorAll('.home-tab-file-uploader').forEach(fileInput => {
    fileInput.onchange = (e) => {
      const targetId = fileInput.getAttribute('data-target');
      const previewId = fileInput.getAttribute('data-preview');
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const targetInput = document.getElementById(targetId);
        const previewImg = document.getElementById(previewId);
        if (targetInput) targetInput.value = evt.target.result;
        if (previewImg) previewImg.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };
  });

  // Attach listener for adding new slide from local file on Home tab
  const homeTabNewSlideFile = document.getElementById('home-tab-new-hero-slide-file');
  if (homeTabNewSlideFile) {
    homeTabNewSlideFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const slides = KreatorzStore.getHeroSlides();
        slides.push(evt.target.result);
        KreatorzStore.updateHeroSlides(slides);
        renderHeroSlideshowAdmin();
        showToast("NEW HERO SLIDE UPLOADED & ADDED TO BANNER!");
      };
      reader.readAsDataURL(file);
    };
  }

  document.getElementById('home-hero-title').value = home.heroTitle || '';
  document.getElementById('home-hero-subtitle').value = home.heroSubtitle || '';
  document.getElementById('home-mission-title').value = home.missionTitle || '';
  document.getElementById('home-mission-desc').value = home.missionDescription || '';

  const formContent = document.getElementById('form-home-content');
  formContent.onsubmit = (e) => {
    e.preventDefault();
    KreatorzStore.updateHome({
      heroTitle: document.getElementById('home-hero-title').value,
      heroSubtitle: document.getElementById('home-hero-subtitle').value,
      missionTitle: document.getElementById('home-mission-title').value,
      missionDescription: document.getElementById('home-mission-desc').value,
    });
    showToast("HOME HERO & MISSION UPDATED!");
  };

  // Stats
  const statsContainer = document.getElementById('home-stats-fields-container');
  if (statsContainer && home.stats) {
    statsContainer.innerHTML = home.stats.map((s, idx) => `
      <div style="background-color: #FFF; padding: 1rem; border: var(--border-width) solid var(--border-dark);">
        <div class="admin-form-group">
          <label>STAT #${idx + 1} NUMBER</label>
          <input type="text" class="admin-input stat-num-input" value="${escapeAttr(s.number)}" required />
        </div>
        <div class="admin-form-group">
          <label>STAT #${idx + 1} LABEL</label>
          <input type="text" class="admin-input stat-label-input" value="${escapeAttr(s.label)}" required />
        </div>
      </div>
    `).join('');
  }

  const formStats = document.getElementById('form-home-stats');
  formStats.onsubmit = (e) => {
    e.preventDefault();
    const numInputs = document.querySelectorAll('.stat-num-input');
    const labelInputs = document.querySelectorAll('.stat-label-input');
    const newStats = [];

    numInputs.forEach((input, idx) => {
      newStats.push({
        number: input.value,
        label: labelInputs[idx] ? labelInputs[idx].value : ''
      });
    });

    KreatorzStore.updateHome({ stats: newStats });
    showToast("STATS METRICS SAVED!");
  };
}

/* --- ABOUT TAB --- */
function loadAboutTab() {
  const about = KreatorzStore.getAbout();

  document.getElementById('about-hero-title').value = about.heroTitle || '';
  document.getElementById('about-hero-subtitle').value = about.heroSubtitle || '';
  document.getElementById('about-vision-text').value = about.visionText || '';

  const formAbout = document.getElementById('form-about-content');
  formAbout.onsubmit = (e) => {
    e.preventDefault();
    KreatorzStore.updateAbout({
      heroTitle: document.getElementById('about-hero-title').value,
      heroSubtitle: document.getElementById('about-hero-subtitle').value,
      visionText: document.getElementById('about-vision-text').value
    });
    showToast("ABOUT US TEXT SAVED!");
  };

  renderMilestonesList();

  document.getElementById('add-milestone-btn').onclick = () => {
    openMilestoneModal();
  };
}

function renderMilestonesList() {
  const about = KreatorzStore.getAbout();
  const list = document.getElementById('admin-milestones-list');
  if (!list) return;

  list.innerHTML = (about.milestones || []).map((m, idx) => `
    <div style="background: #FFF; padding: 1rem; border: var(--border-width) solid var(--border-dark); margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <span style="font-weight: 900; color: var(--electric-blue);">${escapeAttr(m.year)}</span> — <strong>${escapeAttr(m.title)}</strong>
        <p style="font-size: 0.85rem; color: #555; margin-top: 0.2rem;">${escapeAttr(m.desc)}</p>
      </div>
      <div>
        <button onclick="editMilestone(${idx})" class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">EDIT</button>
        <button onclick="deleteMilestone(${idx})" class="btn btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background-color: #FF2D5B;">DELETE</button>
      </div>
    </div>
  `).join('');
}

window.deleteMilestone = function(idx) {
  if (!confirm("Are you sure you want to delete this milestone?")) return;
  const about = KreatorzStore.getAbout();
  about.milestones.splice(idx, 1);
  KreatorzStore.updateAbout({ milestones: about.milestones });
  renderMilestonesList();
  showToast("MILESTONE DELETED");
};

window.editMilestone = function(idx) {
  const about = KreatorzStore.getAbout();
  openMilestoneModal(about.milestones[idx], idx);
};

function openMilestoneModal(data = null, idx = null) {
  const isEdit = data !== null;
  const html = `
    <form id="form-milestone-modal">
      <div class="admin-form-group">
        <label>YEAR *</label>
        <input type="text" id="m-year" class="admin-input" value="${data ? escapeAttr(data.year) : ''}" required />
      </div>
      <div class="admin-form-group">
        <label>MILESTONE TITLE *</label>
        <input type="text" id="m-title" class="admin-input" value="${data ? escapeAttr(data.title) : ''}" required />
      </div>
      <div class="admin-form-group">
        <label>DESCRIPTION *</label>
        <textarea id="m-desc" class="admin-textarea" rows="3" required>${data ? escapeAttr(data.desc) : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">${isEdit ? 'UPDATE MILESTONE' : 'ADD MILESTONE'}</button>
    </form>
  `;

  openUniversalModal(isEdit ? "EDIT MILESTONE" : "ADD NEW MILESTONE", html);

  document.getElementById('form-milestone-modal').onsubmit = (e) => {
    e.preventDefault();
    const year = document.getElementById('m-year').value;
    const title = document.getElementById('m-title').value;
    const desc = document.getElementById('m-desc').value;

    const about = KreatorzStore.getAbout();
    if (!about.milestones) about.milestones = [];

    if (isEdit) {
      about.milestones[idx] = { year, title, desc };
    } else {
      about.milestones.push({ year, title, desc });
    }

    KreatorzStore.updateAbout({ milestones: about.milestones });
    closeUniversalModal();
    renderMilestonesList();
    showToast(isEdit ? "MILESTONE UPDATED!" : "MILESTONE ADDED!");
  };
}

/* --- PROJECTS TAB --- */
function loadProjectsTab() {
  renderAdminProjectsGrid();
  document.getElementById('add-project-btn').onclick = () => {
    openProjectModal();
  };
}

function renderAdminProjectsGrid() {
  const projects = KreatorzStore.getProjects();
  const grid = document.getElementById('admin-projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(p => `
    <div class="nb-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="height: 160px; margin: -1.5rem -1.5rem 1rem -1.5rem; overflow: hidden; border-bottom: var(--border-width) solid var(--border-dark);">
          <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <span class="eyebrow-tag" style="background-color: ${p.badgeColor || '#2D5BFF'}; color: #fff; margin-bottom: 0.5rem; font-size: 0.7rem;">${escapeAttr(p.categoryLabel || p.category)}</span>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem; text-transform: uppercase;">${escapeAttr(p.title)}</h3>
        <p style="font-size: 0.85rem; color: #555; margin-bottom: 1rem;">${escapeAttr(p.summary)}</p>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: auto;">
        <button onclick="editProject('${p.id}')" class="btn btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.8rem;">EDIT</button>
        <button onclick="deleteProject('${p.id}')" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: #FF2D5B;">DELETE</button>
      </div>
    </div>
  `).join('');
}

window.deleteProject = function(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  KreatorzStore.deleteProject(id);
  renderAdminProjectsGrid();
  if (typeof renderImagesManagerGrid === 'function') renderImagesManagerGrid();
  showToast("PROJECT DELETED");
};

window.editProject = function(id) {
  const projects = KreatorzStore.getProjects();
  const p = projects.find(item => item.id === id);
  if (p) openProjectModal(p);
};

function openProjectModal(p = null) {
  const isEdit = p !== null;
  const html = `
    <form id="form-project-modal">
      <div class="admin-form-group">
        <label>PROJECT TITLE *</label>
        <input type="text" id="p-title" class="admin-input" value="${p ? escapeAttr(p.title) : ''}" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>CATEGORY ID (e.g. aerial, combat) *</label>
          <input type="text" id="p-category" class="admin-input" value="${p ? escapeAttr(p.category) : 'aerial'}" required />
        </div>
        <div class="admin-form-group">
          <label>CATEGORY LABEL *</label>
          <input type="text" id="p-categoryLabel" class="admin-input" value="${p ? escapeAttr(p.categoryLabel) : 'AERIAL ROBOTICS'}" required />
        </div>
      </div>

      <div class="admin-form-group">
        <label>IMAGE URL OR LOCAL UPLOAD *</label>
        <div style="height: 120px; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.5rem; background: #EEE;">
          <img id="p-image-preview" src="${p ? escapeAttr(p.image) : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${p && p.image ? 'block' : 'none'};" />
        </div>
        <input type="text" id="p-image" class="admin-input" value="${p ? escapeAttr(p.image) : ''}" placeholder="https://images.unsplash.com/... or upload" required />
        <label class="btn btn-secondary" style="margin-top: 0.5rem; display: inline-block; cursor: pointer; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          📁 UPLOAD LOCAL IMAGE FILE
          <input type="file" id="p-image-file" accept="image/*" style="display: none;" />
        </label>
      </div>

      <div class="admin-form-group">
        <label>SUMMARY / SHORT DESCRIPTION *</label>
        <textarea id="p-summary" class="admin-textarea" rows="3" required>${p ? escapeAttr(p.summary) : ''}</textarea>
      </div>

      <div class="admin-form-group">
        <label>DETAIL PAGE LINK</label>
        <input type="text" id="p-detailLink" class="admin-input" value="${p ? escapeAttr(p.detailLink) : 'projects/drone.html'}" />
      </div>

      <div class="admin-form-group">
        <label>BADGE COLOR CODE</label>
        <input type="color" id="p-badgeColor" value="${p && p.badgeColor ? p.badgeColor : '#2D5BFF'}" style="height: 40px; cursor: pointer;" />
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">${isEdit ? 'UPDATE PROJECT' : 'SAVE NEW PROJECT'}</button>
    </form>
  `;

  openUniversalModal(isEdit ? "EDIT PROJECT" : "ADD NEW PROJECT", html);

  const fileInput = document.getElementById('p-image-file');
  const urlInput = document.getElementById('p-image');
  const previewImg = document.getElementById('p-image-preview');

  urlInput.oninput = () => {
    previewImg.src = urlInput.value;
    previewImg.style.display = urlInput.value ? 'block' : 'none';
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      urlInput.value = evt.target.result;
      previewImg.src = evt.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  document.getElementById('form-project-modal').onsubmit = (e) => {
    e.preventDefault();
    const itemData = {
      title: document.getElementById('p-title').value,
      category: document.getElementById('p-category').value,
      categoryLabel: document.getElementById('p-categoryLabel').value,
      image: document.getElementById('p-image').value,
      summary: document.getElementById('p-summary').value,
      detailLink: document.getElementById('p-detailLink').value,
      badgeColor: document.getElementById('p-badgeColor').value,
    };

    if (isEdit) {
      KreatorzStore.updateProject(p.id, itemData);
    } else {
      KreatorzStore.addProject(itemData);
    }

    closeUniversalModal();
    renderAdminProjectsGrid();
    if (typeof loadImagesTab === 'function') loadImagesTab();
    showToast(isEdit ? "PROJECT UPDATED!" : "PROJECT ADDED!");
  };
}

/* --- TEAM TAB --- */
function loadTeamTab() {
  renderAdminTeamGrid();
  document.getElementById('add-team-btn').onclick = () => {
    openTeamModal();
  };
}

function renderAdminTeamGrid() {
  const team = KreatorzStore.getTeam();
  const grid = document.getElementById('admin-team-grid');
  if (!grid) return;

  grid.innerHTML = team.map(m => `
    <div class="nb-card" style="display: flex; flex-direction: column; text-align: center;">
      <div style="width: 90px; height: 90px; border-radius: 50%; overflow: hidden; margin: 0 auto 0.75rem; border: var(--border-width) solid var(--border-dark);">
        <img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <h3 style="font-size: 1.1rem; text-transform: uppercase; margin-bottom: 0.2rem;">${escapeAttr(m.name)}</h3>
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--electric-blue); margin-bottom: 0.5rem;">${escapeAttr(m.role)}</div>
      <p style="font-size: 0.8rem; color: #555; margin-bottom: 1rem;">${escapeAttr(m.bio)}</p>

      <div style="display: flex; gap: 0.5rem; margin-top: auto;">
        <button onclick="editTeamMember('${m.id}')" class="btn btn-secondary" style="flex: 1; padding: 0.3rem; font-size: 0.75rem;">EDIT</button>
        <button onclick="deleteTeamMember('${m.id}')" class="btn btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background-color: #FF2D5B;">DELETE</button>
      </div>
    </div>
  `).join('');
}

window.deleteTeamMember = function(id) {
  if (!confirm("Are you sure you want to remove this team member?")) return;
  KreatorzStore.deleteTeamMember(id);
  renderAdminTeamGrid();
  if (typeof renderImagesManagerGrid === 'function') renderImagesManagerGrid();
  showToast("TEAM MEMBER REMOVED");
};

window.editTeamMember = function(id) {
  const team = KreatorzStore.getTeam();
  const m = team.find(item => item.id === id);
  if (m) openTeamModal(m);
};

function openTeamModal(m = null) {
  const isEdit = m !== null;
  const html = `
    <form id="form-team-modal">
      <div class="admin-form-group">
        <label>FULL NAME *</label>
        <input type="text" id="t-name" class="admin-input" value="${m ? escapeAttr(m.name) : ''}" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>ROLE / TITLE *</label>
          <input type="text" id="t-role" class="admin-input" value="${m ? escapeAttr(m.role) : ''}" placeholder="e.g. EMBEDDED LEAD" required />
        </div>
        <div class="admin-form-group">
          <label>YEAR & BRANCH *</label>
          <input type="text" id="t-year" class="admin-input" value="${m ? escapeAttr(m.year) : ''}" placeholder="e.g. 3rd Year ECE" required />
        </div>
      </div>

      <div class="admin-form-group">
        <label>DIVISION *</label>
        <input type="text" id="t-division" class="admin-input" value="${m ? escapeAttr(m.division) : ''}" placeholder="e.g. Electronics & Firmware" required />
      </div>

      <div class="admin-form-group">
        <label>PHOTO URL OR LOCAL UPLOAD *</label>
        <div style="width: 90px; height: 90px; border-radius: 50%; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.5rem; background: #EEE;">
          <img id="t-image-preview" src="${m ? escapeAttr(m.image) : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${m && m.image ? 'block' : 'none'};" />
        </div>
        <input type="text" id="t-image" class="admin-input" value="${m ? escapeAttr(m.image) : ''}" placeholder="https://... or upload" required />
        <label class="btn btn-secondary" style="margin-top: 0.5rem; display: inline-block; cursor: pointer; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          📁 UPLOAD PHOTO FILE
          <input type="file" id="t-image-file" accept="image/*" style="display: none;" />
        </label>
      </div>

      <div class="admin-form-group">
        <label>SHORT BIO *</label>
        <textarea id="t-bio" class="admin-textarea" rows="3" required>${m ? escapeAttr(m.bio) : ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">${isEdit ? 'UPDATE MEMBER' : 'SAVE MEMBER'}</button>
    </form>
  `;

  openUniversalModal(isEdit ? "EDIT TEAM MEMBER" : "ADD TEAM MEMBER", html);

  const fileInput = document.getElementById('t-image-file');
  const urlInput = document.getElementById('t-image');
  const previewImg = document.getElementById('t-image-preview');

  urlInput.oninput = () => {
    previewImg.src = urlInput.value;
    previewImg.style.display = urlInput.value ? 'block' : 'none';
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      urlInput.value = evt.target.result;
      previewImg.src = evt.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  document.getElementById('form-team-modal').onsubmit = (e) => {
    e.preventDefault();
    const itemData = {
      name: document.getElementById('t-name').value,
      role: document.getElementById('t-role').value,
      year: document.getElementById('t-year').value,
      division: document.getElementById('t-division').value,
      image: document.getElementById('t-image').value,
      bio: document.getElementById('t-bio').value
    };

    if (isEdit) {
      KreatorzStore.updateTeamMember(m.id, itemData);
    } else {
      KreatorzStore.addTeamMember(itemData);
    }

    closeUniversalModal();
    renderAdminTeamGrid();
    if (typeof loadImagesTab === 'function') loadImagesTab();
    showToast(isEdit ? "TEAM MEMBER UPDATED!" : "MEMBER ADDED!");
  };
}

/* --- ACHIEVEMENTS TAB --- */
function loadAchievementsTab() {
  renderAdminAchievements();
  document.getElementById('add-achievement-btn').onclick = () => {
    openAchievementModal();
  };
}

function renderAdminAchievements() {
  const achievements = KreatorzStore.getAchievements();
  const list = document.getElementById('admin-achievements-list');
  if (!list) return;

  list.innerHTML = achievements.map(a => `
    <div style="background: #FFF; border: var(--border-width) solid var(--border-dark); padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
      <div style="max-width: 80%;">
        <span style="background-color: ${a.badgeColor || '#2D5BFF'}; color: #FFF; font-size: 0.75rem; font-weight: 900; padding: 0.2rem 0.5rem; border: var(--border-width) solid var(--border-dark); display: inline-block; margin-bottom: 0.4rem;">
          ${escapeAttr(a.rank)} (${escapeAttr(a.year)})
        </span>
        <h3 style="font-size: 1.2rem; text-transform: uppercase;">${escapeAttr(a.title)}</h3>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--electric-blue); margin-bottom: 0.4rem;">${escapeAttr(a.competition)}</div>
        <p style="font-size: 0.88rem; color: #444;">${escapeAttr(a.description)}</p>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <button onclick="editAchievement('${a.id}')" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">EDIT</button>
        <button onclick="deleteAchievement('${a.id}')" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: #FF2D5B;">DELETE</button>
      </div>
    </div>
  `).join('');
}

window.deleteAchievement = function(id) {
  if (!confirm("Delete this achievement?")) return;
  KreatorzStore.deleteAchievement(id);
  renderAdminAchievements();
  if (typeof renderImagesManagerGrid === 'function') renderImagesManagerGrid();
  showToast("ACHIEVEMENT DELETED");
};

window.editAchievement = function(id) {
  const achievements = KreatorzStore.getAchievements();
  const a = achievements.find(item => item.id === id);
  if (a) openAchievementModal(a);
};

function openAchievementModal(a = null) {
  const isEdit = a !== null;
  const html = `
    <form id="form-ach-modal">
      <div class="admin-form-group">
        <label>ACHIEVEMENT TITLE *</label>
        <input type="text" id="a-title" class="admin-input" value="${a ? escapeAttr(a.title) : ''}" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>COMPETITION NAME *</label>
          <input type="text" id="a-competition" class="admin-input" value="${a ? escapeAttr(a.competition) : ''}" required />
        </div>
        <div class="admin-form-group">
          <label>YEAR *</label>
          <input type="text" id="a-year" class="admin-input" value="${a ? escapeAttr(a.year) : ''}" required />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>RANK / BADGE TEXT *</label>
          <input type="text" id="a-rank" class="admin-input" value="${a ? escapeAttr(a.rank) : 'GOLD MEDAL'}" required />
        </div>
        <div class="admin-form-group">
          <label>BADGE COLOR</label>
          <input type="color" id="a-badgeColor" value="${a && a.badgeColor ? a.badgeColor : '#FFD700'}" style="height: 40px; cursor: pointer;" />
        </div>
      </div>

      <div class="admin-form-group">
        <label>PHOTO OR TROPHY IMAGE (OPTIONAL)</label>
        <div style="height: 120px; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.5rem; background: #EEE;">
          <img id="a-image-preview" src="${a && a.image ? escapeAttr(a.image) : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${a && a.image ? 'block' : 'none'};" />
        </div>
        <input type="text" id="a-image" class="admin-input" value="${a && a.image ? escapeAttr(a.image) : ''}" placeholder="Paste URL or upload image file..." />
        <label class="btn btn-secondary" style="margin-top: 0.5rem; display: inline-block; cursor: pointer; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          📁 UPLOAD PHOTO FILE
          <input type="file" id="a-image-file" accept="image/*" style="display: none;" />
        </label>
      </div>

      <div class="admin-form-group">
        <label>DESCRIPTION *</label>
        <textarea id="a-description" class="admin-textarea" rows="3" required>${a ? escapeAttr(a.description) : ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">${isEdit ? 'UPDATE ACHIEVEMENT' : 'SAVE ACHIEVEMENT'}</button>
    </form>
  `;

  openUniversalModal(isEdit ? "EDIT ACHIEVEMENT" : "ADD ACHIEVEMENT", html);

  const fileInput = document.getElementById('a-image-file');
  const urlInput = document.getElementById('a-image');
  const previewImg = document.getElementById('a-image-preview');

  if (urlInput && previewImg) {
    urlInput.oninput = () => {
      previewImg.src = urlInput.value;
      previewImg.style.display = urlInput.value ? 'block' : 'none';
    };
  }

  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (urlInput) urlInput.value = evt.target.result;
        if (previewImg) {
          previewImg.src = evt.target.result;
          previewImg.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    };
  }

  document.getElementById('form-ach-modal').onsubmit = (e) => {
    e.preventDefault();
    const itemData = {
      title: document.getElementById('a-title').value,
      competition: document.getElementById('a-competition').value,
      year: document.getElementById('a-year').value,
      rank: document.getElementById('a-rank').value,
      badgeColor: document.getElementById('a-badgeColor').value,
      image: document.getElementById('a-image').value,
      description: document.getElementById('a-description').value,
    };

    if (isEdit) {
      KreatorzStore.updateAchievement(a.id, itemData);
    } else {
      KreatorzStore.addAchievement(itemData);
    }

    closeUniversalModal();
    renderAdminAchievements();
    if (typeof loadImagesTab === 'function') loadImagesTab();
    showToast(isEdit ? "ACHIEVEMENT UPDATED!" : "ACHIEVEMENT ADDED!");
  };
}

/* --- BLOGS TAB --- */
function loadBlogsTab() {
  renderAdminBlogs();
  document.getElementById('add-blog-btn').onclick = () => {
    openBlogModalEditor();
  };
}

function renderAdminBlogs() {
  const blogs = KreatorzStore.getBlogs();
  const list = document.getElementById('admin-blogs-list');
  if (!list) return;

  list.innerHTML = blogs.map(b => `
    <div style="background: #FFF; border: var(--border-width) solid var(--border-dark); padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
      <div style="max-width: 80%;">
        <span class="eyebrow-tag" style="font-size: 0.7rem; margin-bottom: 0.3rem;">${escapeAttr(b.categoryLabel || b.category)}</span>
        <h3 style="font-size: 1.2rem; text-transform: uppercase;">${escapeAttr(b.title)}</h3>
        <div style="font-size: 0.8rem; font-weight: 700; color: #666; margin-bottom: 0.4rem;">
          BY ${escapeAttr(b.author).toUpperCase()} • ${escapeAttr(b.date).toUpperCase()}
        </div>
        <p style="font-size: 0.88rem; color: #444;">${escapeAttr(b.snippet)}</p>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <button onclick="editBlog('${b.id}')" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">EDIT</button>
        <button onclick="deleteBlog('${b.id}')" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: #FF2D5B;">DELETE</button>
      </div>
    </div>
  `).join('');
}

window.deleteBlog = function(id) {
  if (!confirm("Delete this blog article?")) return;
  KreatorzStore.deleteBlog(id);
  renderAdminBlogs();
  if (typeof renderImagesManagerGrid === 'function') renderImagesManagerGrid();
  showToast("BLOG ARTICLE DELETED");
};

window.editBlog = function(id) {
  const blogs = KreatorzStore.getBlogs();
  const b = blogs.find(item => item.id === id);
  if (b) openBlogModalEditor(b);
};

function openBlogModalEditor(b = null) {
  const isEdit = b !== null;
  const html = `
    <form id="form-blog-modal">
      <div class="admin-form-group">
        <label>ARTICLE TITLE *</label>
        <input type="text" id="b-title" class="admin-input" value="${b ? escapeAttr(b.title) : ''}" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>AUTHOR NAME *</label>
          <input type="text" id="b-author" class="admin-input" value="${b ? escapeAttr(b.author) : 'Kreatorz Team'}" required />
        </div>
        <div class="admin-form-group">
          <label>PUBLICATION DATE *</label>
          <input type="text" id="b-date" class="admin-input" value="${b ? escapeAttr(b.date) : 'August 7, 2026'}" required />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="admin-form-group">
          <label>CATEGORY ID *</label>
          <input type="text" id="b-category" class="admin-input" value="${b ? escapeAttr(b.category) : 'mechanical'}" required />
        </div>
        <div class="admin-form-group">
          <label>CATEGORY LABEL *</label>
          <input type="text" id="b-categoryLabel" class="admin-input" value="${b ? escapeAttr(b.categoryLabel) : 'MECHANICAL'}" required />
        </div>
      </div>

      <div class="admin-form-group">
        <label>COVER IMAGE URL OR LOCAL UPLOAD *</label>
        <div style="height: 120px; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.5rem; background: #EEE;">
          <img id="b-image-preview" src="${b ? escapeAttr(b.image) : ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${b && b.image ? 'block' : 'none'};" />
        </div>
        <input type="text" id="b-image" class="admin-input" value="${b ? escapeAttr(b.image) : ''}" placeholder="https://... or upload" required />
        <label class="btn btn-secondary" style="margin-top: 0.5rem; display: inline-block; cursor: pointer; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          📁 UPLOAD COVER IMAGE
          <input type="file" id="b-image-file" accept="image/*" style="display: none;" />
        </label>
      </div>

      <div class="admin-form-group">
        <label>SHORT SNIPPET *</label>
        <textarea id="b-snippet" class="admin-textarea" rows="2" required>${b ? escapeAttr(b.snippet) : ''}</textarea>
      </div>

      <div class="admin-form-group">
        <label>FULL HTML / TEXT CONTENT *</label>
        <textarea id="b-content" class="admin-textarea" rows="6" required>${b ? escapeAttr(b.content) : ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">${isEdit ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}</button>
    </form>
  `;

  openUniversalModal(isEdit ? "EDIT BLOG DISPATCH" : "PUBLISH NEW BLOG", html);

  const fileInput = document.getElementById('b-image-file');
  const urlInput = document.getElementById('b-image');
  const previewImg = document.getElementById('b-image-preview');

  urlInput.oninput = () => {
    previewImg.src = urlInput.value;
    previewImg.style.display = urlInput.value ? 'block' : 'none';
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      urlInput.value = evt.target.result;
      previewImg.src = evt.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  document.getElementById('form-blog-modal').onsubmit = (e) => {
    e.preventDefault();
    const itemData = {
      title: document.getElementById('b-title').value,
      author: document.getElementById('b-author').value,
      date: document.getElementById('b-date').value,
      category: document.getElementById('b-category').value,
      categoryLabel: document.getElementById('b-categoryLabel').value,
      image: document.getElementById('b-image').value,
      snippet: document.getElementById('b-snippet').value,
      content: document.getElementById('b-content').value,
    };

    if (isEdit) {
      KreatorzStore.updateBlog(b.id, itemData);
    } else {
      KreatorzStore.addBlog(itemData);
    }

    closeUniversalModal();
    renderAdminBlogs();
    if (typeof loadImagesTab === 'function') loadImagesTab();
    showToast(isEdit ? "ARTICLE UPDATED!" : "ARTICLE PUBLISHED!");
  };
}

/* --- CONTACT & INBOX TAB --- */
function loadContactTab() {
  const contact = KreatorzStore.getContact();

  document.getElementById('contact-email').value = contact.email || '';
  document.getElementById('contact-phone').value = contact.phone || '';
  document.getElementById('contact-hours').value = contact.hours || '';
  document.getElementById('contact-address').value = contact.address || '';

  const formContact = document.getElementById('form-contact-info');
  formContact.onsubmit = (e) => {
    e.preventDefault();
    KreatorzStore.updateContact({
      email: document.getElementById('contact-email').value,
      phone: document.getElementById('contact-phone').value,
      hours: document.getElementById('contact-hours').value,
      address: document.getElementById('contact-address').value
    });
    showToast("CONTACT INFO SAVED!");
  };

  renderAdminInbox();
}

function renderAdminInbox() {
  const messages = KreatorzStore.getMessages();
  const container = document.getElementById('admin-inbox-container');
  if (!container) return;

  if (!messages.length) {
    container.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: #666; font-weight: 700;">No contact submissions received yet.</p>`;
    return;
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>DATE</th>
          <th>SENDER</th>
          <th>EMAIL</th>
          <th>MESSAGE</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        ${messages.map(m => `
          <tr>
            <td style="font-size: 0.8rem; font-weight: 700; white-space: nowrap;">${escapeAttr(m.date || '')}</td>
            <td style="font-weight: 700;">${escapeAttr(m.name)}</td>
            <td><a href="mailto:${escapeAttr(m.email)}" style="color: var(--electric-blue); font-weight: 700;">${escapeAttr(m.email)}</a></td>
            <td>${escapeAttr(m.message)}</td>
            <td>
              <button onclick="deleteInboxMessage('${m.id}')" class="btn btn-primary" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; background-color: #FF2D5B;">DELETE</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

window.deleteInboxMessage = function(id) {
  if (!confirm("Are you sure you want to delete this inbox message?")) return;
  KreatorzStore.deleteMessage(id);
  renderAdminInbox();
  showToast("MESSAGE DELETED");
};

/* --- SYSTEM TAB --- */
function initSystemTab() {
  document.getElementById('sys-reset-btn').onclick = () => {
    if (confirm("⚠️ Are you sure you want to reset ALL website content back to default values?")) {
      KreatorzStore.resetDefaults();
      loadAllAdminData();
      showToast("ALL DATA RESTORED TO DEFAULT!");
    }
  };

  document.getElementById('sys-export-btn').onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(KreatorzStore.getStore(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kreatorz_website_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("DATA BACKUP EXPORTED!");
  };

  const importInput = document.getElementById('sys-import-input');
  importInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        KreatorzStore.saveStore(importedData);
        loadAllAdminData();
        showToast("DATA IMPORTED SUCCESSFULLY!");
      } catch (err) {
        alert("Invalid JSON file provided.");
      }
    };
    reader.readAsText(file);
  };
}

/* --- MEDIA & IMAGES TAB --- */
let currentImgFilter = 'all';

function loadImagesTab() {
  renderHeroSlideshowAdmin();

  // Attach listener for uploading a new hero slide image file
  const newHeroFile = document.getElementById('new-hero-slide-file');
  if (newHeroFile) {
    newHeroFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const slides = KreatorzStore.getHeroSlides();
        slides.push(evt.target.result);
        KreatorzStore.updateHeroSlides(slides);
        renderHeroSlideshowAdmin();
        showToast("NEW HERO SLIDE UPLOADED & ADDED!");
      };
      reader.readAsDataURL(file);
    };
  }

  const siteImages = KreatorzStore.getSiteImages ? KreatorzStore.getSiteImages() : {};

  // Populate Section Banner inputs & previews
  const heroUrlInput = document.getElementById('img-url-heroBg');
  const heroPrevImg = document.getElementById('img-prev-heroBg');
  if (heroUrlInput) heroUrlInput.value = siteImages.heroBg || '';
  if (heroPrevImg) heroPrevImg.src = siteImages.heroBg || '';

  const labUrlInput = document.getElementById('img-url-labImg');
  const labPrevImg = document.getElementById('img-prev-labImg');
  if (labUrlInput) labUrlInput.value = siteImages.labImg || '';
  if (labPrevImg) labPrevImg.src = siteImages.labImg || '';

  const originUrlInput = document.getElementById('img-url-aboutOriginImg');
  const originPrevImg = document.getElementById('img-prev-aboutOriginImg');
  if (originUrlInput) originUrlInput.value = siteImages.aboutOriginImg || '';
  if (originPrevImg) originPrevImg.src = siteImages.aboutOriginImg || '';

  const clubLogoUrlInput = document.getElementById('img-url-clubLogo');
  const clubLogoPrevImg = document.getElementById('img-prev-clubLogo');
  if (clubLogoUrlInput) clubLogoUrlInput.value = siteImages.clubLogo || '';
  if (clubLogoPrevImg) clubLogoPrevImg.src = siteImages.clubLogo || '';

  // Attach file uploader events to section inputs
  document.querySelectorAll('.img-file-uploader').forEach(fileInput => {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const targetId = fileInput.getAttribute('data-target');
      const prevId = fileInput.getAttribute('data-preview');
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (targetId && document.getElementById(targetId)) {
          document.getElementById(targetId).value = dataUrl;
        }
        if (prevId && document.getElementById(prevId)) {
          document.getElementById(prevId).src = dataUrl;
        }
        showToast("IMAGE FILE LOADED!");
      };
      reader.readAsDataURL(file);
    };
  });

  // Handle Form Save for Section Banners
  const formSiteImages = document.getElementById('form-site-images');
  if (formSiteImages) {
    formSiteImages.onsubmit = (e) => {
      e.preventDefault();
      KreatorzStore.updateSiteImages({
        heroBg: document.getElementById('img-url-heroBg').value,
        labImg: document.getElementById('img-url-labImg').value,
        aboutOriginImg: document.getElementById('img-url-aboutOriginImg').value,
        clubLogo: document.getElementById('img-url-clubLogo') ? document.getElementById('img-url-clubLogo').value : siteImages.clubLogo
      });
      showToast("SITE BANNERS & LOGOS UPDATED!");
    };
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.img-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentImgFilter = btn.getAttribute('data-filter');
      renderImagesManagerGrid();
    };
  });

  renderImagesManagerGrid();
  renderStockPresetsGallery();
}

function renderImagesManagerGrid() {
  const container = document.getElementById('admin-images-manager-grid');
  if (!container) return;

  const projects = KreatorzStore.getProjects();
  const team = KreatorzStore.getTeam();
  const blogs = KreatorzStore.getBlogs();
  const achievements = KreatorzStore.getAchievements();

  let items = [];

  if (currentImgFilter === 'all' || currentImgFilter === 'projects') {
    projects.forEach(p => {
      items.push({ type: 'PROJECT', id: p.id, title: p.title, image: p.image, badgeColor: p.badgeColor || '#2D5BFF', raw: p });
    });
  }

  if (currentImgFilter === 'all' || currentImgFilter === 'team') {
    team.forEach(m => {
      items.push({ type: 'TEAM', id: m.id, title: m.name + ' (' + m.role + ')', image: m.image, badgeColor: '#10B981', raw: m });
    });
  }

  if (currentImgFilter === 'all' || currentImgFilter === 'blogs') {
    blogs.forEach(b => {
      items.push({ type: 'BLOG', id: b.id, title: b.title, image: b.image, badgeColor: '#FF2D5B', raw: b });
    });
  }

  if (currentImgFilter === 'all' || currentImgFilter === 'achievements') {
    achievements.forEach(a => {
      items.push({ type: 'ACHIEVEMENT', id: a.id, title: a.title + ' (' + a.competition + ')', image: a.image || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80', badgeColor: a.badgeColor || '#FFD700', raw: a });
    });
  }

  if (!items.length) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: #FFF; border: var(--border-width) solid var(--border-dark);">No image items found in this category.</div>`;
    return;
  }

  container.innerHTML = items.map((item, idx) => `
    <div style="background: #FFF; border: var(--border-width) solid var(--border-dark); padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="background-color: ${item.badgeColor}; color: #FFF; font-size: 0.7rem; font-weight: 900; padding: 0.15rem 0.5rem; border: 1px solid #000;">
            ${item.type}
          </span>
          <span style="font-size: 0.75rem; font-weight: 700; color: #777;">ID: ${escapeAttr(item.id)}</span>
        </div>

        <h4 style="font-size: 0.95rem; text-transform: uppercase; margin-bottom: 0.75rem; line-height: 1.3;">${escapeAttr(item.title)}</h4>

        <div style="height: 140px; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.75rem; background: #EEE;">
          <img id="item-prev-${idx}" src="${escapeAttr(item.image)}" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeAttr(item.title)}" />
        </div>

        <div class="admin-form-group" style="margin-bottom: 0.5rem;">
          <label style="font-size: 0.75rem;">IMAGE URL / DATA</label>
          <input type="text" id="item-url-${idx}" class="admin-input" value="${escapeAttr(item.image)}" style="font-size: 0.8rem; padding: 0.4rem;" />
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <label class="btn btn-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.75rem; text-align: center; cursor: pointer; margin: 0;">
          📁 UPLOAD
          <input type="file" accept="image/*" class="item-card-file-input" data-idx="${idx}" style="display: none;" />
        </label>
        <button onclick="saveItemImage('${item.type}', '${item.id}', ${idx})" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
          💾 SAVE
        </button>
        <button onclick="deleteItemFromImagesManager('${item.type}', '${item.id}')" class="btn btn-primary" style="padding: 0.4rem 0.6rem; font-size: 0.75rem; background-color: #FF2D5B;" title="Delete Item">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  // Attach local file uploader listeners for each card
  document.querySelectorAll('.item-card-file-input').forEach(input => {
    input.onchange = (e) => {
      const idx = input.getAttribute('data-idx');
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        const urlInput = document.getElementById(`item-url-${idx}`);
        const prevImg = document.getElementById(`item-prev-${idx}`);
        if (urlInput) urlInput.value = dataUrl;
        if (prevImg) prevImg.src = dataUrl;
        showToast("IMAGE FILE LOADED! CLICK SAVE TO APPLY.");
      };
      reader.readAsDataURL(file);
    };
  });
}

window.deleteItemFromImagesManager = function(type, id) {
  if (!confirm(`Are you sure you want to delete this ${type.toLowerCase()} item?`)) return;

  if (type === 'PROJECT') {
    KreatorzStore.deleteProject(id);
    if (typeof renderAdminProjectsGrid === 'function') renderAdminProjectsGrid();
  } else if (type === 'TEAM') {
    KreatorzStore.deleteTeamMember(id);
    if (typeof renderAdminTeamGrid === 'function') renderAdminTeamGrid();
  } else if (type === 'BLOG') {
    KreatorzStore.deleteBlog(id);
    if (typeof renderAdminBlogs === 'function') renderAdminBlogs();
  } else if (type === 'ACHIEVEMENT') {
    KreatorzStore.deleteAchievement(id);
    if (typeof renderAdminAchievements === 'function') renderAdminAchievements();
  }

  renderImagesManagerGrid();
  showToast(`${type} DELETED`);
};

window.saveItemImage = function(type, id, idx) {
  const urlInput = document.getElementById(`item-url-${idx}`);
  if (!urlInput) return;
  const newUrl = urlInput.value.trim();

  if (!newUrl) {
    alert("Please enter or upload an image URL.");
    return;
  }

  if (type === 'PROJECT') {
    KreatorzStore.updateProject(id, { image: newUrl });
  } else if (type === 'TEAM') {
    KreatorzStore.updateTeamMember(id, { image: newUrl });
  } else if (type === 'BLOG') {
    KreatorzStore.updateBlog(id, { image: newUrl });
  } else if (type === 'ACHIEVEMENT') {
    KreatorzStore.updateAchievement(id, { image: newUrl });
  }

  renderImagesManagerGrid();
  loadProjectsTab();
  loadTeamTab();
  loadBlogsTab();
  loadAchievementsTab();
  showToast("IMAGE UPDATED SUCCESSFULLY!");
};

function renderStockPresetsGallery() {
  const container = document.getElementById('admin-presets-gallery');
  if (!container) return;

  const presets = [
    { title: "Combat Bot Spinner", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
    { title: "Agricultural Spray Drone", url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80" },
    { title: "Micromouse Maze Solver", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
    { title: "FPV Racing Quadcopter", url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80" },
    { title: "Omni Robo Soccer Bot", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80" },
    { title: "PID Speedster Bot", url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80" },
    { title: "Water USV Catamaran", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
    { title: "CNC Milling Workshop", url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" },
    { title: "Microcontroller Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    { title: "Lab Team Workbench", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
  ];

  container.innerHTML = presets.map((p) => `
    <div style="background: #FFF; border: var(--border-width) solid var(--border-dark); padding: 0.5rem; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="height: 100px; overflow: hidden; border: 1px solid #000; margin-bottom: 0.5rem;">
          <img src="${p.url}" style="width: 100%; height: 100%; object-fit: cover;" alt="${p.title}" />
        </div>
        <div style="font-weight: 900; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">${p.title}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
        <button onclick="addPresetToHero('${p.url}')" class="btn btn-primary" style="width: 100%; padding: 0.25rem; font-size: 0.7rem; background-color: var(--yellow-accent); color: #000;">
          ➕ ADD TO HERO SLIDES
        </button>
        <button onclick="copyPresetUrl('${p.url}')" class="btn btn-secondary" style="width: 100%; padding: 0.25rem; font-size: 0.7rem;">
          📋 COPY URL
        </button>
      </div>
    </div>
  `).join('');
}

function renderHeroSlideshowAdmin() {
  const containers = [
    document.getElementById('admin-hero-slideshow-grid'),
    document.getElementById('home-tab-hero-slideshow-grid')
  ].filter(Boolean);

  if (!containers.length) return;

  const slides = KreatorzStore.getHeroSlides();

  containers.forEach(container => {
    if (!slides.length) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: #FFF; border: var(--border-width) solid var(--border-dark);">No hero slides found. Add your first image slide below!</div>`;
      return;
    }

    const prefix = container.id.startsWith('home-tab') ? 'ht-' : 'med-';

    container.innerHTML = slides.map((url, i) => `
      <div style="background: #FFF; border: var(--border-width) solid var(--border-dark); padding: 0.75rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="background-color: var(--yellow-accent); color: #000; font-size: 0.75rem; font-weight: 900; padding: 0.2rem 0.5rem; border: 1px solid #000;">
              SLIDE ${i + 1}
            </span>
            <div style="display: flex; gap: 0.25rem;">
              ${i > 0 ? `<button onclick="moveHeroSlide(${i}, -1)" class="btn btn-secondary" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" title="Move Left">◀</button>` : ''}
              ${i < slides.length - 1 ? `<button onclick="moveHeroSlide(${i}, 1)" class="btn btn-secondary" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" title="Move Right">▶</button>` : ''}
            </div>
          </div>

          <div style="height: 120px; border: var(--border-width) solid var(--border-dark); overflow: hidden; margin-bottom: 0.5rem; background: #EEE;">
            <img id="${prefix}hero-slide-prev-${i}" src="${escapeAttr(url)}" style="width: 100%; height: 100%; object-fit: cover;" alt="Slide ${i + 1}" />
          </div>

          <div class="admin-form-group" style="margin-bottom: 0.5rem;">
            <label style="font-size: 0.7rem;">IMAGE URL / DATA</label>
            <input type="text" id="${prefix}hero-slide-url-${i}" class="admin-input" value="${escapeAttr(url)}" style="font-size: 0.75rem; padding: 0.35rem;" />
          </div>
        </div>

        <div style="display: flex; gap: 0.35rem; margin-top: 0.5rem;">
          <label class="btn btn-secondary" style="flex: 1; padding: 0.35rem; font-size: 0.7rem; text-align: center; cursor: pointer; margin: 0;">
            📁 UPLOAD
            <input type="file" accept="image/*" class="hero-slide-card-file" data-prefix="${prefix}" data-idx="${i}" style="display: none;" />
          </label>
          <button onclick="saveHeroSlideUrl(${i}, '${prefix}')" class="btn btn-primary" style="padding: 0.35rem 0.5rem; font-size: 0.7rem;">
            💾 SAVE
          </button>
          <button onclick="deleteHeroSlide(${i})" class="btn btn-danger" style="padding: 0.35rem 0.5rem; font-size: 0.7rem; background-color: var(--pink-accent); color: #FFF;">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  });

  document.querySelectorAll('.hero-slide-card-file').forEach(input => {
    input.onchange = (e) => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const slides = KreatorzStore.getHeroSlides();
        slides[idx] = evt.target.result;
        KreatorzStore.updateHeroSlides(slides);
        renderHeroSlideshowAdmin();
        showToast("SLIDE IMAGE UPDATED!");
      };
      reader.readAsDataURL(file);
    };
  });
}

window.addHomeTabHeroSlideFromInput = function() {
  const input = document.getElementById('home-tab-new-hero-slide-url');
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    alert("Please enter a valid image URL or click 'UPLOAD LOCAL IMAGE'.");
    return;
  }
  const slides = KreatorzStore.getHeroSlides();
  slides.push(url);
  KreatorzStore.updateHeroSlides(slides);
  input.value = '';
  renderHeroSlideshowAdmin();
  showToast("NEW HERO SLIDE ADDED!");
};

window.saveHomeSectionPhoto = function() {
  const urlInput = document.getElementById('home-tab-img-url-labImg');
  if (!urlInput) return;
  const newUrl = urlInput.value.trim();
  if (!newUrl) {
    alert("Please enter or upload an image for the home section.");
    return;
  }
  const siteImages = KreatorzStore.getSiteImages ? KreatorzStore.getSiteImages() : {};
  siteImages.labImg = newUrl;
  KreatorzStore.updateSiteImages(siteImages);
  
  // Sync to Media tab input
  const mediaLabUrlInput = document.getElementById('img-url-labImg');
  const mediaLabPrevImg = document.getElementById('img-prev-labImg');
  if (mediaLabUrlInput) mediaLabUrlInput.value = newUrl;
  if (mediaLabPrevImg) mediaLabPrevImg.src = newUrl;

  showToast("HOME LAB SECTION PHOTO UPDATED!");
};

window.addHeroSlideFromInput = function() {
  const input = document.getElementById('new-hero-slide-url');
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    alert("Please enter a valid image URL or click 'UPLOAD LOCAL IMAGE'.");
    return;
  }
  const slides = KreatorzStore.getHeroSlides();
  slides.push(url);
  KreatorzStore.updateHeroSlides(slides);
  input.value = '';
  renderHeroSlideshowAdmin();
  showToast("NEW HERO SLIDE ADDED!");
};

window.addPresetToHero = function(url) {
  const slides = KreatorzStore.getHeroSlides();
  slides.push(url);
  KreatorzStore.updateHeroSlides(slides);
  renderHeroSlideshowAdmin();
  showToast("PRESET IMAGE ADDED TO HERO SLIDESHOW!");
};

window.saveHeroSlideUrl = function(idx, prefix) {
  const inputId = prefix ? `${prefix}hero-slide-url-${idx}` : `hero-slide-url-${idx}`;
  const input = document.getElementById(inputId) || document.getElementById(`hero-slide-url-${idx}`);
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    alert("Image URL cannot be empty.");
    return;
  }
  const slides = KreatorzStore.getHeroSlides();
  slides[idx] = url;
  KreatorzStore.updateHeroSlides(slides);
  renderHeroSlideshowAdmin();
  showToast("SLIDE UPDATED!");
};

window.moveHeroSlide = function(idx, direction) {
  const slides = KreatorzStore.getHeroSlides();
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= slides.length) return;
  const temp = slides[idx];
  slides[idx] = slides[targetIdx];
  slides[targetIdx] = temp;
  KreatorzStore.updateHeroSlides(slides);
  renderHeroSlideshowAdmin();
  showToast("SLIDE REORDERED!");
};

window.deleteHeroSlide = function(idx) {
  const slides = KreatorzStore.getHeroSlides();
  if (slides.length <= 1) {
    alert("You must keep at least 1 image in the hero slideshow!");
    return;
  }
  if (!confirm("Are you sure you want to remove this hero slide?")) return;
  slides.splice(idx, 1);
  KreatorzStore.updateHeroSlides(slides);
  renderHeroSlideshowAdmin();
  showToast("SLIDE REMOVED!");
};

window.copyPresetUrl = function(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast("PRESET IMAGE URL COPIED TO CLIPBOARD!");
  }).catch(() => {
    prompt("Copy this image URL:", url);
  });
};

/* --------------------------------------------------------------------------
   4. UNIVERSAL MODAL & TOAST HELPERS
   -------------------------------------------------------------------------- */
function openUniversalModal(title, htmlContent) {
  const modal = document.getElementById('admin-editor-modal');
  const titleEl = document.getElementById('modal-editor-title');
  const bodyEl = document.getElementById('modal-editor-body');

  titleEl.textContent = title;
  bodyEl.innerHTML = htmlContent;

  modal.classList.add('active');

  const closeBtn = document.getElementById('modal-editor-close-btn');
  closeBtn.onclick = closeUniversalModal;
}

function closeUniversalModal() {
  const modal = document.getElementById('admin-editor-modal');
  modal.classList.remove('active');
}

function showToast(message) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  toast.textContent = "✅ " + message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
