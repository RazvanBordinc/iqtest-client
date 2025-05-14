"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ error, type = "error" }) {
  const bgColor = type === "error" 
    ? "bg-red-50 dark:bg-red-950/50" 
    : "bg-yellow-50 dark:bg-yellow-950/50";
  
  const borderColor = type === "error"
    ? "border-red-200 dark:border-red-800"
    : "border-yellow-200 dark:border-yellow-800";
    
  const iconColor = type === "error"
    ? "text-red-600 dark:text-red-400"
    : "text-yellow-600 dark:text-yellow-400";
    
  const textColor = type === "error"
    ? "text-red-700 dark:text-red-300"
    : "text-yellow-700 dark:text-yellow-300";

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`${bgColor} ${borderColor} border rounded-lg p-3 mb-4 flex items-start`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 15 }}
            className="mr-3"
          >
            <AlertCircle className={`w-5 h-5 ${iconColor}`} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm ${textColor} flex-1`}
          >
            {error}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}