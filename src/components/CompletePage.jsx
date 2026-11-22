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
  onRestart,
  onOpenSettings,
}) {
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  const percentage = Math.round((score / (maxPossibleScore || totalQuestions * 100)) * 100);
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  useEffect(() => {
    sound.playVictory();
    if (percentage >= 50) {
      triggerConfetti();
    }
  }, [percentage]);

  const getRank = () => {
    if (percentage >= 90) return { title: "🌍 Master Cartographer", desc: "Supreme geography prodigy!" };
    if (percentage >= 70) return { title: "🧭 Expert Explorer", desc: "Impressive global knowledge!" };
    if (percentage >= 50) return { title: "🗺️ World Adventurer", desc: "Good journey, keep learning!" };
    return { title: "🌱 Curious Traveler", desc: "Practice makes perfect!" };
  };

  const rank = getRank();

  const handleShare = () => {
    const text = `🏆 I scored ${score} pts (${correctCount}/${totalQuestions} correct) on Country Quiz! Can you beat my rank: ${rank.title}?`;
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
      <div className="bg-[#2D325A]/95 border border-[#434A85] backdrop-blur-md py-10 px-6 sm:px-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
        <img
          src={congrats}
          alt="Quiz Finished"
          className="w-48 sm:w-56 drop-shadow-lg mx-auto"
        />

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#BC6BE8] bg-[#BC6BE8]/10 px-3 py-1 rounded-full border border-[#BC6BE8]/30">
            {rank.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E2E4F3] mt-2">
            Quiz Completed!
          </h2>
          <p className="text-sm text-[#A0A5D0]">{rank.desc}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mt-2">
          <div className="bg-[#202340] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-xs text-[#8E95C7]">Total Score</p>
            <p className="text-xl font-black text-[#E65895]">{score}</p>
          </div>
          <div className="bg-[#202340] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-xs text-[#8E95C7]">Correct</p>
            <p className="text-xl font-black text-emerald-400">
              {correctCount}/{totalQuestions}
            </p>
          </div>
          <div className="bg-[#202340] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-xs text-[#8E95C7]">Accuracy</p>
            <p className="text-xl font-black text-[#BC6BE8]">
              {Math.round((correctCount / (totalQuestions || 1)) * 100)}%
            </p>
          </div>
          <div className="bg-[#202340] border border-[#393E6E] p-3 rounded-2xl">
            <p className="text-xs text-[#8E95C7]">Max Streak</p>
            <p className="text-xl font-black text-amber-400">🔥 {maxStreak || 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-3 w-full mt-2">
          <button
            onClick={onRestart}
            className="flex-1 min-w-[140px] bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 cursor-pointer text-base"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onOpenSettings}
            className="bg-[#25284B] hover:bg-[#343964] border border-[#444A7F] text-white font-semibold py-3.5 px-5 rounded-2xl transition-all cursor-pointer text-sm"
          >
            ⚙️ Modes
          </button>

          <button
            onClick={handleShare}
            className="bg-[#25284B] hover:bg-[#343964] border border-[#444A7F] text-white font-semibold py-3.5 px-5 rounded-2xl transition-all cursor-pointer text-sm"
          >
            {copied ? "✅ Copied!" : "📤 Share"}
          </button>
        </div>

        {/* Toggle Detailed Review */}
        <button
          onClick={() => setShowReview(!showReview)}
          className="text-xs text-[#A0A5D0] hover:text-white underline mt-2 cursor-pointer transition-colors"
        >
          {showReview ? "Hide Answer Breakdown ▲" : "Review All Answers & Fun Facts ▼"}
        </button>

        {/* Answer Breakdown Accordion */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full text-left overflow-hidden space-y-3 mt-4"
            >
              <h3 className="font-bold text-sm text-[#C8CDED] uppercase tracking-wider">
                Question Breakdown
              </h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = userAnswers.find((a) => a.questionIndex === idx);
                  const isCorrect = ans?.isCorrect;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border ${
                        isCorrect
                          ? "bg-[#1E2E3D]/80 border-emerald-500/40"
                          : "bg-[#3D1E2C]/80 border-rose-500/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={isCorrect ? CheckIcon : CrossIcon}
                            alt=""
                            className="w-4 h-4 mt-0.5"
                          />
                          <p className="text-sm font-semibold text-white">
                            {idx + 1}. {q.question}
                          </p>
                        </div>
                      </div>

                      {q.flagUrl && (
                        <img
                          src={q.flagUrl}
                          alt="Flag"
                          className="h-8 rounded my-2 border border-white/20 object-cover"
                        />
                      )}

                      <div className="text-xs mt-2 space-y-1">
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
                          <p className="text-[#A5ABDE] italic pt-1 text-[11px]">
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
