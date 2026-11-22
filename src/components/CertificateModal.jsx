import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificateModal({
  isOpen,
  onClose,
  score,
  accuracy,
  rankTitle,
  modeTitle,
}) {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1C1F3D] border border-[#3E4577] text-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
        >
          {/* Certificate Canvas Box */}
          <div
            id="certificate-print-area"
            className="relative bg-gradient-to-br from-[#1E234B] via-[#161833] to-[#251A3B] border-4 border-[#BC6BE8]/40 rounded-2xl p-6 sm:p-10 text-center space-y-5 shadow-2xl overflow-hidden"
          >
            {/* Decorative Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[#BC6BE8]/40 text-xl font-serif">
              ✦
            </div>
            <div className="absolute top-2 right-2 text-[#BC6BE8]/40 text-xl font-serif">
              ✦
            </div>
            <div className="absolute bottom-2 left-2 text-[#BC6BE8]/40 text-xl font-serif">
              ✦
            </div>
            <div className="absolute bottom-2 right-2 text-[#BC6BE8]/40 text-xl font-serif">
              ✦
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#E65895] font-extrabold">
                Certificate of Achievement
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-white mt-1">
                Geography Master Certification
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-[#E65895] to-[#BC6BE8] mx-auto mt-2" />
            </div>

            <p className="text-xs text-[#A0A5D0] italic">
              This credential certifies that the bearer has completed the global geography expedition
            </p>

            <div className="py-2">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
                {rankTitle || "Master Cartographer"}
              </span>
              <p className="text-xs text-[#BC6BE8] font-bold mt-1">
                Challenge: {modeTitle || "World Expedition"}
              </p>
            </div>

            {/* Metrics Ribbon */}
            <div className="flex justify-center gap-6 text-xs border-y border-[#353C6E] py-3 max-w-sm mx-auto">
              <div>
                <p className="text-[#8E97CF]">Final Score</p>
                <p className="font-black text-sm text-[#E65895]">{score} pts</p>
              </div>
              <div className="w-px bg-[#353C6E]" />
              <div>
                <p className="text-[#8E97CF]">Accuracy</p>
                <p className="font-black text-sm text-emerald-400">{accuracy}%</p>
              </div>
              <div className="w-px bg-[#353C6E]" />
              <div>
                <p className="text-[#8E97CF]">Date</p>
                <p className="font-black text-sm text-white">{currentDate}</p>
              </div>
            </div>

            {/* Official Seal / Signature */}
            <div className="flex justify-between items-end pt-3 text-[11px] text-[#A0A5D0] px-4">
              <div className="text-left">
                <p className="font-serif italic text-white text-xs">Country Quiz Academy</p>
                <p className="text-[10px] text-gray-400">Official Evaluation</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#BC6BE8] flex items-center justify-center bg-[#BC6BE8]/10 text-xl shadow-lg">
                  🌍
                </div>
                <span className="text-[9px] font-bold tracking-widest text-[#BC6BE8] uppercase mt-1">
                  Verified Seal
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2A2E54] hover:bg-[#393E6E] text-white transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️ Print / Save PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
