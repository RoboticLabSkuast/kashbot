// tests/verify_html.js
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error("FAIL: index.html does not exist");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

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
  'Research, Prototyping and Automation',
  'Identify a specific agricultural problem',
  'Develop a suitable mechanical and automation concept',
  'Integrate relevant sensors, control systems',
  'Build and test prototypes',
  'Evaluate performance and refine',
  'meta name="viewport"',
  'id="technologies"',
  'id="lifecycle"',
  'id="impact"',
  'id="contact"'
];

let failed = false;
requiredStrings.forEach(str => {
  if (!html.includes(str)) {
    console.error(`FAIL: Missing required content in index.html: "${str}"`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: index.html contains all required company data, Sorrel typography, and official logos.");
}
