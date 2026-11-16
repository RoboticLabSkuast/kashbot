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
