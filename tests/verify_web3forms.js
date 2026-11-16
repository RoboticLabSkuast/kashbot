// tests/verify_web3forms.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("--- Verifying Web3Forms AJAX Dispatch, Validation & State Feedback ---");

const jsPath = path.join(__dirname, '..', 'js', 'app.js');
if (!fs.existsSync(jsPath)) {
  console.error("FAIL: js/app.js does not exist");
  process.exit(1);
}

const code = fs.readFileSync(jsPath, 'utf8');

// Helper to create mock DOM elements
function createMockElement(tag, initialProps = {}) {
  const el = {
    tagName: tag.toUpperCase(),
    value: initialProps.value || '',
    textContent: initialProps.textContent || '',
    innerHTML: initialProps.innerHTML || '',
    className: initialProps.className || '',
    placeholder: initialProps.placeholder || '',
    disabled: initialProps.disabled || false,
    action: initialProps.action || 'https://api.web3forms.com/submit',
    method: initialProps.method || 'POST',
    style: {},
    attributes: { ...initialProps.attributes },
    classList: {
      _classes: new Set((initialProps.className || '').split(/\s+/).filter(Boolean)),
      add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(' '); },
      remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(' '); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    getAttribute(name) { return this.attributes[name] ?? null; },
    setAttribute(name, val) { this.attributes[name] = String(val); },
    removeAttribute(name) { delete this.attributes[name]; },
    _listeners: {},
    addEventListener(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },
    async trigger(event) {
      const handlers = this._listeners[event.type] || [];
      for (const h of handlers) {
        await h(event);
      }
    },
    resetCalled: false,
    reset() {
      this.resetCalled = true;
      this.value = '';
    },
    scrollIntoViewCalled: false,
    scrollIntoView() {
      this.scrollIntoViewCalled = true;
    }
  };
  return el;
}

class MockFormData {
  constructor(form) {
    this.form = form;
    this.entries = new Map();
  }
  append(key, val) {
    this.entries.set(key, val);
  }
  get(key) {
    return this.entries.get(key);
  }
}

