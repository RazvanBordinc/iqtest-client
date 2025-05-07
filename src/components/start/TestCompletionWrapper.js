"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, CheckCircle } from "lucide-react";

/**
 * Wrapper component that handles test completion animations
 * and transitions to the results page
 */
const TestCompletionWrapper = ({
  children,
  onComplete,
  testType = "numerical",
  score = null,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Get gradient and icon based on test type
  const getTypeInfo = () => {
    switch (testType) {
      case "numerical":
        return {
          color:
            "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        };
      case "verbal":
        return {
          color:
            "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
          bg: "bg-green-50 dark:bg-green-900/20",
        };
      case "memory":
        return {
          color:
            "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
          bg: "bg-amber-50 dark:bg-amber-900/20",
        };
      case "mixed":
        return {
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
        };
      default:
        return {
          color:
            "from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600",
          bg: "bg-purple-50 dark:bg-purple-900/20",
        };
    }
  };

  const typeInfo = getTypeInfo();

  // Handler for test completion
  const handleComplete = useCallback(
    (completionData) => {
      // Start animation sequence
      setShowAnimation(true);

      // After animation, call the actual completion handler
      setTimeout(() => {
        setAnimationComplete(true);

        // Small delay before calling onComplete to ensure animations finish
        setTimeout(() => {
          if (onComplete && typeof onComplete === "function") {
            onComplete(completionData.score || score);
          }
        }, 500);
      }, 2000); // Animation duration
    },
    [onComplete, score]
  );

  return (
    <div className="relative w-full h-full">
      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showAnimation && (
          <motion.div
            key="test-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pass handleComplete to children */}
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, { onComplete: handleComplete })
                : child
            )}
          </motion.div>
        )}

        {/* Completion animation */}
        {showAnimation && !animationComplete && (
          <motion.div
            key="completion-animation"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`p-10 rounded-xl ${typeInfo.bg} flex flex-col items-center justify-center`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  <motion.div
                    className={`w-24 h-24 rounded-full bg-gradient-to-r ${typeInfo.color} flex items-center justify-center`}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(79, 70, 229, 0.5)",
                        "0 0 0 15px rgba(79, 70, 229, 0)",
                        "0 0 0 0 rgba(79, 70, 229, 0)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: 1,
                      repeatType: "loop",
                      delay: 1,
                    }}
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Particle effects */}
                  <motion.div
                    className="absolute -top-4 -right-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-3"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Award className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.h2
                className="mt-6 text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Test Complete!
              </motion.h2>

              <motion.p
                className="mt-2 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Calculating your results...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestCompletionWrapper;
