exports.calculateRisk = (moodHistory) => {
  if (!moodHistory || moodHistory.length === 0) return "Low";

  // Simple rule-based mock for testing risk
  const recentMoods = moodHistory.slice(0, 5).map(entry => entry.mood.toLowerCase());
  
  const highStressMoods = ["stressed", "anxious", "sad", "angry"];
  
  let riskCount = 0;
  recentMoods.forEach(mood => {
    if (highStressMoods.includes(mood)) {
      riskCount++;
    }
  });

  if (riskCount >= 4) return "Critical";
  if (riskCount >= 2) return "Moderate";
  return "Low";
};

exports.getRecommendations = (risk) => {
  if (risk === "Critical") {
    return "Burnout risk is critical. Please prioritize self-care immediately, reduce workload significantly, and consider booking a session with a counselor.";
  } else if (risk === "Moderate") {
    return "You're showing signs of increasing stress. We recommend a proactive break, a good night's sleep, and scaling back on non-essential tasks.";
  }
  return "You seem to be managing well. Keep up your balanced routine!";
};
