# Sorrel Theme & Official Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Kashbot Agri Systems website into an editorial botanical deep-tech platform adopting the Sorrel QR menu theme (`https://gsapvault.com/demos/qr-menu-template/index.html`) and integrate the official logo from `public/logo.svg`.

**Architecture:** 
- Ingest and tight-crop `public/logo.svg` to create `assets/logo.svg` (full lockup) and `assets/logo-mark.svg` (emblem mark) without awkward A4 whitespace.
- Implement the Sorrel design system in `css/style.css` using the warm sage/paper/forest palette, `Yeseva One` and `Mukta` typography, dotted leader lines, and pill chips.
- Upgrade `index.html` and `js/app.js` with sticky category tabs, tactile filter chips, expandable technology drawers, and editorial section styling.

**Tech Stack:** HTML5 semantic layout, Vanilla CSS3 (custom properties, radial washes, cubic-bezier transitions), Vanilla JavaScript (tabs, filter chips, accordion toggles, impact calculator), SVG vector assets.

## Global Constraints
- Exact color tokens: `--ground: #E7ECE1`, `--paper: #F3F6EF`, `--ink: #23291F`, `--ink-soft: #55604D`, `--herb: #3F6B47`, `--tomato: #BE4830`.
- Exact typography: `'Yeseva One', Georgia, serif` for display titles; `'Mukta', system-ui, -apple-system, sans-serif` for body and UI.
- All company details from `public/details.txt` (Buchpora, Srinagar, Jammu & Kashmir – 190020, info@kashbot.in, 7006613634) must remain intact.
- Official logo from `public/logo.svg` must be used accurately with no distorted aspect ratio.

---

### Task 1: Official Logo Processing & Vector Mark Generation

**Files:**
- Modify: `tests/verify_assets.js`
- Create: `assets/logo.svg`
- Create: `assets/logo-mark.svg`

**Interfaces:**
- Consumes: `public/logo.svg` paths and styling.
- Produces: `assets/logo.svg` with tight viewBox (`viewBox="45 138 125 92"`) and `assets/logo-mark.svg` (`viewBox="64 138 75 60"`).

- [ ] **Step 1: Write test in `tests/verify_assets.js`**

Update `tests/verify_assets.js` to assert the presence of `public/logo.svg`, `assets/logo.svg` (with tight viewBox and official paths), and `assets/logo-mark.svg`.

```javascript
// tests/verify_assets.js
const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'logo.svg',
  'logo-mark.svg',
  'agri-robot.svg',
  'smart-spray.svg',
  'laser-weeder.svg',
  'sensors-board.svg'
];

let failed = false;

// Check public/logo.svg
const publicLogo = path.join(__dirname, '..', 'public', 'logo.svg');
if (!fs.existsSync(publicLogo)) {
  console.error("FAIL: Missing public/logo.svg");
  failed = true;
}

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

// Verify assets/logo.svg has tight viewBox and contains Kashbot paths
if (fs.existsSync(path.join(__dirname, '..', 'assets', 'logo.svg'))) {
  const logoContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'logo.svg'), 'utf8');
  if (!logoContent.includes('viewBox="45 138 125 92"')) {
    console.error("FAIL: assets/logo.svg does not have tight crop viewBox=\"45 138 125 92\"");
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: All required vector visual assets are valid.");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_assets.js`
Expected: FAIL due to missing `assets/logo-mark.svg` or non-tight `assets/logo.svg`.

- [ ] **Step 3: Create `assets/logo.svg` and `assets/logo-mark.svg`**

