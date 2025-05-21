"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/fetch/auth";
import checkUsernameTryAllApproaches from "@/fetch/checkUsername";
import createUserMultiFormat from "@/fetch/createUser";
import loginMultiFormat from "@/fetch/login";
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
      // Try multiple approaches for username check to find one that works
      console.log('Starting comprehensive username check for:', username);
      const data = await checkUsernameTryAllApproaches(username);
      console.log('Username check completed with response:', data);
      
      // Handle the response
      if (data) {
        // In production mode, exists will be null for security reasons
        const userExists = data.exists ?? null;
        setUserExists(userExists);
        
        if (userExists === true) {
          // User definitely exists, go to login
          console.log('Username exists, directing to login form');
          setStep("login");
        } else if (userExists === false) {
          // User definitely doesn't exist, go to registration
          console.log('Username available, directing to registration form');
          setStep("details");
        } else {
          // In production we don't know for sure (null), so try login first
          console.log('Username check ambiguous, directing to password form');
          setStep("password");
        }
      } else {
        // If no data returned, default to registration form
        console.log('No data returned, defaulting to registration form');
        setUserExists(false);
        setStep("details");
      }
    } catch (error) {
      console.error("Username check error:", error);
      // Even if error occurs, continue to registration
      console.log('Error occurred, defaulting to registration form');
      setUserExists(false);
      setStep("details");
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

  // Handle password submission (for new users or production mode)
  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    setPasswordError("");

    setIsLoading(true);
    try {
      console.log("Processing password submission");
      
      // If we have country and age, we're in registration flow
      // Otherwise we're in a simplified flow
      if (country && age) {
        try {
          // Create new user with all details using multi-format approach
          console.log("Creating new user account with all details");
          await createUserMultiFormat({ 
            username, 
            country, 
            age: parseInt(age), 
            password,
            email: `${username}@iqtest.local`
          });
          
          // Redirect on success
          router.push("/tests");
        } catch (createError) {
          console.error("Create user error:", createError);
          
          // If create fails, it could be because user exists
          // Try login as fallback
          try {
            console.log("Create user failed, trying login as fallback");
            await loginMultiFormat({ email: `${username}@iqtest.local`, password });
            router.push("/tests");
          } catch (loginError) {
            console.error("Login fallback error:", loginError);
            // Show generic error
            showError("Account creation failed. Please try again with a different username.");
          }
        }
      } else {
        // We have username + password but no country/age
        // This happens in simplified flow - try login directly
        try {
          await loginMultiFormat({ email: `${username}@iqtest.local`, password });
          router.push("/tests");
        } catch (loginError) {
          console.error("Login error:", loginError);
          
          // Login failed - show details form for registration
          if (loginError.isInvalidCredentials || loginError.message.includes("Invalid credentials")) {
            // Could be wrong password or non-existent user
            setPasswordError("Login failed. Either the password is incorrect or you need to create an account.");
            setStep("details");
          } else {
            // Other error - attempt offline login
            console.log("Creating offline session due to backend error");
            
            // Create fake session data
            localStorage.setItem("offline_mode", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("email", `${username}@iqtest.local`);
            
            // Redirect user
            router.push("/tests");
          }
        }
      }
    } catch (error) {
      console.error("Password submission error:", error);
      
      // Create offline session as last resort
      localStorage.setItem("offline_mode", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("email", `${username}@iqtest.local`);
      
      router.push("/tests");
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
      // Use the multi-format login function for more robustness
      await loginMultiFormat({ email: `${username}@iqtest.local`, password });
      router.push("/tests");
    } catch (error) {
      console.error("Login error:", error);
      
      // Determine if we should fall back to offline mode
      if (error.status === 400 && error.message.includes("Invalid credentials")) {
        // This is likely a wrong password - show specific message
        setPasswordError("Invalid password. Please try again.");
        return;
      }
      
      // For other errors (connectivity, backend issues), fallback to offline
      console.log("Creating offline session due to login error");
      
      // Create fake session data
      localStorage.setItem("offline_mode", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("email", `${username}@iqtest.local`);
      
      // Redirect user
      router.push("/tests");
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

            {/* Password Step (for production mode - handles both login and registration) */}
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
                    {userExists === null ? `Welcome, ${username}!` : 'Create a password'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userExists === null ? 'Enter your password to continue' : 'Keep your account secure'}
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
                      placeholder={userExists === null ? "Enter your password" : "Create a password (8+ characters)"}
                      autoFocus
                    />
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(userExists === null ? "username" : "details")}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePasswordSubmit}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      {userExists === null ? 'Continue' : 'Create Account'}
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