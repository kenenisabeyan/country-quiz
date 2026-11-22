// Mobile Haptic feedback with safety checks
export const haptics = {
  light() {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // unsupported or disabled by browser
      }
    }
  },
  success() {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([30, 40, 50]);
      } catch {
        // unsupported or disabled by browser
      }
    }
  },
  error() {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([60, 50, 60]);
      } catch {
        // unsupported or disabled by browser
      }
    }
  },
};
