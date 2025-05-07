"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AgeSelector from "./AgeSelector";
import GenderSelector from "./GenderSelector";
import StartButton from "../shared/StartButton";

export default function WelcomeMessage({
  inputText,
  age,
  setAge,
  gender,
  setGender,
  triggerSparkles,
  checked,
}) {
  const [isChecked, setIsChecked] = React.useState(false);
  // Store user data in localStorage whenever it changes
  useEffect(() => {
    // Only store data if username exists
    if (inputText && inputText.trim() !== "") {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: inputText,
          age: age || 25, // Default to 25 if not set
          gender: gender || null,
          // Add timestamp for session management if needed
          lastUpdated: new Date().toISOString(),
          checked: isChecked,
        })
      );
    }
  }, [inputText, age, gender]);

  // Check if both username and age are set to determine if Continue button should be fully enabled
  const isDataComplete =
    inputText && inputText.trim() !== "" && age > 0 && checked;
  if (isDataComplete) {
    return (
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-md px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-75"
          initial={{ letterSpacing: "0px" }}
          animate={{ letterSpacing: "2px" }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Welcome, {inputText}!
        </motion.h1>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-md px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
    >
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-75"
        initial={{ letterSpacing: "0px" }}
        animate={{ letterSpacing: "2px" }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Welcome, {inputText}!
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-12 transition-colors duration-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        Your journey begins now
      </motion.p>

      <AgeSelector age={age} setAge={setAge} />
      <GenderSelector
        gender={gender}
        setGender={setGender}
        triggerSparkles={triggerSparkles}
      />

      {/* Always display the StartButton but pass dataComplete flag */}
      <StartButton
        isChecked={setIsChecked}
        showButton={true}
        genderSelected={gender !== null}
        dataComplete={isDataComplete}
      />
    </motion.div>
  );
}
