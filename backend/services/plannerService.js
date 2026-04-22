const getRiskLevel = (deadline, priority) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(deadline);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 2 && priority === "High") return "Critical";
    if (diffDays <= 5) return "Warning";
    return "Safe";
};

const calculateProductivity = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const completionRate =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const studyHoursThisWeek = tasks.reduce(
        (sum, task) => sum + Number(task.estimatedHours || 0),
        0
    );

    const score = Math.min(
        100,
        Math.round(completionRate * 0.7 + studyHoursThisWeek * 0.8)
    );

    return {
        completionRate,
        studyHoursThisWeek,
        score,
        streakDays: 5
    };
};

const getSuggestedTime = (priority, estimatedHours) => {
    if (priority === "High" && Number(estimatedHours) >= 3) return "02:00 PM";
    if (priority === "High") return "03:00 PM";
    if (priority === "Medium") return "04:00 PM";
    return "06:00 PM";
};

const getMappedDayName = (dateObj) => {
    const dayIndex = dateObj.getDay();

    if (dayIndex === 0) return "Sunday";
    if (dayIndex === 1) return "Monday";
    if (dayIndex === 2) return "Tuesday";
    if (dayIndex === 3) return "Wednesday";
    if (dayIndex === 4) return "Thursday";
    if (dayIndex === 5) return "Friday";
    return "Saturday";
};

const getLeadDays = (priority) => {
    if (priority === "High") return 2;
    if (priority === "Medium") return 1;
    return 1;
};

const resolveSubject = (task, subjects) => {
    if (task.subjectId && typeof task.subjectId === "object" && task.subjectId.subjectCode) {
        return task.subjectId;
    }

    const taskSubjectId = task.subjectId?.toString?.() || "";
    return subjects.find((s) => s._id.toString() === taskSubjectId);
};

const generateWeeklyPlan = (tasks, subjects) => {
    const plan = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks
        .filter((task) => {
            const deadline = new Date(task.deadline);
            deadline.setHours(0, 0, 0, 0);
            return task.status !== "Completed" && deadline >= today;
        })
        .sort((a, b) => {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };

            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }

            return new Date(a.deadline) - new Date(b.deadline);
        });

    for (const task of upcomingTasks) {
        const subject = resolveSubject(task, subjects);

        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);

        const studyDate = new Date(deadline);
        studyDate.setDate(studyDate.getDate() - getLeadDays(task.priority));

        if (studyDate < today) {
            studyDate.setTime(today.getTime());
        }

        const mappedDay = getMappedDayName(studyDate);

        plan[mappedDay].push({
            time: getSuggestedTime(task.priority, task.estimatedHours),
            task: task.title,
            type: "study",
            isAi: true,
            subjectCode: subject ? subject.subjectCode : "",
            deadline: task.deadline,
            estimatedHours: task.estimatedHours,
            priority: task.priority
        });
    }

    return plan;
};

const getAlertSummary = (tasks) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((task) => {
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        return deadline < now && task.status !== "Completed";
    });

    const upcoming = tasks.filter((task) => {
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3 && task.status !== "Completed";
    });

    const notifications = [];

    if (overdue.length > 0) {
        notifications.push({
            title: `${overdue.length} overdue task${overdue.length > 1 ? "s" : ""}`,
            message: "Some tasks are overdue and need immediate attention.",
            type: "risk"
        });
    }

    if (upcoming.length > 0) {
        notifications.push({
            title: `${upcoming.length} upcoming deadline${upcoming.length > 1 ? "s" : ""}`,
            message: "You have tasks due soon. Run AI analysis to organize your week.",
            type: "warning"
        });
    }

    notifications.push({
        title: "Weekly Plan Ready",
        message: "Generate your weekly study plan based on priority and deadline.",
        type: "info"
    });

    return {
        overdue,
        upcoming,
        notifications
    };
};

module.exports = {
    getRiskLevel,
    calculateProductivity,
    generateWeeklyPlan,
    getAlertSummary
};