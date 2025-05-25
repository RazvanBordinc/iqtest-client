"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

const FullScreenLoader = ({ isLoading, text = "Processing..." }) => {
  // Neuron connection points
  const neurons = [
    { x: 20, y: 20, delay: 0 },
    { x: 80, y: 15, delay: 0.2 },
    { x: 15, y: 80, delay: 0.4 },
    { x: 85, y: 85, delay: 0.6 },
    { x: 50, y: 50, delay: 0.1 },
    { x: 35, y: 65, delay: 0.3 },
    { x: 65, y: 35, delay: 0.5 },
    { x: 25, y: 50, delay: 0.7 },
    { x: 75, y: 50, delay: 0.8 },
    { x: 50, y: 25, delay: 0.9 },
    { x: 50, y: 75, delay: 1.0 },
  ];

  const connections = [
    { from: 0, to: 4 },
    { from: 1, to: 4 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 7 },
    { from: 6, to: 8 },
    { from: 4, to: 9 },
    { from: 4, to: 10 },
    { from: 7, to: 10 },
    { from: 8, to: 9 },
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(12px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Neural network animation */}
            <div className="relative w-80 h-80 mb-8">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                {/* Animated connections */}
                {connections.map((connection, index) => {
                  const from = neurons[connection.from];
                  const to = neurons[connection.to];
                  return (
                    <motion.line
                      key={`connection-${index}`}
                      x1={from.x}
                      y1={from.y}
                      x2={from.x}
                      y2={from.y}
                      stroke="url(#gradient)"
                      strokeWidth="0.5"
                      opacity="0.3"
                      animate={{
                        x2: to.x,
                        y2: to.y,
                        opacity: [0.1, 0.6, 0.1],
                      }}
                      transition={{
                        x2: { duration: 1, delay: index * 0.1 },
                        y2: { duration: 1, delay: index * 0.1 },
                        opacity: {
                          duration: 2,
                          delay: index * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                    />
                  );
                })}

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(147 51 234)" />
                    <stop offset="100%" stopColor="rgb(99 102 241)" />
                  </linearGradient>
                </defs>

                {/* Animated neurons */}
                {neurons.map((neuron, index) => (
                  <motion.circle
                    key={`neuron-${index}`}
                    cx={neuron.x}
                    cy={neuron.y}
                    r="2"
                    className="fill-purple-600 dark:fill-purple-400"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      delay: neuron.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </svg>

              {/* Central brain icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                }}
              >
                <Brain className="w-16 h-16 text-purple-600 dark:text-purple-400" />
              </motion.div>

              {/* Orbiting particles */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute top-1/2 left-1/2 w-full h-full"
                  style={{ transform: "translate(-50%, -50%)" }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{
                      top: "0%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Text with animated background */}
            <motion.div
              className="relative px-8 py-4 rounded-full overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />

              {/* Text content */}
              <div className="relative z-10 flex items-center gap-3">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"
                      animate={{
                        y: ["0%", "-50%", "0%"],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
                <motion.p
                  className="text-lg font-medium text-gray-800 dark:text-gray-200"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {text}
                </motion.p>
              </div>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ width: "50%" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoader;