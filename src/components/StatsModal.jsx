import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMissedCountries } from "../data/countryData";
import { AVATARS, getSelectedAvatar, setSelectedAvatar } from "../utils/avatars";

export default function StatsModal({
  isOpen,
  onClose,
  stats,
  onResetStats,
  onImportStats,
  onPracticeWeakSpots,
  onAvatarSelect,
}) {
  const fileInputRef = useRef(null);
  const [currentAvatar, setCurrentAvatar] = useState(getSelectedAvatar());

  if (!isOpen) return null;

  const totalAnswered = stats.totalAnswered || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const missedCountries = getMissedCountries();

  const handleChooseAvatar = (avatar) => {
    setSelectedAvatar(avatar.id);
    setCurrentAvatar(avatar);
    if (onAvatarSelect) onAvatarSelect(avatar);
  };

  const handleExport = () => {
    const payload = {
      stats,
      unlockedAchievements: JSON.parse(
        localStorage.getItem("country_quiz_unlocked_achievements") || "[]"
      ),
      missedCountries,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `country-quiz-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.stats && onImportStats) {
          onImportStats(data.stats);
        }
        if (data.unlockedAchievements) {
          localStorage.setItem(
            "country_quiz_unlocked_achievements",
            JSON.stringify(data.unlockedAchievements)
          );
        }
        if (data.missedCountries) {
          localStorage.setItem(
            "country_quiz_missed_countries",
            JSON.stringify(data.missedCountries)
          );
        }
      } catch (err) {
        console.error("Failed to parse imported profile:", err);
      }
    };
    reader.readAsText(file);
  };

  // Generate 28 mock-relative activity blocks based on gamesPlayed
  const activityDays = Array.from({ length: 28 }, (_, i) => {
    const isActive = (i + 1) * 3 <= (stats.gamesPlayed || 0) || i === 27;
    return { day: i + 1, active: isActive };
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#242749] border border-[#3E4577] text-white w-full max-w-md rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#3E4577]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Career &amp; Explorer Dossier</h2>
                <p className="text-[11px] text-[#9DA3D1]">Achievements, habits &amp; telemetry</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Avatar Selector */}
          <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] space-y-2">
            <p className="text-[11px] text-[#8E97CF] font-bold uppercase tracking-wider">
              Explorer Persona: {currentAvatar.title}
            </p>
            <div className="flex justify-between items-center gap-1.5 overflow-x-auto py-0.5">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleChooseAvatar(av)}
                  title={av.title}
                  className={`p-2 rounded-xl text-xl transition-all cursor-pointer border ${
                    currentAvatar.id === av.id
                      ? "bg-[#BC6BE8]/20 border-[#BC6BE8] scale-110 shadow-md"
                      : "bg-[#171A33] border-[#2E3463] hover:border-gray-500 opacity-70"
                  }`}
                >
                  {av.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-[11px] text-[#8E97CF]">Games Played</p>
              <p className="text-2xl font-black text-white mt-0.5">{stats.gamesPlayed || 0}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-[11px] text-[#8E97CF]">Accuracy Rate</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{accuracy}%</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-[11px] text-[#8E97CF]">Total Points</p>
              <p className="text-2xl font-black text-[#E65895] mt-0.5">{stats.totalScore || 0}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] text-center">
              <p className="text-[11px] text-[#8E97CF]">Best Streak</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">🔥 {stats.bestStreak || 0}</p>
            </div>
          </div>

          {/* 28-Day Habit Activity Heatmap */}
          <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D] space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#8E97CF] font-bold">📅 4-Week Activity Log</span>
              <span className="text-emerald-400 font-semibold">Active Streak</span>
            </div>
            <div className="grid grid-cols-7 gap-1 pt-1">
              {activityDays.map((d) => (
                <div
                  key={d.day}
                  className={`h-4 rounded-md transition-all ${
                    d.active
                      ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                      : "bg-[#252A52]"
                  }`}
                  title={`Day ${d.day}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#1C1F3D] p-3.5 rounded-2xl border border-[#343B6D] flex justify-between items-center text-xs">
            <div>
              <p className="text-[#8E97CF] font-medium">🏆 Survival High Score</p>
              <p className="font-semibold text-white">Questions Survived</p>
            </div>
            <span className="text-xl font-black text-[#BC6BE8]">
              {stats.survivalRecord || 0}
            </span>
          </div>

          {/* Missed Countries Revision Section */}
          {missedCountries.length > 0 && (
            <div className="bg-[#3D1E2C]/50 border border-rose-500/30 p-3 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-rose-300">
                  🎯 Weak Spots: {missedCountries.length} countries
                </p>
                <p className="text-[10px] text-gray-400">Questions you previously missed</p>
              </div>
              <button
                onClick={() => {
                  onPracticeWeakSpots();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-sm"
              >
                Practice
              </button>
            </div>
          )}

          {/* Backup / Restore controls */}
          <div className="pt-1 border-t border-[#343B6D] flex justify-between items-center text-xs text-[#8E97CF]">
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="hover:text-white underline cursor-pointer"
                title="Save backup file"
              >
                💾 Export JSON
              </button>
              <span>•</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-white underline cursor-pointer"
                title="Restore from backup file"
              >
                📥 Import
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            <button
              onClick={onResetStats}
              className="text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-bold bg-[#333866] hover:bg-[#434A85] text-white text-xs cursor-pointer transition-all"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
