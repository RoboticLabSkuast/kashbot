/**
 * KASHBOT AGRI SYSTEMS — ALPINE FIELD-ENGINEERING APPLICATION LOGIC
 * Accessible, zero-dependency ES6 interactivity & kinetic telemetry engine
 * Supports Motion Pause/Play, Hero LiDAR Canvas, AIROS Blueprint Targeting SVG,
 * Catalog View Transitions, Pipeline Progress Rail, Impact Console & Web3Forms
 */

const AIROS_SUBSYSTEMS = {
  masts: {
    code: 'SUB-01 // SPRAY ASSEMBLY',
    title: 'Vertical Air-Assist Spray Masts',
    badge: '85% Drift Cut',
    coords: [38, 16],
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
    coords: [25, 55],
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
    coords: [55, 59],
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
    coords: [33, 73],
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
    coords: [48, 88],
    desc: 'High-torque independent 4WD agricultural tire drivetrain engineered for damp valley orchard soils, steep gradients, and low soil compaction.',
    specs: [
      ['Drive Train', '4WD independent electric hubs'],
      ['Payload Hitch', 'Up to 180 kg modular bay'],
      ['Endurance', '8 Hours continuous field run']
    ]
  }
};

let isMotionPaused = false;
let lidarAnimationControl = null;

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function runWithViewTransition(updateFn) {
  if (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !isMotionPaused &&
    !prefersReducedMotion()
  ) {
    document.startViewTransition(updateFn);
  } else {
    updateFn();
  }
}

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
 * Global Motion Pause/Play Toggle (WCAG 2.2.2)
 */
function initMotionToggle() {
  const toggleBtn = document.getElementById('motion-toggle-btn');
  if (!toggleBtn) return;

  if (prefersReducedMotion()) {
    isMotionPaused = true;
    toggleBtn.textContent = 'Play Motion';
    toggleBtn.setAttribute('aria-label', 'Play ambient motion graphics');
  }

  toggleBtn.addEventListener('click', () => {
    isMotionPaused = !isMotionPaused;
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('motion-paused', isMotionPaused);
    }
    toggleBtn.textContent = isMotionPaused ? 'Play Motion' : 'Pause Motion';
    toggleBtn.setAttribute(
      'aria-label',
      isMotionPaused ? 'Play ambient motion graphics' : 'Pause ambient motion graphics'
    );
    if (lidarAnimationControl) {
      if (isMotionPaused) lidarAnimationControl.stop();
      else lidarAnimationControl.start();
    }
  });
}

/**
 * Hero LiDAR Point-Cloud & Alpine Topographic Sweep Canvas
 */
function initHeroLidarCanvas() {
  const canvas = document.getElementById('hero-lidar-canvas');
  if (!canvas || typeof canvas.getContext !== 'function' || typeof window === 'undefined') return;
  if (typeof requestAnimationFrame !== 'function') return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let rafId = null;
  let isVisible = true;
  let angle = 0;
  let pointerX = 0.72;
  let pointerY = 0.45;

  // Deterministic orchard canopy & terrain points
  const points = Array.from({ length: 46 }, (_, i) => ({
    xNorm: ((i * 37) % 100) / 100,
    yNorm: ((i * 53 + 11) % 100) / 100,
    radius: 1.3 + (i % 3) * 0.7,
    isTarget: i % 9 === 0
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : { width: 1200, height: 700 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(rect.width || 800, 320);
    height = Math.max(rect.height || 600, 320);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const originX = width * pointerX;
    const originY = height * pointerY;
    const maxRadius = Math.hypot(width, height) * 0.55;

    // Subtle Alpine Topographic Wave Contours
    ctx.lineWidth = 1;
    for (let ring = 0; ring < 4; ring++) {
      const yBase = height * (0.28 + ring * 0.16);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 28) {
        const wave = Math.sin(x * 0.0055 + angle * 0.8 + ring * 1.1) * 14 +
          Math.cos(x * 0.011 - angle * 0.4) * 7;
        if (x === 0) ctx.moveTo(x, yBase + wave);
        else ctx.lineTo(x, yBase + wave);
      }
      ctx.strokeStyle = `rgba(74, 222, 128, ${0.045 + ring * 0.012})`;
      ctx.stroke();
    }

    // LiDAR Sweep Cone
    const sweepWidth = 0.42;
    const grad = ctx.createRadialGradient(originX, originY, 0, originX, originY, maxRadius);
    grad.addColorStop(0, 'rgba(74, 222, 128, 0.12)');
    grad.addColorStop(0.55, 'rgba(42, 111, 78, 0.06)');
    grad.addColorStop(1, 'rgba(11, 16, 13, 0)');

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.arc(originX, originY, maxRadius, angle - sweepWidth, angle);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Leading Scanline
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + Math.cos(angle) * maxRadius, originY + Math.sin(angle) * maxRadius);
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.22)';
    ctx.stroke();

    // Orchard Point Cloud Blips illuminated by Sweep
    points.forEach(pt => {
      const px = pt.xNorm * width;
      const py = pt.yNorm * height;
      const ptAngle = Math.atan2(py - originY, px - originX);
      let diff = (angle - ptAngle) % (Math.PI * 2);
      if (diff < 0) diff += Math.PI * 2;
      const lit = diff < 0.85 ? 1 - diff / 0.85 : 0.14;

      ctx.beginPath();
      ctx.arc(px, py, pt.radius, 0, Math.PI * 2);
      ctx.fillStyle = pt.isTarget
        ? `rgba(217, 78, 40, ${0.22 + lit * 0.65})`
        : `rgba(74, 222, 128, ${0.12 + lit * 0.55})`;
      ctx.fill();
    });
  }

  function tick() {
    if (isMotionPaused || !isVisible || (typeof document !== 'undefined' && document.hidden)) {
      rafId = null;
      return;
    }
    angle = (angle + 0.009) % (Math.PI * 2);
    drawFrame();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (!rafId && !isMotionPaused && isVisible) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  lidarAnimationControl = { start, stop };

  resize();
  drawFrame();

  window.addEventListener('resize', () => {
    resize();
    drawFrame();
  }, { passive: true });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('pointermove', (e) => {
      if (isMotionPaused) return;
      const r = heroSection.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        pointerX = 0.55 + ((e.clientX - r.left) / r.width - 0.5) * 0.25;
        pointerY = 0.42 + ((e.clientY - r.top) / r.height - 0.5) * 0.2;
      }
    }, { passive: true });

    if (typeof IntersectionObserver === 'function') {
      const obs = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible && !isMotionPaused) start();
        else stop();
      }, { threshold: 0.05 });
      obs.observe(heroSection);
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (isVisible && !isMotionPaused) start();
    });
  }

  if (!isMotionPaused) {
    start();
  }
}

