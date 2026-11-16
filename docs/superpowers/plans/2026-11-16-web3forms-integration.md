# Web3Forms Contact Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Kashbot Agri Systems contact form to the Web3Forms API (`https://api.web3forms.com/submit`) with access key `072bfda0-e3e8-45f7-a15c-c100ad09bd56` via asynchronous AJAX dispatch with in-place validation, loading states, and inline confirmation messaging.

**Architecture:** Client-side HTML form markup configured with Web3Forms hidden attributes and named fields, intercepted by vanilla ES6 JavaScript handling asynchronous `fetch` dispatch to Web3Forms without page reload, presenting inline loading and success/error feedback.

**Tech Stack:** Vanilla HTML5, CSS3, Vanilla ES6 JavaScript, Web3Forms API, Node.js test scripts.

## Global Constraints

- Endpoint: `https://api.web3forms.com/submit`
- Access Key: `072bfda0-e3e8-45f7-a15c-c100ad09bd56`
- Form fields: `name`, `email`, `phone`, `organization`, `inquiry_type`, `message`, `access_key`, `botcheck`, `subject`, `from_name`
- Mobile responsiveness must remain 100% intact across all breakpoints
- All existing tests in `tests/` must continue to pass

---

### Task 1: Update Form Markup & Semantic Attributes

**Files:**
- Modify: `index.html:750-785`
- Test: `tests/verify_html.js`

**Interfaces:**
- Consumes: Existing form structure `#kashbot-inquiry-form`
- Produces: Form markup configured with Web3Forms action, hidden access key, subject, from_name, botcheck honeypot, named inputs, and updated submit button

- [ ] **Step 1: Write failing test in tests/verify_html.js**

Add checks for Web3Forms configuration to `tests/verify_html.js`:
```javascript
  'action="https://api.web3forms.com/submit"',
  '072bfda0-e3e8-45f7-a15c-c100ad09bd56',
  'name="access_key"',
  'name="name"',
  'name="email"',
  'name="phone"',
  'name="organization"',
  'name="message"',
  'name="botcheck"'
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_html.js`
Expected: FAIL with "Missing required content in index.html"

- [ ] **Step 3: Update index.html with Web3Forms markup**

Update `<form class="contact-form" id="kashbot-inquiry-form">` to:
```html
<form class="contact-form" id="kashbot-inquiry-form" action="https://api.web3forms.com/submit" method="POST" novalidate>
  <input type="hidden" name="access_key" value="072bfda0-e3e8-45f7-a15c-c100ad09bd56">
  <input type="hidden" name="subject" id="form-subject" value="New Engineering & Trial Inquiry — Kashbot Agri Systems">
  <input type="hidden" name="from_name" value="Kashbot Agri Systems Website">
  <input type="hidden" name="inquiry_type" id="form-inquiry-type" value="Orchardist / Commercial Grower">
  <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

  <div class="form-group">
    <label for="form-name">Your Full Name *</label>
    <input type="text" id="form-name" name="name" placeholder="e.g. Er. Tariq Ahmad" required>
  </div>

  <div class="form-row-2">
    <div class="form-group">
      <label for="form-email">Email Address *</label>
      <input type="email" id="form-email" name="email" placeholder="name@domain.com" required>
    </div>
    <div class="form-group">
      <label for="form-phone">Phone / WhatsApp Number *</label>
      <input type="tel" id="form-phone" name="phone" placeholder="7006613634" required>
    </div>
  </div>

  <div class="form-group">
    <label for="form-org" id="label-org">Orchard / Farm Name</label>
    <input type="text" id="form-org" name="organization" placeholder="e.g. Valley Apple Orchards">
  </div>

  <div class="form-group">
    <label for="form-message" id="label-message">Acreage &amp; Field Trial Requirements *</label>
    <textarea id="form-message" name="message" rows="4" placeholder="Describe your orchard/farm size, crop types (e.g. apple, pear), or specific operational challenges..." required></textarea>
  </div>

  <button type="submit" class="btn-primary btn-submit-inquiry" id="submit-inquiry-btn" style="width: 100%; padding: 0.95rem; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
    <span>Send Inquiry to Engineering</span>
  </button>

  <div id="form-feedback-msg" style="display: none; padding: 1.1rem; border-radius: 0.8rem; text-align: center; margin-top: 0.5rem; line-height: 1.5;">
  </div>
</form>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify_html.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/verify_html.js
git commit -m "feat: add Web3Forms configuration and input names to contact form"
```

