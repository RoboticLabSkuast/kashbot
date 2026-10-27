/**
 * KASHBOT AGRI SYSTEMS — SORREL EDITORIAL APPLICATION LOGIC
 * High-performance, accessible, vanilla ES6 logic
 * Supports Sorrel Category Tabs, Filter Chips, Accordion Drawers & Impact Calculator
 */

/**
 * Calculates environmental and operational savings based on farm acreage
 * @param {number} acres - Total farm or orchard acreage
 * @returns {object} Calculated metrics
 */
function calculateImpact(acres) {
  const numericAcres = Number(acres) || 1;
  // Based on empirical trial data: 255 Liters of chemical wastage avoided per acre per season
  const chemicalSavedLiters = Math.round(numericAcres * 255);
  // Machine hours saved: ~8 hours saved per acre across full season
  const fuelSavedHours = Math.round(numericAcres * 8);
  const reductionPercent = 85;

  return {
    chemicalSavedLiters,
    fuelSavedHours,
    reductionPercent
  };
}

/**
 * Formats a number with comma separators (e.g. 3,825)
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Initialize Sorrel Category Tabs
 * Supports switching between panels (All, Robotics, Machinery, Spraying, Laser, R&D)
 */
function initSorrelTabs() {
  const tabsNav = document.querySelector('[data-tabs]');
  if (!tabsNav) return;

  const tabs = tabsNav.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel[data-panel]');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = tab.getAttribute('data-tab');

      // Update active tab
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      // Show/hide panels
      panels.forEach(panel => {
        const panelCat = panel.getAttribute('data-panel');
        if (targetCategory === 'all' || panelCat === targetCategory) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });

      // Re-apply filters for the newly active panel(s)
      applyActiveFilters();
    });
  });
}

/**
 * Filter items in active panels based on selected filter chips
 */
function applyActiveFilters() {
  const activeChips = Array.from(document.querySelectorAll('.chip[aria-pressed="true"]'))
    .map(chip => chip.getAttribute('data-diet').toLowerCase());

  const activePanels = document.querySelectorAll('.panel.is-active');

  activePanels.forEach(panel => {
    const items = panel.querySelectorAll('[data-item]');
    let visibleCount = 0;

    items.forEach(item => {
      const itemTags = (item.getAttribute('data-diet') || '').toLowerCase().split(/\s+/);
      const matchesAll = activeChips.every(chip => itemTags.includes(chip));

      if (matchesAll) {
        item.classList.remove('is-hidden');
        visibleCount++;
      } else {
        item.classList.add('is-hidden');
      }
    });

    // Toggle empty panel message
    const emptyMsg = panel.querySelector('[data-empty]');
    if (emptyMsg) {
      if (visibleCount === 0 && items.length > 0) {
        emptyMsg.removeAttribute('hidden');
      } else {
        emptyMsg.setAttribute('hidden', '');
      }
    }
  });
}

/**
 * Initialize Sorrel Dietary/Field Filter Chips
 */
function initSorrelFilters() {
  const chips = document.querySelectorAll('.chip[data-diet]');
  if (!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isPressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', isPressed ? 'false' : 'true');
      applyActiveFilters();
    });
  });
}

/**
 * Initialize Expandable Tech Specification Drawers
 */
function initItemToggles() {
  const toggles = document.querySelectorAll('[data-toggle]');
  if (!toggles.length) return;

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const itemCard = toggle.closest('.item');
      if (itemCard) {
        itemCard.classList.toggle('is-expanded');
      }
    });
  });
}

/**
 * Initialize 5-Stage Engineering Lifecycle Interactive Nodes
 */
function initLifecycle() {
  const stepNodes = document.querySelectorAll('.step-node');
  if (!stepNodes.length) return;

  stepNodes.forEach(node => {
    node.addEventListener('click', () => {
      stepNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    });
  });
}

/**
 * Initialize Precision Impact Slider
 */
function initImpactSlider() {
  const slider = document.getElementById('acreage-slider');
  const acreageDisplay = document.getElementById('acreage-display');
  const chemDisplay = document.getElementById('chemical-saved-val');
  const fuelDisplay = document.getElementById('fuel-saved-val');

  if (!slider || !acreageDisplay || !chemDisplay || !fuelDisplay) return;

  function update() {
    const acres = parseInt(slider.value, 10);
    acreageDisplay.textContent = acres;
    const impact = calculateImpact(acres);
    chemDisplay.textContent = `${formatNumber(impact.chemicalSavedLiters)} L`;
    fuelDisplay.textContent = `${formatNumber(impact.fuelSavedHours)} Hrs`;
  }

  slider.addEventListener('input', update);
  update(); // Initial calculation
}

/**
 * Initialize Dual-Mode Inquiry Form Switcher
 */
function initFormSwitcher() {
  const growerBtn = document.getElementById('mode-grower-btn');
  const partnerBtn = document.getElementById('mode-partner-btn');
  const labelOrg = document.getElementById('label-org');
  const inputOrg = document.getElementById('form-org');
  const labelMessage = document.getElementById('label-message');
  const textareaMessage = document.getElementById('form-message');

  if (!growerBtn || !partnerBtn) return;

  function setMode(mode) {
    if (mode === 'grower') {
      growerBtn.classList.add('active');
      partnerBtn.classList.remove('active');
      if (labelOrg) labelOrg.textContent = 'Orchard / Farm Name *';
      if (inputOrg) inputOrg.placeholder = 'e.g. Valley Apple Orchards';
      if (labelMessage) labelMessage.textContent = 'Acreage & Field Trial Requirements';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your orchard/farm size, crop types (e.g., apple, saffron), or specific operational challenges...';
    } else {
      partnerBtn.classList.add('active');
      growerBtn.classList.remove('active');
      if (labelOrg) labelOrg.textContent = 'Institution / Organization / Fund *';
      if (inputOrg) inputOrg.placeholder = 'e.g. SKUAST-Kashmir / AgTech Ventures';
      if (labelMessage) labelMessage.textContent = 'Collaboration or Investment Proposal';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your research objective, grant proposal, trial partnership, or investment scope...';
    }
  }

  growerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('grower');
  });

  partnerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('partner');
  });
}

/**
 * Initialize Form Submission Handler
 */
function initInquiryForm() {
  const form = document.getElementById('kashbot-inquiry-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');

  if (!form || !feedbackMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
      alert('Please fill in your name, email, and phone number so our Srinagar engineering team can contact you.');
      return;
    }

    feedbackMsg.style.display = 'block';
    feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
  });
}

/**
 * Initialize Mobile Navigation Drawer
 */
function initMobileNav() {
  const openBtn = document.getElementById('mobile-menu-open-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (openBtn && drawer) {
    openBtn.addEventListener('click', () => {
      drawer.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.remove('is-open');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Initialize ScrollSpy for Header Navigation Links
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-header .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// Global DOM Initialization
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSorrelTabs();
    initSorrelFilters();
    initItemToggles();
    initLifecycle();
    initImpactSlider();
    initFormSwitcher();
    initInquiryForm();
    initMobileNav();
    initScrollSpy();
  });
}
