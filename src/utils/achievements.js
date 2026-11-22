// Achievement System Definition and State Manager
export const ACHIEVEMENTS = [
  {
    id: "first_win",
    title: "First Steps",
    description: "Complete your first quiz game",
    icon: "🧭",
    tier: "Bronze",
    check: (stats) => (stats.gamesPlayed || 0) >= 1,
  },
  {
    id: "streak_5",
    title: "On Fire",
    description: "Achieve a 5x answer streak",
    icon: "🔥",
    tier: "Silver",
    check: (stats) => (stats.bestStreak || 0) >= 5,
  },
  {
    id: "streak_10",
    title: "Unstoppable",
    description: "Achieve a 10x answer streak",
    icon: "⚡",
    tier: "Gold",
    check: (stats) => (stats.bestStreak || 0) >= 10,
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Answer 100 questions across all games",
    icon: "💯",
    tier: "Gold",
    check: (stats) => (stats.totalAnswered || 0) >= 100,
  },
  {
    id: "perfect_round",
    title: "Flawless Cartographer",
    description: "Complete a 10+ question game with 100% accuracy",
    icon: "👑",
    tier: "Platinum",
    check: (stats, session) =>
      session && session.totalQuestions >= 10 && session.accuracy === 100,
  },
  {
    id: "survivor_10",
    title: "Survival Master",
    description: "Survive 10 or more questions in Survival Mode",
    icon: "🛡️",
    tier: "Gold",
    check: (stats) => (stats.survivalRecord || 0) >= 10,
  },
  {
    id: "speed_demon",
    title: "Lightning Reflexes",
    description: "Answer a question with more than 12 seconds remaining",
    icon: "⏱️",
    tier: "Silver",
    check: (stats, session) => session && session.fastestTimeLeft >= 12,
  },
  {
    id: "score_5000",
    title: "High Roller",
    description: "Accumulate over 5,000 career points",
    icon: "🏆",
    tier: "Platinum",
    check: (stats) => (stats.totalScore || 0) >= 5000,
  },
];

export function getUnlockedAchievements() {
  try {
    const raw = localStorage.getItem("country_quiz_unlocked_achievements");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function evaluateAchievements(stats, sessionData = {}) {
  const previouslyUnlocked = new Set(getUnlockedAchievements());
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach((achievement) => {
    if (!previouslyUnlocked.has(achievement.id)) {
      if (achievement.check(stats, sessionData)) {
        previouslyUnlocked.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    localStorage.setItem(
      "country_quiz_unlocked_achievements",
      JSON.stringify(Array.from(previouslyUnlocked))
    );
  }

  return {
    unlockedList: Array.from(previouslyUnlocked),
    newlyUnlocked,
  };
}
