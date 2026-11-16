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
  const hiddenInquiryType = document.getElementById('form-inquiry-type');
  const hiddenSubject = document.getElementById('form-subject');

  if (!growerBtn || !partnerBtn) return;

  function setMode(mode) {
    if (mode === 'grower') {
      growerBtn.classList.add('is-on');
      growerBtn.setAttribute('aria-pressed', 'true');
      partnerBtn.classList.remove('is-on');
      partnerBtn.setAttribute('aria-pressed', 'false');
      if (labelOrg) labelOrg.textContent = 'Orchard / Farm Name';
      if (inputOrg) inputOrg.placeholder = 'e.g. Valley Apple Orchards';
      if (labelMessage) labelMessage.textContent = 'Acreage & Field Trial Requirements *';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your orchard/farm size, crop types (e.g. apple, pear), or specific operational challenges...';
      if (hiddenInquiryType) hiddenInquiryType.value = 'Orchardist / Commercial Grower';
      if (hiddenSubject) hiddenSubject.value = 'New Orchard Field Trial Inquiry — Kashbot Agri Systems';
    } else {
      partnerBtn.classList.add('is-on');
      partnerBtn.setAttribute('aria-pressed', 'true');
      growerBtn.classList.remove('is-on');
      growerBtn.setAttribute('aria-pressed', 'false');
      if (labelOrg) labelOrg.textContent = 'Institution / Organization / Fund';
      if (inputOrg) inputOrg.placeholder = 'e.g. SKUAST-Kashmir / AgTech Ventures';
      if (labelMessage) labelMessage.textContent = 'Collaboration or Research Proposal *';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your research objective, grant proposal, trial partnership, or commercial scope...';
      if (hiddenInquiryType) hiddenInquiryType.value = 'Research Institution / Partner';
      if (hiddenSubject) hiddenSubject.value = 'New Research & Partnership Inquiry — Kashbot Agri Systems';
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
 * Generate formatted WhatsApp URL for one-tap inquiry
 */
function generateWhatsAppInquiryUrl(params) {
  const { name, phone, email, category, org, message } = params;
  const lines = [
    '🌾 *New Inquiry for Kashbot Agri Systems*',
    '----------------------------------------',
    `• *Name:* ${name}`,
    `• *Phone / WhatsApp:* ${phone}`,
    email ? `• *Email:* ${email}` : null,
    `• *Category:* ${category}`,
    org ? `• *Orchard / Farm:* ${org}` : null,
    message ? `• *Requirements / Acreage:*\n${message}` : '• *Requirement:* Inquiring about autonomous field robotics & precision canopy spraying.'
  ].filter(Boolean);

  const fullText = lines.join('\n');
  return `https://wa.me/917006613634?text=${encodeURIComponent(fullText)}`;
}

/**
 * Escape HTML characters to prevent XSS in dynamic DOM insertions
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Initialize Form Submission Handler
 */
function initInquiryForm() {
  const form = document.getElementById('kashbot-inquiry-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  if (!form || !feedbackMsg || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !phone || !message) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please complete all required fields (*)</strong> so our engineering team can review your request.';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please provide a valid email address</strong> (e.g. name@domain.com).';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Enter loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Sending Inquiry to Engineering...</span>
    `;

    feedbackMsg.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action || 'https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.reset();
        feedbackMsg.className = 'feedback-msg feedback-msg--success';
        feedbackMsg.style.display = 'block';
        feedbackMsg.style.background = 'rgba(var(--herb-rgb), 0.12)';
        feedbackMsg.style.border = '1px solid var(--herb)';
        feedbackMsg.style.color = 'var(--ink)';
        feedbackMsg.innerHTML = `
          <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.35rem; color: var(--herb);">
            ✓ Inquiry Sent Successfully!
          </div>
          <div style="margin-bottom: 0.5rem; line-height: 1.5;">
            Thank you, <strong>${escapeHtml(name)}</strong>. Your details have been delivered to our engineering desk at Buchpora, Srinagar. We will review your field specifications and connect with you shortly.
          </div>
          <div style="font-size: 0.9rem; margin-top: 0.6rem; color: var(--ink-soft);">
            Need an immediate response? <a href="https://wa.me/917006613634?text=Hello%20Kashbot%2C%20I%20just%20submitted%20a%20trial%20inquiry%20via%20your%20website%20(Name%3A%20${encodeURIComponent(name)})" target="_blank" rel="noopener noreferrer" style="color: var(--herb); font-weight: 700; text-decoration: underline;">Tap here to chat on WhatsApp (+91 7006613634)</a>.
          </div>
        `;
        submitBtn.innerHTML = `<span>Inquiry Sent ✓</span>`;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.innerHTML = originalBtnContent;
        }, 3500);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.3rem; color: var(--tomato);">
          Notice: Online dispatch could not be completed.
        </div>
        <div style="font-size: 0.92rem; line-height: 1.5;">
          Please email us directly at <a href="mailto:info@kashbot.in" style="color: var(--herb); text-decoration: underline; font-weight: 600;">info@kashbot.in</a> or connect with engineering on <a href="https://wa.me/917006613634" target="_blank" rel="noopener noreferrer" style="color: var(--herb); text-decoration: underline; font-weight: 600;">WhatsApp (+91 7006613634)</a>.
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalBtnContent;
    }

    feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('drawer-open');
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('drawer-open');
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', openDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }
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
