// page.js
"use client";
import React, { useState, useEffect } from "react";
import { Finger_Paint } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import InputRectangle from "@/components/begin/InputRectangle";
import MovingBall from "@/components/begin/MovingBall";
import AnimatedLetter from "@/components/begin/AnimatedLetter";
import WelcomeMessage from "@/components/begin/WelcomeMessage";
import SimpleWelcome from "@/components/begin/SimpleWelcome"; // We'll create this new component

import { useTheme } from "@/components/shared/ThemeProvider";

const fingerPaint = Finger_Paint({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Animation timing constants exported for other components to use
export const TRAVEL_DURATION = 1.5;
export const TRANSFORM_DELAY = TRAVEL_DURATION - 0.05;
export const TRANSFORM_DURATION = 0.3;
export const INPUT_APPEAR_DELAY = TRANSFORM_DELAY + TRANSFORM_DURATION * 0.5;

export default function Page() {
  // All hooks must be at the top level
  const { mounted } = useTheme();
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [animatingLetters, setAnimatingLetters] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [hasCompletedRegistration, setHasCompletedRegistration] =
    useState(false);

  // Configurable rectangle dimensions
  const RECTANGLE_WIDTH = 400;
  const RECTANGLE_HEIGHT = 80;

  // Check localStorage on mount and redirect if user data exists
  useEffect(() => {
    if (mounted && !hasCheckedStorage) {
      // Make sure to only check once
      setHasCheckedStorage(true);

      try {
        const savedUserData = localStorage.getItem("userData");

        if (savedUserData) {
          const userData = JSON.parse(savedUserData);

          // If we have both username and age, prepare for redirect
          if (userData.username && userData.age) {
            // Set the state from saved data for smooth transition
            setInputText(userData.username);
            setAge(userData.age);

            if (userData.gender) {
              setGender(userData.gender);
            }

            // Mark as confirmed to show welcome screen
            setIsConfirmed(true);

            // Set this to true to indicate we have a returning user
            // who has already completed registration
            setHasCompletedRegistration(true);

            // Start redirecting animation after a short delay
            setTimeout(() => {
              setIsRedirecting(true);

              // Actually redirect after transition animation completes
              setTimeout(() => {
                router.push("/tests");
              }, 1000); // Matches the transition duration
            }, 2000); // Give more time to see the welcome screen
          }
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
  }, [mounted, router, hasCheckedStorage]);

  // Watch for input text changes to show/hide button
  useEffect(() => {
    if (mounted) {
      setShowButton(inputText.length > 0);
    }
  }, [inputText, mounted]);

  // Handle input changes and trigger letter animations
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    if (newText.length > inputText.length) {
      // Get the newly added character
      const newChar = newText[newText.length - 1];

      // Add new letter to animation queue with random position
      const newLetter = {
        id: Date.now(),
        char: newChar,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 3 + 2, // Random size between 2-5x
      };

      setAnimatingLetters((prev) => [...prev, newLetter]);

      // Remove letter animation after it completes
      setTimeout(() => {
        setAnimatingLetters((prev) =>
          prev.filter((letter) => letter.id !== newLetter.id)
        );
      }, 2000);
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  // Function to trigger sparkle animations for gender selection
  const triggerSparkles = () => {
    // Create sparkle animation effect - limited to just a few to reduce lag
    const numSparkles = 8;
    const newSparkles = [];

    for (let i = 0; i < numSparkles; i++) {
      newSparkles.push({
        id: Date.now() + i,
        char: "✨",
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.3,
        scale: Math.random() * 1.5 + 0.5,
      });
    }

    // Batch update to improve performance
    setAnimatingLetters((prev) => [...prev, ...newSparkles]);

    // Remove sparkles after animation
    setTimeout(() => {
      setAnimatingLetters((prev) =>
        prev.filter((letter) => !newSparkles.some((s) => s.id === letter.id))
      );
    }, 2000);
  };

  // Handle continue button click (for returning users)
  const handleContinue = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/tests");
    }, 1000);
  };

  // Ball positions configuration
  const ballPositions = [
    {
      initial: { top: 0, right: 0 },
      animate: { top: "50%", right: "50%" },
    },
    {
      initial: { bottom: 0, left: 0 },
      animate: { bottom: "50%", left: "50%" },
    },
    {
      initial: { bottom: 0, right: 0 },
      animate: { bottom: "50%", right: "50%" },
    },
  ];

  // Early return for SSR/non-mounted state
  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className={`relative h-screen w-full overflow-hidden ${fingerPaint.className} transition-all duration-1000 bg-white dark:bg-gray-900`}
      animate={
        isRedirecting ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Input rectangle */}
      <AnimatePresence>
        {!isConfirmed && (
          <InputRectangle
            width={RECTANGLE_WIDTH}
            height={RECTANGLE_HEIGHT}
            inputText={inputText}
            handleInputChange={handleInputChange}
            isConfirmed={isConfirmed}
            showButton={showButton}
            handleConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      {/* The other three balls */}
      <AnimatePresence>
        {!isConfirmed &&
          ballPositions.map((position, i) => (
            <MovingBall key={i} position={position} isConfirmed={isConfirmed} />
          ))}
      </AnimatePresence>

      {/* Animated letters appearing on screen */}
      <AnimatePresence>
        {animatingLetters.map((item) => (
          <AnimatedLetter key={item.id} item={item} isConfirmed={isConfirmed} />
        ))}
      </AnimatePresence>

      {/* For returning users who have already completed registration */}
      <AnimatePresence>
        {isConfirmed && hasCompletedRegistration && (
          <SimpleWelcome username={inputText} onContinue={handleContinue} />
        )}
      </AnimatePresence>

      {/* Welcome message and forms for new users */}
      <AnimatePresence>
        {isConfirmed && !hasCompletedRegistration && (
          <WelcomeMessage
            inputText={inputText}
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            triggerSparkles={triggerSparkles}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
