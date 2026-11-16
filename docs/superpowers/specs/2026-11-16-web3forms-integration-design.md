# Kashbot Agri Systems — Web3Forms Contact Integration Design Spec

**Date:** 2026-11-16  
**Status:** Approved  
**Topic:** Integrate Web3Forms asynchronous contact form submission into the Kashbot Agri Systems website.

---

## 1. Overview & Objectives

Kashbot Agri Systems Private Limited requires a reliable, serverless contact form submission pipeline to collect field trial requests, grower inquiries, and institutional research partnerships directly into the company's email inbox.

The objective is to connect the existing Sorrel editorial contact form to the Web3Forms API endpoint (`https://api.web3forms.com/submit`) using access key `072bfda0-e3e8-45f7-a15c-c100ad09bd56`, delivering a seamless, in-place AJAX user experience without page refreshes or external redirects.

---

## 2. Form Architecture & Markup (`index.html`)

### 2.1 Form Configuration
The `<form id="kashbot-inquiry-form">` element will declare standard attributes for progressive enhancement while being handled via JavaScript `fetch`:
- `action="https://api.web3forms.com/submit"`
- `method="POST"`
- `novalidate` (browser default popups suppressed in favor of polished inline validation notices)

### 2.2 Hidden Form Fields
1. **Access Key:**
   ```html
   <input type="hidden" name="access_key" value="072bfda0-e3e8-45f7-a15c-c100ad09bd56">
   ```
2. **Subject:**
   ```html
   <input type="hidden" name="subject" id="form-subject" value="New Inquiry for Kashbot Agri Systems">
   ```
3. **From Name:**
   ```html
   <input type="hidden" name="from_name" value="Kashbot Agri Systems Website">
   ```
4. **Category / Inquiry Type:**
   ```html
   <input type="hidden" name="inquiry_type" id="form-inquiry-type" value="Orchardist / Commercial Grower">
   ```
   *Dynamically updated whenever the user toggles between the "Orchardist / Grower" and "Institution / Research" chips.*
5. **Anti-Spam Honeypot:**
   ```html
   <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
   ```

### 2.3 Form Fields & Name Attributes
All user-facing input elements will carry clear semantic `name` attributes:
- `name="name"`: Full Name (`#form-name`, `required`)
- `name="email"`: Email Address (`#form-email`, `required`)
- `name="phone"`: Phone / WhatsApp Number (`#form-phone`, `required`)
- `name="organization"`: Orchard / Farm / Institution Name (`#form-org`)
- `name="message"`: Acreage & Requirements (`#form-message`, `required`)

### 2.4 Submit Button & Direct WhatsApp Strip
- **Submit Button:** Styled as `.btn-primary.btn-submit-inquiry` with button text:
  *"Send Inquiry to Engineering"* (accompanied by a send/paper-plane SVG icon).
- **Direct WhatsApp Strip:** The `.whatsapp-quick-banner` situated above the form is preserved intact to provide visitors with the choice of either formal email submission or immediate 1-tap WhatsApp chat.

---

## 3. Client-Side AJAX Architecture (`js/app.js`)

### 3.1 Submission Workflow
1. **Form Interception:** Event listener on `submit` event with `e.preventDefault()`.
2. **Client Validation:**
   - Verify `name`, `email`, `phone`, and `message` are non-empty.
   - Validate email format with standard email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - If invalid, display a tailored prompt in `#form-feedback-msg` without submitting.
3. **Loading State:**
   - Disable submit button (`submitBtn.disabled = true;`).
   - Save original button inner HTML.
   - Set button text to: *"Sending Inquiry..."* with subtle opacity dimming.
4. **Asynchronous API Dispatch:**
   - Construct `FormData` from the form.
   - Dispatch `fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })`.
   - Parse response as JSON (`data.success === true`).
5. **Success Handling:**
   - Form is reset (`form.reset()`).
   - Mode is reset to default (Orchardist/Grower).
   - Display prominent confirmation in `#form-feedback-msg`:
     ```html
     <div class="feedback-success">
       <strong>✓ Inquiry Sent Successfully!</strong>
       <p>Thank you, [Name]! Your inquiry has been delivered directly to our Srinagar engineering team. We will review your field specifications and connect with you shortly.</p>
       <p class="feedback-sub">Need an immediate answer? <a href="[WhatsApp URL]" target="_blank" rel="noopener noreferrer">Tap here to chat on WhatsApp (+91 7006613634)</a>.</p>
     </div>
     ```
   - Restore submit button state with *"Inquiry Sent ✓"*, reverting to *"Send Inquiry to Engineering"* after 4 seconds.
6. **Error & Fallback Handling:**
   - If `fetch` fails or `data.success` is false:
     - Restore submit button.
     - Display a clean warning in `#form-feedback-msg` offering direct email (`info@kashbot.in`) and WhatsApp (+91 7006613634) fallback links.

---

## 4. Testing & Verification

1. **HTML Verification (`tests/verify_html.js`):**
   - Ensure `https://api.web3forms.com/submit` action is present.
   - Ensure access key `072bfda0-e3e8-45f7-a15c-c100ad09bd56` is present.
   - Ensure all input `name` attributes (`name`, `email`, `phone`, `organization`, `message`, `access_key`, `botcheck`) are present.
2. **App Verification (`tests/verify_app.js`):**
   - Ensure `initInquiryForm` handles the AJAX submission flow, disables button on submit, constructs `FormData`, and handles both success and error responses.
   - Preserve existing function exports and impact calculations.
3. **Dedicated Integration Test (`tests/verify_web3forms.js`):**
   - Automated sandbox test verifying mock `fetch` submission, correct parameters sent to Web3Forms endpoint, and UI feedback updates.
4. **Regression Testing:**
   - Run `tests/verify_mobile.js`, `tests/verify_css.js`, `tests/verify_html.js`, `tests/verify_app.js`, `tests/verify_assets.js` to ensure 100% pass rate.
