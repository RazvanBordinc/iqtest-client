"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";

// Component for memory pair/triplet questions
const MemoryPairQuestion = memo(function MemoryPairQuestion({
  questionText,
  pairs,
  missingIndices,
  userAnswers = {},
  onAnswerChange,
  questionNumber,
  animateKey,
  showHint = false,
}) {
  const [focusedIndex, setFocusedIndex] = useState(null);

  // Calculate how many words are in each pair (2 for pairs, 3 for triplets)
  const pairSize = pairs && pairs.length > 0 ? pairs[0].length : 2;
  const isPair = pairSize === 2;
  const isTriplet = pairSize === 3;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`memory-${animateKey || questionNumber}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-6 leading-relaxed">
            {questionText}
          </h3>

          {showHint && (
            <motion.div
              className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {isPair
                    ? "Remember the pairs shown earlier. Complete each pair by entering the missing word."
                    : "Remember the triplets shown earlier. Complete each triplet by entering the missing word(s)."}
                </p>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            {pairs.map((pair, pairIndex) => (
              <div
                key={`pair-${pairIndex}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {pair.map((word, wordIndex) => {
                    const isMissing =
                      missingIndices[pairIndex]?.includes(wordIndex);
                    const inputId = `pair-${pairIndex}-word-${wordIndex}`;

                    // Determine if this is the last visible word before a missing word
                    const isLastVisibleBeforeMissing =
                      !isMissing &&
                      wordIndex < pair.length - 1 &&
                      missingIndices[pairIndex]?.includes(wordIndex + 1);

                    return (
                      <React.Fragment key={`word-${pairIndex}-${wordIndex}`}>
                        {isMissing ? (
                          <motion.div
                            className={`relative border ${
                              focusedIndex === inputId
                                ? "border-purple-500 ring-1 ring-purple-300 dark:ring-purple-800"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-md overflow-hidden flex-1 min-w-[120px]`}
                            animate={{
                              y: focusedIndex === inputId ? -2 : 0,
                              boxShadow:
                                focusedIndex === inputId
                                  ? "0 4px 10px rgba(124, 58, 237, 0.15)"
                                  : "none",
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <input
                              type="text"
                              id={inputId}
                              value={userAnswers[inputId] || ""}
                              onChange={(e) =>
                                onAnswerChange(inputId, e.target.value)
                              }
                              onFocus={() => setFocusedIndex(inputId)}
                              onBlur={() => setFocusedIndex(null)}
                              placeholder="Enter word"
                              className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-white border-none outline-none"
                            />

                            {focusedIndex === inputId && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                                layoutId="focus-line"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md text-gray-900 dark:text-white font-medium flex-1 min-w-[120px] text-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            {word}
                          </motion.div>
                        )}

                        {/* Show arrow between words */}
                        {wordIndex < pair.length - 1 && (
                          <div className="flex items-center justify-center sm:mx-2">
                            <ChevronRight className="text-gray-400 dark:text-gray-500 h-5 w-5" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default MemoryPairQuestion;
