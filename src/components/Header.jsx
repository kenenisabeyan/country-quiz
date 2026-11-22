import React from "react";
import { motion } from "framer-motion";

export default function Header({
  score,
  streak,
  highScore,
  lives,
  isSurvivalMode,
  isMuted,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  modeTitle,
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center my-5 gap-3.5 flex-wrap">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-[#E2E4F3] to-[#BC6BE8] bg-clip-text text-transparent">
          Country Quiz
        </h1>
        <p className="text-xs text-[#A0A5D0] mt-0.5 font-medium flex items-center gap-2">
          <span>{modeTitle || "Geography Challenge"}</span>
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {/* Survival Lives Indicator */}
        {isSurvivalMode && (
          <div className="flex items-center gap-1 bg-[#251A2E] border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-rose-400">
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
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-3 py-1.5 rounded-full text-xs shadow-md shadow-orange-500/20"
          >
            <span>🔥</span>
            <span>{streak}x Streak</span>
          </motion.div>
        )}

        {/* Score & Points */}
        <div className="flex items-center bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold rounded-full px-3.5 py-1.5 gap-1.5 shadow-md shadow-purple-500/20 text-xs sm:text-sm">
          <span>🏆</span>
          <span>{score} pts</span>
        </div>

        {/* Career Stats */}
        <button
          onClick={onOpenStats}
          title="Career Statistics"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          📊
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleSound}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Game Mode / Settings button */}
        <button
          onClick={onOpenSettings}
          title="Game Customizer"
          className="p-2 rounded-full bg-[#2A2F57] hover:bg-[#3D447D] text-white transition-all transform active:scale-95 cursor-pointer border border-[#444D87] text-xs sm:text-sm"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
