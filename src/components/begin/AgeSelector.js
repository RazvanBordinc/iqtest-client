// components/AgeSelector.js
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function AgeSelector({ age, setAge }) {
  const incrementAge = () => setAge((prev) => Math.min(prev + 1, 99));
  const decrementAge = () => setAge((prev) => Math.max(prev - 1, 1));

  return (
    <motion.div
      className="mb-10 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.3, duration: 0.8 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        How old are you?
      </h2>
      <div className="flex items-center justify-center">
        <motion.button
          onClick={decrementAge}
          className="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center mr-4"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={24} />
        </motion.button>

        <motion.div
          className="relative w-20 h-20 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
            // Reduced animation complexity for better performance
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.span className="text-3xl font-bold z-10" layout key={age}>
            {age}
          </motion.span>
        </motion.div>

        <motion.button
          onClick={incrementAge}
          className="bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center ml-4"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
}
