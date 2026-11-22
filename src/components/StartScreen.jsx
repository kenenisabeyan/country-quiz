import React from "react";
import { motion } from "framer-motion";
import { calculateLevelFromScore } from "../utils/progression";

export default function StartScreen({
  stats,
  onStartGame,
  onOpenSettings,
  onOpenAtlas,
  onOpenTrophies,
  onOpenStats,
}) {
  const progression = calculateLevelFromScore(stats.totalScore || 0);

  const quickModes = [
    {
      id: "flags",
      title: "🚩 Flag Master",
      desc: "Identify countries by flags",
      badge: "Popular",
    },
    {
      id: "daily",
      title: "📅 Daily Challenge",
      desc: "Today's seeded expedition",
      badge: "Daily",
    },
    {
      id: "survival",
      title: "🏆 Survival (3 Lives)",
      desc: "High stakes sudden death",
      badge: "Hardcore",
    },
    {
      id: "capitals",
      title: "🏛️ Capital Cities",
      desc: "Match cities & nations",
      badge: "Classic",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto space-y-5 text-center"
    >
      {/* Hero Card */}
      <div className="bg-[#202446]/95 border border-[#3E4577] backdrop-blur-lg rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BC6BE8]/15 border border-[#BC6BE8]/30 text-xs font-extrabold text-[#BC6BE8] mb-3">
            <span>🌍</span>
            <span>Global Geography Expedition</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-[#E2E4F3] to-[#BC6BE8] bg-clip-text text-transparent">
            Country Quiz Master
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5D0] mt-2 max-w-md mx-auto">
            Test your knowledge across flags, capitals, landmarks, and continents. Level up your cartographic rank!
          </p>
        </div>

        {/* Player Profile & XP Bar */}
        <div className="bg-[#181B38] border border-[#2D335E] rounded-2xl p-4 text-left space-y-2.5 max-w-lg mx-auto">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">{progression.badge}</span>
              <div>
                <p className="font-bold text-white text-sm">
                  Level {progression.level}: {progression.title}
                </p>
                <p className="text-[10px] text-[#8E97CF]">
                  {stats.totalScore || 0} Total Career Points
                </p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-[#BC6BE8]">
              {progression.currentLevelXP} / {progression.nextLevelXP} XP
            </span>
          </div>

          <div className="h-2 w-full bg-[#25284B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E65895] to-[#BC6BE8] transition-all duration-700"
              style={{ width: `${progression.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Launch Modes Grid */}
        <div className="space-y-2 text-left max-w-lg mx-auto">
          <p className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
            Quick Launch Expeditions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickModes.map((qm) => (
              <button
                key={qm.id}
                onClick={() => onStartGame(qm.id)}
                className="bg-[#1C1F3D] hover:bg-[#282D5C] border border-[#32396B] hover:border-[#BC6BE8]/50 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs sm:text-sm text-white group-hover:text-[#BC6BE8] transition-colors">
                      {qm.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#8E97CF] mt-0.5">{qm.desc}</p>
                </div>
                <span className="text-xs text-[#BC6BE8] group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap justify-center gap-3 pt-2 max-w-lg mx-auto">
          <button
            onClick={() => onStartGame("flags")}
            className="flex-1 min-w-[150px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 cursor-pointer transition-all transform active:scale-95"
          >
            🚀 Launch Expedition
          </button>

          <button
            onClick={onOpenSettings}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Custom Mode Settings"
          >
            ⚙️ Custom Mode
          </button>

          <button
            onClick={onOpenAtlas}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="World Atlas & Study Deck"
          >
            📖 Atlas
          </button>

          <button
            onClick={onOpenTrophies}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Achievements"
          >
            🏆 Trophies
          </button>

          <button
            onClick={onOpenStats}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Career Statistics"
          >
            📊 Stats
          </button>
        </div>
      </div>
    </motion.div>
  );
}
