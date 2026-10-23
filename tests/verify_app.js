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

// Test impact calculation logic in isolated sandbox
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
  vm.runInContext(code + '\n;globalThis.calc = calculateImpact;', sandbox);
  if (typeof sandbox.calc === 'function') {
    const result15 = sandbox.calc(15);
    if (!result15 || result15.chemicalSavedLiters !== 3825 || result15.fuelSavedHours !== 120 || result15.reductionPercent !== 85) {
      console.error("FAIL: calculateImpact(15) returned unexpected values:", result15);
      failed = true;
    }
    const result10 = sandbox.calc(10);
    if (!result10 || result10.chemicalSavedLiters !== 2550 || result10.fuelSavedHours !== 80) {
      console.error("FAIL: calculateImpact(10) returned unexpected values:", result10);
      failed = true;
    }
  } else {
    console.error("FAIL: calculateImpact is not a callable function in sandbox");
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
