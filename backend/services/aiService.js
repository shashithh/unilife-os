exports.calculateRisk = (moodHistory) => {
  // simple logic:
  // if stress >=4 appears 3+ times in last 5 entries => HIGH
  const last5 = moodHistory.slice(0, 5);
  const highStressCount = last5.filter(e => e.stressLevel >= 4).length;

  if (highStressCount >= 3) return "High";
  if (highStressCount === 2) return "Moderate";
  return "Low";
};

exports.getRecommendations = (risk) => {
  if (risk === "High") {
    return [
      "Book a counseling session this week",
      "Try 5-minute breathing exercise",
      "Reduce workload and take a break",
    ];
  }
  if (risk === "Moderate") {
    return [
      "Take short breaks every 60 minutes",
      "Try guided meditation",
      "Talk to a friend or mentor",
    ];
  }
  return [
    "Keep logging mood daily",
    "Maintain good sleep routine",
    "Do light exercise 3 times a week",
  ];
};