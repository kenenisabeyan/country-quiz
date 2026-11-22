import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GameSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) {
  const [mode, setMode] = React.useState(settings.mode || "flags");
  const [questionCount, setQuestionCount] = React.useState(settings.questionCount || 10);
  const [difficulty, setDifficulty] = React.useState(settings.difficulty || "medium");
  const [hasTimer, setHasTimer] = React.useState(settings.hasTimer ?? true);

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveSettings({
      mode,
      questionCount,
      difficulty,
      hasTimer,
    });
    onClose();
  };

  const modes = [
    { id: "flags", title: "🚩 Flag Master", desc: "Identify countries by their national flags" },
    { id: "capitals", title: "🏛️ Capital Cities", desc: "Match countries with their capitals" },
    { id: "trivia", title: "🌍 World Trivia", desc: "Geography facts, borders, & landscapes" },
    { id: "timeAttack", title: "⚡ Time Attack", desc: "Fast-paced rapid fire with speed bonuses" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#242749] border border-[#3E4577] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#3E4577]">
            <h2 className="text-2xl font-bold tracking-tight">Game Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#A0A5D0] uppercase tracking-wider">
              Select Game Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    mode === m.id
                      ? "bg-gradient-to-r from-[#E65895]/20 to-[#BC6BE8]/20 border-[#BC6BE8] shadow-md"
                      : "bg-[#1E213D] border-[#343964] hover:border-[#4B538D]"
                  }`}
                >
                  <p className="font-bold text-sm text-white">{m.title}</p>
                  <p className="text-xs text-[#959BC4] mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#A0A5D0] uppercase tracking-wider">
              Questions Count
            </label>
            <div className="flex gap-3">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                    questionCount === cnt
                      ? "bg-gradient-to-r from-[#E65895] to-[#BC6BE8] border-transparent text-white shadow-md"
                      : "bg-[#1E213D] border-[#343964] text-[#A0A5D0] hover:text-white"
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Timer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#A0A5D0] uppercase tracking-wider block mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#1E213D] border border-[#343964] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#BC6BE8]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#A0A5D0] uppercase tracking-wider block mb-2">
                Timer
              </label>
              <button
                type="button"
                onClick={() => setHasTimer(!hasTimer)}
                className={`w-full py-2 px-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  hasTimer
                    ? "bg-[#2563EB]/20 border-[#3B82F6] text-[#93C5FD]"
                    : "bg-[#1E213D] border-[#343964] text-gray-400"
                }`}
              >
                {hasTimer ? "⏱️ Enabled (15s)" : "♾️ Relaxed (No Timer)"}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#2A2E54] hover:bg-[#393E6E] text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer active:scale-95"
            >
              Start New Game
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
