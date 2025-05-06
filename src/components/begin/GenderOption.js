// components/GenderOption.js
import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function GenderOption({ type, selected, onSelect }) {
  const isSelected = selected === type;
  const colors =
    type === "male"
      ? {
          gradient: isSelected
            ? "from-blue-400 to-blue-600"
            : "from-blue-200 to-blue-400",
          ring: "ring-blue-300",
          text: isSelected ? "text-blue-600" : "text-gray-600",
          sparkle: "text-blue-500",
        }
      : {
          gradient: isSelected
            ? "from-pink-400 to-pink-600"
            : "from-pink-200 to-pink-400",
          ring: "ring-pink-300",
          text: isSelected ? "text-pink-600" : "text-gray-600",
          sparkle: "text-pink-500",
        };

  return (
    <motion.div
      className="relative cursor-pointer group"
      onClick={() => onSelect(type)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${
          colors.gradient
        } ${
          isSelected ? `ring-4 ${colors.ring}` : ""
        } transition-all duration-300`}
      >
        <Heart
          fill={isSelected ? "white" : "none"}
          className="text-white w-12 h-12 sm:w-16 sm:h-16"
        />

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1"
          >
            <Sparkles size={24} className={colors.sparkle} />
          </motion.div>
        )}
      </motion.div>
      <p className={`mt-2 text-center font-semibold ${colors.text}`}>
        {type === "male" ? "Male" : "Female"}
      </p>
    </motion.div>
  );
}
