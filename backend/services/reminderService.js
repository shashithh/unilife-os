async function sendReminder(task) {
    // In real app: email, SMS, push notification
    console.log(`🔔 Reminder: "${task.title}" scheduled at ${task.reminderAt}`);
}

module.exports = { sendReminder };