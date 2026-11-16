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
