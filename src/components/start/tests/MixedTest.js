"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import FillInGapQuestion from "../questions/FillInGapQuestion";
import MemoryPairQuestion from "../questions/MemoryPairQuestion";
import TestProgressBar from "../TestProgressBar";
import NavigationControls from "../NavigationControls";

const MixedTest = ({ onComplete, questions = [] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [memoryPhase, setMemoryPhase] = useState("memorization"); // Only used for memory questions
  const [timer, setTimer] = useState(0); // For memory questions timer
  
  // Effect to handle timer expiration
  useEffect(() => {
    const checkTimeExpiration = () => {
      if (window.testRemainingTime !== undefined && window.testRemainingTime <= 0) {
        // Submit whatever answers we have
        const finalAnswers = Object.entries(answers).map(([index, answer]) => ({
          ...answer,
          questionIndex: parseInt(index),
        }));
        onComplete(finalAnswers);
      }
    };
    
    const interval = setInterval(checkTimeExpiration, 1000);
    return () => clearInterval(interval);
  }, [answers, onComplete]);

  useEffect(() => {
    console.log("Mixed Test Questions:", questions);
  }, [questions]);

  // Get current question data
  const currentQuestionData = React.useMemo(() => questions[currentQuestion] || {}, [questions, currentQuestion]);

  // Handle memory question timer
  useEffect(() => {
    if (
      currentQuestionData?.type === "memory-pair" &&
      memoryPhase === "memorization" &&
      timer > 0
    ) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setMemoryPhase("recall");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [currentQuestionData?.type, memoryPhase, timer]);

  // Reset memory phase when moving to a new memory question
  useEffect(() => {
    if (currentQuestionData?.type === "memory-pair") {
      setMemoryPhase("memorization");
      setTimer(currentQuestionData.memorizationTime || 10);
    }
  }, [currentQuestion, currentQuestionData?.type, currentQuestionData?.memorizationTime]);

  // If no questions are provided, show error
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No questions available for this test.
        </p>
        <button
          onClick={() => onComplete([])}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Return
        </button>
      </div>
    );
  }

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

  // Handle memory pair answer
  const handleMemoryAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: { value: answer, type: "memory-pair" },
    });
  };

  // Calculate score and prepare answers for submission
  const calculateScore = () => {
    // Convert answers object to array format for backend submission
    const formattedAnswers = [];
    
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      
      if (userAnswer) {
        // Only include non-null values (skip empty questions)
        if (userAnswer.type !== "skipped" && userAnswer.value !== null) {
          formattedAnswers.push({
            questionIndex: index,
            value: userAnswer.value,
            type: userAnswer.type
          });
        }
      }
    });

    // Return formatted answers for submission to backend
    return formattedAnswers;
  };

  // Handle navigation - Modified to support completion and skipping
  const handleNext = ({ isCompletion, isSkip } = {}) => {
    // If skipping, mark the question as skipped
    if (isSkip && !answers[currentQuestion]) {
      setAnswers({
        ...answers,
        [currentQuestion]: { value: null, type: "skipped" },
      });
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed - send answers to parent
      const finalAnswers = calculateScore();

      if (onComplete) {
        onComplete(finalAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get current answer based on question type
  const getCurrentAnswer = () => {
    const answerData = answers[currentQuestion];

    if (!answerData) {
      return currentQuestionData.type === "multiple-choice" ? null : "";
    }

    return answerData.value;
  };

  // Check if current question has been answered
  const hasAnswer = () => {
    const answerData = answers[currentQuestion];
    if (!answerData || answerData.type === "skipped") return false;
    
    if (currentQuestionData.type === "multiple-choice") {
      return typeof answerData.value === "number";
    } else if (currentQuestionData.type === "fill-in-gap") {
      return answerData.value?.trim().length > 0;
    } else if (currentQuestionData.type === "memory-pair") {
      return answerData.value !== null && answerData.value !== undefined;
    }
    
    return false;
  };

  // Render question based on type
  const renderQuestion = () => {
    switch (currentQuestionData.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestionData.text}
            options={currentQuestionData.options}
            selectedOption={getCurrentAnswer()}
            onSelectOption={handleOptionSelect}
            questionNumber={currentQuestion}
          />
        );
      case "fill-in-gap":
        return (
          <FillInGapQuestion
            question={currentQuestionData.text}
            currentAnswer={getCurrentAnswer()}
            onAnswerChange={handleTextInput}
            questionNumber={currentQuestion}
          />
        );
      case "memory-pair":
        return (
          <MemoryPairQuestion
            question={currentQuestionData.text}
            pairs={currentQuestionData.pairs}
            memoryDuration={currentQuestionData.memorizationTime}
            onAnswer={handleMemoryAnswer}
            phase={memoryPhase}
            timer={timer}
            onPhaseComplete={() => setMemoryPhase("recall")}
          />
        );
      default:
        // Fallback to multiple choice if type is not recognized
        return (
          <MultipleChoiceQuestion
            question={currentQuestionData.text || "Question not available"}
            options={currentQuestionData.options || ["Option A", "Option B", "Option C", "Option D"]}
            selectedOption={getCurrentAnswer()}
            onSelectOption={handleOptionSelect}
            questionNumber={currentQuestion}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comprehensive IQ Test
          </h2>
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          A comprehensive test combining numerical, verbal, and memory challenges
        </p>
      </motion.div>

      <TestProgressBar
        current={currentQuestion}
        total={questions.length}
        type="mixed"
      />

      {/* Question content */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Updated navigation controls with skip functionality */}
        <NavigationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          isPreviousDisabled={currentQuestion === 0}
          isNextDisabled={false} // Never disable - allow skipping
          isLastQuestion={currentQuestion === questions.length - 1}
          testType="mixed"
          hasAnswer={hasAnswer()}
          enableKeyboard={true}
        />
      </div>
    </div>
  );
};

export default MixedTest;