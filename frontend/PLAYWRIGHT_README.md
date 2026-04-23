# Academic Planner - Automated Testing Evidence

This directory is set up with Playwright for complete End-to-End (E2E) testing of the Academic Planner module in UniLife OS.

## 🚀 Setup & Execution Instructions

**Step 1. Open your terminal in the `frontend` folder:**
```bash
cd d:\ITPM\unilife-os\frontend
```

**Step 2. Install Playwright and browser binaries:**
```bash
npm install -D @playwright/test
npx playwright install chrome
```
*(This will download Chrome/Chromium to run the automated tests)*

**Step 3. Run the development server:**
Ensure your frontend is running locally (this tests against `localhost:5173`).
```bash
npm run dev
```

**Step 4. Run the automated tests:**
Open a *new* terminal in the `frontend` folder and run:
```bash
npm run test:e2e
```
*To watch the tests run visually, use:*
```bash
npm run test:e2e:ui
```

**Step 5. View the HTML Report:**
```bash
npm run test:report
```
*(Use this report to take a screenshot for your assignment evidence!)*

---

## 🎙️ Viva Explanations

**Why Playwright was used?**
> "For our automated testing, we chose Playwright because it is modern, incredibly fast, and specifically built for dynamic React web applications like UniLife OS. Unlike older tools, Playwright automatically waits for UI elements to load and handles complex network mocking natively. This is critical for our MERN stack. Additionally, its built-in HTML reporter and trace viewer gave us a professional, evidence-friendly way to validate that our module works end-to-end exactly as a real user would experience it."

**What User Journeys were tested?**
> "We focused on testing the core Academic Planner user journeys that impact student productivity. The tests prove that a student can successfully open the planner, interact with the task creation form, hit critical validation limits (like date constraints and required fields), and observe accurate visual feedback like priority badges and calendar updates. We even set up a scaffold to verify the AI auto-rescheduling flow, validating that missing a task correctly updates the system state."

---

## 📸 Assignment Screenshot Checklist

Before your Viva or submission, make sure you capture screenshots of the following:

- [ ] **Code Structure**: A screenshot showing the `tests/planner/academic-planner.spec.js` file and `playwright.config.js`.
- [ ] **Test Execution**: A screenshot of terminal output showing `10 passed` after running `npm run test:e2e`.
- [ ] **HTML Report**: A screenshot of the Playwright HTML report (`npm run test:report`) displaying the test names (e.g., "Academic Planner | Task creation succeeds with valid data").
- [ ] **UI Mode (Optional Bonus)**: A screenshot with `npm run test:e2e:ui` open, showing Playwright clicking through your application timeline.
- [ ] **Failure Trace (If any)**: If you purposely make a test fail (e.g., by changing a locator) to prove the test works, show the Playwright error trace in your document.

---

## 📁 Included Test Cases
1. **TC-01:** Planner page loads successfully
2. **TC-02:** Add task form opens
3. **TC-03:** Task creation succeeds with valid data
4. **TC-04:** Deadline required validation works
5. **TC-05:** Past date invalidation works
6. **TC-06:** Weekly planner displays tasks
7. **TC-07:** Priority badge visible
8. **TC-08:** Productivity score visible
9. **TC-09:** Auto-reschedule updates missed tasks
10. **TC-10:** Calendar view reflects tasks
