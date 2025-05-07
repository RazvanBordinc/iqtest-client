"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

// Using memo for better performance
const BackgroundParticles = memo(function BackgroundParticles({ count = 20 }) {
  const { mounted } = useTheme();

  // Don't render until mounted on client
  if (!mounted) return null;

  // Use a fixed array with deterministic values to avoid hydration errors
  const particles = [
    { id: 1, size: 4, left: 13, top: 27, opacity: 0.3 },
    { id: 2, size: 6, left: 26, top: 54, opacity: 0.2 },
    { id: 3, size: 3, left: 41, top: 12, opacity: 0.4 },
    { id: 4, size: 5, left: 67, top: 38, opacity: 0.3 },
    { id: 5, size: 7, left: 82, top: 71, opacity: 0.2 },
    { id: 6, size: 4, left: 19, top: 83, opacity: 0.3 },
    { id: 7, size: 5, left: 33, top: 47, opacity: 0.2 },
    { id: 8, size: 6, left: 52, top: 29, opacity: 0.4 },
    { id: 9, size: 3, left: 74, top: 56, opacity: 0.2 },
    { id: 10, size: 5, left: 88, top: 19, opacity: 0.3 },
    { id: 11, size: 4, left: 9, top: 65, opacity: 0.4 },
    { id: 12, size: 7, left: 61, top: 76, opacity: 0.2 },
    { id: 13, size: 3, left: 42, top: 94, opacity: 0.3 },
    { id: 14, size: 5, left: 57, top: 35, opacity: 0.2 },
    { id: 15, size: 6, left: 79, top: 8, opacity: 0.4 },
    { id: 16, size: 4, left: 23, top: 43, opacity: 0.3 },
    { id: 17, size: 5, left: 95, top: 61, opacity: 0.2 },
    { id: 18, size: 3, left: 37, top: 26, opacity: 0.4 },
    { id: 19, size: 6, left: 71, top: 49, opacity: 0.3 },
    { id: 20, size: 4, left: 48, top: 81, opacity: 0.2 },
    { id: 21, size: 7, left: 15, top: 32, opacity: 0.4 },
    { id: 22, size: 3, left: 63, top: 17, opacity: 0.3 },
    { id: 23, size: 5, left: 85, top: 73, opacity: 0.2 },
    { id: 24, size: 4, left: 29, top: 91, opacity: 0.4 },
    { id: 25, size: 6, left: 54, top: 11, opacity: 0.3 },
    { id: 26, size: 3, left: 77, top: 39, opacity: 0.2 },
    { id: 27, size: 5, left: 12, top: 58, opacity: 0.4 },
    { id: 28, size: 7, left: 91, top: 24, opacity: 0.3 },
    { id: 29, size: 4, left: 39, top: 67, opacity: 0.2 },
    { id: 30, size: 5, left: 68, top: 86, opacity: 0.4 },
  ];

  // Limit to the requested count
  const visibleParticles = particles.slice(0, count);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <AnimatePresence>
        {visibleParticles.map((particle) => (
          <motion.div
            key={`bg-particle-${particle.id}`}
            className="absolute rounded-full bg-gray-200 dark:bg-gray-700"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              opacity: particle.opacity,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: particle.opacity,
              y: [0, -8, 0, 8, 0],
              x: [0, 5, 0, -5, 0],
            }}
            transition={{
              opacity: { duration: 1 },
              y: {
                repeat: Infinity,
                duration: 10 + (particle.id % 10),
                ease: "easeInOut",
              },
              x: {
                repeat: Infinity,
                duration: 15 + (particle.id % 8),
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default BackgroundParticles;
