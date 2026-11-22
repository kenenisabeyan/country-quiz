import React from "react";
import { sound } from "../utils/sound";

export default function Lifelines({
  lifelines,
  onUseFiftyFifty,
  onUseHint,
  onUseSkip,
  disabled,
}) {
  const handleFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || disabled) return;
    sound.playLifeline();
    onUseFiftyFifty();
  };

  const handleHint = () => {
    if (lifelines.hint <= 0 || disabled) return;
    sound.playLifeline();
    onUseHint();
  };

  const handleSkip = () => {
    if (lifelines.skip <= 0 || disabled) return;
    sound.playLifeline();
    onUseSkip();
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* 50:50 Lifeline */}
      <button
        onClick={handleFiftyFifty}
        disabled={lifelines.fiftyFifty <= 0 || disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          lifelines.fiftyFifty > 0 && !disabled
            ? "bg-[#2A2E54] hover:bg-[#3B4175] text-[#E2E4F3] border-[#4A518C] cursor-pointer shadow-sm active:scale-95"
            : "bg-[#202340] text-gray-500 border-gray-700/50 cursor-not-allowed opacity-50"
        }`}
        title="Remove two incorrect options"
      >
        <span>⚖️ 50:50</span>
        <span className="bg-[#3D4478] px-1.5 py-0.5 rounded-full text-[10px]">
          {lifelines.fiftyFifty}
        </span>
      </button>

      {/* Hint Lifeline */}
      <button
        onClick={handleHint}
        disabled={lifelines.hint <= 0 || disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          lifelines.hint > 0 && !disabled
            ? "bg-[#2A2E54] hover:bg-[#3B4175] text-[#E2E4F3] border-[#4A518C] cursor-pointer shadow-sm active:scale-95"
            : "bg-[#202340] text-gray-500 border-gray-700/50 cursor-not-allowed opacity-50"
        }`}
        title="Get a helpful hint"
      >
        <span>💡 Hint</span>
        <span className="bg-[#3D4478] px-1.5 py-0.5 rounded-full text-[10px]">
          {lifelines.hint}
        </span>
      </button>

      {/* Skip Lifeline */}
      <button
        onClick={handleSkip}
        disabled={lifelines.skip <= 0 || disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          lifelines.skip > 0 && !disabled
            ? "bg-[#2A2E54] hover:bg-[#3B4175] text-[#E2E4F3] border-[#4A518C] cursor-pointer shadow-sm active:scale-95"
            : "bg-[#202340] text-gray-500 border-gray-700/50 cursor-not-allowed opacity-50"
        }`}
        title="Skip this question without penalty"
      >
        <span>⏭️ Skip</span>
        <span className="bg-[#3D4478] px-1.5 py-0.5 rounded-full text-[10px]">
          {lifelines.skip}
        </span>
      </button>
    </div>
  );
}
