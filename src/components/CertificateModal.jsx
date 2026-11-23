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

  const handleDownloadPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, "#191B35");
    bgGrad.addColorStop(0.5, "#121426");
    bgGrad.addColorStop(1, "#26153B");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Outer & Inner Gold/Purple Borders
    ctx.strokeStyle = "#BC6BE8";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = "#E65895";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 710);

    // Decorative corner stars
    ctx.fillStyle = "#E65895";
    ctx.font = "28px serif";
    ctx.fillText("✦", 60, 80);
    ctx.fillText("✦", 1120, 80);
    ctx.fillText("✦", 60, 740);
    ctx.fillText("✦", 1120, 740);

    // Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#E65895";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("CERTIFICATE OF CARTOGRAPHIC MASTERY", 600, 130);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 46px serif";
    ctx.fillText("Country Quiz Master Academy", 600, 195);

    // Underline accent
    const lineGrad = ctx.createLinearGradient(450, 0, 750, 0);
    lineGrad.addColorStop(0, "#E65895");
    lineGrad.addColorStop(1, "#BC6BE8");
    ctx.fillStyle = lineGrad;
    ctx.fillRect(450, 220, 300, 4);

    // Subtitle
    ctx.fillStyle = "#A0A5D0";
    ctx.font = "italic 20px sans-serif";
    ctx.fillText("This credential certifies that the bearer has demonstrated supreme world geography knowledge", 600, 280);

    // Rank & Title
    ctx.fillStyle = "#FBCFE8";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(rankTitle || "Master Cartographer", 600, 370);

    ctx.fillStyle = "#BC6BE8";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(`Expedition Challenge: ${modeTitle || "World Expedition"}`, 600, 420);

    // Metrics Box
    ctx.fillStyle = "#1E2248";
    ctx.fillRect(300, 470, 600, 110);
    ctx.strokeStyle = "#3E4577";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(300, 470, 600, 110);

    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#8E97CF";
    ctx.fillText("FINAL SCORE", 400, 505);
    ctx.fillText("ACCURACY", 600, 505);
    ctx.fillText("DATE AWARDED", 800, 505);

    ctx.font = "900 28px sans-serif";
    ctx.fillStyle = "#E65895";
    ctx.fillText(`${score} pts`, 400, 550);

    ctx.fillStyle = "#34D399";
    ctx.fillText(`${accuracy}%`, 600, 550);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(currentDate, 800, 548);

    // Seal & Signature Footer
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "italic 20px serif";
    ctx.fillText("Kenenisa Beyan", 120, 680);
    ctx.fillStyle = "#8E97CF";
    ctx.font = "14px sans-serif";
    ctx.fillText("Lead Cartographic Evaluator", 120, 705);

    ctx.textAlign = "right";
    ctx.fillStyle = "#BC6BE8";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("OFFICIAL DIGITAL SEAL 🌍", 1080, 680);
    ctx.fillStyle = "#8E97CF";
    ctx.font = "13px sans-serif";
    ctx.fillText("VERIFIED ON BLOCK / WEB CREDENTIAL", 1080, 705);

    // Trigger Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `country-quiz-certificate-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
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
                <p className="text-[10px] text-gray-400">Verified by Kenenisa Beyan</p>
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
          <div className="flex flex-wrap justify-end gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2A2E54] hover:bg-[#393E6E] text-white transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPNG}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#343B6D] hover:bg-[#454E8E] text-[#BC6BE8] border border-[#BC6BE8]/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>🖼️ Download PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E65895] to-[#BC6BE8] hover:from-[#d84f8a] hover:to-[#ab5fd6] text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️ Print / PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
