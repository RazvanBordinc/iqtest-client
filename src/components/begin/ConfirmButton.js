"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const ConfirmButton = memo(function ConfirmButton({
  showButton,
  handleConfirm,
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`absolute right-2 bottom-1/2 translate-y-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          initial={{ width: 0, height: 0, opacity: 0, scale: 0 }}
          animate={{
            width: "2.5rem",
            height: "2.5rem",
            opacity: 1,
            scale: 1,
          }}
          exit={{ width: 0, height: 0, opacity: 0, scale: 0 }}
          transition={{
            duration: 0.4,
            type: "spring",
            damping: 15,
            stiffness: 150
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 opacity-50"
          />
          
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(147, 51, 234, 0.4)",
                "0 0 0 10px rgba(147, 51, 234, 0)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          
          <motion.div
            className="z-10 text-sm text-white font-black"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
          >
            {isLoading ? '•••' : '✓'}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

export default ConfirmButton;