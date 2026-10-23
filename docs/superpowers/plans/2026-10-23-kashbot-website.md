# Kashbot Agri Systems Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a state-of-the-art, responsive, high-performance web presence for Kashbot Agri Systems Private Limited based on the approved Eco-Tech & Precision Engineering design specification.

**Architecture:** Single-page semantic HTML5 structure styled with custom CSS3 modern tokens (Plus Jakarta Sans, Inter, JetBrains Mono, glassmorphism, responsive grid) powered by vanilla ES6 JavaScript managing the interactive Technology Explorer, acreage impact calculator, 5-stage engineering lifecycle, and dual-mode inquiry hub.

**Tech Stack:** HTML5, Modern CSS3 (CSS Custom Properties, Flexbox, Grid, CSS animations), Vanilla JavaScript (ES6+), custom high-fidelity SVG schematics, Node.js / Python for local verification.

## Global Constraints
- Pure vanilla web implementation without bulky external framework runtimes.
- Zero SATURATED red/blue/green colors: use curated palette (`#0C3B2E`, `#10B981`, `#059669`, `#0284C7`, `#F8FAF8`, `#FFFFFF`, `#0F172A`).
- All company data in `public/details.txt` must be faithfully represented (Srinagar address, phone 7006613634, email info@kashbot.in, all 5 core areas, 5-stage lifecycle, purpose, vision).
- Fluid mobile responsiveness across 360px, 768px, 1024px, and 1440px+ viewports.
- WCAG AA/AAA compliant contrast and keyboard accessibility (`aria-selected`, `aria-controls`, focus states).

---

### Task 1: Design Tokens, Typography, and Base CSS Architecture

**Files:**
- Create: `css/style.css`
- Test: `tests/verify_css.js`

**Interfaces:**
- Consumes: Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`)
- Produces: CSS custom properties (`--color-forest`, `--color-mint`, `--color-emerald-deep`, `--color-cyan`, `--color-surface`, `--color-bg`, `--font-heading`, `--font-body`, `--font-mono`), glass card utilities, interactive button styles, badge components, responsive grid systems.

- [ ] **Step 1: Write CSS verification test**
Create `tests/verify_css.js` using Node.js to verify that `css/style.css` defines all required design tokens, font families, responsive breakpoints, and UI classes.

```javascript
// tests/verify_css.js
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
if (!fs.existsSync(cssPath)) {
  console.error("FAIL: css/style.css does not exist");
  process.exit(1);
}

const css = fs.readFileSync(cssPath, 'utf8');
const requiredTokens = [
  '--color-forest',
  '--color-mint',
  '--color-cyan',
  '--color-bg',
  '--color-surface',
  '--color-text-primary',
  '--font-heading',
  '--font-body',
  '--font-mono'
];

const requiredClasses = [
  '.glass-card',
  '.btn-primary',
  '.btn-secondary',
  '.badge-telemetry',
  '.tech-tab-btn',
  '.step-node',
  '.impact-slider'
];

let failed = false;
requiredTokens.forEach(token => {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing design token: ${token}`);
    failed = true;
  }
});

requiredClasses.forEach(cls => {
  if (!css.includes(cls)) {
    console.error(`FAIL: Missing CSS class: ${cls}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: css/style.css has all required design tokens and utility classes.");
}
```

- [ ] **Step 2: Run verification test to verify failure**
Run: `node tests/verify_css.js`
Expected: FAIL (file does not exist yet)

- [ ] **Step 3: Implement `css/style.css`**
Write complete, rich CSS styles with CSS variables, typography imports, fluid layouts, glassmorphic cards, telemetry pills, responsive navigation styles, and micro-interactions.

- [ ] **Step 4: Run verification test to verify pass**
Run: `node tests/verify_css.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add css/style.css tests/verify_css.js
git commit -m "style: implement design tokens, typography, and core CSS architecture"
```

---

### Task 2: High-Fidelity SVG Visual Assets & Brand Insignia

**Files:**
- Create: `assets/logo.svg`
- Create: `assets/agri-robot.svg`
- Create: `assets/smart-spray.svg`
- Create: `assets/laser-weeder.svg`
- Create: `assets/sensors-board.svg`
- Test: `tests/verify_assets.js`

**Interfaces:**
- Consumes: Technical spec details from `public/details.txt`
- Produces: Vector visual assets for the header, hero, and interactive technology explorer tabs.

- [ ] **Step 1: Write asset verification test**
Create `tests/verify_assets.js` to ensure all 5 SVG files exist, are valid SVGs (`<svg` opening and `</svg>` closing tags), and contain vector paths.

```javascript
// tests/verify_assets.js
const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'logo.svg',
  'agri-robot.svg',
  'smart-spray.svg',
  'laser-weeder.svg',
  'sensors-board.svg'
];