async function runTests() {
  let failed = false;

  // Setup DOM elements
  const elements = {
    'mode-grower-btn': createMockElement('button', { className: 'chip is-on', attributes: { 'aria-pressed': 'true' } }),
    'mode-partner-btn': createMockElement('button', { className: 'chip', attributes: { 'aria-pressed': 'false' } }),
    'label-org': createMockElement('label', { textContent: 'Orchard / Farm Name' }),
    'form-org': createMockElement('input', { placeholder: 'e.g. Valley Apple Orchards' }),
    'label-message': createMockElement('label', { textContent: 'Acreage & Field Trial Requirements *' }),
    'form-message': createMockElement('textarea'),
    'form-inquiry-type': createMockElement('input', { value: 'Orchardist / Commercial Grower' }),
    'form-subject': createMockElement('input', { value: 'New Orchard Field Trial Inquiry — Kashbot Agri Systems' }),
    'kashbot-inquiry-form': createMockElement('form', { action: 'https://api.web3forms.com/submit' }),
    'form-feedback-msg': createMockElement('div'),
    'submit-inquiry-btn': createMockElement('button', { innerHTML: '<span>Send Inquiry</span>' }),
    'form-name': createMockElement('input'),
    'form-email': createMockElement('input'),
    'form-phone': createMockElement('input')
  };

  let fetchCalls = [];
  let mockFetchResponse = null;

  const mockFetch = async (url, opts) => {
    fetchCalls.push({ url, opts });
    if (mockFetchResponse instanceof Error) {
      throw mockFetchResponse;
    }
    return mockFetchResponse;
  };

  const sandbox = {
    window: {
      open: () => {},
      addEventListener: () => {}
    },
    alert: () => {},
    document: {
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    FormData: MockFormData,
    fetch: mockFetch,
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    encodeURIComponent: encodeURIComponent
  };

  vm.createContext(sandbox);

  try {
    vm.runInContext(code + '\n;globalThis.initFormSwitcher = initFormSwitcher; globalThis.initInquiryForm = initInquiryForm;', sandbox);
  } catch (err) {
    console.error("FAIL: Error executing js/app.js in sandbox:", err);
    process.exit(1);
  }

  // Initialize both components
  sandbox.initFormSwitcher();
  sandbox.initInquiryForm();

  // -------------------------------------------------------------
  // Test 1: initFormSwitcher syncs hidden inquiry_type and subject
  // -------------------------------------------------------------
  console.log("Test 1: Testing mode switcher syncing hidden inputs...");
  await elements['mode-partner-btn'].trigger({ type: 'click', preventDefault: () => {} });
  if (
    elements['form-inquiry-type'].value !== 'Research Institution / Partner' ||
    elements['form-subject'].value !== 'New Research & Partnership Inquiry — Kashbot Agri Systems'
  ) {
    console.error("FAIL Test 1: Partner mode did not properly sync hidden inquiry_type or subject:", {
      inquiryType: elements['form-inquiry-type'].value,
      subject: elements['form-subject'].value
    });
    failed = true;
  } else {
    console.log("PASS: Partner mode successfully synced hidden fields.");
  }

  await elements['mode-grower-btn'].trigger({ type: 'click', preventDefault: () => {} });
  if (
    elements['form-inquiry-type'].value !== 'Orchardist / Commercial Grower' ||
    elements['form-subject'].value !== 'New Orchard Field Trial Inquiry — Kashbot Agri Systems'
  ) {
    console.error("FAIL Test 1: Grower mode did not properly sync hidden inquiry_type or subject:", {
      inquiryType: elements['form-inquiry-type'].value,
      subject: elements['form-subject'].value
    });
    failed = true;
  } else {
    console.log("PASS: Grower mode successfully restored hidden fields.");
  }

  // -------------------------------------------------------------
  // Test 2: Validation of required fields
  // -------------------------------------------------------------
  console.log("Test 2: Testing required fields validation...");
  fetchCalls = [];
  elements['form-name'].value = '';
  elements['form-email'].value = '';
  elements['form-phone'].value = '';
  elements['form-message'].value = '';

  await elements['kashbot-inquiry-form'].trigger({ type: 'submit', preventDefault: () => {} });

  if (fetchCalls.length > 0) {
    console.error("FAIL Test 2: fetch was invoked despite missing required fields.");
    failed = true;
  } else if (!elements['form-feedback-msg'].innerHTML.includes('Please complete all required fields')) {
    console.error("FAIL Test 2: Expected required fields warning message, got:", elements['form-feedback-msg'].innerHTML);
    failed = true;
  } else if (elements['form-feedback-msg'].style.display !== 'block') {
    console.error("FAIL Test 2: Feedback message display style was not set to 'block'");
    failed = true;
  } else {
    console.log("PASS: Missing required fields properly prevented dispatch and showed alert.");
  }

  // -------------------------------------------------------------
  // Test 3: Validation of email format
  // -------------------------------------------------------------
  console.log("Test 3: Testing email format validation...");
  fetchCalls = [];
  elements['form-name'].value = 'Er. Tariq Ahmad';
  elements['form-email'].value = 'invalid-email-address';
  elements['form-phone'].value = '7006613634';
  elements['form-message'].value = 'Testing spray trials in Shopian';

  await elements['kashbot-inquiry-form'].trigger({ type: 'submit', preventDefault: () => {} });

  if (fetchCalls.length > 0) {
    console.error("FAIL Test 3: fetch was invoked despite invalid email.");
    failed = true;
  } else if (!elements['form-feedback-msg'].innerHTML.includes('valid email address')) {
    console.error("FAIL Test 3: Expected valid email warning message, got:", elements['form-feedback-msg'].innerHTML);
    failed = true;
  } else {
    console.log("PASS: Invalid email format properly caught and flagged.");
  }

  // -------------------------------------------------------------
  // Test 4: Successful AJAX dispatch & inline success state
  // -------------------------------------------------------------
  console.log("Test 4: Testing successful AJAX dispatch...");
  fetchCalls = [];
  elements['form-name'].value = 'Er. Tariq Ahmad';
  elements['form-email'].value = 'tariq@kashbot.in';
  elements['form-phone'].value = '7006613634';
  elements['form-message'].value = '5-acre high-density apple orchard in Shopian.';
  elements['kashbot-inquiry-form'].resetCalled = false;

  mockFetchResponse = {
    ok: true,
    json: async () => ({ success: true, message: 'Submission received' })
  };

  await elements['kashbot-inquiry-form'].trigger({ type: 'submit', preventDefault: () => {} });

  if (fetchCalls.length !== 1) {
    console.error("FAIL Test 4: Expected 1 fetch call, got:", fetchCalls.length);
    failed = true;
  } else {
    const call = fetchCalls[0];
    if (call.url !== 'https://api.web3forms.com/submit') {
      console.error("FAIL Test 4: Fetch called with unexpected URL:", call.url);
      failed = true;
    }
    if (call.opts.headers?.Accept !== 'application/json') {
      console.error("FAIL Test 4: Fetch headers missing Accept: application/json:", call.opts.headers);
      failed = true;
    }
  }

  if (!elements['form-feedback-msg'].className.includes('feedback-msg--success')) {
    console.error("FAIL Test 4: Expected feedback-msg--success class, got:", elements['form-feedback-msg'].className);
    failed = true;
  }
  if (!elements['form-feedback-msg'].innerHTML.includes('Er. Tariq Ahmad')) {
    console.error("FAIL Test 4: Success message does not contain applicant name 'Er. Tariq Ahmad'");
    failed = true;
  }
  if (!elements['form-feedback-msg'].innerHTML.includes('wa.me/917006613634')) {
    console.error("FAIL Test 4: Success message missing WhatsApp link fallback");
    failed = true;
  }
  if (!elements['kashbot-inquiry-form'].resetCalled) {
    console.error("FAIL Test 4: form.reset() was not invoked upon success.");
    failed = true;
  }
  if (!failed) {
    console.log("PASS: Successful AJAX submission verified with applicant feedback and WhatsApp link.");
  }

  // -------------------------------------------------------------
  // Test 5: Network failure / server error handling with WhatsApp fallback
  // -------------------------------------------------------------
  console.log("Test 5: Testing network error fallback...");
  fetchCalls = [];
  elements['form-name'].value = 'Er. Tariq Ahmad';
  elements['form-email'].value = 'tariq@kashbot.in';
  elements['form-phone'].value = '7006613634';
  elements['form-message'].value = '5-acre orchard.';
  mockFetchResponse = new Error('Network error (Failed to fetch)');

  await elements['kashbot-inquiry-form'].trigger({ type: 'submit', preventDefault: () => {} });

  if (!elements['form-feedback-msg'].className.includes('feedback-msg--alert')) {
    console.error("FAIL Test 5: Expected feedback-msg--alert class on error, got:", elements['form-feedback-msg'].className);
    failed = true;
  }
  if (!elements['form-feedback-msg'].innerHTML.includes('info@kashbot.in')) {
    console.error("FAIL Test 5: Error fallback message missing info@kashbot.in mailto link");
    failed = true;
  }
  if (!elements['form-feedback-msg'].innerHTML.includes('wa.me/917006613634')) {
    console.error("FAIL Test 5: Error fallback message missing WhatsApp fallback link");
    failed = true;
  }
  if (elements['submit-inquiry-btn'].disabled) {
    console.error("FAIL Test 5: Submit button remained disabled after error");
    failed = true;
  }
  if (!failed) {
    console.log("PASS: Network failure handled gracefully with email and WhatsApp fallbacks.");
  }

  if (failed) {
    console.error("OVERALL STATUS: FAILED Web3Forms submission checks.");
    process.exit(1);
  } else {
    console.log("OVERALL STATUS: ALL WEB3FORMS TESTS PASSED.");
  }
}

runTests().catch(err => {
  console.error("Unhandled error in tests:", err);
  process.exit(1);
});