---

### Task 2: Implement AJAX Dispatch, Validation & State Feedback

**Files:**
- Modify: `js/app.js:180-295`
- Create: `tests/verify_web3forms.js`
- Test: `tests/verify_app.js`

**Interfaces:**
- Consumes: Form submit event, Web3Forms API endpoint
- Produces: Asynchronous `fetch` call with `FormData`, dynamic loading state, inline success confirmation with WhatsApp fallback, error resilience

- [ ] **Step 1: Write automated test in tests/verify_web3forms.js**

Create `tests/verify_web3forms.js` which loads `js/app.js` into a sandboxed DOM environment and verifies:
- Validation checks required fields (name, email, phone, message).
- Successful `fetch` response produces inline success HTML containing the applicant's name and resets the form.
- Network failure or server error produces inline error fallback with direct email and WhatsApp contact.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify_web3forms.js`
Expected: FAIL (AJAX submit not yet implemented in `initInquiryForm`)

- [ ] **Step 3: Implement AJAX submission in js/app.js**

Update `initFormSwitcher` to sync `form-inquiry-type` and `form-subject`:
```javascript
function initFormSwitcher() {
  const growerBtn = document.getElementById('mode-grower-btn');
  const partnerBtn = document.getElementById('mode-partner-btn');
  const labelOrg = document.getElementById('label-org');
  const inputOrg = document.getElementById('form-org');
  const labelMessage = document.getElementById('label-message');
  const textareaMessage = document.getElementById('form-message');
  const hiddenInquiryType = document.getElementById('form-inquiry-type');
  const hiddenSubject = document.getElementById('form-subject');

  if (!growerBtn || !partnerBtn) return;

  function setMode(mode) {
    if (mode === 'grower') {
      growerBtn.classList.add('is-on');
      growerBtn.setAttribute('aria-pressed', 'true');
      partnerBtn.classList.remove('is-on');
      partnerBtn.setAttribute('aria-pressed', 'false');
      if (labelOrg) labelOrg.textContent = 'Orchard / Farm Name';
      if (inputOrg) inputOrg.placeholder = 'e.g. Valley Apple Orchards';
      if (labelMessage) labelMessage.textContent = 'Acreage & Field Trial Requirements *';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your orchard/farm size, crop types (e.g. apple, pear), or specific operational challenges...';
      if (hiddenInquiryType) hiddenInquiryType.value = 'Orchardist / Commercial Grower';
      if (hiddenSubject) hiddenSubject.value = 'New Orchard Field Trial Inquiry — Kashbot Agri Systems';
    } else {
      partnerBtn.classList.add('is-on');
      partnerBtn.setAttribute('aria-pressed', 'true');
      growerBtn.classList.remove('is-on');
      growerBtn.setAttribute('aria-pressed', 'false');
      if (labelOrg) labelOrg.textContent = 'Institution / Organization / Fund';
      if (inputOrg) inputOrg.placeholder = 'e.g. SKUAST-Kashmir / AgTech Ventures';
      if (labelMessage) labelMessage.textContent = 'Collaboration or Research Proposal *';
      if (textareaMessage) textareaMessage.placeholder = 'Describe your research objective, grant proposal, trial partnership, or commercial scope...';
      if (hiddenInquiryType) hiddenInquiryType.value = 'Research Institution / Partner';
      if (hiddenSubject) hiddenSubject.value = 'New Research & Partnership Inquiry — Kashbot Agri Systems';
    }
  }

  growerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('grower');
  });

  partnerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setMode('partner');
  });
}
```

Implement `initInquiryForm`:
```javascript
function initInquiryForm() {
  const form = document.getElementById('kashbot-inquiry-form');
  const feedbackMsg = document.getElementById('form-feedback-msg');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  if (!form || !feedbackMsg || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !phone || !message) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please complete all required fields (*)</strong> so our engineering team can review your request.';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = '<strong>Please provide a valid email address</strong> (e.g. name@domain.com).';
      feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Enter loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Sending Inquiry to Engineering...</span>
    `;

    feedbackMsg.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action || 'https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.reset();
        feedbackMsg.className = 'feedback-msg feedback-msg--success';
        feedbackMsg.style.display = 'block';
        feedbackMsg.style.background = 'rgba(var(--herb-rgb), 0.12)';
        feedbackMsg.style.border = '1px solid var(--herb)';
        feedbackMsg.style.color = 'var(--ink)';
        feedbackMsg.innerHTML = `
          <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.35rem; color: var(--herb);">
            ✓ Inquiry Sent Successfully!
          </div>
          <div style="margin-bottom: 0.5rem; line-height: 1.5;">
            Thank you, <strong>${name}</strong>. Your details have been delivered to our engineering desk at Buchpora, Srinagar. We will review your field specifications and connect with you shortly.
          </div>
          <div style="font-size: 0.9rem; margin-top: 0.6rem; color: var(--ink-soft);">
            Need an immediate response? <a href="https://wa.me/917006613634?text=Hello%20Kashbot%2C%20I%20just%20submitted%20a%20trial%20inquiry%20via%20your%20website%20(Name%3A%20${encodeURIComponent(name)})" target="_blank" rel="noopener noreferrer" style="color: var(--herb); font-weight: 700; text-decoration: underline;">Tap here to chat on WhatsApp (+91 7006613634)</a>.
          </div>
        `;
        submitBtn.innerHTML = `<span>Inquiry Sent ✓</span>`;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.innerHTML = originalBtnContent;
        }, 3500);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      feedbackMsg.className = 'feedback-msg feedback-msg--alert';
      feedbackMsg.style.display = 'block';
      feedbackMsg.style.background = 'rgba(var(--tomato-rgb), 0.1)';
      feedbackMsg.style.border = '1px solid var(--tomato)';
      feedbackMsg.style.color = 'var(--ink)';
      feedbackMsg.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.3rem; color: var(--tomato);">
          Notice: Online dispatch could not be completed.
        </div>
        <div style="font-size: 0.92rem; line-height: 1.5;">
          Please email us directly at <a href="mailto:info@kashbot.in" style="color: var(--herb); text-decoration: underline; font-weight: 600;">info@kashbot.in</a> or connect with engineering on <a href="https://wa.me/917006613634" target="_blank" rel="noopener noreferrer" style="color: var(--herb); text-decoration: underline; font-weight: 600;">WhatsApp (+91 7006613634)</a>.
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalBtnContent;
    }

    feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/verify_web3forms.js`
Run: `node tests/verify_app.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/app.js tests/verify_web3forms.js tests/verify_app.js
git commit -m "feat: implement Web3Forms AJAX submission with inline feedback and WhatsApp fallback"
```

---

### Task 3: Full Regression & Mobile Verification

**Files:**
- Test: `tests/verify_mobile.js`
- Test: `tests/verify_css.js`
- Test: `tests/verify_html.js`
- Test: `tests/verify_app.js`
- Test: `tests/verify_assets.js`
- Test: `tests/verify_web3forms.js`

- [ ] **Step 1: Execute all test suites**

Run:
```bash
node tests/verify_html.js
node tests/verify_css.js
node tests/verify_app.js
node tests/verify_assets.js
node tests/verify_mobile.js
node tests/verify_web3forms.js
```
Expected: All suites report PASS with 0 exit code.

- [ ] **Step 2: End-to-end headless Chrome verification**

Run headless Chrome at 375px viewport to verify contact form renders cleanly on mobile, submit button doesn't wrap awkwardly, and honeypot field is hidden.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore: verify Web3Forms integration across all test suites"
```