let failed = false;
requiredAssets.forEach(file => {
  const p = path.join(__dirname, '..', 'assets', file);
  if (!fs.existsSync(p)) {
    console.error(`FAIL: Missing asset assets/${file}`);
    failed = true;
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes('<svg') || !content.includes('</svg>')) {
    console.error(`FAIL: Invalid SVG in assets/${file}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: All required vector visual assets are valid.");
}
```

- [ ] **Step 2: Run verification test to verify failure**
Run: `node tests/verify_assets.js`
Expected: FAIL (assets folder / files missing)

- [ ] **Step 3: Create vector SVGs**
Generate clean, precision-engineered SVGs:
1. `assets/logo.svg`: Kashbot emblem with botanical leaf and precision gear geometry.
2. `assets/agri-robot.svg`: All-terrain autonomous orchard rover schematic with RTK sensor & chassis.
3. `assets/smart-spray.svg`: Canopy sensor cones and intelligent nozzle spray pattern schematic.
4. `assets/laser-weeder.svg`: Optical targeting and directed laser ablation mechanism.
5. `assets/sensors-board.svg`: Embedded controller, CAN-bus, sensor fusion schematic.

- [ ] **Step 4: Run verification test to verify pass**
Run: `node tests/verify_assets.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add assets/ tests/verify_assets.js
git commit -m "feat: add high-fidelity vector visual assets and brand insignia"
```

---

### Task 3: Semantic HTML5 Structure & Full Content Integration

**Files:**
- Create: `index.html`
- Test: `tests/verify_html.js`

**Interfaces:**
- Consumes: `public/details.txt`, `css/style.css`, `assets/*.svg`
- Produces: Complete semantic DOM structure for Header, Hero, Overview, Interactive Tech Explorer, 5-Stage Lifecycle, Impact Visualizer, Company Background, Dual-Mode Pilot Portal, and Footer.

- [ ] **Step 1: Write HTML verification test**
Create `tests/verify_html.js` to verify all content from `public/details.txt` is present:
- Company name: `Kashbot Agri Systems Private Limited`
- Location: `Buchpora, Srinagar, Jammu & Kashmir – 190020, India`
- Email: `info@kashbot.in`
- Phone: `7006613634`
- All 5 Core Areas represented
- 5-Stage Engineering Lifecycle steps
- Purpose and Vision statements
- Proper `<meta name="viewport">` and SEO title

- [ ] **Step 2: Run verification test to verify failure**
Run: `node tests/verify_html.js`
Expected: FAIL

- [ ] **Step 3: Implement `index.html`**
Write semantic HTML5 document including:
- Accessible skip link
- Sticky navigation with mobile menu drawer toggle
- Hero section with live telemetry metrics and CTA buttons
- Overview & Regional agro-climatic context
- Interactive Technology Explorer tabbed container with 5 panels
- 5-Stage Engineering Lifecycle interactive timeline
- Precision Impact Calculator UI
- Company Vision & Core Values cards
- Dual-Mode Pilot Inquiry & Academic Partnership Hub with form controls
- Detailed footer with Srinagar coordinates & contact links

- [ ] **Step 4: Run verification test to verify pass**
Run: `node tests/verify_html.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add index.html tests/verify_html.js
git commit -m "feat: implement complete semantic HTML5 structure with all company details"
```

---

### Task 4: Interactive Client-Side Engine (`js/app.js`)

**Files:**
- Create: `js/app.js`
- Test: `tests/verify_app.js`

**Interfaces:**
- Consumes: DOM nodes in `index.html`
- Produces:
  - `switchTab(tabId)`: Switches active technology tab, updates ARIA attributes, animates panels.
  - `updateImpact(acres)`: Dynamically calculates chemical savings, fuel savings, and runoff prevention.
  - `selectLifecycleStep(stepIndex)`: Highlights engineering stage and displays stage deep-dive.
  - `switchFormMode(mode)`: Toggles inquiry form between "Grower / Pilot Trial" and "Partner / Research".
  - `handleFormSubmit(e)`: Form validation and interactive success confirmation toast.
  - Mobile drawer toggle and scrollspy navigation highlighting.

- [ ] **Step 1: Write interactive verification test**
Create `tests/verify_app.js` that tests the mathematical calculations and exports of `js/app.js` (e.g. calculation of savings based on acreage).

```javascript
// tests/verify_app.js
const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'js', 'app.js');
if (!fs.existsSync(jsPath)) {
  console.error("FAIL: js/app.js does not exist");
  process.exit(1);
}

const code = fs.readFileSync(jsPath, 'utf8');
const requiredMethods = [
  'calculateImpact',
  'initTechTabs',
  'initLifecycle',
  'initFormSwitcher',
  'initMobileNav'
];

let failed = false;
requiredMethods.forEach(method => {
  if (!code.includes(method)) {
    console.error(`FAIL: Missing function: ${method}`);
    failed = true;
  }
});

// Test impact calculation math
const vm = require('vm');
const sandbox = { module: {}, exports: {} };
vm.createContext(sandbox);
vm.runInContext(code + '\nif (typeof calculateImpact !== "undefined") { sandbox.calc = calculateImpact; }', sandbox);

if (typeof sandbox.calc === 'function') {
  const result10 = sandbox.calc(10);
  if (!result10 || result10.chemicalSavedLiters <= 0 || result10.reductionPercent !== 85) {
    console.error("FAIL: calculateImpact math output unexpected", result10);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: js/app.js implements all interactive handlers and correct impact calculation logic.");
}
```

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/verify_app.js`
Expected: FAIL

- [ ] **Step 3: Implement `js/app.js`**
Write clean, modular, accessible JavaScript for all interactions.

- [ ] **Step 4: Run test to verify pass**
Run: `node tests/verify_app.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add js/app.js tests/verify_app.js
git commit -m "feat: implement interactive technology explorer, impact calculator, and inquiry engine"
```

---

### Task 5: End-to-End Visual Verification & Browser Validation

**Files:**
- Test: Live browser testing on port 8088 using `browser_subagent`
- Verification: Desktop (1920x1080) and Mobile (375x812) viewports

- [ ] **Step 1: Start local web server and verify availability**
Run HTTP server on port 8088 serving project root.

- [ ] **Step 2: Run automated browser subagent verification**
Inspect:
- Hero metrics and navigation links
- Switching through all 5 Technology Explorer tabs
- Adjusting acreage slider in Impact Calculator and verifying real-time number updates
- Switching form modes between Grower and Researcher
- Inspecting mobile drawer navigation
- Confirming zero console errors

- [ ] **Step 3: Take verification screenshots and document test results**

- [ ] **Step 4: Commit and finalize**
```bash
git add .
git commit -m "chore: complete browser verification and responsive UI polish"
```