Extract the artwork from `public/logo.svg` with tight viewBox definitions:
- `assets/logo.svg`: `viewBox="45 138 125 92"` containing the emblem, "KASHBOT", and "AGRI SYSTEMS" with official colors (`#3e9c06` and `#23291F`).
- `assets/logo-mark.svg`: `viewBox="64 138 75 60"` containing the botanical leaf and robotic gear emblem.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify_assets.js`
Expected: PASS with "PASS: All required vector visual assets are valid."

- [ ] **Step 5: Commit**

```bash
git add tests/verify_assets.js assets/logo.svg assets/logo-mark.svg
git commit -m "feat: add tight-crop official logo and standalone emblem mark"
```

---

### Task 2: Sorrel Design Tokens & Typography in `css/style.css`

**Files:**
- Modify: `tests/verify_css.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: Sorrel palette and typography tokens (`Yeseva One`, `Mukta`).
- Produces: CSS custom properties (`--ground`, `--paper`, `--ink`, `--ink-soft`, `--herb`, `--tomato`, `--font-display`, `--font-sans`), dotted leaders (`.item__leader`), chip filters (`.chip`), category tabs (`.tab`), and dish/card styling (`.item`).

- [ ] **Step 1: Write test in `tests/verify_css.js`**

Update `tests/verify_css.js` to assert Sorrel design tokens and classes:

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
  '--ground:',
  '--paper:',
  '--ink:',
  '--ink-soft:',
  '--herb:',
  '--tomato:',
  '--font-display:',
  '--font-sans:',
  '--line:'
];

const requiredClasses = [
  '.site-header',
  '.brand',
  '.tab',
  '.chip',
  '.item',
  '.item__leader',
  '.item__desc',
  '.diet__tag'
];

