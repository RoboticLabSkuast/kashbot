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
