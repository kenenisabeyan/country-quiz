import React from "react";
import { motion } from "framer-motion";

export default function Header({
  score,
  streak,
  highScore,
  isMuted,
  onToggleSound,
  onOpenSettings,
  modeTitle,
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center my-6 gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#E2E4F3] to-[#BC6BE8] bg-clip-text text-transparent">
            Country Quiz
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5D0] mt-1 font-medium">
            {modeTitle || "Geography Challenge"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Streak Indicator */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow-lg shadow-orange-500/20"
          >
            <span>🔥</span>
            <span>{streak}x Combo</span>
          </motion.div>
        )}

        {/* Score & Points */}
        <div className="flex items-center bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold rounded-full px-4 py-2 gap-2 shadow-lg shadow-purple-500/20">
          <span>🏆</span>
          <span className="text-sm sm:text-base">{score} pts</span>
        </div>

        {/* Best High Score */}
        {highScore > 0 && (
          <div className="hidden md:flex items-center bg-[#25284B] border border-[#444A7F] text-[#CBD1F5] rounded-full px-3 py-1.5 text-xs font-semibold gap-1.5">
            <span>⭐ Best:</span>
            <span>{highScore}</span>
          </div>
        )}

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleSound}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
          className="p-2.5 rounded-full bg-[#393F6E] hover:bg-[#4C538F] text-white transition-all transform active:scale-95 cursor-pointer border border-[#4E568F]"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Game Mode / Settings button */}
        <button
          onClick={onOpenSettings}
          title="Game Settings"
          className="p-2.5 rounded-full bg-[#393F6E] hover:bg-[#4C538F] text-white transition-all transform active:scale-95 cursor-pointer border border-[#4E568F]"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
