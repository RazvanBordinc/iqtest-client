"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { checkUsername, createUser, loginWithPassword, isAuthenticated } from "@/fetch/auth";
import { showError } from "@/components/shared/ErrorModal";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import CountrySelect from "@/components/shared/CountrySelect";
import AgeSelector from "@/components/begin/AgeSelector";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Flow state
  const [step, setStep] = useState("username"); // "username", "details", "password", "login"
  const [userExists, setUserExists] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState(null);
  const [password, setPassword] = useState("");

  // Form validation state
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [ageError, setAgeError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          router.push("/tests");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle username check
  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    setUsernameError("");

    setIsLoading(true);
    try {
      const response = await checkUsername(username);
      // In production, exists is null, so we always go to details step
      const userExists = response.exists ?? false;
      setUserExists(userExists);
      if (userExists) {
        setStep("login");
      } else {
        setStep("details");
      }
    } catch (error) {
      showError("Failed to check username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user creation
  const handleCreateUser = async () => {
    if (!country || !age) {
      if (!country) showError("Please select your country");
      if (!age) setAgeError("Please enter your age");
      return;
    }

    if (age < 1 || age > 120) {
      setAgeError("Please enter a valid age");
      return;
    }

    setStep("password");
  };

  // Handle password submission (for new users)
  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError("");

    setIsLoading(true);
    try {
      await createUser({ username, country, age: parseInt(age), password });
      router.push("/tests");
    } catch (error) {
      showError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login (for existing users)
  const handleLogin = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    setPasswordError("");

    setIsLoading(true);
    try {
      await loginWithPassword({ email: `${username}@iqtest.local`, password });
      router.push("/tests");
    } catch (error) {
      showError(error.message || "Invalid password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center p-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-center p-4">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* Username Step */}
            {step === "username" && (
              <motion.div
                key="username"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to IQ Test
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your username to continue
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleUsernameCheck)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        usernameError
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="Enter your username"
                      autoFocus
                    />
                    {usernameError && (
                      <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                    )}
                  </div>

                  <motion.button
                    onClick={handleUsernameCheck}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    <motion.span
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isLoading ? 0 : 1 }}
                      className="relative z-10"
                    >
                      Continue
                    </motion.span>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Details Step (for new users) */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Tell us about yourself
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us personalize your experience
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Select your country
                    </p>
                    <CountrySelect value={country} onChange={setCountry} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Enter your age
                    </p>
                    <AgeSelector age={age} setAge={setAge} />
                    {ageError && (
                      <p className="mt-2 text-sm text-red-500 text-center">{ageError}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep("username")}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCreateUser}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Password Step (for new users) */}
            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Create a password
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Keep your account secure
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        passwordError
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="Create a password (8+ characters)"
                      autoFocus
                    />
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep("details")}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePasswordSubmit}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Login Step (for existing users) */}
            {step === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {username}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your password to continue
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        passwordError
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="Enter your password"
                      autoFocus
                    />
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep("username");
                        setPassword("");
                        setUsername("");
                      }}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Use Different Account
                    </button>
                    <button
                      onClick={handleLogin}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}