import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "../utils/sound";
import { THEMES, getActiveTheme, setActiveTheme } from "../utils/themes";

export default function GameSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onThemeChange,
}) {
  const [mode, setMode] = React.useState(settings.mode || "flags");
  const [continent, setContinent] = React.useState(settings.continent || "All");
  const [questionCount, setQuestionCount] = React.useState(settings.questionCount || 10);
  const [difficulty, setDifficulty] = React.useState(settings.difficulty || "medium");
  const [hasTimer, setHasTimer] = React.useState(settings.hasTimer ?? true);
  const [volume, setVolume] = React.useState(Math.round(sound.getVolume() * 100));
  const [currentTheme, setCurrentTheme] = React.useState(getActiveTheme().id);

  if (!isOpen) return null;

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    sound.setVolume(val / 100);
  };

  const handleThemeSelect = (themeId) => {
    setCurrentTheme(themeId);
    const updated = setActiveTheme(themeId);
    if (onThemeChange) {
      onThemeChange(updated);
    }
  };

  const handleApply = () => {
    onSaveSettings({
      mode,
      continent,
      questionCount,
      difficulty,
      hasTimer,
    });
    onClose();
  };

  const modes = [
    { id: "flags", title: "🚩 Flag Master", desc: "Identify countries by their national flags" },
    { id: "capitals", title: "🏛️ Capital Cities", desc: "Match countries with their capitals" },
    { id: "landmarks", title: "🗺️ Wonders & Sites", desc: "Famous landmarks, mountains, & wonders" },
    { id: "daily", title: "📅 Daily Challenge", desc: "Seeded global expedition (5 questions)" },
    { id: "revision", title: "🎯 Weak Spot Revision", desc: "Focus practice on previously missed nations" },
    { id: "survival", title: "🏆 Survival (3 Lives)", desc: "Sudden death mode — 3 lives, go as far as you can!" },
    { id: "trivia", title: "🌍 World Trivia", desc: "Geography facts, borders, & landscapes" },
    { id: "timeAttack", title: "⚡ Time Blitz", desc: "Fast-paced rapid fire with speed bonuses" },
  ];

  const continents = ["All", "Africa", "Asia", "Europe", "Americas", "Oceania"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#242749] border border-[#3E4577] text-white w-full max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#3E4577]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Game Customizer</h2>
              <p className="text-xs text-[#9DA3D1]">Choose mode, region, theme & challenge settings</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
              Select Game Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    mode === m.id
                      ? "bg-gradient-to-r from-[#E65895]/20 to-[#BC6BE8]/20 border-[#BC6BE8] shadow-md"
                      : "bg-[#1E213D] border-[#343964] hover:border-[#4B538D]"
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm text-white">{m.title}</p>
                  <p className="text-[11px] text-[#959BC4] mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Continent Filter */}
          {mode !== "daily" && mode !== "revision" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
                Region / Continent
              </label>
              <div className="flex flex-wrap gap-1.5">
                {continents.map((c) => (
                  <button
                    key={c}
                    onClick={() => setContinent(c)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      continent === c
                        ? "bg-[#BC6BE8] border-[#BC6BE8] text-white shadow-sm"
                        : "bg-[#1E213D] border-[#343964] text-[#A0A5D0] hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
              Visual Theme Atmosphere
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    currentTheme === theme.id
                      ? "bg-[#BC6BE8]/20 border-[#BC6BE8] text-white ring-1 ring-[#BC6BE8]"
                      : "bg-[#1E213D] border-[#343964] text-gray-400 hover:text-white"
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          {mode !== "survival" && mode !== "daily" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
                Question Count
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-1 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
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
          )}

          {/* Difficulty & Timer & Audio Volume */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider block mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#1E213D] border border-[#343964] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#BC6BE8]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider block mb-1">
                Timer
              </label>
              <button
                type="button"
                onClick={() => setHasTimer(!hasTimer)}
                className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  hasTimer
                    ? "bg-[#2563EB]/25 border-[#3B82F6] text-[#93C5FD]"
                    : "bg-[#1E213D] border-[#343964] text-gray-400"
                }`}
              >
                {hasTimer ? "⏱️ Enabled (15s)" : "♾️ Relaxed (Off)"}
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#A0A5D0] uppercase tracking-wider">
                  Volume: {volume}%
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#BC6BE8] cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2A2E54] hover:bg-[#393E6E] text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer active:scale-95"
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
