import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorldMapRadar from "./WorldMapRadar";
import { speakText } from "../utils/speech";

export default function CountryFactModal({ country, isOpen, onClose }) {
  if (!isOpen || !country) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#24284D] border border-[#444D87] text-white w-full max-w-md rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#BC6BE8] bg-[#BC6BE8]/15 px-2.5 py-0.5 rounded-full border border-[#BC6BE8]/30">
                {country.continent || "World"}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {country.name}
                </h2>
                <button
                  type="button"
                  onClick={() => speakText(`${country.name}. Capital: ${country.capital}`)}
                  title="Listen to pronunciation"
                  aria-label={`Pronounce ${country.name}`}
                  className="p-1.5 rounded-full bg-[#393F73] hover:bg-[#4C5499] text-xs text-purple-200 transition-colors cursor-pointer active:scale-95"
                >
                  🔊
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 text-xl rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Flag & Map Radar Side-by-Side or Stacked */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {country.code && (
              <img
                src={`https://flagcdn.com/w320/${country.code}.png`}
                alt={`${country.name} Flag`}
                className="h-20 sm:h-22 rounded-xl shadow-lg border border-white/20 object-cover"
              />
            )}
            <WorldMapRadar activeContinent={country.continent} />
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#1C1F3D] p-2.5 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">🏛️ Capital</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{country.capital || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-2.5 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">👥 Population</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{country.population || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-2.5 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">💵 Currency</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{country.currency || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-2.5 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">📍 Landmark</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate" title={country.landmark}>
                {country.landmark || "N/A"}
              </p>
            </div>
          </div>

          {/* Fun Fact */}
          {country.funFact && (
            <div className="bg-gradient-to-r from-[#BC6BE8]/15 to-[#E65895]/15 border border-[#BC6BE8]/30 p-3 rounded-2xl text-xs text-purple-100">
              <span className="font-bold text-[#E65895]">💡 Fun Fact: </span>
              {country.funFact}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold text-xs cursor-pointer hover:opacity-95 transition-all active:scale-98"
          >
            Got It
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
