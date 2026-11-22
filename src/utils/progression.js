// Player Level & XP Progression Engine
const RANKS = [
  { minLevel: 1, title: "Novice Traveler", badge: "🌱" },
  { minLevel: 3, title: "Globe Wanderer", badge: "🧭" },
  { minLevel: 5, title: "Continent Pathfinder", badge: "🗺️" },
  { minLevel: 8, title: "Regional Explorer", badge: "🌍" },
  { minLevel: 12, title: "Cartographic Scholar", badge: "📜" },
  { minLevel: 16, title: "Senior Geographer", badge: "🏛️" },
  { minLevel: 20, title: "Master Navigator", badge: "⭐" },
  { minLevel: 25, title: "Supreme Cartographer", badge: "👑" },
];

export function calculateLevelFromScore(totalScore = 0) {
  // 500 XP per level with gentle scaling
  const baseXP = 400;
  let level = 1;
  let remaining = totalScore;
  let xpForNext = baseXP;

  while (remaining >= xpForNext) {
    remaining -= xpForNext;
    level += 1;
    xpForNext = Math.round(baseXP * Math.pow(1.15, level - 1));
  }

  const currentLevelXP = remaining;
  const nextLevelXP = xpForNext;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

  let rank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      rank = RANKS[i];
      break;
    }
  }

  return {
    level,
    title: rank.title,
    badge: rank.badge,
    currentLevelXP,
    nextLevelXP,
    progressPercent,
  };
}
