import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountryFactModal({ country, isOpen, onClose }) {
  if (!isOpen || !country) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#24284D] border border-[#444D87] text-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#BC6BE8] bg-[#BC6BE8]/15 px-2.5 py-1 rounded-full border border-[#BC6BE8]/30">
                {country.continent || "World"}
              </span>
              <h2 className="text-2xl font-black mt-2 text-white flex items-center gap-2">
                {country.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 text-xl rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Flag Display */}
          {country.code && (
            <div className="flex justify-center py-2">
              <img
                src={`https://flagcdn.com/w320/${country.code}.png`}
                alt={`${country.name} Flag`}
                className="h-28 rounded-xl shadow-xl border-2 border-white/20 object-cover"
              />
            </div>
          )}

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">🏛️ Capital</p>
              <p className="text-sm font-bold text-white mt-0.5">{country.capital || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">👥 Population</p>
              <p className="text-sm font-bold text-white mt-0.5">{country.population || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">💵 Currency</p>
              <p className="text-sm font-bold text-white mt-0.5">{country.currency || "N/A"}</p>
            </div>
            <div className="bg-[#1C1F3D] p-3 rounded-2xl border border-[#343B6D]">
              <p className="text-[#8E97CF] font-medium">📍 Landmark</p>
              <p className="text-sm font-bold text-white mt-0.5 truncate" title={country.landmark}>
                {country.landmark || "N/A"}
              </p>
            </div>
          </div>

          {/* Fun Fact */}
          {country.funFact && (
            <div className="bg-gradient-to-r from-[#BC6BE8]/15 to-[#E65895]/15 border border-[#BC6BE8]/30 p-3.5 rounded-2xl text-xs text-purple-100">
              <span className="font-bold text-[#E65895]">💡 Fun Fact: </span>
              {country.funFact}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold text-sm cursor-pointer hover:opacity-95 transition-all active:scale-98"
          >
            Got It
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
