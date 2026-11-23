// Speech Synthesis Engine for Country & Capital Pronunciations
export function speakText(text, lang = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      am: "am-ET",
    };

    utterance.lang = langMap[lang] || "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.warn("Speech synthesis unavailable:", error);
    return false;
  }
}
