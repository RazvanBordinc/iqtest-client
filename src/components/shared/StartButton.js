"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";

// Using memo to prevent unnecessary re-renders
const StartButton = memo(function StartButton({ showButton }) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.3,
          }}
          className="mt-10"
        >
          <Link href="/start" passHref>
            <motion.div
              className="relative group cursor-pointer"
              whileHover="hover"
            >
              {/* Animated background particles - only rendered when hovered */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-white dark:bg-gray-300 opacity-20"
                  initial={{
                    top: "50%",
                    left: "50%",
                    scale: 0,
                  }}
                  variants={{
                    hover: {
                      scale: Math.random() * 0.8 + 0.5,
                      top: `${Math.random() * 140 - 20}%`,
                      left: `${Math.random() * 140 - 20}%`,
                      transition: {
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    },
                  }}
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                  }}
                />
              ))}

              <motion.button
                className="bg-black dark:bg-gray-900 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center justify-center gap-3 relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(138, 43, 226, 0.7)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulsing gradient border */}
                <motion.div
                  className="absolute -inset-[1px] rounded-full z-0"
                  variants={{
                    hover: {
                      background: [
                        "linear-gradient(90deg, #8A2BE2, #4B0082, #8A2BE2)",
                        "linear-gradient(180deg, #8A2BE2, #4B0082, #8A2BE2)",
                        "linear-gradient(270deg, #8A2BE2, #4B0082, #8A2BE2)",
                        "linear-gradient(360deg, #8A2BE2, #4B0082, #8A2BE2)",
                        "linear-gradient(90deg, #8A2BE2, #4B0082, #8A2BE2)",
                      ],
                    },
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Background layer */}
                <motion.div className="absolute inset-[2px] bg-black dark:bg-gray-900 rounded-full z-10" />

                {/* Brain icon with animated glow */}
                <motion.div
                  className="relative z-20"
                  variants={{
                    hover: {
                      rotate: [0, -10, 10, -5, 5, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                      },
                    },
                  }}
                >
                  <BrainCircuit className="w-6 h-6 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 bg-purple-500 rounded-full blur-md"
                    variants={{
                      hover: {
                        opacity: [0, 0.7, 0],
                        scale: [0.8, 1.2, 0.8],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                        },
                      },
                    }}
                    style={{ opacity: 0 }}
                  />
                </motion.div>

                {/* Text with subtle animation */}
                <motion.span
                  variants={{
                    hover: {
                      letterSpacing: "0.05em",
                    },
                  }}
                  className="relative z-20 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
                >
                  Start IQ Test
                </motion.span>

                {/* Arrow with animation */}
                <motion.div
                  variants={{
                    hover: {
                      x: [0, 5, 0],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                      },
                    },
                  }}
                  className="relative z-20"
                >
                  <ArrowRight className="w-6 h-6 text-purple-400" />
                </motion.div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 translate-x-[-100%] translate-y-[-100%] bg-gradient-to-br from-transparent via-white to-transparent opacity-20 skew-x-[20deg] z-20"
                  variants={{
                    hover: {
                      translateX: "200%",
                      translateY: "200%",
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      },
                    },
                  }}
                />
              </motion.button>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default StartButton;
