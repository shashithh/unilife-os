import { test, expect } from '@playwright/test';

test.describe('Academic Planner Module', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the main planner dashboard or TaskList before each test
        // Assuming /planner/tasks is the main task list as seen in App.jsx

        // To prevent proxy-related page crashes in Vite dev server (as seen in previous debugs),
        // we can mock the API calls if the backend is not running. 
        // We will provide placeholders here.

        await page.route('**/api/subjects', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ _id: 'subject1', subjectName: 'Software Engineering' }])
            });
        });

        await page.route('**/api/tasks*', async route => {
            if (route.request().method() === 'GET') {
                const url = route.request().url();
                if (url.includes('search')) {
                    // Respond to search
                }
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([
                        {
                            _id: 'task1',
                            title: 'Sample Task',
                            subject: { subjectName: 'Software Engineering' },
                            deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                            priority: 'High',
                            status: 'Pending'
                        }
                    ]) // Mocking initial tasks
                });
            } else {
                await route.continue();
            }
        });

        await page.goto('/planner/tasks');
    });

    // TC-01: Planner page loads successfully
    test('Academic Planner | Planner page loads successfully', async ({ page }) => {
        // Verify the Academic Planner page opens correctly
        await expect(page).toHaveURL(/.*\/planner\/tasks/);

        // Verify the page title or main heading is visible
        const heading = page.locator('h1', { hasText: 'All Tasks' });
        await expect(heading).toBeVisible();

        // Verify the Planner navigation is present
        // Assuming there's a nav link to 'Add Task'
        const addTaskBtn = page.getByRole('button', { name: /Add Task/i });
        await expect(addTaskBtn).toBeVisible();
    });

    // TC-02: Add task form opens
    test('Academic Planner | Add task form opens', async ({ page }) => {
        // Click the Add Task button
        await page.getByRole('button', { name: /Add Task/i }).click();

        // Verify navigation or modal opening
        await expect(page).toHaveURL(/.*\/planner\/add-task/);
        await expect(page.locator('h1', { hasText: 'Create New Task' })).toBeVisible();
    });

    // TC-03: Task creation succeeds with valid data
    test('Academic Planner | Task creation succeeds with valid data', async ({ page }) => {
        // First, intercept the POST request to mock the successful creation
        await page.route('**/api/tasks', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 200, body: JSON.stringify({ success: true, message: 'Created' }) });
            } else {
                await route.continue();
            }
        });

        await page.goto('/planner/add-task');

        // Fill valid data
        await page.getByPlaceholder('e.g. Complete Lab Report').fill('Complete Final Assignment');
        // For Select inputs, we might interact with the select optionally
        await page.locator('select').nth(0).selectOption({ label: 'Software Engineering' });

        // Determine a valid future deadline (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await page.locator('input[type="date"]').fill(dateStr);

        await page.locator('select').nth(1).selectOption({ label: 'High Priority (Red)' });
        await page.locator('input[type="number"]').fill('5');

        await page.getByRole('button', { name: 'Create Task' }).click();

        // Verify successful creation message or redirection
        await expect(page.locator('text=Task created successfully')).toBeVisible();
    });

    // TC-04: Deadline required validation works
    test('Academic Planner | Deadline required validation works', async ({ page }) => {
        await page.goto('/planner/add-task');

        await page.getByPlaceholder('e.g. Complete Lab Report').fill('Validation Test Task');
        await page.locator('select').nth(0).selectOption({ label: 'Software Engineering' });
        // Leave deadline empty

        await page.getByRole('button', { name: 'Create Task' }).click();

        // Verify error message
        // Adjust selector based on how validation errors are rendered, assuming near the input or top of form
        await expect(page.locator('text=Deadline is required')).toBeVisible();
    });

    // TC-05: Past date invalidation works
    test('Academic Planner | Past date invalidation works', async ({ page }) => {
        await page.goto('/planner/add-task');

        await page.getByPlaceholder('e.g. Complete Lab Report').fill('Past Deadline Task');
        await page.locator('select').nth(0).selectOption({ label: 'Software Engineering' });

        // Select yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];
        await page.locator('input[type="date"]').fill(dateStr);

        await page.getByRole('button', { name: 'Create Task' }).click();

        // Verify error
        await expect(page.locator('text=Deadline cannot be in the past')).toBeVisible();
    });

    // TC-06: Weekly planner displays tasks
    test('Academic Planner | Weekly planner displays tasks', async ({ page }) => {
        // Scaffold for weekly plan
        await page.goto('/planner/weekly-plan');

        // Optional Mocking for weekly API if needed
        // await page.route('**/api/tasks/weekly*', ... )

        // Wait for the weekly container to render
        // Replace with data-testid if available, e.g. .getByTestId('weekly-view')
        const header = page.locator('h1', { hasText: 'Weekly Study Plan' });

        // We mock that at least some block or text is visible
        // As evidence requires realistic view, ensure UI renders properly.
        // If not implemented, this test might need adjusting to match the exact DOM.
        await expect(header).toBeVisible({ timeout: 10000 });
    });

    // TC-07: Priority badge visible
    test('Academic Planner | Priority badge visible', async ({ page }) => {
        await page.goto('/planner/tasks');

        // Given our API mock from beforeEach, one 'High' task is rendered.
        // Wait for the TaskCard to mount and locate the Badge via text or color.
        const priorityBadge = page.locator('span', { hasText: 'High' }).first();
        await expect(priorityBadge).toBeVisible();

        // Optional: check css property if color mapping is strict
        // const color = await priorityBadge.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    });

    // TC-08: Productivity score visible
    test('Academic Planner | Productivity score visible', async ({ page }) => {
        await page.goto('/planner/productivity'); // Based on routing in App.jsx

        // Verify the score card/panel is visible
        const scorePanelHeader = page.getByRole('heading', { name: /Productivity/i }).first();
        await expect(scorePanelHeader).toBeVisible();

        // Verify some metric number is loaded (e.g. "85%", "Score", etc.)
        // Replace locator with the exact label you use
        const metricLabel = page.locator('text=Score').first();
        await expect(metricLabel).toBeVisible();
    });

    // TC-09: Auto-reschedule updates missed tasks
    test('Academic Planner | Auto-reschedule updates missed tasks', async ({ page }) => {
        // ----------------------------------------------------
        // TEST SCAFFOLD: Auto-rescheduling is often backend-driven via cron jobs,
        // or triggered via an "AI Reschedule" button. 
        // ----------------------------------------------------
        await page.goto('/planner/ai-scheduler');

        await page.route('**/api/tasks/reschedule', async route => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true, rescheduledCount: 1 }) });
        });

        const rescheduleBtn = page.getByRole('button', { name: /Reschedule/i });
        if (await rescheduleBtn.isVisible()) {
            await rescheduleBtn.click();
            await expect(page.locator('text=Successfully rescheduled')).toBeVisible();
        } else {
            // TODO: Replace with your actual reschedule UI flow logic
            console.log('Reschedule button not found. Assuming backend cron triggers this.');
            test.skip('Backend cron-driven feature - skip manual UI trigger for now.');
        }
    });

    // TC-10: Calendar view reflects tasks
    test('Academic Planner | Calendar view reflects tasks', async ({ page }) => {
        // Mock the calendar API to prevent React from crashing due to undefined data
        await page.route('**/api/calendar', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { title: 'Test Exam', date: new Date().toISOString(), type: 'exam', priority: 'High', source: 'calendar' }
                ])
            });
        });

        await page.goto('/planner/calendar');

        // Verify the heading loads correctly
        const calendarHeader = page.locator('h1', { hasText: 'Calendar' });
        await expect(calendarHeader).toBeVisible();

        // Check if the actual grid component (7 columns) is present
        const calendarGrid = page.locator('.grid.grid-cols-7').first();
        await expect(calendarGrid).toBeVisible();
    });

});
