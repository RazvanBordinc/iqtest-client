"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Using memo to prevent unnecessary re-renders
const ConfirmButton = memo(function ConfirmButton({
  showButton,
  handleConfirm,
}) {
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          onClick={handleConfirm}
          className="absolute right-2 bottom-1/2 translate-y-1/2 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: "2.5rem",
            height: "2.5rem",
            opacity: 1,
            boxShadow: [
              "0 0 0 0 rgba(0,0,0,0)",
              "0 0 0 4px rgba(0,0,0,0.1)",
              "0 0 0 0 rgba(0,0,0,0)",
            ],
          }}
          exit={{ width: 0, height: 0, opacity: 0 }}
          transition={{
            duration: 0.5,
            boxShadow: { repeat: Infinity, duration: 2 },
          }}
          whileHover={{
            scale: 1.1,
            backgroundColor: "#333",
          }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-600 opacity-50"
          />
          <motion.div
            className="z-10 text-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✓
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

export default ConfirmButton;
