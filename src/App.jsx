import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "./assets/Check_round_fill.svg";
import CrossIcon from "./assets/Close_round_fill.svg";
import bgImage from "./assets/bg.jpg";
import StartScreen from "./components/StartScreen";
import CompletePage from "./components/CompletePage";
import Header from "./components/Header";
import Timer from "./components/Timer";
import Lifelines from "./components/Lifelines";
import GameSettingsModal from "./components/GameSettingsModal";
import StatsModal from "./components/StatsModal";
import CountryFactModal from "./components/CountryFactModal";
import StudyDeckModal from "./components/StudyDeckModal";
import AchievementsModal from "./components/AchievementsModal";
import CertificateModal from "./components/CertificateModal";
import WorldMapRadar from "./components/WorldMapRadar";
import PopulationClash from "./components/PopulationClash";
import Toast from "./components/Toast";
import { fetchQuestionsByMode, saveMissedCountry, clearMissedCountry } from "./data/countryData";
import { sound } from "./utils/sound";
import { preloadImages } from "./utils/imagePreloader";
import { haptics } from "./utils/haptics";
import { evaluateAchievements } from "./utils/achievements";
import { getActiveTheme } from "./utils/themes";
import { getLanguage, setLanguage, t } from "./utils/i18n";

const DEFAULT_STATS = {
  gamesPlayed: 0,
  totalScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  bestStreak: 0,
  survivalRecord: 0,
};

