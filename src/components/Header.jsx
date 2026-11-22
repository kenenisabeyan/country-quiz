import React from "react";
import { motion } from "framer-motion";

export default function Header({
  score,
  streak,
  lives,
  isSurvivalMode,
  isMuted,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  onOpenStudyDeck,
  onOpenAchievements,
  modeTitle,
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
        {/* Survival Lives Indicator */}
        {isSurvivalMode && (
          <div
            role="status"
            aria-label={`${lives} lives remaining`}
            className="flex items-center gap-1 bg-[#251A2E] border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-rose-400 shadow-sm"
          >
            <span>Lives:</span>
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
            <span>{streak}x Streak</span>
          </motion.div>
        )}

        {/* Score & Points */}
        <div
          role="status"
          aria-label={`Current score ${score} points`}
          className="flex items-center bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold rounded-full px-3.5 py-1.5 gap-1.5 shadow-md shadow-purple-500/20 text-xs sm:text-sm"
        >
          <span>🏆</span>
          <span>{score} pts</span>
        </div>

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
