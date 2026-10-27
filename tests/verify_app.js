// tests/verify_app.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsPath = path.join(__dirname, '..', 'js', 'app.js');
if (!fs.existsSync(jsPath)) {
  console.error("FAIL: js/app.js does not exist");
  process.exit(1);
}

const code = fs.readFileSync(jsPath, 'utf8');
const requiredMethods = [
  'calculateImpact',
  'initSorrelTabs',
  'initSorrelFilters',
  'initItemToggles',
  'initLifecycle',
  'initMobileNav',
  'generateWhatsAppInquiryUrl'
];

let failed = false;
requiredMethods.forEach(method => {
  if (!code.includes(method)) {
    console.error(`FAIL: Missing function: ${method}`);
    failed = true;
  }
});

// Test impact calculation logic and WhatsApp URL generation in isolated sandbox
const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  }
};
vm.createContext(sandbox);

try {
  vm.runInContext(code + '\n;globalThis.calc = calculateImpact;\nglobalThis.buildWa = generateWhatsAppInquiryUrl;', sandbox);
  if (typeof sandbox.calc === 'function') {
    const result15 = sandbox.calc(15);
    if (!result15 || result15.chemicalSavedLiters !== 3825 || result15.fuelSavedHours !== 120 || result15.reductionPercent !== 85) {
      console.error("FAIL: calculateImpact(15) returned unexpected values:", result15);
      failed = true;
    }
  } else {
    console.error("FAIL: calculateImpact is not a callable function in sandbox");
    failed = true;
  }

  if (typeof sandbox.buildWa === 'function') {
    const waUrl = sandbox.buildWa({
      name: 'Tariq Ahmad',
      phone: '7006613634',
      email: 'tariq@test.com',
      category: 'Orchardist / Commercial Grower',
      org: 'Valley Apples',
      message: 'Need spraying rover'
    });
    if (!waUrl.startsWith('https://wa.me/917006613634?text=') || !waUrl.includes('Tariq%20Ahmad') || !waUrl.includes('7006613634')) {
      console.error("FAIL: generateWhatsAppInquiryUrl produced invalid URL:", waUrl);
      failed = true;
    }
  } else {
    console.error("FAIL: generateWhatsAppInquiryUrl is not a callable function in sandbox");
    failed = true;
  }
} catch (e) {
  console.error("FAIL: Error evaluating js/app.js in sandbox:", e);
  failed = true;
}

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: js/app.js implements all interactive handlers and correct impact calculation logic.");
}
