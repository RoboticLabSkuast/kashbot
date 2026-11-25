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
  'Buchpora, Srinagar, Jammu &amp; Kashmir',
  '190020',
  'info@kashbot.in',
  '7006613634',
  'Space+Grotesk',
  'Plus+Jakarta+Sans',
  'JetBrains+Mono',
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
  'id="airos-blueprint"',
  'id="hero-lidar-canvas"',
  'id="motion-schematic"',
  'id="technologies"',
  'id="trials"',
  'id="lifecycle"',
  'id="impact"',
  'id="contact"',
  'fetchpriority="high"',
  'assets/rover.png',
  'assets/active-spraying-trial.jpg',
  'assets/rover-in-orchard.jpg',
  'assets/field-trial-setup.jpg',
  'wa.me/917006613634',
  'floating-whatsapp-btn',
  'action="https://api.web3forms.com/submit"',
  '072bfda0-e3e8-45f7-a15c-c100ad09bd56',
  'name="access_key"',
  'name="subject"',
  'name="from_name"',
  'name="inquiry_type"',
  'name="name"',
  'name="email"',
  'name="phone"',
  'name="organization"',
  'name="message"',
  'name="botcheck"'
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
  console.log("PASS: index.html contains all required company data, Alpine Field-Engineering typography, interactive blueprint, and official logos.");
}
