import React, { useEffect } from "react";
import { sound } from "../utils/sound";

export default function Timer({
  duration = 15,
  timeLeft,
  setTimeLeft,
  isActive,
  onTimeUp,
}) {
  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp, setTimeLeft]);

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
      <div className="relative flex items-center justify-center">
        <span
          className={`text-sm font-bold w-7 text-center ${
            isUrgent ? "text-rose-400 animate-pulse font-extrabold" : "text-[#A0A5D0]"
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="flex-1 h-2.5 bg-[#25284B] rounded-full overflow-hidden p-0.5 border border-[#3E4577]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent
              ? "bg-gradient-to-r from-red-500 to-rose-400"
              : "bg-gradient-to-r from-[#4D8AFF] via-[#BC6BE8] to-[#E65895]"
          }`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
    </div>
  );
}
