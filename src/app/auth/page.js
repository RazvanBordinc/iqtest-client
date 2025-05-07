"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  User,
  Lock,
  Mail,
  ArrowRight,
  EyeOff,
  Eye,
  CheckCircle,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function AuthPage() {
  const { mounted, theme } = useTheme();
  const router = useRouter();

  // Form control states
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form input states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Form validation states
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Reset errors when form mode changes
  useEffect(() => {
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");
  }, [isLogin]);

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!re.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate username (only for signup)
  const validateUsername = (username) => {
    if (isLogin) return true;
    if (!username) {
      setUsernameError("Username is required");
      return false;
    }
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    setUsernameError("");
    return true;
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (!isLogin && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);

    // Proceed only if all validations pass
    if (isEmailValid && isUsernameValid && isPasswordValid) {
      setIsLoading(true);
      setGeneralError("");

      // Simulate API call
      setTimeout(() => {
        // Simulate successful authentication
        setIsLoading(false);
        setIsSuccess(true);

        // Store fake user data
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: isLogin ? email.split("@")[0] : username,
            email: email,
            // Add other user data as needed
          })
        );

        // Redirect after success animation
        setTimeout(() => {
          router.push("/tests");
        }, 1500);
      }, 2000);
    }
  };

  // Toggle between login and signup
  const toggleAuthMode = () => {
    if (isLoading) return;
    setIsLogin(!isLogin);
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) return null;

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const successVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const buttonHoverVariants = {
    initial: {
      scale: 1,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.03,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-30"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-30"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 3,
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400 dark:text-purple-600" />
          </motion.div>
        ))}
      </div>

      {/* Header and logo */}
      <motion.div
        className="z-10 text-center mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="inline-block mb-6">
          <div className="flex items-center justify-center cursor-pointer">
            <motion.div
              className="relative"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>

              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0px rgba(124, 58, 237, 0.3)",
                    "0 0 0 8px rgba(124, 58, 237, 0)",
                    "0 0 0 0px rgba(124, 58, 237, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </div>
        </Link>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          TestIQ
        </motion.h1>

        <motion.p
          className="text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Discover your intellectual potential
        </motion.p>
      </motion.div>

      {/* Main auth container */}
      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Auth card */}
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Auth mode tabs */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <motion.button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all relative cursor-pointer ${
                isLogin
                  ? "text-indigo-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              disabled={isLoading}
              whileHover={!isLogin ? { scale: 1.03 } : {}}
              whileTap={!isLogin ? { scale: 0.97 } : {}}
            >
              Log In
              {/* Active tab indicator */}
              {isLogin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md -z-10"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all relative cursor-pointer ${
                !isLogin
                  ? "text-indigo-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              disabled={isLoading}
              whileHover={isLogin ? { scale: 1.03 } : {}}
              whileTap={isLogin ? { scale: 0.97 } : {}}
            >
              Sign Up
              {/* Active tab indicator */}
              {!isLogin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md -z-10"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          </div>

          {/* Success animation (when authenticated) */}
          {isSuccess ? (
            <motion.div
              className="flex flex-col items-center justify-center py-10"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6"
                animate={{
                  boxShadow: [
                    "0 0 0 0px rgba(16, 185, 129, 0.3)",
                    "0 0 0 10px rgba(16, 185, 129, 0)",
                    "0 0 0 0px rgba(16, 185, 129, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLogin ? "Welcome back!" : "Account created!"}
              </motion.h3>

              <motion.p
                className="text-gray-600 dark:text-gray-300 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isLogin
                  ? "You've been successfully logged in."
                  : "Your account has been successfully created."}
              </motion.p>

              <motion.p
                className="text-gray-500 dark:text-gray-400 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Redirecting to tests page...
              </motion.p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
              >
                {/* Email field */}
                <motion.div className="mb-4" variants={inputVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        emailError
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </motion.div>

                {/* Username field (only for signup) */}
                {!isLogin && (
                  <motion.div className="mb-4" variants={inputVariants}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => validateUsername(username)}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${
                          usernameError
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                        placeholder="johndoe"
                        disabled={isLoading}
                      />
                    </div>
                    {usernameError && (
                      <p className="mt-1 text-sm text-red-500">
                        {usernameError}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Password field */}
                <motion.div className="mb-6" variants={inputVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validatePassword(password)}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        passwordError
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                      placeholder={
                        isLogin ? "Your password" : "Create a password"
                      }
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                  )}
                </motion.div>

                {/* Forgot password (only for login) */}
                {isLogin && (
                  <motion.div
                    className="flex justify-end mb-6"
                    variants={inputVariants}
                  >
                    <motion.button
                      type="button"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 cursor-pointer"
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Forgot password?
                    </motion.button>
                  </motion.div>
                )}

                {/* Error message */}
                {generalError && (
                  <motion.div
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {generalError}
                    </p>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/30 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "Log In" : "Sign Up"}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                        className="ml-2"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}

                  {/* Button shimmer effect */}
                  <motion.div
                    className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{ display: isLoading ? "none" : "block" }}
                  />
                </motion.button>

                {/* Toggle auth mode link */}
                <motion.p
                  className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
                  variants={inputVariants}
                >
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <motion.button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 cursor-pointer"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </motion.button>
                </motion.p>
              </motion.form>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
