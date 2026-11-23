import React from "react";
import { motion } from "framer-motion";
import { t } from "../utils/i18n";

export default function Header({
  score,
  streak,
  lives,
  isSurvivalMode,
  isMuted,
  isBgmActive,
  onToggleSound,
  onToggleBGM,
  onOpenSettings,
  onOpenStats,
  onOpenStudyDeck,
  onOpenAchievements,
  onOpenShortcuts,
  onLaunchDaily,
  onGoHome,
  modeTitle,
  currentLang = "en",
}) {
  return (
    <header
      role="banner"
      className="flex flex-col sm:flex-row justify-between items-center my-4 sm:my-5 gap-3.5 flex-wrap"
    >
      <div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-[#E2E4F3] to-[#BC6BE8] bg-clip-text text-transparent">
          Country Quiz
        </h1>
        <p className="text-xs text-[#A0A5D0] mt-0.5 font-medium flex items-center gap-2">
          <span>{modeTitle || "Geography Challenge"}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
        {/* Home / Menu Button */}
        {onGoHome && (
          <button
            onClick={onGoHome}
            title="Return to Main Menu"
            aria-label="Return to Main Menu"
            className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
          >
            🏠
          </button>
        )}
        {/* Survival Lives Indicator */}
        {isSurvivalMode && (
          <div
            role="status"
            aria-label={`${lives} lives remaining`}
            className="flex items-center gap-1 bg-[#251A2E] border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-rose-400 shadow-sm"
          >
            <span>{t("lives", currentLang)}:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((heartIndex) => (
                <span
                  key={heartIndex}
                  className={`transition-all duration-300 text-sm ${
                    heartIndex <= lives ? "opacity-100 scale-105" : "opacity-30 grayscale"
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Streak Indicator */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            role="status"
            aria-label={`Current streak is ${streak}`}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-3 py-1.5 rounded-full text-xs shadow-md shadow-orange-500/20"
          >
            <span>🔥</span>
            <span>{streak}x {t("combo", currentLang)}</span>
          </motion.div>
        )}

        {/* Score & Points */}
        <div
          role="status"
          aria-label={`Current score ${score} points`}
          className="flex items-center bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold rounded-full px-3.5 py-1.5 gap-1.5 shadow-md shadow-purple-500/20 text-xs sm:text-sm"
        >
          <span>🏆</span>
          <span>{score} {t("points", currentLang)}</span>
        </div>

        {/* Daily Challenge Quick Button */}
        {onLaunchDaily && (
          <button
            onClick={onLaunchDaily}
            title="Play Today's Seeded Daily Challenge"
            aria-label="Play Daily Challenge"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] text-[#BC6BE8] hover:text-white font-bold text-xs border border-[#BC6BE8]/40 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <span>📅</span>
            <span>Daily</span>
          </button>
        )}

        {/* Achievements Trophy Room Button */}
        <button
          onClick={onOpenAchievements}
          title="Trophy Room & Achievements"
          aria-label="Open Trophy Room"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          🏆
        </button>

        {/* Atlas / Study Deck Button */}
        <button
          onClick={onOpenStudyDeck}
          title="World Atlas & Study Deck"
          aria-label="Open World Atlas and Study Deck"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          📖
        </button>

        {/* Career Stats Button */}
        <button
          onClick={onOpenStats}
          title="Career Statistics"
          aria-label="Open Career Statistics"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          📊
        </button>

        {/* Ambient BGM Button */}
        {onToggleBGM && (
          <button
            onClick={onToggleBGM}
            title={isBgmActive ? "Disable Ambient BGM" : "Enable Ambient BGM"}
            aria-label="Toggle Ambient Music"
            className={`p-2 rounded-full transition-all transform active:scale-95 cursor-pointer border text-xs sm:text-sm ${
              isBgmActive
                ? "bg-[#BC6BE8]/20 border-[#BC6BE8] text-[#BC6BE8]"
                : "bg-[#2A2F57] hover:bg-[#3D447D] border-[#444D87] text-gray-400"
            }`}
          >
            🎵
          </button>
        )}

        {/* Audio Mute Toggle Button */}
        <button
          onClick={onToggleSound}
          title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          aria-pressed={!isMuted}
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Keyboard Shortcuts Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Navigation Shortcuts (?)"
            aria-label="Open Keyboard Shortcuts Guide"
            className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
          >
            ⌨️
          </button>
        )}

        {/* Game Settings button */}
        <button
          onClick={onOpenSettings}
          title="Game Settings"
          aria-label="Open Game Settings"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] focus:ring-2 focus:ring-[#BC6BE8] focus:outline-none text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
