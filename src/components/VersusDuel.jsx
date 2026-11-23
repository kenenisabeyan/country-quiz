import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "../utils/sound";
import { triggerConfetti } from "../utils/confetti";
import CheckIcon from "../assets/Check_round_fill.svg";
import CrossIcon from "../assets/Close_round_fill.svg";

export default function VersusDuel({
  questions,
  onExit,
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [turn, setTurn] = useState(1); // 1 or 2
  const [roundAnswered, setRoundAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [duelGameOver, setDuelGameOver] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (option) => {
    if (roundAnswered || duelGameOver || !currentQ) return;

    setSelectedOption(option);
    setRoundAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      if (turn === 1) {
        setPlayer1Score((prev) => prev + 100);
      } else {
        setPlayer2Score((prev) => prev + 100);
      }
    } else {
      sound.playIncorrect();
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= questions.length) {
        setDuelGameOver(true);
        triggerConfetti();
        sound.playVictory();
      } else {
        setCurrentIdx(nextIdx);
        setTurn(turn === 1 ? 2 : 1);
        setRoundAnswered(false);
        setSelectedOption(null);
      }
    }, 1200);
  };

  const getWinner = () => {
    if (player1Score > player2Score) return { name: "Player 1", color: "text-rose-400" };
    if (player2Score > player1Score) return { name: "Player 2", color: "text-blue-400" };
    return { name: "Epic Tie!", color: "text-purple-300" };
  };

  if (duelGameOver) {
    const winner = getWinner();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto text-center bg-[#202446]/95 border border-[#3E4577] backdrop-blur-lg rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
          👑
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white">Duel Concluded!</h2>
          <p className={`text-xl font-black ${winner.color}`}>
            {winner.name === "Epic Tie!" ? "It's a Stalemate!" : `Victory for ${winner.name}!`}
          </p>
        </div>

        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center">
            <p className="text-xs text-rose-300 font-bold">Player 1 (Red)</p>
            <p className="text-3xl font-black text-white mt-1">{player1Score} pts</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-center">
            <p className="text-xs text-blue-300 font-bold">Player 2 (Blue)</p>
            <p className="text-3xl font-black text-white mt-1">{player2Score} pts</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold text-sm shadow-lg shadow-purple-500/25 cursor-pointer transition-all active:scale-95"
        >
          Return to Main Menu
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Turn & Score Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            turn === 1
              ? "bg-rose-900/60 border-rose-400 ring-2 ring-rose-500/60 shadow-lg shadow-rose-900/40"
              : "bg-[#171A33]/70 border-[#2D335E] opacity-70"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <p className="text-xs font-bold text-rose-300">Player 1 (Turn)</p>
          </div>
          <p className="text-2xl font-black text-white mt-0.5">{player1Score} pts</p>
        </div>

        <div
          className={`p-3.5 rounded-2xl border text-center transition-all ${
            turn === 2
              ? "bg-blue-900/60 border-blue-400 ring-2 ring-blue-500/60 shadow-lg shadow-blue-900/40"
              : "bg-[#171A33]/70 border-[#2D335E] opacity-70"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-xs font-bold text-blue-300">Player 2 (Turn)</p>
          </div>
          <p className="text-2xl font-black text-white mt-0.5">{player2Score} pts</p>
        </div>
      </div>

      {/* Duel Question Card */}
      <div className="bg-[#202446]/95 border border-[#3E4577] backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex justify-between items-center text-xs text-[#8E97CF] font-semibold border-b border-[#2E3463] pb-3">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span className={turn === 1 ? "text-rose-400 font-bold" : "text-blue-400 font-bold"}>
            {turn === 1 ? "🔴 Player 1's Turn" : "🔵 Player 2's Turn"}
          </span>
          <button
            onClick={onExit}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            Leave Duel
          </button>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white px-2">
            {currentQ?.question}
          </h2>

          {currentQ?.flagUrl && (
            <div className="flex justify-center">
              <img
                src={currentQ.flagUrl}
                alt="Country Flag"
                className="h-24 sm:h-28 rounded-xl shadow-md border-2 border-white/20 object-cover"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ?.options.map((option, idx) => {
            const isCorrect = option === currentQ.correctAnswer;
            const isSelected = selectedOption === option;

            let btnStyle = "bg-[#2D335E] hover:bg-[#3D457D] text-white border-[#444D87]";
            if (roundAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30";
              } else if (isSelected) {
                btnStyle = "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30";
              } else {
                btnStyle = "bg-[#181B38] opacity-50 border-transparent text-gray-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                disabled={roundAnswered}
                className={`p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-98 ${btnStyle}`}
              >
                <span>{option}</span>
                {roundAnswered && (isCorrect || isSelected) && (
                  <img
                    src={isCorrect ? CheckIcon : CrossIcon}
                    alt=""
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
