import React from "react";
import { motion } from "framer-motion";
import CheckIcon from "../assets/Check_round_fill.svg";
import CrossIcon from "../assets/Close_round_fill.svg";

export default function PopulationClash({
  clashData,
  onSelect,
  isAnswered,
  currentAnswer,
  correctAnswer,
}) {
  if (!clashData || !clashData.countryA || !clashData.countryB) {
    return null;
  }

  const { countryA, countryB } = clashData;

  const renderCard = (country, isLeft) => {
    const isSelected = currentAnswer?.selectedOption === country.name;
    const isWinner = country.name === correctAnswer;

    let borderStyle = "border-[#3E4577] hover:border-[#BC6BE8]/60 bg-[#1F2344]/90";
    if (isAnswered) {
      if (isWinner) {
        borderStyle = "border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20";
      } else if (isSelected) {
        borderStyle = "border-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20";
      } else {
        borderStyle = "border-[#2D335E] bg-[#171A33]/50 opacity-60";
      }
    }

    return (
      <motion.div
        whileHover={!isAnswered ? { y: -3, scale: 1.02 } : {}}
        whileTap={!isAnswered ? { scale: 0.98 } : {}}
        onClick={() => !isAnswered && onSelect(country.name)}
        className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col items-center justify-between gap-3 text-center ${borderStyle}`}
        role="button"
        tabIndex={0}
        aria-label={`Select ${country.name} for higher population`}
        onKeyDown={(e) => {
          if (!isAnswered && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onSelect(country.name);
          }
        }}
      >
        <div className="w-full space-y-2">
          {/* Flag */}
          <div className="relative mx-auto w-24 sm:w-28 h-16 sm:h-18 rounded-xl overflow-hidden shadow-md border border-white/20">
            <img
              src={`https://flagcdn.com/w320/${country.code}.png`}
              alt={`${country.name} flag`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {isAnswered && isWinner && (
              <span className="absolute top-1 right-1 text-sm bg-black/60 rounded-full px-1">
                👑
              </span>
            )}
          </div>

          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              {country.name}
            </h3>
            <span className="text-[11px] text-[#8E97CF] font-medium">
              {country.continent} • {country.capital}
            </span>
          </div>
        </div>

        {/* Population Reveal when answered */}
        {isAnswered ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-2 px-3 rounded-xl bg-black/30 border border-white/10 space-y-1"
          >
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Population
            </span>
            <p className="font-black text-sm sm:text-base text-[#BC6BE8]">
              {country.population}
            </p>
            {isWinner && (
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-bold">
                <img src={CheckIcon} alt="Correct" className="w-3.5 h-3.5" />
                <span>Larger Population</span>
              </div>
            )}
            {isSelected && !isWinner && (
              <div className="flex items-center justify-center gap-1 text-[11px] text-rose-400 font-bold">
                <img src={CrossIcon} alt="Incorrect" className="w-3.5 h-3.5" />
                <span>Smaller Population</span>
              </div>
            )}
          </motion.div>
        ) : (
          <button
            type="button"
            className="w-full py-2.5 px-3 rounded-xl bg-[#2D335E] hover:bg-[#3D457D] text-xs font-bold text-white transition-colors cursor-pointer border border-[#444D87]"
          >
            Choose {country.name}
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 w-full max-w-xl mx-auto">
      {renderCard(countryA, true)}

      {/* VS Emblem */}
      <div className="flex flex-col items-center justify-center flex-shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#E65895] to-[#BC6BE8] flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-lg shadow-purple-500/30 border-2 border-white/40">
          VS
        </div>
      </div>

      {renderCard(countryB, false)}
    </div>
  );
}