/**
 * Hero Stat Count-Up & Live RTK Telemetry Readout
 */
function initHeroTelemetry() {
  const satReadout = document.getElementById('live-sat-readout');
  if (satReadout && typeof setInterval === 'function') {
    const satStates = ['RTK LOCK: 14 SAT', 'RTK LOCK: 15 SAT', 'RTK LOCK: 16 SAT', 'RTK LOCK: 15 SAT'];
    let idx = 0;
    setInterval(() => {
      if (isMotionPaused) return;
      idx = (idx + 1) % satStates.length;
      satReadout.textContent = satStates[idx];
    }, 3400);
  }

  if (isMotionPaused || prefersReducedMotion() || typeof requestAnimationFrame !== 'function') return;

  const counters = document.querySelectorAll('[data-count-to]');
  counters.forEach(el => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const pad = parseInt(el.getAttribute('data-pad') || '0', 10);
    if (Number.isNaN(target)) return;

    const duration = 550;
    const startTime = performance.now();

    function frame(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      let text = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
      if (pad > 0) text = text.padStart(pad, '0');
      el.textContent = text;
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  });
}

/**
 * Initialize Interactive AIROS Hardware Blueprint Hotspots & Targeting SVG
 */
function initAirosBlueprint() {
  const hotspotBtns = document.querySelectorAll('[data-hotspot]');
  const codeEl = document.getElementById('hotspot-code');
  const titleEl = document.getElementById('hotspot-title');
  const badgeEl = document.getElementById('hotspot-badge');
  const descEl = document.getElementById('hotspot-desc');
  const specsEl = document.getElementById('hotspot-specs');
  const leaderLine = document.getElementById('blueprint-leader-line');
  const reticle = document.getElementById('blueprint-reticle');
  const readoutBox = document.querySelector('.blueprint-readout');

  if (!hotspotBtns.length || !titleEl) return;

  function selectSubsystem(key) {
    const data = AIROS_SUBSYSTEMS[key];
    if (!data) return;

    hotspotBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-hotspot') === key;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    if (leaderLine && data.coords) {
      leaderLine.setAttribute('x1', String(data.coords[0]));
      leaderLine.setAttribute('y1', String(data.coords[1]));
      leaderLine.setAttribute('x2', '98');
      leaderLine.setAttribute('y2', String(data.coords[1]));
    }

    if (reticle && data.coords) {
      reticle.setAttribute('cx', String(data.coords[0]));
      reticle.setAttribute('cy', String(data.coords[1]));
    }

    if (readoutBox && !isMotionPaused) {
      readoutBox.classList.remove('is-switching');
      void readoutBox.offsetWidth;
      readoutBox.classList.add('is-switching');
    }

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
 * Initialize Category Tabs (with View Transitions)
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

      runWithViewTransition(() => {
        tabs.forEach(t => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });

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

      if (typeof tab.scrollIntoView === 'function') {
        try {
          tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        } catch (_) {
          tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
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
 * Initialize Field Filter Chips (with View Transitions)
 */
function initSorrelFilters() {
  const chips = document.querySelectorAll('.chip[data-diet]');
  if (!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      runWithViewTransition(() => {
        const isPressed = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', isPressed ? 'false' : 'true');
        applyActiveFilters();
      });
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
 * Initialize 5-Stage Engineering Lifecycle Interactive Nodes & Progress Rail
 */
function initLifecycle() {
  const stepNodes = document.querySelectorAll('.step-node');
  const railFill = document.getElementById('pipeline-rail-fill');
  if (!stepNodes.length) return;

  function activateNode(targetNode) {
    let activeIdx = 0;
    stepNodes.forEach((n, idx) => {
      const isActive = n === targetNode;
      n.classList.toggle('active', isActive);
      n.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) activeIdx = idx;
    });

    if (railFill && railFill.style) {
      const progress = ((activeIdx + 1) / stepNodes.length).toFixed(2);
      railFill.style.setProperty('--pipeline-progress', progress);
    }
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
 * Initialize Precision Impact Slider & Animated Presets
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

  let tweenRaf = null;

  function renderMetrics(acres) {
    acreageDisplay.textContent = acres;

    const impact = calculateImpact(acres);
    chemDisplay.textContent = `${formatNumber(impact.chemicalSavedLiters)} L`;
    fuelDisplay.textContent = `${formatNumber(impact.fuelSavedHours)} Hrs`;

    const conventionalLiters = Math.round(acres * 300);
    const kashbotLiters = Math.round(acres * 45);
    if (convDisplay) convDisplay.textContent = `${formatNumber(conventionalLiters)} L/season`;
    if (kashDisplay) kashDisplay.textContent = `${formatNumber(kashbotLiters)} L/season`;
  }

  function update(targetAcresOverride) {
    const acres = parseInt(targetAcresOverride ?? slider.value, 10) || 1;
    renderMetrics(acres);

    presetBtns.forEach(btn => {
      const presetAcres = parseInt(btn.getAttribute('data-acres'), 10);
      btn.classList.toggle('is-active', presetAcres === acres);
    });
  }

  function pulseMetrics() {
    [chemDisplay, fuelDisplay].forEach(el => {
      if (!el || !el.classList || isMotionPaused) return;
      el.classList.remove('is-pulsing');
      void el.offsetWidth;
      el.classList.add('is-pulsing');
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAcres = parseInt(btn.getAttribute('data-acres') || '15', 10);
      const startAcres = parseInt(slider.value, 10) || 15;
      slider.value = String(targetAcres);

      if (isMotionPaused || prefersReducedMotion() || typeof requestAnimationFrame !== 'function' || startAcres === targetAcres) {
        update(targetAcres);
        pulseMetrics();
        return;
      }

      if (tweenRaf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(tweenRaf);
      const t0 = performance.now();
      const dur = 360;

      function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.round(startAcres + (targetAcres - startAcres) * eased);
        renderMetrics(current);
        if (p < 1) {
          tweenRaf = requestAnimationFrame(step);
        } else {
          update(targetAcres);
          pulseMetrics();
        }
      }

      tweenRaf = requestAnimationFrame(step);
    });
  });

  slider.addEventListener('input', () => update());
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
 * Cursor Spotlight Sheen & Tactile Magnetic Buttons (Fine Pointer Only)
 */
function initInteractiveEffects() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }

  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      if (isMotionPaused) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });

  document.querySelectorAll('.btn-primary, .floating-whatsapp-btn').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      if (isMotionPaused || prefersReducedMotion()) return;
      const rect = btn.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
      const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      btn.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    }, { passive: true });

    btn.addEventListener('pointerleave', () => {
      btn.style.translate = '';
    });
  });
}

/**
 * Progressive Enhancement IntersectionObserver Scroll Reveal Fallback
 */
function initScrollRevealFallback() {
  if (
    typeof window === 'undefined' ||
    typeof CSS === 'undefined' ||
    typeof CSS.supports !== 'function' ||
    typeof IntersectionObserver !== 'function' ||
    prefersReducedMotion()
  ) {
    return;
  }

  if (CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    return;
  }

  if (document.documentElement) {
    document.documentElement.classList.add('js-reveal-fallback');
  }

  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/**
 * Initialize Header Scroll State & ScrollSpy
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header || typeof window === 'undefined') return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-header .nav-link');

  if (!sections.length || !navLinks.length || typeof window === 'undefined') return;

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
    initMotionToggle();
    initHeroLidarCanvas();
    initHeroTelemetry();
    initAirosBlueprint();
    initSorrelTabs();
    initSorrelFilters();
    initItemToggles();
    initLifecycle();
    initImpactSlider();
    initFormSwitcher();
    initInquiryForm();
    initMobileNav();
    initInteractiveEffects();
    initScrollRevealFallback();
    initHeaderScroll();
    initScrollSpy();
  });
}
