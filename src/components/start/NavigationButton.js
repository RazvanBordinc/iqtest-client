"use client";

import React, { memo } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Using memo to prevent unnecessary re-renders
const NavigationButton = memo(function NavigationButton({
  direction,
  onClick,
  disabled,
  text,
}) {
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;

  // Define button styles based on theme, direction and disabled state
  const getButtonClass = () => {
    if (disabled) {
      return "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed";
    }

    if (direction === "next") {
      return "px-6 py-3 rounded-lg flex items-center gap-2 relative bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] overflow-hidden";
    }

    return "px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]";
  };

  return (
    <button
      className={getButtonClass()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        transform: "translateZ(0)", // Force hardware acceleration
        willChange: "transform", // Hint to browser
        touchAction: "manipulation", // Optimize for touch
      }}
    >
      {direction === "prev" && <Icon className="w-5 h-5" />}
      <span>{text}</span>
      {direction === "next" && <Icon className="w-5 h-5" />}

      {direction === "next" && !disabled && (
        <div className="absolute inset-0 rounded-lg opacity-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine"
            style={{
              animation: "shine 2s infinite",
              animationTimingFunction: "ease-in-out",
              backgroundSize: "200% 100%",
              backgroundPosition: "-100% 0",
            }}
          />
        </div>
      )}
    </button>
  );
});

export default NavigationButton;
