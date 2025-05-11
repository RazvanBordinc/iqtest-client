"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye } from "lucide-react";
import MemoryPairQuestion from "../questions/MemoryPairQuestion";
import NavigationControls from "../NavigationControls";
import TestProgressBar from "../TestPorgressBar";

const MemoryTest = ({ onComplete, questions = [] }) => {
  // Test state
  const [phase, setPhase] = useState("memorization"); // memorization, recall
  const [currentSet, setCurrentSet] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(20); // Countdown timer for memorization phase
  const [errorState, setErrorState] = useState(false);
  const [currentSetData, setCurrentSetData] = useState(null);

  // Extract memory sets from questions
  const memorySets = questions.filter((q) => q.type === "memory-pair");

  // Set current memory set data
  useEffect(() => {
    if (memorySets && memorySets.length > currentSet) {
      setCurrentSetData(memorySets[currentSet]);
    } else {
      setErrorState(true);
    }
  }, [currentSet, memorySets]);

  // Start timer for memorization phase
  useEffect(() => {
    if (phase === "memorization" && timer > 0 && currentSetData) {
      // Use the memorization time from the question
      if (timer === 20 && currentSetData.memorizationTime) {
        setTimer(currentSetData.memorizationTime);
      }

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Move to recall phase when timer reaches 0
            setPhase("recall");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [phase, timer, currentSetData]);

  // Reset timer when moving to new set
  useEffect(() => {
    if (currentSetData && currentSetData.memorizationTime) {
      setTimer(currentSetData.memorizationTime);
    }
  }, [currentSet, currentSetData]);

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
        setTimer(memorySets[currentSet + 1].memorizationTime || 20);
      } else {
        // Test completed - send answers to parent
        if (onComplete) {
          onComplete(answers);
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
    if (!answers[currentSet] || !currentSetData) return false;

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

  const isMemorizationPhase = phase === "memorization";

  // If no questions are provided or error state is true, show error UI
  if (!questions || questions.length === 0 || errorState) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No questions available for this test.
        </p>
        <button
          onClick={() => onComplete([])}
          className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Return
        </button>
      </div>
    );
  }

  // If no valid current set data, show error UI
  if (!currentSetData) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No memory questions available.
        </p>
        <button
          onClick={() => onComplete([])}
          className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Return
        </button>
      </div>
    );
  }

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

      {/* Progress bar for memory tests */}
      <TestProgressBar
        current={currentSet}
        total={memorySets.length}
        type="memory"
        phase={phase}
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
                {currentSetData.pairs[0]?.length === 2
                  ? "These Pairs"
                  : "These Triplets"}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You&apos;ll need to recall the missing{" "}
                {currentSetData.pairs[0]?.length === 2
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
                questionText={currentSetData.text}
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
          testType="memory"
        />
      </div>
    </div>
  );
};

export default MemoryTest;
