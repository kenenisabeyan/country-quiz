import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="pointer-events-auto bg-[#252A54]/95 border border-[#BC6BE8]/50 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5"
          >
            <span className="text-3xl p-2 bg-gradient-to-br from-[#E65895]/20 to-[#BC6BE8]/20 rounded-xl border border-[#BC6BE8]/30">
              {toast.icon || "🏆"}
            </span>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#BC6BE8]">
                Achievement Unlocked!
              </span>
              <p className="font-bold text-sm text-white">{toast.title}</p>
              <p className="text-xs text-[#A0A5D0]">{toast.description}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
