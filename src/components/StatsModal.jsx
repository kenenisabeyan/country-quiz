import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatsModal({ isOpen, onClose, stats, onResetStats }) {
  if (!isOpen) return null;

  const totalAnswered = stats.totalAnswered || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#242749] border border-[#3E4577] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#3E4577]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-2xl font-bold tracking-tight">Career Statistics</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1C1F3D] p-3.5 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-xs text-[#8E97CF]">Games Played</p>
              <p className="text-2xl font-black text-white mt-1">{stats.gamesPlayed || 0}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3.5 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-xs text-[#8E97CF]">Accuracy Rate</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{accuracy}%</p>
            </div>
            <div className="bg-[#1C1F3D] p-3.5 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-xs text-[#8E97CF]">Total Points</p>
              <p className="text-2xl font-black text-[#E65895] mt-1">{stats.totalScore || 0}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3.5 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-xs text-[#8E97CF]">Best Streak</p>
              <p className="text-2xl font-black text-amber-400 mt-1">🔥 {stats.bestStreak || 0}</p>
            </div>
          </div>

          <div className="bg-[#1C1F3D] p-4 rounded-2xl border border-[#343B6D] flex justify-between items-center">
            <div>
              <p className="text-xs text-[#8E97CF]">🏆 Survival High Score</p>
              <p className="text-sm font-semibold text-white">Questions Survived</p>
            </div>
            <span className="text-2xl font-black text-[#BC6BE8]">
              {stats.survivalRecord || 0}
            </span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={onResetStats}
              className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Reset Statistics
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold bg-[#333866] hover:bg-[#434A85] text-white text-sm cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
