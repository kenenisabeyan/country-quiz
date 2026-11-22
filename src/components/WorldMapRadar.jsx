import React from "react";
import { motion } from "framer-motion";

export default function WorldMapRadar({ activeContinent }) {
  const continent = (activeContinent || "").toLowerCase();

  const isAfrica = continent.includes("africa");
  const isAsia = continent.includes("asia");
  const isEurope = continent.includes("europe");
  const isAmericas = continent.includes("america") || continent.includes("north") || continent.includes("south");
  const isOceania = continent.includes("oceania") || continent.includes("australia");

  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="relative w-48 h-20 bg-[#161933]/80 rounded-xl border border-[#343B6D] flex items-center justify-center overflow-hidden shadow-inner">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a305e15_1px,transparent_1px),linear-gradient(to_bottom,#2a305e15_1px,transparent_1px)] bg-[size:10px_10px]" />

        {/* Stylized Minimal World SVG Map */}
        <svg viewBox="0 0 200 90" className="w-full h-full p-2 z-10">
          {/* North & South Americas */}
          <path
            d="M 25 15 Q 35 15 40 25 Q 45 40 38 55 Q 42 70 48 80 Q 42 85 38 78 Q 30 55 22 40 Z"
            className={`transition-all duration-300 ${
              isAmericas
                ? "fill-[#BC6BE8] stroke-[#E65895] stroke-1 drop-shadow-[0_0_6px_#BC6BE8]"
                : "fill-[#2B305C] stroke-[#3B427A] stroke-[0.5]"
            }`}
          />

          {/* Europe */}
          <path
            d="M 85 18 Q 98 15 105 22 Q 108 30 98 32 Q 88 30 85 18 Z"
            className={`transition-all duration-300 ${
              isEurope
                ? "fill-[#BC6BE8] stroke-[#E65895] stroke-1 drop-shadow-[0_0_6px_#BC6BE8]"
                : "fill-[#2B305C] stroke-[#3B427A] stroke-[0.5]"
            }`}
          />

          {/* Africa */}
          <path
            d="M 88 35 Q 102 33 108 42 Q 112 58 100 70 Q 92 68 85 52 Q 82 42 88 35 Z"
            className={`transition-all duration-300 ${
              isAfrica
                ? "fill-[#BC6BE8] stroke-[#E65895] stroke-1 drop-shadow-[0_0_6px_#BC6BE8]"
                : "fill-[#2B305C] stroke-[#3B427A] stroke-[0.5]"
            }`}
          />

          {/* Asia */}
          <path
            d="M 112 18 Q 145 15 158 28 Q 155 45 140 50 Q 125 45 115 35 Z"
            className={`transition-all duration-300 ${
              isAsia
                ? "fill-[#BC6BE8] stroke-[#E65895] stroke-1 drop-shadow-[0_0_6px_#BC6BE8]"
                : "fill-[#2B305C] stroke-[#3B427A] stroke-[0.5]"
            }`}
          />

          {/* Oceania / Australia */}
          <path
            d="M 148 60 Q 165 58 168 68 Q 162 76 148 72 Z"
            className={`transition-all duration-300 ${
              isOceania
                ? "fill-[#BC6BE8] stroke-[#E65895] stroke-1 drop-shadow-[0_0_6px_#BC6BE8]"
                : "fill-[#2B305C] stroke-[#3B427A] stroke-[0.5]"
            }`}
          />
        </svg>

        {/* Pulse radar sweep line */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-[#BC6BE8]/20 to-transparent pointer-events-none"
        />
      </div>

      <span className="text-[10px] text-[#A0A5D0] font-semibold tracking-wider uppercase">
        Region: <span className="text-[#BC6BE8] font-bold">{activeContinent || "Global"}</span>
      </span>
    </div>
  );
}
