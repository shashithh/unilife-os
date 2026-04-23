import { test, expect } from '@playwright/test';

test.describe('Wellbeing Hub Module Tests', () => {

    // --- Mock Data ---
    const MOCK_MOOD_ENTRY = {
        _id: 'mock-mood-123',
        mood: 'happy',
        stressLevel: 3,
        notes: 'Feeling great today!',
        createdAt: new Date().toISOString(),
    };

    const MOCK_SUPPORT_MESSAGE = {
        _id: 'mock-msg-123',
        message: 'I am here to support you.',
        timestamp: new Date().toISOString(),
    };

    const MOCK_COUNSELORS = [
        { 
            _id: 'c1', 
            fullName: 'Dr. Jane Smith', 
            specialization: 'Anxiety', 
            counselingModes: ['Online', 'In-person'],
            availabilityStatus: 'Available'
        }
    ];

    const MOCK_SLOTS = {
        slots: [
            { date: '2026-05-01', time: '10:00 AM' },
            { date: '2026-05-01', time: '11:00 AM' }
        ]
    };

    // --- Setup Before Each Test ---
    test.beforeEach(async ({ page }) => {
        // Mock the user profile to prevent 401s if API is not running
        await page.route('**/api/users/profile', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    _id: 'test-user-id',
                    name: 'Test Student',
                    email: 'student@unilife.com',
                    role: 'Student'
                })
            });
        });

        // Mock basic wellbeing endpoints to prevent UI crashes and ensure realistic behavior
        await page.route('**/api/moods/today', async (route) => {
            await route.fulfill({ status: 200, json: null });
        });

        await page.route('**/api/moods**', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 201, json: MOCK_MOOD_ENTRY });
            } else {
                await route.fulfill({ status: 200, json: [MOCK_MOOD_ENTRY] });
            }
        });

        await page.route('**/api/wellbeing/support**', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 201, json: MOCK_SUPPORT_MESSAGE });
            } else {
                await route.fulfill({ status: 200, json: [MOCK_SUPPORT_MESSAGE] });
            }
        });

        await page.route('**/api/counselors', async (route) => {
            await route.fulfill({ status: 200, json: MOCK_COUNSELORS });
        });

        await page.route('**/api/counselors/c1', async (route) => {
            await route.fulfill({ status: 200, json: MOCK_COUNSELORS[0] });
        });

        await page.route('**/api/counselors/c1/slots', async (route) => {
            await route.fulfill({ status: 200, json: MOCK_SLOTS });
        });

        await page.route('**/api/bookings**', async (route) => {
            await route.fulfill({ status: 201, json: { message: 'Booking successful' } });
        });

        await page.route('**/api/wellbeing/risk**', async (route) => {
            await route.fulfill({ status: 200, json: { riskLevel: 'Low', score: 20 } });
        });
    });

    // --------------------------------------------------------
    // TC-01: Wellbeing Hub page loads successfully
    // --------------------------------------------------------
    test('Wellbeing Hub | Page loads successfully', async ({ page }) => {
        await page.goto('/wellbeing');
        
        // Wait for network idle or main content to load
        await page.waitForLoadState('networkidle');

        // Check if main heading exists (adjust text if your dashboard says something else)
        const heading = page.locator('h1', { hasText: /Good morning/i });
        await expect(heading).toBeVisible();

        // Optional: Take a screenshot for assignment evidence
        // await page.screenshot({ path: 'evidence/tc01-wellbeing-hub.png' });
    });

    // --------------------------------------------------------
    // TC-02: Mood logging form opens or is visible
    // --------------------------------------------------------
    test('Wellbeing Hub | Mood logging form is visible', async ({ page }) => {
        await page.goto('/wellbeing/mood');
        
        // Verify form presence
        const moodHeading = page.locator('h1, h2, h3, h4').filter({ hasText: /How are you feeling today|Daily Check-in/i }).first();
        await expect(moodHeading).toBeVisible();

        // Check if there are buttons or inputs for mood (adjust selector as needed)
        // E.g., looking for a specific mood button like "Happy" or a generic button role
        const submitButton = page.getByRole('button', { name: /save daily mood/i });
        await expect(submitButton).toBeVisible();
    });

    // --------------------------------------------------------
    // TC-03: Mood entry submission succeeds with valid data
    // --------------------------------------------------------
    test('Wellbeing Hub | Mood entry submission succeeds', async ({ page }) => {
        await page.goto('/wellbeing/mood');

        // 1. Select a mood
        const happyMoodButton = page.getByRole('button', { name: /happy|good/i }).first();
        await happyMoodButton.click();

        // 3. Add notes
        const notesTextarea = page.getByPlaceholder(/note/i);
        await notesTextarea.fill('Feeling great today!');

        // 4. Submit
        const submitButton = page.getByRole('button', { name: /save daily mood/i });
        await submitButton.click();

        // 5. Verify success message or URL redirection
        // Checking for a toast notification or success message on screen
        const successMessage = page.locator('text=/Mood Logged!/i').first();
        await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    // --------------------------------------------------------
    // TC-04: Daily mood validation works
    // --------------------------------------------------------
    test('Wellbeing Hub | Daily mood validation works', async ({ page }) => {
        await page.goto('/wellbeing/mood');

        // Verify the submit button is disabled until a mood is selected
        const submitButton = page.getByRole('button', { name: /save daily mood/i });
        await expect(submitButton).toBeDisabled();

        // Try filling note, but don't select a mood
        const notesTextarea = page.getByPlaceholder(/note/i);
        await notesTextarea.fill('A short note');

        // Verify the button remains disabled
        await expect(submitButton).toBeDisabled();
    });

    // --------------------------------------------------------
    // TC-05: Mood history chart is visible
    // --------------------------------------------------------
    test('Wellbeing Hub | Mood history chart is visible', async ({ page }) => {
        await page.goto('/wellbeing/analytics');

        // Wait for the chart to render. In Recharts, it often renders an SVG with class 'recharts-surface'
        const chartArea = page.locator('.recharts-surface, canvas, svg').first();
        
        // Wait for it to be visible
        await expect(chartArea).toBeVisible({ timeout: 10000 });
        
        // Verify heading
        const heading = page.locator('h1, h2').filter({ hasText: /Analytics|History/i }).first();
        await expect(heading).toBeVisible();
    });

    // --------------------------------------------------------
    // TC-06: Anonymous peer support UI is visible
    // --------------------------------------------------------
    test('Wellbeing Hub | Anonymous peer support UI is visible', async ({ page }) => {
        await page.goto('/wellbeing/support');

        // Check heading
        const heading = page.locator('h1, h2, h3').filter({ hasText: /Privacy-First Support|Anonymous/i }).first();
        await expect(heading).toBeVisible();

        // Check textarea exists
        const textarea = page.getByRole('textbox').first();
        await expect(textarea).toBeVisible();
    });


    // --------------------------------------------------------
    // TC-08: Counseling booking form is visible
    // --------------------------------------------------------
    test('Wellbeing Hub | Counseling booking form is visible', async ({ page }) => {
        await page.goto('/wellbeing/counseling');

        // Check heading
        const heading = page.locator('h1, h2').filter({ hasText: /Book Counseling Session/i }).first();
        await expect(heading).toBeVisible();

        // Since we mocked the counselors endpoint, we should see Dr. Jane Smith
        const counselorName = page.locator('text=Dr. Jane Smith').first();
        await expect(counselorName).toBeVisible();
    });

    // --------------------------------------------------------
    // TC-09: Counseling booking submission works
    // --------------------------------------------------------
    test('Wellbeing Hub | Counseling booking submission works', async ({ page }) => {
        // Go directly to counselor booking or slot selection
        await page.goto('/wellbeing/counseling');

        // 1. Click on a counselor or a "Book" button
        const bookButton = page.getByRole('button', { name: /View & Book Slots/i }).first();
        await bookButton.click();

        // Wait for slot selection page to load
        await expect(page.locator('h1, h2, h3').filter({ hasText: 'Select a Time Slot' }).first()).toBeVisible();

        // 2. Select a date/time slot
        const dateSlot = page.locator('button', { hasText: '2026-05-01' }).first();
        await dateSlot.click();

        const timeSlot = page.locator('button', { hasText: '10:00 AM' }).first();
        await timeSlot.click();

        // 3. Confirm booking
        const confirmButton = page.getByRole('button', { name: /Confirm Booking/i }).first();
        await confirmButton.click();

        // 4. Verify success
        const successMessage = page.locator('text=/Booking Confirmed!/i').first();
        await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    // --------------------------------------------------------
    // TC-10: Wellbeing risk indicator is visible
    // --------------------------------------------------------
    test('Wellbeing Hub | Wellbeing risk indicator is visible', async ({ page }) => {
        await page.goto('/wellbeing/risk');

        // Verify Risk UI loads
        const heading = page.locator('h1, h2').filter({ hasText: /Risk|Prediction/i }).first();
        await expect(heading).toBeVisible();

        // Check if the mocked risk level is visible
        const riskLevel = page.locator('text=/Low|Medium|High/i').first();
        await expect(riskLevel).toBeVisible();
    });

});
