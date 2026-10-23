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
