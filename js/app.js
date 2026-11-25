/**
 * KASHBOT AGRI SYSTEMS — ALPINE FIELD-ENGINEERING APPLICATION LOGIC
 * Accessible, zero-dependency ES6 interactivity
 * Supports Interactive AIROS Blueprint, Category Tabs, Filter Chips,
 * Expandable Spec Drawers, Pipeline Stages, Impact Telemetry Console & Web3Forms
 */

const AIROS_SUBSYSTEMS = {
  masts: {
    code: 'SUB-01 // SPRAY ASSEMBLY',
    title: 'Vertical Air-Assist Spray Masts',
    badge: '85% Drift Cut',
    desc: 'Twin vertical aluminum spray masts fitted with individually modulated nozzles that match droplet velocity to trellised apple canopy height under anti-hail nets.',
    specs: [
      ['Droplet VMD', '180 – 240 μm'],
      ['Zone Control', 'Independent multi-tier shutoff'],
      ['Coverage', '3.2m vertical canopy reach']
    ]
  },
  sensors: {
    code: 'SUB-02 // PERCEPTION SUITE',
    title: 'RTK-GNSS & Canopy Sensor Array',
    badge: '±1.5 cm RTK',
    desc: 'Mast-mounted dual-antenna RTK GNSS receiver paired with ultrasonic and depth vision sensors to profile tree foliage gaps and follow narrow rows autonomously.',
    specs: [
      ['Localization', 'Dual-Antenna RTK-GNSS'],
      ['Canopy Scan', 'Triple ultrasonic + depth vision'],
      ['Obstacle Guard', '360° LiDAR safety envelope']
    ]
  },
  manifold: {
    code: 'SUB-03 // FLUID MANIFOLD',
    title: 'PWM Micro-Solenoid Fluid Manifold',
    badge: '50 Hz PWM',
    desc: 'Stainless steel pressurized reservoir and 50 Hz pulse-width modulated valve manifold regulating application volume proportionally to rover ground speed.',
    specs: [
      ['Actuation', '< 15 ms solenoid response'],
      ['Operating Bar', 'Adjustable 2.0 – 6.5 Bar'],
      ['Tank Material', 'SS-304 corrosion-resistant bay']
    ]
  },
  compute: {
    code: 'SUB-04 // CONTROL CORE',
    title: 'IP67 CAN / ROS2 Compute Bay',
    badge: 'PREEMPT_RT',
    desc: 'Ruggedized industrial compute enclosure bridging real-time CAN 2.0B actuator nodes, ROS2 navigation stacks, and telemetry diagnostics.',
    specs: [
      ['Ingress Rating', 'IP67 dust & moisture sealed'],
      ['Bus Network', 'Triple CAN 2.0B + Ethernet'],
      ['Thermal Envelope', '-20°C to +60°C field duty']
    ]
  },
  drivetrain: {
    code: 'SUB-05 // MOBILITY PLATFORM',
    title: '4WD Electric Hub-Motor Drivetrain',
    badge: '8 Hr Duty',
    desc: 'High-torque independent 4WD agricultural tire drivetrain engineered for damp valley orchard soils, steep gradients, and low soil compaction.',
    specs: [
      ['Drive Train', '4WD independent electric hubs'],
      ['Payload Hitch', 'Up to 180 kg modular bay'],
      ['Endurance', '8 Hours continuous field run']
    ]
  }
};

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
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Initialize Interactive AIROS Hardware Blueprint Hotspots
 */
function initAirosBlueprint() {
  const hotspotBtns = document.querySelectorAll('[data-hotspot]');
  const codeEl = document.getElementById('hotspot-code');
  const titleEl = document.getElementById('hotspot-title');
  const badgeEl = document.getElementById('hotspot-badge');
  const descEl = document.getElementById('hotspot-desc');
  const specsEl = document.getElementById('hotspot-specs');

  if (!hotspotBtns.length || !titleEl) return;

  function selectSubsystem(key) {
    const data = AIROS_SUBSYSTEMS[key];
    if (!data) return;

    hotspotBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-hotspot') === key;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    if (codeEl) codeEl.textContent = data.code;
    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (descEl) descEl.textContent = data.desc;

    if (specsEl && typeof document !== 'undefined') {
      specsEl.innerHTML = data.specs
        .map(([label, val]) => `<div class="spec-item"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(val)}</dd></div>`)
        .join('');
    }
  }

  hotspotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-hotspot');
      selectSubsystem(key);
    });
  });
}

/**
 * Initialize Category Tabs
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

      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (typeof tab.scrollIntoView === 'function') {
        try {
          tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        } catch (_) {
          tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }

      panels.forEach(panel => {
        const panelCat = panel.getAttribute('data-panel');
        if (targetCategory === 'all' || panelCat === targetCategory) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });

      applyActiveFilters();
    });
  });
}

/**
 * Filter items in active panels based on selected filter chips
 */
