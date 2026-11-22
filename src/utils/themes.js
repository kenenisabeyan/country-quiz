// Theme Management Engine with CSS Variable injection
export const THEMES = [
  {
    id: "aurora",
    name: "🌌 Cosmic Aurora",
    colors: {
      bgCard: "#202446",
      bgSubtle: "#2B2F57",
      primary: "#BC6BE8",
      secondary: "#E65895",
      accent: "#4D8AFF",
      border: "#3A4072",
    },
  },
  {
    id: "terra",
    name: "🌲 Terra Verde",
    colors: {
      bgCard: "#152820",
      bgSubtle: "#1F3B2F",
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#F59E0B",
      border: "#294D3E",
    },
  },
  {
    id: "solar",
    name: "🌋 Solar Flare",
    colors: {
      bgCard: "#29181B",
      bgSubtle: "#3B2227",
      primary: "#F97316",
      secondary: "#EF4444",
      accent: "#FBBF24",
      border: "#4E2C33",
    },
  },
  {
    id: "oceanic",
    name: "🌊 Cyber Oceanic",
    colors: {
      bgCard: "#112238",
      bgSubtle: "#183050",
      primary: "#06B6D4",
      secondary: "#3B82F6",
      accent: "#818CF8",
      border: "#24426B",
    },
  },
];

export function getActiveTheme() {
  try {
    const saved = localStorage.getItem("country_quiz_theme");
    return THEMES.find((t) => t.id === saved) || THEMES[0];
  } catch {
    return THEMES[0];
  }
}

export function setActiveTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  try {
    localStorage.setItem("country_quiz_theme", theme.id);
  } catch {
    // ignore local storage errors
  }
  return theme;
}
