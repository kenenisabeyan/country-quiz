import React from "react";
import { motion } from "framer-motion";
import { calculateLevelFromScore } from "../utils/progression";
import { t } from "../utils/i18n";

export default function StartScreen({
  stats,
  currentLang = "en",
  onStartGame,
  onOpenSettings,
  onOpenAtlas,
  onOpenTrophies,
  onOpenStats,
}) {
  const progression = calculateLevelFromScore(stats?.totalScore || 0);

  const quickModes = [
    {
      id: "flags",
      title: `🚩 ${t("flagMaster", currentLang)}`,
      desc: "Identify countries by flags",
      badge: "Popular",
    },
    {
      id: "daily",
      title: `📅 ${t("dailyChallenge", currentLang)}`,
      desc: "Today's seeded global run",
      badge: "Daily",
    },
    {
      id: "higherLower",
      title: `📊 ${t("higherLower", currentLang)}`,
      desc: "Compare country populations",
      badge: "Battle",
    },
    {
      id: "survival",
      title: `🏆 ${t("survivalMode", currentLang)}`,
      desc: "High stakes sudden death (3 lives)",
      badge: "Hardcore",
    },
    {
      id: "capitals",
      title: `🏛️ ${t("capitalCities", currentLang)}`,
      desc: "Match cities & nations",
      badge: "Classic",
    },
    {
      id: "revision",
      title: `🎯 ${t("weakSpotRevision", currentLang)}`,
      desc: "Practice previously missed flags",
      badge: "Smart",
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
            <span>{t("tagline", currentLang)}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-[#E2E4F3] to-[#BC6BE8] bg-clip-text text-transparent">
            {t("appTitle", currentLang)}
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5D0] mt-2 max-w-md mx-auto">
            {t("heroDesc", currentLang)}
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
                  {stats?.totalScore || 0} Total Career Points
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
            {t("quickLaunch", currentLang)}
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
            {t("launchExpedition", currentLang)}
          </button>

          <button
            onClick={onOpenSettings}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Custom Mode Settings"
          >
            {t("customMode", currentLang)}
          </button>

          <button
            onClick={onOpenAtlas}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="World Atlas & Study Deck"
          >
            {t("atlas", currentLang)}
          </button>

          <button
            onClick={onOpenTrophies}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Achievements"
          >
            {t("trophies", currentLang)}
          </button>

          <button
            onClick={onOpenStats}
            className="py-3.5 px-4 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            title="Career Statistics"
          >
            {t("stats", currentLang)}
          </button>
        </div>

        {/* Keyboard Shortcut Tips */}
        <div className="pt-2 border-t border-[#2E3463] text-[11px] text-[#7E88BF] flex items-center justify-center gap-2">
          <span>⌨️</span>
          <span>Shortcut keys: <strong>1-4 / A-D</strong> answer, <strong>H</strong> hint, <strong>F</strong> 50:50, <strong>S</strong> skip</span>
        </div>
      </div>
    </motion.div>
  );
}
