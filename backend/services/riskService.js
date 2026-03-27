function computeRisk({ deadline, priority, completionRate = 0.7 }) {
    const now = new Date();
    const msLeft = new Date(deadline) - now;
    const daysLeft = msLeft / (1000 * 60 * 60 * 24);

    let score = 0;

    // time pressure
    if (daysLeft < 1) score += 3;
    else if (daysLeft < 3) score += 2;
    else if (daysLeft < 7) score += 1;

    // priority weight
    if (priority === "High") score += 2;
    if (priority === "Medium") score += 1;

    // poor completion habit increases risk
    if (completionRate < 0.4) score += 2;
    else if (completionRate < 0.6) score += 1;

    if (score >= 5) return "High";
    if (score >= 3) return "Medium";
    return "Low";
}

module.exports = { computeRisk };