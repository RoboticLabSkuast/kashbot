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
