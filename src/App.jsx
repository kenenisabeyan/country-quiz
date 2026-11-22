import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "./assets/Check_round_fill.svg";
import CrossIcon from "./assets/Close_round_fill.svg";
import bgImage from "./assets/bg.jpg";
import CompletePage from "./components/CompletePage";
import Header from "./components/Header";
import Timer from "./components/Timer";
import Lifelines from "./components/Lifelines";
import GameSettingsModal from "./components/GameSettingsModal";
import { fetchQuestionsByMode } from "./data/countryData";
import { sound } from "./utils/sound";

function App() {
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Settings
  const [settings, setSettings] = useState({
    mode: "flags",
    questionCount: 10,
    difficulty: "medium",
    hasTimer: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Lifelines & hints
  const [lifelines, setLifelines] = useState({ fiftyFifty: 1, hint: 1, skip: 1 });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Load high score and sound preference
  useEffect(() => {
    const savedHighScore = parseInt(localStorage.getItem("country_quiz_highscore") || "0", 10);
    setHighScore(savedHighScore);
    setIsMuted(sound.isMuted());
  }, []);

  const loadQuestions = useCallback(async (customSettings = settings) => {
    setIsLoading(true);
    try {
      const data = await fetchQuestionsByMode(
        customSettings.mode,
        customSettings.questionCount,
        customSettings.difficulty
      );
      setQuestions(data);
      setCurrent(0);
      setUserAnswers([]);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setLifelines({ fiftyFifty: 1, hint: 1, skip: 1 });
      setHiddenOptions([]);
      setShowHint(false);
      setQuizCompleted(false);
      setTimeLeft(15);
      setIsTimerActive(customSettings.hasTimer);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Handle completion
  useEffect(() => {
    if (questions.length > 0 && userAnswers.length === questions.length) {
      setQuizCompleted(true);
      setIsTimerActive(false);

      // Update High Score
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("country_quiz_highscore", score.toString());
      }
    }
  }, [userAnswers.length, questions.length, score, highScore]);

  // Reset timer on question change
  useEffect(() => {
    if (settings.hasTimer && !quizCompleted && !isLoading) {
      setTimeLeft(15);
      setIsTimerActive(true);
    }
    setHiddenOptions([]);
    setShowHint(false);
  }, [current, settings.hasTimer, quizCompleted, isLoading]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleAnswer = (selectedOption) => {
    if (isAnswered) return;
    setIsTimerActive(false);

    const isCorrect = selectedOption === questions[current].correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }

      // Base 100 + Streak bonus + Speed bonus
      const speedBonus = settings.hasTimer ? timeLeft * 5 : 0;
      const streakBonus = (newStreak - 1) * 20;
      const pointsEarned = 100 + speedBonus + streakBonus;
      setScore((prev) => prev + pointsEarned);
    } else {
      sound.playIncorrect();
      setStreak(0);
    }

    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption, isCorrect },
    ];
    setUserAnswers(newAnswers);

    // Auto advance
    setTimeout(() => {
      moveToNextUnanswered(newAnswers);
    }, 1100);
  };

  const moveToNextUnanswered = useCallback((answers) => {
    let nextIdx = current + 1;
    while (nextIdx < questions.length && answers.some((a) => a.questionIndex === nextIdx)) {
      nextIdx++;
    }

    if (nextIdx < questions.length) {
      setCurrent(nextIdx);
    } else {
      // Find any previously skipped/unanswered question
      const firstUnanswered = questions.findIndex(
        (_, idx) => !answers.some((a) => a.questionIndex === idx)
      );
      if (firstUnanswered !== -1) {
        setCurrent(firstUnanswered);
      }
    }
  }, [current, questions]);

  const handleTimeUp = useCallback(() => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (alreadyAnswered || quizCompleted) return;
    sound.playIncorrect();
    setStreak(0);

    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption: null, isCorrect: false },
    ];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      moveToNextUnanswered(newAnswers);
    }, 1200);
  }, [current, userAnswers, quizCompleted, moveToNextUnanswered]);

  // Lifeline Handlers
  const handleUseFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || isAnswered) return;
    const currentQ = questions[current];
    const incorrectOptions = currentQ.options.filter(
      (opt) => opt !== currentQ.correctAnswer
    );
    // Shuffle and pick 2 to hide
    const toHide = [...incorrectOptions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    setHiddenOptions(toHide);
    setLifelines((prev) => ({ ...prev, fiftyFifty: prev.fiftyFifty - 1 }));
  };

  const handleUseHint = () => {
    if (lifelines.hint <= 0 || isAnswered) return;
    setShowHint(true);
    setLifelines((prev) => ({ ...prev, hint: prev.hint - 1 }));
  };

  const handleUseSkip = () => {
    if (lifelines.skip <= 0 || isAnswered) return;
    setLifelines((prev) => ({ ...prev, skip: prev.skip - 1 }));

    // Mark as answered or advance
    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption: "Skipped", isCorrect: false, isSkipped: true },
    ];
    setUserAnswers(newAnswers);
    moveToNextUnanswered(newAnswers);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    loadQuestions(newSettings);
  };

  const currentQ = questions[current];
  const isAnswered = userAnswers.some((a) => a.questionIndex === current);
  const currentAnswer = userAnswers.find((a) => a.questionIndex === current);

  const getModeTitle = () => {
    switch (settings.mode) {
      case "flags":
        return "🚩 Flag Master";
      case "capitals":
        return "🏛️ Capital Cities";
      case "timeAttack":
        return "⚡ Time Attack Challenge";
      default:
        return "🌍 World Geography Trivia";
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-[#E2E4F3] p-6 font-['Be_Vietnam_Pro',sans-serif]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-[#2D325A]/90 p-8 rounded-3xl border border-[#444A7F] flex flex-col items-center gap-4 shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-[#BC6BE8] border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-bold tracking-wide">Preparing Geography Challenge...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex justify-center items-center text-[#E2E4F3] p-4 font-['Be_Vietnam_Pro',sans-serif]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <CompletePage
          score={score}
          maxPossibleScore={questions.length * 150}
          totalQuestions={questions.length}
          userAnswers={userAnswers}
          questions={questions}
          maxStreak={maxStreak}
          onRestart={() => loadQuestions()}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <GameSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center text-[#E2E4F3] p-4 sm:p-6 font-['Be_Vietnam_Pro',sans-serif]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-3xl bg-[#202446]/95 border border-[#3A4072] rounded-3xl sm:rounded-4xl p-6 sm:p-10 shadow-2xl backdrop-blur-lg">
        {/* Header with points, streak, sound, settings */}
        <Header
          score={score}
          streak={streak}
          highScore={highScore}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setIsSettingsOpen(true)}
          modeTitle={getModeTitle()}
        />

        {/* Progress & Question Selector */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-[#9DA3D1] mb-2 font-semibold">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(((current) / questions.length) * 100)}% Completed</span>
          </div>

          <ul className="flex gap-2 flex-wrap justify-center py-2">
            {questions.map((_, index) => {
              const answer = userAnswers.find((a) => a.questionIndex === index);
              let statusBg = "bg-[#2D335E] border-transparent text-[#9DA3D1]";

              if (index === current) {
                statusBg = "bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white ring-2 ring-white/70 shadow-md";
              } else if (answer) {
                statusBg = answer.isCorrect
                  ? "bg-emerald-600/80 text-white"
                  : "bg-rose-600/80 text-white";
              }

              return (
                <li
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`cursor-pointer rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-bold transition-all transform hover:scale-105 ${statusBg}`}
                >
                  {index + 1}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Question Container */}
        <div className="bg-[#2B2F57] py-6 sm:py-8 px-4 sm:px-8 rounded-2xl border border-[#3E457C] shadow-inner space-y-6">
          {/* Timer Bar */}
          {settings.hasTimer && (
            <Timer
              duration={15}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              isActive={isTimerActive && !isAnswered}
              onTimeUp={handleTimeUp}
            />
          )}

          {/* Animated Question & Options */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Question Text */}
              <div className="text-center space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white px-2 leading-relaxed">
                  {currentQ?.question}
                </h2>

                {/* Flag Image Display */}
                {currentQ?.flagUrl && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                  >
                    <img
                      src={currentQ.flagUrl}
                      alt="Country Flag"
                      className="h-24 sm:h-32 rounded-xl shadow-xl border-2 border-white/20 object-cover"
                    />
                  </motion.div>
                )}

                {/* Hint Display */}
                {showHint && currentQ?.hint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm px-4 py-2 rounded-xl"
                  >
                    💡 Hint: {currentQ.hint}
                  </motion.div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentQ?.options.map((option, i) => {
                  const isHidden = hiddenOptions.includes(option);
                  const isCorrectAnswer = option === currentQ.correctAnswer;
                  const isSelected = currentAnswer?.selectedOption === option;

                  let btnStyle = "bg-[#383E6E] hover:bg-[#484F8C] text-white border-[#4A5291]";
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30";
                    } else {
                      btnStyle = "bg-[#25284B] opacity-50 border-transparent text-gray-400";
                    }
                  }

                  if (isHidden) {
                    return (
                      <div
                        key={i}
                        className="py-4 px-5 rounded-2xl border border-dashed border-gray-700/40 opacity-20 pointer-events-none"
                      />
                    );
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`text-left p-4 sm:p-4.5 rounded-2xl border font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-98 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && (isCorrectAnswer || isSelected) && (
                        <img
                          src={isCorrectAnswer ? CheckIcon : CrossIcon}
                          alt=""
                          className="w-5 h-5 flex-shrink-0 ml-2"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Lifelines Bar */}
          <Lifelines
            lifelines={lifelines}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseHint={handleUseHint}
            onUseSkip={handleUseSkip}
            disabled={isAnswered}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
