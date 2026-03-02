function computeProductivity({ completedCount, missedCount, pendingCount }) {
    const total = completedCount + missedCount + pendingCount;
    if (total === 0) return { score: 0, label: "No Data" };

    // simple scoring: completed good, missed bad
    const raw = (completedCount * 2) - (missedCount * 2) + (pendingCount * 0.5);
    const normalized = Math.max(0, Math.min(100, Math.round((raw / (total * 2)) * 100)));

    let label = "Average";
    if (normalized >= 75) label = "Excellent";
    else if (normalized >= 55) label = "Good";
    else if (normalized >= 35) label = "Average";
    else label = "Needs Improvement";

    return { score: normalized, label };
}

module.exports = { computeProductivity };