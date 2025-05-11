"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye } from "lucide-react";
import MemoryPairQuestion from "../questions/MemoryPairQuestion";
import NavigationControls from "../NavigationControls";
import TestProgressBar from "../TestPorgressBar";

const MemoryTest = ({ onComplete }) => {
  // Test state
  const [phase, setPhase] = useState("memorization"); // memorization, recall
  const [currentSet, setCurrentSet] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(20); // Countdown timer for memorization phase
  const [testComplete, setTestComplete] = useState(false);

  // Sample memory sets - In a real app this would come from an API or props
  const memorySets = [
    {
      type: "pairs",
      pairs: [
        ["boat", "apple"],
        ["mountain", "coffee"],
        ["laptop", "forest"],
        ["bicycle", "ocean"],
      ],
      missingIndices: [
        [1], // "apple" is missing from first pair
        [0], // "mountain" is missing from second pair
        [1], // "forest" is missing from third pair
        [0], // "bicycle" is missing from fourth pair
      ],
      questionText: "Complete each pair by entering the missing word",
    },
    {
      type: "triplets",
      pairs: [
        ["goat", "steel", "house"],
        ["river", "pencil", "cloud"],
        ["candle", "guitar", "diamond"],
      ],
      missingIndices: [
        [1, 2], // "steel" and "house" are missing from first triplet
        [0, 2], // "river" and "cloud" are missing from second triplet
        [0, 1], // "candle" and "guitar" are missing from third triplet
      ],
      questionText: "Complete each triplet by entering the missing words",
    },
  ];

  // Start timer for memorization phase
  useEffect(() => {
    if (phase === "memorization" && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (phase === "memorization" && timer === 0) {
      // Automatically switch to recall phase when timer reaches 0
      setPhase("recall");
    }
  }, [phase, timer]);

  // Handle answer change for memory questions
  const handleAnswerChange = (inputId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSet]: {
        ...prev[currentSet],
        [inputId]: value,
      },
    }));
  };

  // Handle navigation
  const handleNext = () => {
    if (phase === "memorization") {
      // Skip timer and move to recall phase
      setPhase("recall");
    } else if (phase === "recall") {
      if (currentSet < memorySets.length - 1) {
        // Move to next memory set
        setCurrentSet(currentSet + 1);
        setPhase("memorization");
        setTimer(memorySets[currentSet + 1].type === "pairs" ? 15 : 25); // More time for triplets
      } else {
        // Test completed
        setTestComplete(true);
        if (onComplete) {
          onComplete(calculateScore());
        }
      }
    }
  };

  const handlePrevious = () => {
    // Previous usually disabled in memory tests, but implementation for consistency
    if (phase === "recall" && currentSet > 0) {
      setCurrentSet(currentSet - 1);
      setPhase("recall"); // Stay in recall phase for previous set
    }
  };

  // Check if all required answers are filled for current set
  const areAllAnswersFilled = () => {
    if (!answers[currentSet]) return false;

    const currentSetData = memorySets[currentSet];
    let allFilled = true;

    currentSetData.pairs.forEach((pair, pairIndex) => {
      currentSetData.missingIndices[pairIndex].forEach((wordIndex) => {
        const inputId = `pair-${pairIndex}-word-${wordIndex}`;
        if (!answers[currentSet]?.[inputId]?.trim()) {
          allFilled = false;
        }
      });
    });

    return allFilled;
  };

  // Calculate score
  const calculateScore = () => {
    let correctCount = 0;
    let totalQuestions = 0;

    memorySets.forEach((set, setIndex) => {
      set.pairs.forEach((pair, pairIndex) => {
        set.missingIndices[pairIndex].forEach((wordIndex) => {
          totalQuestions++;
          const inputId = `pair-${pairIndex}-word-${wordIndex}`;
          const userAnswer = answers[setIndex]?.[inputId]?.trim().toLowerCase();

          if (userAnswer === pair[wordIndex].toLowerCase()) {
            correctCount++;
          }
        });
      });
    });

    return Math.round((correctCount / totalQuestions) * 100);
  };

  const currentSetData = memorySets[currentSet];
  const isMemorizationPhase = phase === "memorization";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Memory & Recall Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Evaluate your short-term memory and information retention abilities
        </p>
      </motion.div>

      {/* Use our new TestProgressBar component */}
      <TestProgressBar
        total={questions.length}
        type="memory" // "verbal", "memory", "mixed"
      />

      {/* Main content */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {isMemorizationPhase ? (
            <motion.div
              key="memorization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                className="mb-6 text-purple-600 dark:text-purple-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-16 h-16 mx-auto" />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Memorize{" "}
                {currentSetData.type === "pairs"
                  ? "These Pairs"
                  : "These Triplets"}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You&apos;ll need to recall the missing{" "}
                {currentSetData.type === "pairs"
                  ? "word from each pair"
                  : "words from each triplet"}{" "}
                afterward
              </p>

              {/* Memory pairs or triplets to memorize */}
              <div className="grid gap-4 max-w-lg mx-auto mb-8">
                {currentSetData.pairs.map((pair, pairIndex) => (
                  <motion.div
                    key={`memorize-${pairIndex}`}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pairIndex * 0.15 }}
                  >
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {pair.map((word, wordIndex) => (
                        <React.Fragment key={`word-${pairIndex}-${wordIndex}`}>
                          <motion.div
                            className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md font-medium text-gray-900 dark:text-white shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {word}
                          </motion.div>

                          {wordIndex < pair.length - 1 && (
                            <div className="text-gray-400">→</div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timer display */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-purple-500" />
                <motion.div
                  className="text-xl font-bold text-purple-600 dark:text-purple-400"
                  key={timer}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {timer}s
                </motion.div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Take your time to memorize. The test will automatically continue
                in {timer} seconds...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MemoryPairQuestion
                questionText={currentSetData.questionText}
                pairs={currentSetData.pairs}
                missingIndices={currentSetData.missingIndices}
                userAnswers={answers[currentSet] || {}}
                onAnswerChange={handleAnswerChange}
                questionNumber={currentSet}
                showHint={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={currentSet === 0 || isMemorizationPhase}
          isNextDisabled={phase === "recall" && !areAllAnswersFilled()}
          isLastQuestion={
            currentSet === memorySets.length - 1 && phase === "recall"
          }
          nextText={
            isMemorizationPhase
              ? "I'm Ready"
              : currentSet < memorySets.length - 1
              ? "Next Set"
              : "Finish"
          }
        />
      </div>
    </div>
  );
};

export default MemoryTest;
