// components/WelcomeMessage.js
import React, { useMemo } from "react";
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
}) {
  // Only show the start button if both gender and age are selected
  const showStartButton = useMemo(() => {
    return gender !== null && age > 0;
  }, [gender, age]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-md px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
    >
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-4"
        initial={{ letterSpacing: "0px" }}
        animate={{ letterSpacing: "2px" }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Welcome, {inputText}!
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-gray-700 mb-12"
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

      <StartButton showButton={showStartButton} />
    </motion.div>
  );
}
