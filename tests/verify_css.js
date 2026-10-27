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
  '.diet__tag',
  '.trial-card',
  '.rover-hero-img',
  '.floating-whatsapp-btn'
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
