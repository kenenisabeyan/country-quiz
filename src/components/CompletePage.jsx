import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import congrats from "../assets/congrats.png";
import { triggerConfetti } from "../utils/confetti";
import { sound } from "../utils/sound";
import CheckIcon from "../assets/Check_round_fill.svg";
import CrossIcon from "../assets/Close_round_fill.svg";

export default function CompletePage({
  score,
  maxPossibleScore,
  totalQuestions,
  userAnswers,
  questions,
  maxStreak,
  isSurvivalMode,
  survivedCount,
  onRestart,
  onOpenSettings,
  onInspectCountry,
}) {
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  useEffect(() => {
    sound.playVictory();
    if (percentage >= 50 || (isSurvivalMode && survivedCount >= 5)) {
      triggerConfetti();
    }
  }, [percentage, isSurvivalMode, survivedCount]);

  const getRank = () => {
    if (isSurvivalMode) {
      if (survivedCount >= 15) return { title: "👑 Geography Legend", desc: "Immortal knowledge of the globe!" };
      if (survivedCount >= 10) return { title: "🧭 Seasoned Navigator", desc: "Exceptional survival skills!" };
      if (survivedCount >= 5) return { title: "🗺️ Daring Adventurer", desc: "Great run under pressure!" };
      return { title: "🌱 Brave Traveler", desc: "Every journey begins with a single step!" };
    }
    if (percentage >= 90) return { title: "🌍 Master Cartographer", desc: "Supreme geography prodigy!" };
    if (percentage >= 70) return { title: "🧭 Expert Explorer", desc: "Impressive global knowledge!" };
    if (percentage >= 50) return { title: "🗺️ World Adventurer", desc: "Good journey, keep learning!" };
    return { title: "🌱 Curious Traveler", desc: "Practice makes perfect!" };
  };

  const rank = getRank();

  const handleShare = () => {
    const text = isSurvivalMode
      ? `🏆 I survived ${survivedCount} questions with ${score} pts on Country Quiz! Rank: ${rank.title}. Can you beat me?`
      : `🏆 I scored ${score} pts (${correctCount}/${totalQuestions} correct) on Country Quiz! Rank: ${rank.title}. Can you beat me?`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto text-center"
    >
      <div className="bg-[#2D325A]/95 border border-[#434A85] backdrop-blur-md py-8 sm:py-10 px-5 sm:px-10 rounded-3xl shadow-2xl flex flex-col items-center gap-5">
        <img
          src={congrats}
          alt="Quiz Finished"
          className="w-44 sm:w-52 drop-shadow-lg mx-auto"
        />

        <div className="space-y-1.5">
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#BC6BE8] bg-[#BC6BE8]/10 px-3 py-1 rounded-full border border-[#BC6BE8]/30">
            {rank.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#E2E4F3] mt-2">
            {isSurvivalMode ? "Game Over — Survival Run" : "Quiz Completed!"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A5D0]">{rank.desc}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg">
          <div className="bg-[#1F2342] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-[11px] text-[#8E95C7]">Total Score</p>
            <p className="text-xl font-black text-[#E65895]">{score}</p>
          </div>
          <div className="bg-[#1F2342] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-[11px] text-[#8E95C7]">
              {isSurvivalMode ? "Survived" : "Correct"}
            </p>
            <p className="text-xl font-black text-emerald-400">
              {isSurvivalMode ? `${survivedCount} Qs` : `${correctCount}/${totalQuestions}`}
            </p>
          </div>
          <div className="bg-[#1F2342] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-[11px] text-[#8E95C7]">Accuracy</p>
            <p className="text-xl font-black text-[#BC6BE8]">{percentage}%</p>
          </div>
          <div className="bg-[#1F2342] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-[11px] text-[#8E95C7]">Max Streak</p>
            <p className="text-xl font-black text-amber-400">🔥 {maxStreak || 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 w-full mt-1">
          <button
            onClick={onRestart}
            className="flex-1 min-w-[130px] bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 cursor-pointer text-sm"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onOpenSettings}
            className="bg-[#25284B] hover:bg-[#343964] border border-[#444A7F] text-white font-semibold py-3 px-4 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm"
          >
            ⚙️ Modes
          </button>

          <button
            onClick={handleShare}
            className="bg-[#25284B] hover:bg-[#343964] border border-[#444A7F] text-white font-semibold py-3 px-4 rounded-2xl transition-all cursor-pointer text-xs sm:text-sm"
          >
            {copied ? "✅ Copied!" : "📤 Share"}
          </button>
        </div>

        {/* Toggle Detailed Review */}
        <button
          onClick={() => setShowReview(!showReview)}
          className="text-xs text-[#A0A5D0] hover:text-white underline mt-1 cursor-pointer transition-colors"
        >
          {showReview ? "Hide Question Review ▲" : "Review All Answers & Country Cards ▼"}
        </button>

        {/* Answer Breakdown Accordion */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full text-left overflow-hidden space-y-2.5 mt-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-[#C8CDED] uppercase tracking-wider">
                  Question Breakdown & Fact Cards
                </h3>
                <span className="text-[11px] text-[#8E95C7]">Tap country name for facts</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = userAnswers.find((a) => a.questionIndex === idx);
                  const isCorrect = ans?.isCorrect;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border ${
                        isCorrect
                          ? "bg-[#1B2B38]/85 border-emerald-500/40"
                          : "bg-[#381B28]/85 border-rose-500/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={isCorrect ? CheckIcon : CrossIcon}
                            alt=""
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          />
                          <p className="text-xs sm:text-sm font-semibold text-white">
                            {idx + 1}. {q.question}
                          </p>
                        </div>

                        {q.countryData && (
                          <button
                            onClick={() => onInspectCountry(q.countryData)}
                            className="text-[10px] bg-[#3B4275] hover:bg-[#4C5596] text-purple-200 px-2 py-0.5 rounded-lg border border-purple-400/30 font-semibold cursor-pointer flex-shrink-0 transition-colors"
                          >
                            ℹ️ Fact Card
                          </button>
                        )}
                      </div>

                      {q.flagUrl && (
                        <img
                          src={q.flagUrl}
                          alt="Flag"
                          className="h-7 rounded my-1.5 border border-white/20 object-cover"
                        />
                      )}

                      <div className="text-[11px] mt-1 space-y-0.5">
                        <p className="text-gray-300">
                          Your answer:{" "}
                          <span
                            className={
                              isCorrect
                                ? "text-emerald-400 font-bold"
                                : "text-rose-400 font-bold"
                            }
                          >
                            {ans ? ans.selectedOption : "Timed out / Skipped"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-gray-300">
                            Correct answer:{" "}
                            <span className="text-emerald-400 font-bold">
                              {q.correctAnswer}
                            </span>
                          </p>
                        )}
                        {q.funFact && (
                          <p className="text-[#A5ABDE] italic pt-0.5 text-[10px]">
                            💡 {q.funFact}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
