import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS, getUnlockedAchievements } from "../utils/achievements";

export default function AchievementsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const unlockedIds = new Set(getUnlockedAchievements());
  const total = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).length;
  const progressPercent = Math.round((unlockedCount / total) * 100);

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum":
        return "text-cyan-300 bg-cyan-500/15 border-cyan-400/30";
      case "Gold":
        return "text-amber-300 bg-amber-500/15 border-amber-400/30";
      case "Silver":
        return "text-slate-300 bg-slate-500/15 border-slate-400/30";
      default:
        return "text-orange-300 bg-orange-500/15 border-orange-400/30";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#202446] border border-[#3E4577] text-white w-full max-w-xl max-h-[85vh] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col space-y-4"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#3E4577]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏆</span>
              <div>
                <h2 className="text-2xl font-black">Trophy Room</h2>
                <p className="text-xs text-[#9DA3D1]">
                  Unlock badges by mastering geography and survival challenges
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#181B38] p-3.5 rounded-2xl border border-[#2E3566] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#A0A5D0]">Trophy Progress</span>
              <span className="font-extrabold text-[#BC6BE8]">
                {unlockedCount} / {total} Unlocked ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-[#25284B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E65895] to-[#BC6BE8] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Badges List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedIds.has(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                    isUnlocked
                      ? "bg-[#252A52] border-[#BC6BE8]/40 shadow-sm"
                      : "bg-[#181B38] border-[#2E3566] opacity-60"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isUnlocked
                        ? "bg-gradient-to-br from-[#E65895]/20 to-[#BC6BE8]/20 border border-[#BC6BE8]/40"
                        : "bg-[#202342] border border-[#2B305C] grayscale"
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-white truncate">{ach.title}</p>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getTierColor(
                          ach.tier
                        )}`}
                      >
                        {ach.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#9DA3D1] mt-0.5">{ach.description}</p>
                  </div>

                  <div className="flex-shrink-0">
                    {isUnlocked ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        Unlocked ✅
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-700/20 px-2.5 py-1 rounded-full">
                        Locked 🔒
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#32386E] hover:bg-[#434B8F] text-white font-bold text-xs cursor-pointer transition-all"
          >
            Close Trophy Room
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
