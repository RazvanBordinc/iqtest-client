// components/BackgroundParticles.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundParticles() {
  return (
    <AnimatePresence>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-gray-200"
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
          }}
        />
      ))}
    </AnimatePresence>
  );
}
