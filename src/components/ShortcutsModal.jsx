import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "1 / 2 / 3 / 4", desc: "Select option (1st, 2nd, 3rd, 4th)" },
    { key: "A / B / C / D", desc: "Select option (Alternative keys)" },
    { key: "H", desc: "Reveal question hint" },
    { key: "F", desc: "Trigger 50:50 Lifeline" },
    { key: "S", desc: "Skip current question" },
    { key: "P", desc: "Pronounce country name aloud" },
    { key: "M", desc: "Toggle audio mute (SFX)" },
    { key: "B", desc: "Toggle ambient background music" },
    { key: "?", desc: "Open / close this shortcuts guide" },
    { key: "Esc", desc: "Close any open dialog or modal" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#202446] border border-[#3E4577] text-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 my-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-[#3E4577]">
            <div className="flex items-center gap-2">
              <span className="text-xl">⌨️</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Keyboard Navigation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 text-xl cursor-pointer"
              aria-label="Close shortcuts modal"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-[#A0A5D0]">
            Speed up your geography expeditions using single-key command shortcuts:
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#171A33] border border-[#2E3463] text-xs"
              >
                <span className="text-[#C8CDED] font-medium">{s.desc}</span>
                <kbd className="px-2.5 py-1 rounded-lg bg-[#2B315E] border border-[#444D87] font-mono text-[11px] font-bold text-[#E2E4F3] shadow-inner">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#2A2F57] hover:bg-[#3D447D] border border-[#444D87] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Got It! Return to Game
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
