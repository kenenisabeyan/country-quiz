import React from "react";

export default function PerformanceTelemetry({ userAnswers = [] }) {
  if (!userAnswers || userAnswers.length === 0) return null;

  const validTimes = userAnswers.map((a) => a.timeTaken || 5);
  const avgTime = (
    validTimes.reduce((acc, t) => acc + t, 0) / validTimes.length
  ).toFixed(1);
  const maxTime = Math.max(...validTimes, 15);

  const getSpeedRating = (time) => {
    if (time <= 4) return { label: "⚡ Lightning", color: "text-amber-400" };
    if (time <= 8) return { label: "🏃 Swift", color: "text-emerald-400" };
    return { label: "🚶 Steady", color: "text-blue-400" };
  };

  const rating = getSpeedRating(parseFloat(avgTime));

  return (
    <div className="bg-[#1C1F3D] border border-[#343B6D] rounded-2xl p-4 text-left space-y-3 w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs">
        <div>
          <p className="text-[#8E97CF] font-semibold">Response Time Telemetry</p>
          <p className="text-white font-bold text-sm">
            Avg: <span className="text-[#BC6BE8]">{avgTime}s</span> / question
          </p>
        </div>
        <span
          className={`text-xs font-black px-2.5 py-1 rounded-full bg-white/5 border border-white/10 ${rating.color}`}
        >
          {rating.label}
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-2">
        <div className="h-16 flex items-end gap-1.5 justify-between px-1 border-b border-[#2D335E] pb-1">
          {userAnswers.map((ans, idx) => {
            const time = ans.timeTaken || 5;
            const heightPercent = Math.min(100, Math.max(15, (time / maxTime) * 100));
            const isCorrect = ans.isCorrect;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-7 hidden group-hover:flex bg-black/90 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  Q{idx + 1}: {time}s
                </div>

                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isCorrect
                      ? "bg-gradient-to-t from-emerald-600 to-teal-400 hover:brightness-125"
                      : "bg-gradient-to-t from-rose-600 to-red-400 hover:brightness-125"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] text-[#8E97CF] mt-1 font-mono">{idx + 1}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-[#6F77A8] pt-1">
          <span>Q1</span>
          <span>Per-Question Response Time</span>
          <span>Q{userAnswers.length}</span>
        </div>
      </div>
    </div>
  );
}
