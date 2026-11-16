# Task 2 Report: Implement AJAX Dispatch, Validation & State Feedback

**Task:** Task 2 — Implement AJAX Dispatch, Validation & State Feedback in `js/app.js`  
**Status:** DONE  
**Commit:** `b4f9ec8` (`feat: implement Web3Forms AJAX submission with inline feedback and WhatsApp fallback`)  
**Timestamp:** 2026-11-16T11:04:00+05:30  

---

## 1. Overview of Changes

1. **`js/app.js` (`initFormSwitcher` & `initInquiryForm`):**
   - **Mode Switcher Sync (`initFormSwitcher`):**
     - Updated mode toggles to sync hidden form fields `form-inquiry-type` and `form-subject`.
     - When toggled to **Orchardist / Grower**:
       - `form-inquiry-type`: `'Orchardist / Commercial Grower'`
       - `form-subject`: `'New Orchard Field Trial Inquiry — Kashbot Agri Systems'`
       - Field labels and placeholders dynamically update.
     - When toggled to **Institution / Research**:
       - `form-inquiry-type`: `'Research Institution / Partner'`
       - `form-subject`: `'New Research & Partnership Inquiry — Kashbot Agri Systems'`
       - Field labels and placeholders dynamically update.
   - **Validation & Dynamic State Feedback (`initInquiryForm`):**
     - Replaced synchronous redirect/alert behavior with a non-blocking asynchronous `submit` handler.
     - Performs front-end validation checking required fields (`name`, `email`, `phone`, `message`) and validating email syntax with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
     - Displays accessible inline warning banners if validation fails without making any network calls.
     - Activates loading state on the submit button with an animated SVG spinner and text (`Sending Inquiry to Engineering...`), while disabling duplicate submissions.
     - Dispatches `FormData` asynchronously via `fetch` to `https://api.web3forms.com/submit` with `Accept: application/json`.
     - On success (`response.ok && data.success`):
       - Resets the form via `form.reset()`.
       - Renders an inline green confirmation box greeting the applicant by name and providing a one-tap WhatsApp fallback link pre-filled with their name.
       - Temporarily changes submit button to `Inquiry Sent ✓` before restoring normal state after 3.5 seconds.
     - On network error or Web3Forms API failure:
       - Displays an inline alert banner offering immediate fallback contact paths to Srinagar engineering via email (`info@kashbot.in`) and WhatsApp (`wa.me/917006613634`).
       - Re-enables the submit button and restores original text.

2. **Automated Verification Suites:**
   - **`tests/verify_web3forms.js` (New):**
     - Loads `js/app.js` into an isolated sandboxed DOM environment.
     - Verifies mode switcher synchronization of hidden `inquiry_type` and `subject`.
     - Verifies required field validation prevention of network dispatch.
     - Verifies email syntax validation.
     - Verifies successful `fetch` dispatch, JSON response handling, applicant name rendering in confirmation, WhatsApp fallback link generation, and form reset.
     - Verifies network failure and server error handling with email (`info@kashbot.in`) and WhatsApp fallback links.
   - **`tests/verify_app.js` (Updated):**
     - Added `initFormSwitcher` and `initInquiryForm` to required methods list.
   - **`tests/verify_html.js` (Updated per Task 1 review note):**
     - Added assertions for `name="subject"`, `name="from_name"`, and `name="inquiry_type"`.

---

## 2. Test-Driven Development (TDD) Lifecycle

1. **RED:** Created `tests/verify_web3forms.js`. Ran `node tests/verify_web3forms.js` against un-updated `js/app.js` — test failed as expected due to missing hidden input sync, lack of `fetch` AJAX dispatch, and unhandled validation state.
2. **GREEN:** Implemented asynchronous submission, field validation, and mode synchronization in `js/app.js`. Re-ran `node tests/verify_web3forms.js` and `node tests/verify_app.js` — both passed completely.
3. **REGRESSION VERIFICATION:** Ran all test suites in sequence:
   - `node tests/verify_html.js` -> PASS
   - `node tests/verify_app.js` -> PASS
   - `node tests/verify_web3forms.js` -> PASS
   - `node tests/verify_assets.js` -> PASS
   - `node tests/verify_css.js` -> PASS
   - `node tests/verify_mobile.js` -> PASS

---

## 3. Self-Review & Quality Checklist

- [x] All required inputs validated before network dispatch.
- [x] Web3Forms endpoint `https://api.web3forms.com/submit` dispatched with `Accept: application/json`.
- [x] Dynamic loading state with animated SVG indicator prevents duplicate submissions.
- [x] Inline confirmation renders applicant's name and WhatsApp link fallback.
- [x] Network errors handled gracefully with direct fallback links.
- [x] Zero console errors; all 6 test suites passing.
- [x] Clean git commit with required commit message.