function App() {
  const [gameState, setGameState] = useState("menu"); // "menu" | "playing" | "completed"
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Screen reader announcement
  const [announcement, setAnnouncement] = useState("");

  // Visual Theme
  const [activeTheme, setActiveThemeState] = useState(getActiveTheme());

  // Localization Language
  const [currentLang, setCurrentLang] = useState(getLanguage());

  // Background Ambient Music
  const [isBgmActive, setIsBgmActive] = useState(sound.isBGMActive());

  const handleToggleBGM = () => {
    const active = sound.toggleBGM();
    setIsBgmActive(active);
  };

  // Survival Mode
  const [lives, setLives] = useState(3);

  // Settings
  const [settings, setSettings] = useState({
    mode: "flags",
    continent: "All",
    questionCount: 10,
    difficulty: "medium",
    hasTimer: true,
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isStudyDeckOpen, setIsStudyDeckOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [inspectedCountry, setInspectedCountry] = useState(null);

  // Toast notifications for achievements
  const [toasts, setToasts] = useState([]);

  // Audio & Stats
  const [isMuted, setIsMuted] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const fastestTimeLeftRef = useRef(0);

  // Lifelines & hints
  const [lifelines, setLifelines] = useState({ fiftyFifty: 1, hint: 1, skip: 1 });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Load stats & theme from localStorage
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem("country_quiz_career_stats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch {
      // fallback
    }
    setIsMuted(sound.isMuted());
    setActiveThemeState(getActiveTheme());
  }, []);

  const triggerAchievementCheck = useCallback((currentStats, sessionData) => {
    const { newlyUnlocked } = evaluateAchievements(currentStats, sessionData);
    if (newlyUnlocked.length > 0) {
      sound.playLifeline();
      newlyUnlocked.forEach((ach) => {
        const toastItem = { ...ach, id: `${ach.id}_${Date.now()}` };
        setToasts((prev) => [...prev, toastItem]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
        }, 5000);
      });
    }
  }, []);

  const saveCareerStats = useCallback((points, answers, bestStreakSession, survived) => {
    setStats((prev) => {
      const correctSession = answers.filter((a) => a.isCorrect).length;
      const updated = {
        gamesPlayed: (prev.gamesPlayed || 0) + 1,
        totalScore: (prev.totalScore || 0) + points,
        totalAnswered: (prev.totalAnswered || 0) + answers.length,
        totalCorrect: (prev.totalCorrect || 0) + correctSession,
        bestStreak: Math.max(prev.bestStreak || 0, bestStreakSession),
        survivalRecord: Math.max(prev.survivalRecord || 0, survived || 0),
      };
      localStorage.setItem("country_quiz_career_stats", JSON.stringify(updated));

      const accuracy = answers.length > 0 ? Math.round((correctSession / answers.length) * 100) : 0;
      triggerAchievementCheck(updated, {
        totalQuestions: answers.length,
        accuracy,
        fastestTimeLeft: fastestTimeLeftRef.current,
      });

      return updated;
    });
  }, [triggerAchievementCheck]);

  const handleResetStats = () => {
    localStorage.removeItem("country_quiz_career_stats");
    setStats(DEFAULT_STATS);
  };

  const handleImportStats = (imported) => {
    setStats(imported);
    localStorage.setItem("country_quiz_career_stats", JSON.stringify(imported));
  };

  const loadQuestions = useCallback(async (customSettings = settings) => {
    setIsLoading(true);
    setGameState("playing");
    try {
      const qCount = customSettings.mode === "survival" ? 50 : customSettings.questionCount;
      const data = await fetchQuestionsByMode(
        customSettings.mode,
        qCount,
        customSettings.difficulty,
        customSettings.continent
      );
      setQuestions(data);
      setCurrent(0);
      setUserAnswers([]);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setLives(3);
      setLifelines({ fiftyFifty: 1, hint: 1, skip: 1 });
      setHiddenOptions([]);
      setShowHint(false);
      setTimeLeft(15);
      setIsTimerActive(customSettings.hasTimer);
      fastestTimeLeftRef.current = 0;

      const flagsToPreload = data
        .slice(0, 4)
        .map((q) => q.flagUrl)
        .filter(Boolean);
      preloadImages(flagsToPreload);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Preload upcoming flags
  useEffect(() => {
    if (questions.length > 0) {
      const upcoming = [
        questions[current + 1]?.flagUrl,
        questions[current + 2]?.flagUrl,
      ].filter(Boolean);
      if (upcoming.length > 0) {
        preloadImages(upcoming);
      }
    }
  }, [current, questions]);

  // Check completion
  useEffect(() => {
    if (gameState === "playing" && questions.length > 0 && userAnswers.length === questions.length) {
      setGameState("completed");
      setIsTimerActive(false);
      saveCareerStats(score, userAnswers, maxStreak, userAnswers.length);
    }
  }, [userAnswers, questions.length, gameState, score, maxStreak, saveCareerStats]);

  // Reset timer on question switch
  useEffect(() => {
    if (settings.hasTimer && gameState === "playing" && !isLoading) {
      setTimeLeft(15);
      setIsTimerActive(true);
    }
    setHiddenOptions([]);
    setShowHint(false);
  }, [current, settings.hasTimer, gameState, isLoading]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const moveToNextUnanswered = useCallback((answers) => {
    let nextIdx = current + 1;
    while (nextIdx < questions.length && answers.some((a) => a.questionIndex === nextIdx)) {
      nextIdx++;
    }

    if (nextIdx < questions.length) {
      setCurrent(nextIdx);
    } else {
      const firstUnanswered = questions.findIndex(
        (_, idx) => !answers.some((a) => a.questionIndex === idx)
      );
      if (firstUnanswered !== -1) {
        setCurrent(firstUnanswered);
      }
    }
  }, [current, questions]);

  const handleAnswer = useCallback((selectedOption) => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (alreadyAnswered || gameState !== "playing" || !questions[current]) return;

    setIsTimerActive(false);
    const isCorrect = selectedOption === questions[current].correctAnswer;

    if (timeLeft > fastestTimeLeftRef.current) {
      fastestTimeLeftRef.current = timeLeft;
    }

    let updatedLives = lives;
    let nextStreak = streak;

    if (isCorrect) {
      sound.playCorrect();
      haptics.success();
      clearMissedCountry(questions[current].correctAnswer);
      nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) {
        setMaxStreak(nextStreak);
      }

      const speedBonus = settings.hasTimer ? timeLeft * 5 : 0;
      const streakBonus = (nextStreak - 1) * 25;
      const pointsEarned = 100 + speedBonus + streakBonus;
      setScore((prev) => prev + pointsEarned);
      setAnnouncement(`Correct! Selected ${selectedOption}. +${pointsEarned} points.`);
    } else {
      setStreak(0);
      haptics.error();
      saveMissedCountry(questions[current].correctAnswer);
      if (settings.mode === "survival") {
        sound.playLifeLost();
        updatedLives = lives - 1;
        setLives(updatedLives);
        setAnnouncement(`Incorrect! The correct answer was ${questions[current].correctAnswer}. One life lost.`);
      } else {
        sound.playIncorrect();
        setAnnouncement(`Incorrect! The correct answer was ${questions[current].correctAnswer}.`);
      }
    }

    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption, isCorrect },
    ];
    setUserAnswers(newAnswers);

    if (settings.mode === "survival" && updatedLives <= 0) {
      setTimeout(() => {
        setGameState("completed");
        saveCareerStats(score, newAnswers, maxStreak, newAnswers.length);
      }, 1000);
      return;
    }

    setTimeout(() => {
      moveToNextUnanswered(newAnswers);
    }, 1100);
  }, [userAnswers, current, gameState, questions, timeLeft, lives, streak, maxStreak, settings, saveCareerStats, score, moveToNextUnanswered]);

  const handleTimeUp = useCallback(() => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (alreadyAnswered || gameState !== "playing") return;

    setStreak(0);
    haptics.error();
    saveMissedCountry(questions[current]?.correctAnswer);
    let updatedLives = lives;

    if (settings.mode === "survival") {
      sound.playLifeLost();
      updatedLives = lives - 1;
      setLives(updatedLives);
      setAnnouncement(`Time is up! One life lost. Correct answer was ${questions[current]?.correctAnswer}.`);
    } else {
      sound.playIncorrect();
      setAnnouncement(`Time is up! Correct answer was ${questions[current]?.correctAnswer}.`);
    }

    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption: null, isCorrect: false },
    ];
    setUserAnswers(newAnswers);

    if (settings.mode === "survival" && updatedLives <= 0) {
      setTimeout(() => {
        setGameState("completed");
        saveCareerStats(score, newAnswers, maxStreak, newAnswers.length);
      }, 1000);
      return;
    }

    setTimeout(() => {
      moveToNextUnanswered(newAnswers);
    }, 1200);
  }, [current, userAnswers, gameState, settings.mode, lives, score, maxStreak, saveCareerStats, moveToNextUnanswered, questions]);

  // Lifelines
  const handleUseFiftyFifty = useCallback(() => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (lifelines.fiftyFifty <= 0 || alreadyAnswered || !questions[current]) return;
    haptics.light();
    const currentQ = questions[current];
    const incorrectOptions = currentQ.options.filter(
      (opt) => opt !== currentQ.correctAnswer
    );
    const toHide = [...incorrectOptions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    setHiddenOptions(toHide);
    setLifelines((prev) => ({ ...prev, fiftyFifty: prev.fiftyFifty - 1 }));
    setAnnouncement("50:50 Lifeline used. Two incorrect options eliminated.");
  }, [lifelines.fiftyFifty, userAnswers, current, questions]);

  const handleUseHint = useCallback(() => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (lifelines.hint <= 0 || alreadyAnswered) return;
    haptics.light();
    setShowHint(true);
    setLifelines((prev) => ({ ...prev, hint: prev.hint - 1 }));
    setAnnouncement(`Hint revealed: ${questions[current]?.hint}`);
  }, [lifelines.hint, userAnswers, current, questions]);

  const handleUseSkip = useCallback(() => {
    const alreadyAnswered = userAnswers.some((a) => a.questionIndex === current);
    if (lifelines.skip <= 0 || alreadyAnswered) return;
    haptics.light();
    setLifelines((prev) => ({ ...prev, skip: prev.skip - 1 }));

    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedOption: "Skipped", isCorrect: false, isSkipped: true },
    ];
    setUserAnswers(newAnswers);
    setAnnouncement("Question skipped.");
    moveToNextUnanswered(newAnswers);
  }, [lifelines.skip, userAnswers, current, moveToNextUnanswered]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        isSettingsOpen ||
        isStatsOpen ||
        isStudyDeckOpen ||
        isAchievementsOpen ||
        isCertificateOpen ||
        inspectedCountry ||
        gameState !== "playing" ||
        isLoading
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const currentQ = questions[current];
      if (!currentQ || !currentQ.options) return;

      const optionMap = { "1": 0, "A": 0, "2": 1, "B": 1, "3": 2, "C": 2, "4": 3, "D": 3 };
      if (key in optionMap) {
        const optIdx = optionMap[key];
        const selectedOpt = currentQ.options[optIdx];
        if (selectedOpt && !hiddenOptions.includes(selectedOpt)) {
          handleAnswer(selectedOpt);
        }
      } else if (key === "H") {
        handleUseHint();
      } else if (key === "F") {
        handleUseFiftyFifty();
      } else if (key === "S") {
        handleUseSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSettingsOpen,
    isStatsOpen,
    isStudyDeckOpen,
    isAchievementsOpen,
    isCertificateOpen,
    inspectedCountry,
    gameState,
    isLoading,
    questions,
    current,
    hiddenOptions,
    handleAnswer,
    handleUseHint,
    handleUseFiftyFifty,
    handleUseSkip,
  ]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    loadQuestions(newSettings);
  };

  const handleLaunchContinentQuiz = (continent) => {
    const updated = { ...settings, continent };
    setSettings(updated);
    loadQuestions(updated);
  };

  const handlePracticeWeakSpots = () => {
    const updated = { ...settings, mode: "revision" };
    setSettings(updated);
    loadQuestions(updated);
  };

  const handleLaunchDaily = () => {
    const updated = { ...settings, mode: "daily" };
    setSettings(updated);
    loadQuestions(updated);
  };

  const currentQ = questions[current];
  const isAnswered = userAnswers.some((a) => a.questionIndex === current);
  const currentAnswer = userAnswers.find((a) => a.questionIndex === current);

  const getModeTitle = () => {
    switch (settings.mode) {
      case "daily":
        return "📅 Daily Global Challenge";
      case "revision":
        return "🎯 Weak Spot Revision Deck";
      case "flags":
        return `🚩 Flag Master (${settings.continent})`;
      case "capitals":
        return `🏛️ Capital Cities (${settings.continent})`;
      case "landmarks":
        return `🗺️ Wonders & Sites (${settings.continent})`;
      case "survival":
        return "🏆 Survival Mode (3 Lives)";
      case "timeAttack":
        return "⚡ Time Blitz";
      default:
        return `🌍 World Geography Trivia (${settings.continent})`;
    }
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const currentAccuracy = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center text-[#E2E4F3] p-3 sm:p-6 font-['Be_Vietnam_Pro',sans-serif]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* 1. START / LANDING MENU SCREEN */}
      {gameState === "menu" && (
        <StartScreen
          stats={stats}
          onStartGame={(modeId) => {
            const updated = { ...settings, mode: modeId };
            setSettings(updated);
            loadQuestions(updated);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAtlas={() => setIsStudyDeckOpen(true)}
          onOpenTrophies={() => setIsAchievementsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      )}

      {/* 2. LOADING SCREEN */}
      {isLoading && (
        <div className="bg-[#2D325A]/95 p-8 rounded-3xl border border-[#444A7F] flex flex-col items-center gap-4 shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-[#BC6BE8] border-t-transparent rounded-full animate-spin" />
          <p className="text-base font-bold tracking-wide">Assembling Geography Expedition...</p>
        </div>
      )}

      {/* 3. GAMEPLAY SCREEN */}
      {gameState === "playing" && !isLoading && (
        <main
          className="w-full max-w-3xl border rounded-3xl sm:rounded-4xl p-5 sm:p-9 shadow-2xl backdrop-blur-lg transition-colors duration-500"
          style={{
            backgroundColor: `${activeTheme.colors.bgCard}f0`,
            borderColor: activeTheme.colors.border,
          }}
        >
          {/* Header */}
          <Header
            score={score}
            streak={streak}
            lives={lives}
            isSurvivalMode={settings.mode === "survival"}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenStudyDeck={() => setIsStudyDeckOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onLaunchDaily={handleLaunchDaily}
            onGoHome={() => setGameState("menu")}
            modeTitle={getModeTitle()}
          />

          {/* Progress & Question Selector (in non-survival mode) */}
          {settings.mode !== "survival" && (
            <nav aria-label="Question progress" className="mb-5">
              <div className="flex justify-between items-center text-xs text-[#9DA3D1] mb-2 font-semibold">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{Math.round(((current) / questions.length) * 100)}% Completed</span>
              </div>

              <ul className="flex gap-2 flex-wrap justify-center py-1">
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
                      onClick={() => {
                        haptics.light();
                        setCurrent(index);
                      }}
                      role="button"
                      aria-label={`Jump to question ${index + 1}`}
                      className={`cursor-pointer rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold transition-all transform hover:scale-105 ${statusBg}`}
                    >
                      {index + 1}
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Question Container */}
          <section
            aria-label="Current question"
            className="py-6 sm:py-7 px-4 sm:px-7 rounded-2xl border shadow-inner space-y-5 transition-colors duration-500"
            style={{
              backgroundColor: activeTheme.colors.bgSubtle,
              borderColor: activeTheme.colors.border,
            }}
          >
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Question Text */}
                <div className="text-center space-y-3">
                  <h2 className="text-lg sm:text-2xl font-bold text-white px-2 leading-relaxed">
                    {currentQ?.question}
                  </h2>

                  {/* Flag Image Display with instant preloaded cache */}
                  {currentQ?.flagUrl && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex justify-center"
                    >
                      <img
                        src={currentQ.flagUrl}
                        alt="National Country Flag"
                        className="h-24 sm:h-32 rounded-xl shadow-xl border-2 border-white/20 object-cover"
                        loading="eager"
                      />
                    </motion.div>
                  )}

                  {/* World Map Radar Locator when continent is available */}
                  {currentQ?.countryData?.continent && (
                    <div className="flex justify-center py-0.5">
                      <WorldMapRadar activeContinent={currentQ.countryData.continent} />
                    </div>
                  )}

                  {/* Country Fact Sheet Button during gameplay */}
                  {currentQ?.countryData && isAnswered && (
                    <button
                      onClick={() => setInspectedCountry(currentQ.countryData)}
                      className="inline-flex items-center gap-1.5 bg-[#3B4275] hover:bg-[#4C5596] text-purple-200 text-xs px-3 py-1.5 rounded-xl border border-purple-400/30 font-semibold cursor-pointer transition-all"
                    >
                      <span>ℹ️ Explore {currentQ.countryData.name} Fact Sheet</span>
                    </button>
                  )}

                  {/* Hint Display */}
                  {showHint && currentQ?.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="note"
                      className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs px-4 py-1.5 rounded-xl"
                    >
                      💡 Hint: {currentQ.hint}
                    </motion.div>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                          className="py-3.5 px-4 rounded-2xl border border-dashed border-gray-700/40 opacity-20 pointer-events-none"
                        />
                      );
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        aria-pressed={isSelected}
                        className={`text-left p-3.5 sm:p-4 rounded-2xl border font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#BC6BE8] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-gray-300">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isAnswered && (isCorrectAnswer || isSelected) && (
                          <img
                            src={isCorrectAnswer ? CheckIcon : CrossIcon}
                            alt={isCorrectAnswer ? "Correct" : "Incorrect"}
                            className="w-4 h-4 flex-shrink-0 ml-2"
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
          </section>
        </main>
      )}

      {/* 4. RESULTS / COMPLETE SCREEN */}
      {gameState === "completed" && (
        <CompletePage
          score={score}
          totalQuestions={settings.mode === "survival" ? userAnswers.length : questions.length}
          userAnswers={userAnswers}
          questions={questions}
          maxStreak={maxStreak}
          isSurvivalMode={settings.mode === "survival"}
          survivedCount={userAnswers.length}
          onRestart={() => loadQuestions()}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onInspectCountry={(country) => setInspectedCountry(country)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onGoHome={() => setGameState("menu")}
        />
      )}

      {/* MODALS */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onThemeChange={(th) => setActiveThemeState(th)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
        onImportStats={handleImportStats}
        onPracticeWeakSpots={handlePracticeWeakSpots}
      />

      <CountryFactModal
        country={inspectedCountry}
        isOpen={!!inspectedCountry}
        onClose={() => setInspectedCountry(null)}
      />

      <StudyDeckModal
        isOpen={isStudyDeckOpen}
        onClose={() => setIsStudyDeckOpen(false)}
        onSelectCountryToQuiz={handleLaunchContinentQuiz}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        score={score}
        accuracy={currentAccuracy}
        rankTitle="Master Cartographer"
        modeTitle={getModeTitle()}
      />
    </div>
  );
}

export default App;
