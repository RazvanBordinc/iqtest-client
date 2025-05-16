"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

// Using memo to prevent unnecessary re-renders
const ConfirmButton = memo(function ConfirmButton({
  showButton,
  handleConfirm,
  isLoading = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  // Create sparkle particles on hover
  const createParticles = () => {
    if (!isHovered) return;
    const newParticles = Array(5).fill().map((_, i) => ({
      id: Date.now() + i,
      angle: (360 / 5) * i + Math.random() * 30 - 15,
      distance: 30 + Math.random() * 20,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          className="absolute right-3 bottom-1/2 translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, type: "spring", damping: 15 }}
        >
          <motion.button
            onClick={handleConfirm}
            disabled={isLoading}
            onMouseEnter={() => {
              setIsHovered(true);
              createParticles();
            }}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center overflow-visible cursor-pointer shadow-lg hover:shadow-xl transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: isHovered
                  ? [
                      "0 0 20px rgba(147, 51, 234, 0.5)",
                      "0 0 40px rgba(147, 51, 234, 0.3)",
                      "0 0 20px rgba(147, 51, 234, 0.5)",
                    ]
                  : "0 0 0px rgba(147, 51, 234, 0)",
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Pulse rings */}
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-purple-400"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-purple-400"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Sparkle particles */}
            <AnimatePresence>
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
                    y: Math.sin(particle.angle * Math.PI / 180) * particle.distance,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Icon animation */}
            <motion.div
              className="z-10 relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                </motion.div>
              ) : (
                <motion.div
                  animate={isHovered ? {
                    x: [0, 2, 0],
                    transition: { duration: 0.5, repeat: Infinity }
                  } : {}}
                >
                  {isHovered ? (
                    <ArrowRight className="w-5 h-5" />
                  ) : (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Hover text */}
            <AnimatePresence>
              {isHovered && !isLoading && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                    Continue
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ConfirmButton;