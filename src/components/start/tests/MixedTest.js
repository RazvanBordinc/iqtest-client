"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import MemoryPairQuestion from "../questions/MemoryPairQuestion";
import TestProgressBar from "../TestPorgressBar";
import NavigationControls from "../NavigationControls";

const MixedTest = ({ onComplete, questions = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [memoryPhase, setMemoryPhase] = useState("memorization"); // Only used for memory questions
  const [timer, setTimer] = useState(0); // For memory questions timer

  useEffect(() => {
    console.log("Mixed Test Questions:", questions);
  }, [questions]);

  // Get current question data
  const currentQuestionData = questions[currentQuestion] || {};

  // Handle memory question timer
  useEffect(() => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization" &&
      timer > 0
    ) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization" &&
      timer === 0
    ) {
      // Automatically switch to recall phase when timer reaches 0
      setMemoryPhase("recall");
    }
  }, [currentQuestionData, memoryPhase, timer]);

  // Initialize timer when moving to a memory question
  useEffect(() => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization"
    ) {
      setTimer(currentQuestionData.memorizationTime || 15);
    }
  }, [currentQuestion, currentQuestionData, memoryPhase]);

  // Handle option selection for multiple choice
  const handleOptionSelect = (index) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: index, type: "multiple-choice" },
    });
  };

  // Handle text input for fill-in-gap
  const handleTextInput = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: e.target.value, type: "fill-in-gap" },
    });
  };

  // Handle memory questions answers
  const handleMemoryAnswerChange = (inputId, value) => {
    // Create or update the memory answers object for current question
    const currentMemoryAnswers = answers[currentQuestion]?.value || {};

    setAnswers({
      ...answers,
      [currentQuestion]: {
        value: { ...currentMemoryAnswers, [inputId]: value },
        type: "memory-pair",
      },
    });
  };

  // Handle navigation
  const handleNext = () => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization"
    ) {
      // Skip timer and move to recall phase when pressing Next in memorization
      setMemoryPhase("recall");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);

      // Reset memory phase for next question if it's a memory type
      if (questions[currentQuestion + 1]?.type === "memory-pair") {
        setMemoryPhase("memorization");
      }
    } else {
      // Test completed
      setTestComplete(true);
      if (onComplete) {
        onComplete(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // Only allow going back if not in memory question or if in recall phase
      if (
        currentQuestionData?.type !== "memory-pair" ||
        memoryPhase === "recall"
      ) {
        setCurrentQuestion(currentQuestion - 1);

        // Reset memory phase if previous question is memory type
        if (questions[currentQuestion - 1]?.type === "memory-pair") {
          setMemoryPhase("recall"); // Always go to recall phase when going back
        }
      }
    }
  };

  // Get current answer based on question type
  const getCurrentAnswer = () => {
    const answerData = answers[currentQuestion];

    if (!answerData) {
      return currentQuestionData.type === "multiple-choice"
        ? null
        : currentQuestionData.type === "fill-in-gap"
        ? ""
        : {};
    }

    return answerData.value;
  };

  // Is next button enabled
  const isNextEnabled = () => {
    // For memory questions in memorization phase, always enable Next
    if (
      currentQuestionData.type === "memory-pair" &&
      memoryPhase === "memorization"
    ) {
      return true;
    }

    // For memory questions in recall phase, check if all fields are filled
    if (
      currentQuestionData.type === "memory-pair" &&
      memoryPhase === "recall"
    ) {
      // If no answers yet, disable
      if (!answers[currentQuestion]?.value) return false;

      let allFilled = true;

      // Check each required field
      currentQuestionData.pairs.forEach((pair, pairIndex) => {
        if (!currentQuestionData.missingIndices) return;

        currentQuestionData.missingIndices[pairIndex]?.forEach((wordIndex) => {
          const inputId = `pair-${pairIndex}-word-${wordIndex}`;
          if (!answers[currentQuestion]?.value[inputId]?.trim()) {
            allFilled = false;
          }
        });
      });

      return allFilled;
    }

    // For multiple choice, check if an option is selected
    if (currentQuestionData.type === "multiple-choice") {
      return typeof answers[currentQuestion]?.value === "number";
    }

    // For fill-in-gap, check if there's text
    if (currentQuestionData.type === "fill-in-gap") {
      return answers[currentQuestion]?.value?.trim().length > 0;
    }

    return false;
  };

  // Calculate question component key for animations
  const getQuestionKey = () => {
    if (currentQuestionData.type === "memory-pair") {
      return `memory-${currentQuestion}-${memoryPhase}`;
    }
    return `question-${currentQuestion}`;
  };

  // Get next button text
  const getNextButtonText = () => {
    if (
      currentQuestionData.type === "memory-pair" &&
      memoryPhase === "memorization"
    ) {
      return "I'm Ready";
    }
    return currentQuestion === questions.length - 1 ? "Finish" : "Next";
  };

  // Render memory question in memorization phase
  const renderMemorizationPhase = () => {
    const { pairs } = currentQuestionData;
    if (!pairs || pairs.length === 0) return null;

    return (
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
          <Sparkles className="w-16 h-16 mx-auto" />
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Memorize {pairs[0]?.length === 2 ? "These Pairs" : "These Triplets"}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You&apos;ll need to recall the missing{" "}
          {pairs[0]?.length === 2
            ? "word from each pair"
            : "words from each triplet"}{" "}
          afterward
        </p>

        {/* Memory pairs or triplets to memorize */}
        <div className="grid gap-4 max-w-lg mx-auto mb-8">
          {pairs.map((pair, pairIndex) => (
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

        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Take your time to memorize. The test will automatically continue in{" "}
          {timer} seconds...
        </p>
      </motion.div>
    );
  };

  // Render appropriate question component based on type
  const renderQuestion = () => {
    // If memory question in memorization phase
    if (
      currentQuestionData.type === "memory-pair" &&
      memoryPhase === "memorization"
    ) {
      return renderMemorizationPhase();
    }

    // If memory question in recall phase
    if (
      currentQuestionData.type === "memory-pair" &&
      memoryPhase === "recall"
    ) {
      return (
        <MemoryPairQuestion
          questionText={currentQuestionData.text}
          pairs={currentQuestionData.pairs}
          missingIndices={currentQuestionData.missingIndices}
          userAnswers={getCurrentAnswer()}
          onAnswerChange={handleMemoryAnswerChange}
          questionNumber={currentQuestion}
          showHint={true}
        />
      );
    }

    // Multiple choice question
    if (currentQuestionData.type === "multiple-choice") {
      return (
        <MultipleChoiceQuestion
          question={currentQuestionData.text}
          options={currentQuestionData.options}
          selectedOption={getCurrentAnswer()}
          onSelectOption={handleOptionSelect}
          questionNumber={currentQuestion}
          animateKey={getQuestionKey()}
        />
      );
    }

    // Fill in gap question
    if (currentQuestionData.type === "fill-in-gap") {
      return (
        <FillInGapQuestion
          question={currentQuestionData.text}
          currentAnswer={getCurrentAnswer()}
          onAnswerChange={handleTextInput}
          questionNumber={currentQuestion}
          animateKey={getQuestionKey()}
        />
      );
    }

    return null;
  };

  // Category indicator styles
  const getCategoryIndicatorStyles = (category) => {
    switch (category) {
      case "numerical":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "verbal":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "memory":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    }
  };

  // Handle missing or empty questions
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No questions available for this test.
        </p>
        <button
          onClick={() => onComplete({})}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
          Comprehensive IQ Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          A balanced assessment combining multiple cognitive domains
        </p>
      </motion.div>

      {/* Question type indicator */}
      <div className="mb-4 flex justify-center">
        <span
          className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getCategoryIndicatorStyles(
            currentQuestionData.category
          )}`}
        >
          {currentQuestionData.category === "numerical"
            ? "Numerical Reasoning"
            : currentQuestionData.category === "verbal"
            ? "Verbal Intelligence"
            : "Memory & Recall"}
        </span>
      </div>

      {/* Progress bar */}
      <TestProgressBar
        current={currentQuestion} // For numerical/verbal tests
        total={questions.length}
        type="mixed" // "verbal", "memory", "mixed"
      />

      {/* Question */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={getQuestionKey()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={
            currentQuestion === 0 ||
            (currentQuestionData.type === "memory-pair" &&
              memoryPhase === "memorization")
          }
          isNextDisabled={!isNextEnabled()}
          isLastQuestion={currentQuestion === questions.length - 1}
          nextText={getNextButtonText()}
        />
      </div>
    </div>
  );
};

export default MixedTest;
