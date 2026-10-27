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

// Check public/logo.svg exists
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
