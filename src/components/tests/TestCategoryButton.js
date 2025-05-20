"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, ListChecks, TrendingUp, Lock, CheckCircle, Star } from "lucide-react";
import { checkTestAvailability } from "@/fetch/tests";

export default function TestCategoryButton({ category, onSelect, isMobile, refreshKey = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [availability, setAvailability] = useState({ canTake: true, timeUntilNext: null });
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  // Check test availability on mount or when refreshKey changes
  useEffect(() => {
    async function checkAvailability() {
      try {
        setLoading(true);
        const result = await checkTestAvailability(category.id);
        setAvailability(result);
      } catch (error) {
        console.error("Error checking test availability:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAvailability();
  }, [category.id, refreshKey]);
  
  // Update timer display
  useEffect(() => {
    if (!availability.canTake && availability.timeUntilNext) {
      const timer = setInterval(() => {
        const seconds = Math.max(0, Math.floor(availability.timeUntilNext));
        if (seconds <= 0) {
          setAvailability({ canTake: true, timeUntilNext: null });
          clearInterval(timer);
          return;
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${secs}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${secs}s`);
        } else {
          setTimeLeft(`${secs}s`);
        }
        
        if (availability.timeUntilNext > 0) {
          availability.timeUntilNext -= 1;
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [availability]);
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const Icon = category.icon;

  // Simplified animations for mobile devices
  if (isMobile) {
    return (
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 relative overflow-hidden ${
          availability.canTake ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        variants={itemVariants}
        onClick={availability.canTake ? onSelect : undefined}
        whileTap={availability.canTake ? { scale: 0.97 } : {}}
        style={{ touchAction: "manipulation" }}
      >
        {!availability.canTake && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center shadow-xl">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Test Locked</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Available in</p>
              <p className="text-lg font-bold text-red-500">{timeLeft}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 shadow-md relative`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {category.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {category.description}
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ListChecks className="w-3 h-3 mr-1" />
              <span>{category.id === "number-logic" ? "20" : category.id === "word-logic" ? "20" : category.id === "memory" ? "15" : "16"}Q</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{category.id === "number-logic" ? "12" : category.id === "word-logic" ? "15" : category.id === "memory" ? "10" : "20"}min</span>
            </div>
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              <span>{category.id === "mixed" ? "5/5" : "3/5"}</span>
            </div>
          </div>

          {/* Action hint */}
          <div className="mt-3 text-xs font-medium">
            {availability.canTake ? (
              <span className="text-purple-600 dark:text-purple-400">Tap to select</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Complete 24h cooldown</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop version with rich animations
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden h-full ${
        availability.canTake ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      variants={itemVariants}
      onHoverStart={() => availability.canTake && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={availability.canTake ? {
        y: -6,
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        borderColor: "rgb(139, 92, 246)",
        transition: { duration: 0.3 },
      } : {}}
      whileTap={availability.canTake ? { scale: 0.98 } : {}}
      onClick={availability.canTake ? onSelect : undefined}
    >
      {!availability.canTake && (
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Test Locked</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available in</p>
            <p className="text-2xl font-bold text-red-500">{timeLeft}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">24 hour cooldown active</p>
          </motion.div>
        </div>
      )}

      {/* Background elements */}
      <motion.div
        className="absolute top-0 right-0 w-48 h-48 -mt-16 -mr-16 rounded-full opacity-[0.07]"
        style={{
          background: `radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(0,0,0,0) 70%)`,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.12 : 0.07,
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="p-6 relative z-10 h-full flex flex-col">
        {/* Icon */}
        <div className="flex items-center mb-5">
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg relative`}
            whileHover={availability.canTake ? { scale: 1.05 } : {}}
            animate={{
              y: availability.canTake && isHovered ? [0, -4, 0] : 0,
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
            }}
          >
            <Icon className="w-8 h-8 text-white" />

            {/* Orbital effect on hover */}
            {isHovered && (
              <motion.div
                className="absolute w-full h-full rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  boxShadow: [
                    "0 0 0 0px rgba(255,255,255,0.4)",
                    "0 0 0 10px rgba(255,255,255,0)",
                    "0 0 0 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              />
            )}
          </motion.div>

          <div className="ml-4 flex-1">
            <motion.h3
              className="text-xl font-bold text-gray-900 dark:text-white mb-1"
              animate={{
                x: isHovered ? 4 : 0,
                color: isHovered && availability.canTake ? "rgb(139, 92, 246)" : "",
              }}
              transition={{ duration: 0.3 }}
            >
              {category.title}
            </motion.h3>

            {/* Stats row */}
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <ListChecks className="w-3 h-3 mr-1" />
                <span>{category.id === "number-logic" ? "20" : category.id === "word-logic" ? "20" : category.id === "memory" ? "15" : "16"} Questions</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{category.id === "number-logic" ? "12" : category.id === "word-logic" ? "15" : category.id === "memory" ? "10" : "20"} minutes</span>
              </div>
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                <span>{category.id === "mixed" ? "5" : "3"}/5 Difficulty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded description */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow"
          animate={{
            opacity: isHovered ? 1 : 0.9,
          }}
        >
          {isHovered ? category.longDescription : category.description}
        </motion.p>

        {/* Bottom action row */}
        <motion.div
          className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <motion.div
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
            animate={{ opacity: isHovered ? 0 : 1 }}
          >
            {availability.canTake ? (
              <>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (category.id === "mixed" ? 5 : 3)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                <span>Temporarily Locked</span>
              </>
            )}
          </motion.div>

          {availability.canTake ? (
            <motion.div
              className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              <span>Select Test</span>
              <motion.span
                animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                →
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1"
              animate={{ opacity: 1 }}
            >
              <Lock className="w-3 h-3" />
              <span className="text-xs">Cooldown Active</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