function applyActiveFilters() {
  const activeChips = Array.from(document.querySelectorAll('.chip[aria-pressed="true"]'))
    .map(chip => (chip.getAttribute('data-diet') || '').toLowerCase())
    .filter(Boolean);

  const activePanels = document.querySelectorAll('.panel.is-active');
  const totalItems = document.querySelectorAll('.panel [data-item]').length;
  let totalVisible = 0;

  activePanels.forEach(panel => {
    const items = panel.querySelectorAll('[data-item]');
    let visibleCount = 0;

    items.forEach(item => {
      const itemTags = (item.getAttribute('data-diet') || '').toLowerCase().split(/\s+/);
      const matchesAll = activeChips.every(chip => itemTags.includes(chip));

      if (matchesAll) {
        item.classList.remove('is-hidden');
        visibleCount++;
        totalVisible++;
      } else {
        item.classList.add('is-hidden');
      }
    });

    const emptyMsg = panel.querySelector('[data-empty]');
    if (emptyMsg) {
      if (visibleCount === 0 && items.length > 0) {
        emptyMsg.removeAttribute('hidden');
      } else {
        emptyMsg.setAttribute('hidden', '');
      }
    }
  });

  const countEl = document.getElementById('catalog-count');
  if (countEl && totalItems > 0) {
    countEl.textContent = `${totalVisible} / ${totalItems} SYSTEMS`;
  }
}

/**
 * Initialize Field Filter Chips
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
        const expanded = itemCard.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
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

  function activateNode(targetNode) {
    stepNodes.forEach(n => {
      const isActive = n === targetNode;
      n.classList.toggle('active', isActive);
      n.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  stepNodes.forEach(node => {
    node.addEventListener('click', () => activateNode(node));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNode(node);
      }
    });
  });
}

/**
 * Initialize Precision Impact Slider & Presets
 */
function initImpactSlider() {
  const slider = document.getElementById('acreage-slider');
  const acreageDisplay = document.getElementById('acreage-display');
  const chemDisplay = document.getElementById('chemical-saved-val');
  const fuelDisplay = document.getElementById('fuel-saved-val');
  const convDisplay = document.getElementById('conventional-liters-val');
  const kashDisplay = document.getElementById('kashbot-liters-val');
  const presetBtns = document.querySelectorAll('.preset-btn[data-acres]');

  if (!slider || !acreageDisplay || !chemDisplay || !fuelDisplay) return;

  function update() {
    const acres = parseInt(slider.value, 10) || 1;
    acreageDisplay.textContent = acres;

    const impact = calculateImpact(acres);
    chemDisplay.textContent = `${formatNumber(impact.chemicalSavedLiters)} L`;
    fuelDisplay.textContent = `${formatNumber(impact.fuelSavedHours)} Hrs`;

    // Conventional broadcast ~300 L/acre vs Kashbot targeted ~45 L/acre (85% saved = 255 L/acre)
    const conventionalLiters = Math.round(acres * 300);
    const kashbotLiters = Math.round(acres * 45);
    if (convDisplay) convDisplay.textContent = `${formatNumber(conventionalLiters)} L/season`;
    if (kashDisplay) kashDisplay.textContent = `${formatNumber(kashbotLiters)} L/season`;

    presetBtns.forEach(btn => {
      const presetAcres = parseInt(btn.getAttribute('data-acres'), 10);
      btn.classList.toggle('is-active', presetAcres === acres);
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAcres = btn.getAttribute('data-acres');
      if (targetAcres) {
        slider.value = targetAcres;
        update();
      }
    });
  });

  slider.addEventListener('input', update);
  update();
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

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');
  const messageInput = document.getElementById('form-message');

  // Clear aria-invalid non-intrusively as the user corrects input
  [nameInput, emailInput, phoneInput, messageInput].forEach(field => {
    if (field && typeof field.addEventListener === 'function') {
      field.addEventListener('input', () => {
        field.removeAttribute('aria-invalid');
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !phone || !message) {
      let firstInvalid = null;
      [
        [nameInput, name],
        [emailInput, email],
        [phoneInput, phone],
        [messageInput, message]
      ].forEach(([el, val]) => {
        if (el && !val) {
          el.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = el;
        }
      });

      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please complete all required fields (*)</strong> so our engineering team can review your request.';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (emailInput) {
        emailInput.setAttribute('aria-invalid', 'true');
      }
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please provide a valid email address</strong> (e.g. name@domain.com).';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (emailInput && typeof emailInput.focus === 'function') emailInput.focus();
      return;
    }

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
        [nameInput, emailInput, phoneInput, messageInput].forEach(el => {
          if (el) el.removeAttribute('aria-invalid');
        });
        const growerBtn = document.getElementById('mode-grower-btn');
        if (growerBtn && typeof growerBtn.click === 'function') {
          growerBtn.click();
        }
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
    drawer.removeAttribute('hidden');
    drawer.classList.add('is-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('drawer-open');
    }
    if (closeBtn && typeof closeBtn.focus === 'function') {
      closeBtn.focus();
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
    if (openBtn) {
      openBtn.setAttribute('aria-expanded', 'false');
      if (typeof openBtn.focus === 'function') openBtn.focus();
    }
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
 * Initialize Header Scroll State & ScrollSpy
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-header .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

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
  }, { passive: true });
}

// Global DOM Initialization
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initAirosBlueprint();
    initSorrelTabs();
    initSorrelFilters();
    initItemToggles();
    initLifecycle();
    initImpactSlider();
    initFormSwitcher();
    initInquiryForm();
    initMobileNav();
    initHeaderScroll();
    initScrollSpy();
  });
}
