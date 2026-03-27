const cron = require("node-cron");
const Task = require("../models/Task");
const { sendReminder } = require("../services/reminderService");

function startReminderJob() {
    // every minute
    cron.schedule("* * * * *", async () => {
        const now = new Date();
        const nextMinute = new Date(now.getTime() + 60 * 1000);

        const due = await Task.find({
            reminderAt: { $gte: now, $lt: nextMinute },
            status: "Pending"
        });

        for (const task of due) {
            await sendReminder(task);
        }
    });

    console.log("⏰ Reminder job started");
}

module.exports = { startReminderJob };