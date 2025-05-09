"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { login, register } from "@/fetch/auth";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Form validation state
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const isValid = validateInputs();
    if (!isValid) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        await login({ email, password });
      } else {
        // Handle registration
        await register({ username, email, password });
      }

      // Redirect to tests page on success
      router.push("/tests");
    } catch (error) {
      showError(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Input validation
  const validateInputs = () => {
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Username validation (only for signup)
    if (!isLogin) {
      if (!username.trim()) {
        setUsernameError("Username is required");
        isValid = false;
      } else if (username.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        isValid = false;
      } else {
        setUsernameError("");
      }
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!isLogin && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Rest of the component with UI elements...
  // (Including the login/signup form, toggles, animations, etc.)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center p-4">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="w-full max-w-md">
          {/* Auth form implementation */}
          <form onSubmit={handleSubmit}>
            {/* Form fields omitted for brevity */}
          </form>
        </div>
      )}
    </div>
  );
}
