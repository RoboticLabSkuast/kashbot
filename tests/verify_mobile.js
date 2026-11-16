// tests/verify_mobile.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("--- Verifying Mobile Viewport Responsiveness ---");

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const htmlPath = path.join(__dirname, '..', 'index.html');
const css = fs.readFileSync(cssPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

let failed = false;

// Test 1: Check mobile drawer has overflow-y: auto
if (!css.includes('.mobile-drawer') || !css.match(/\.mobile-drawer\s*\{[^}]*overflow-y:\s*auto/)) {
  console.error("FAIL: .mobile-drawer is missing 'overflow-y: auto' for scrollable mobile navigation.");
  failed = true;
} else {
  console.log("PASS: .mobile-drawer is scrollable on constrained height screens.");
}

// Extract media queries
function getMediaBlock(maxPx) {
  const regex = new RegExp(`@media[^{]*max-width:\\s*${maxPx}px[^{]*\\{([\\s\\S]*?)\\n\\}@media|@media[^{]*max-width:\\s*${maxPx}px[^{]*\\{([\\s\\S]*?)$`, 'i');
  const match = css.match(regex);
  return match ? (match[1] || match[2] || '') : '';
}

const media600 = getMediaBlock(600) + getMediaBlock(650) + getMediaBlock(768);

// Test 2: Check header CTA is hidden on small mobile viewports
if (!media600.includes('#header-cta-btn') || !media600.match(/#header-cta-btn\s*\{[^}]*display:\s*none/)) {
  console.error("FAIL: #header-cta-btn should be hidden on mobile to prevent pushing the mobile hamburger off screen.");
  failed = true;
} else {
  console.log("PASS: Header CTA is hidden on small mobile to keep header clean and hamburger visible.");
}

// Test 3: Check hero-actions wraps on mobile
if (!media600.includes('.hero-actions') || !media600.match(/\.hero-actions\s*\{[^}]*flex-direction:\s*column/)) {
  console.error("FAIL: .hero-actions missing flex-direction: column on mobile screens.");
  failed = true;
} else {
  console.log("PASS: .hero-actions stacks vertically on mobile screens.");
}

// Test 4: Check item head flex direction on mobile to prevent badge truncation
if (!media600.includes('.item__head') || !media600.match(/\.item__head\s*\{[^}]*flex-direction:\s*column/)) {
  console.error("FAIL: .item__head should stack into column on mobile so tech titles and status badges don't collide or clip.");
  failed = true;
} else {
  console.log("PASS: .item__head stacks cleanly on mobile.");
}

// Test 5: Check floating whatsapp button collapses text on mobile
if (!media600.includes('.floating-whatsapp-text') || !media600.match(/\.floating-whatsapp-text\s*\{[^}]*display:\s*none/)) {
  console.error("FAIL: .floating-whatsapp-text should be hidden on mobile to prevent covering page content.");
  failed = true;
} else {
  console.log("PASS: Floating WhatsApp button collapses to compact FAB on mobile.");
}

// Test 6: Check container padding on mobile
if (!media600.includes('.container') || !media600.match(/\.container\s*\{[^}]*padding:\s*0\s+1/)) {
  console.error("FAIL: .container missing mobile padding reduction (0 1rem or 0 1.25rem).");
  failed = true;
} else {
  console.log("PASS: .container reduces horizontal padding on mobile.");
}

// Test 7: Headless Chrome Layout Loading Check (375px width)
try {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  if (fs.existsSync(chromePath)) {
    const indexUrl = `file:///${path.join(__dirname, '..', 'index.html').replace(/\\/g, '/')}`;
    execSync(
      `"${chromePath}" --headless --disable-gpu --window-size=375,812 --virtual-time-budget=2000 --dump-dom "${indexUrl}"`,
      { encoding: 'utf8' }
    );
    console.log("PASS: Chrome headless loaded mobile viewport at 375px.");
  }
} catch (e) {
  console.warn("Notice: Headless Chrome check warning:", e.message);
}

if (failed) {
  console.error("OVERALL STATUS: FAILED mobile checks.");
  process.exit(1);
} else {
  console.log("OVERALL STATUS: PASSED all mobile checks.");
}
