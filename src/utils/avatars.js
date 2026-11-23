// Explorer Avatars & Profiles
export const AVATARS = [
  { id: "navigator", icon: "🧭", title: "Master Navigator", badge: "Explorer" },
  { id: "cartographer", icon: "🗺️", title: "Lead Cartographer", badge: "Mapping" },
  { id: "cosmonaut", icon: "🚀", title: "Orbital Observer", badge: "Space" },
  { id: "captain", icon: "⛵", title: "Circumnavigator", badge: "Maritime" },
  { id: "archivist", icon: "👑", title: "Imperial Geographer", badge: "Legend" },
  { id: "volcanologist", icon: "🌋", title: "Tectonic Tracker", badge: "Earth" },
];

const AVATAR_KEY = "country_quiz_selected_avatar";

export function getSelectedAvatar() {
  try {
    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved) {
      const match = AVATARS.find((a) => a.id === saved);
      if (match) return match;
    }
  } catch {
    // fallback
  }
  return AVATARS[0];
}

export function setSelectedAvatar(avatarId) {
  try {
    localStorage.setItem(AVATAR_KEY, avatarId);
  } catch {
    // fallback
  }
  return AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
}