let failed = false;
requiredTokens.forEach(token => {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing Sorrel design token: ${token}`);
    failed = true;
  }
});

requiredClasses.forEach(cls => {
  if (!css.includes(cls)) {
    console.error(`FAIL: Missing Sorrel CSS class: ${cls}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: css/style.css has all required Sorrel design tokens and components.");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_css.js`
Expected: FAIL with missing Sorrel tokens.

- [ ] **Step 3: Implement Sorrel styles in `css/style.css`**

Add root variables:
```css
:root {
  --ground: #E7ECE1;
  --paper: #F3F6EF;
  --ink: #23291F;
  --ink-soft: #55604D;
  --herb: #3F6B47;
  --tomato: #BE4830;

  --ground-rgb: 231, 236, 225;
  --paper-rgb: 243, 246, 239;
  --ink-rgb: 35, 41, 31;
  --ink-soft-rgb: 85, 96, 77;
  --herb-rgb: 63, 107, 71;
  --tomato-rgb: 190, 72, 48;

  --line: rgba(var(--ink-rgb), 0.14);
  --line-strong: rgba(var(--ink-rgb), 0.22);
  --shadow: 0 1px 0 rgba(var(--ink-rgb), 0.04), 0 8px 24px rgba(var(--ink-rgb), 0.06);

  --font-display: 'Yeseva One', Georgia, serif;
  --font-sans: 'Mukta', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --wrap: 72rem;
  color-scheme: light;
}
```
Implement body background radial washes, editorial header, category tabs (`.tabs`, `.tab.is-active`), dietary-style filter chips (`.chip`), item cards with dotted leaders (`.item__leader`), tag pills (`.diet__tag`), and collapsible drawer styles (`.item__more`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify_css.js`
Expected: PASS with "PASS: css/style.css has all required Sorrel design tokens and components."

- [ ] **Step 5: Commit**

```bash
git add tests/verify_css.js css/style.css
git commit -m "feat: implement Sorrel design tokens, typography, and card styles in CSS"
```

---

### Task 3: Interactive Tabs, Filter Chips & Expandable Drawers in `js/app.js`

**Files:**
- Modify: `tests/verify_app.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: DOM tab links (`[data-tab]`), filter chips (`[data-diet]`), item toggles (`[data-toggle]`).
- Produces: `initSorrelTabs()`, `initSorrelFilters()`, `initItemToggles()`, while maintaining `calculateImpact()`, `initLifecycle()`, and `initMobileNav()`.

- [ ] **Step 1: Write test in `tests/verify_app.js`**

Add assertions in `tests/verify_app.js` for `initSorrelTabs`, `initSorrelFilters`, and `initItemToggles`:

```javascript
const requiredMethods = [
  'calculateImpact',
  'initSorrelTabs',
  'initSorrelFilters',
  'initItemToggles',
  'initLifecycle',
  'initMobileNav'
];
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_app.js`
Expected: FAIL due to missing Sorrel methods.

- [ ] **Step 3: Implement Sorrel interactive handlers in `js/app.js`**

Implement:
- `initSorrelTabs()`: Switches active panel and updates tab indicator.
- `initSorrelFilters()`: Toggles active chips and filters items by data attributes (`data-diet`).
- `initItemToggles()`: Toggles expandable spec drawer (`data-more`) with animated height.
- Retain `calculateImpact(acres)` formula for the precision calculator.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify_app.js`
Expected: PASS with all methods implemented and calculations verified.

- [ ] **Step 5: Commit**

```bash
git add tests/verify_app.js js/app.js
git commit -m "feat: add Sorrel category tabs, filter chips, and drawer interactions in js"
```

---

### Task 4: HTML Structure, Logo Integration & Sorrel Component Layout in `index.html`

**Files:**
- Modify: `tests/verify_html.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: Google Fonts (`Yeseva One`, `Mukta`), `assets/logo.svg`, `assets/logo-mark.svg`, `css/style.css`, `js/app.js`.
- Produces: Complete semantic page layout with Sorrel header, hero, tabbed technology panels, pipeline, impact calculator, and footer.

- [ ] **Step 1: Write test in `tests/verify_html.js`**

Update `tests/verify_html.js` to assert Sorrel typography links, official logo references, category tabs, and required company details.

```javascript
const requiredStrings = [
  'Kashbot Agri Systems Private Limited',
  'Buchpora, Srinagar, Jammu & Kashmir',
  '190020',
  'info@kashbot.in',
  '7006613634',
  'Yeseva+One',
  'Mukta:wght@300;400;500;600;700',
  'assets/logo.svg',
  'assets/logo-mark.svg',
  'data-tabs',
  'data-filters',
  'Agricultural Robotics',
  'Precision Agricultural Machinery',
  'Intelligent Spraying Systems',
  'Laser-Based Weed Management',
  'Research, Prototyping and Automation'
];
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_html.js`
Expected: FAIL with missing Sorrel fonts / data attributes.

- [ ] **Step 3: Update `index.html`**

- Update `<head>` with fonts `Yeseva One` & `Mukta`, favicon `assets/logo-mark.svg`, and meta theme-color `#E7ECE1`.
- Update `<header>` with the official tight logo `assets/logo.svg`, company tagline, field lab hours pill, and contact link.
- Update `<main>` with:
  - Hero section in `Yeseva One` with telemetry badges and action buttons.
  - Controls bar (`.controls`): Sticky tabs (`data-tabs`) for categories (`All`, `Agricultural Robotics`, `Precision Machinery`, `Intelligent Spraying`, `Laser Weed Control`, `R&D Lab`) and dietary-style chips (`data-filters`: `Field Tested`, `Sensor AI`, `Zero Chemical`, `Patent Pending`).
  - Technology panels with editorial items (`.item`), dotted leader lines (`.item__leader`), botanical tags, and expandable detail drawers.
  - Overview section with editorial two-column typography.
  - R&D pipeline section (5 steps from `public/details.txt`).
  - Precision impact section with interactive calculator.
  - Footer with official location, phone, email, and copyright.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify_html.js`
Expected: PASS with "PASS: index.html contains all required company data and semantic landmarks."

- [ ] **Step 5: Commit**

```bash
git add tests/verify_html.js index.html
git commit -m "feat: update index.html with official logo, Sorrel fonts, and tabbed catalog"
```

---

### Task 5: End-to-End Regression & Verification

**Files:**
- Run: all test scripts in `tests/`
- Browser verification

- [ ] **Step 1: Run complete test suite**

Run:
```bash
node tests/verify_assets.js
node tests/verify_css.js
node tests/verify_app.js
node tests/verify_html.js
```
Expected: All 4 test scripts pass cleanly with exit code 0.

- [ ] **Step 2: Check git status and commit any cleanups**

```bash
git status
```
Expected: Clean working tree or commit any remaining adjustments.
