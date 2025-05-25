"use client";
import React, { useState, useEffect } from "react";
import { Finger_Paint } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Calendar, Users, AlertCircle, Brain } from "lucide-react";

import InputRectangle from "@/components/begin/InputRectangle";
import CountrySelect from "@/components/shared/CountrySelect";
import AgeSelector from "@/components/begin/AgeSelector";
import { useTheme } from "@/components/shared/ThemeProvider";
import { checkUsername, createUser, loginWithPassword, isAuthenticated } from "@/fetch/auth";
import { showError } from "@/components/shared/ErrorModal";
import LoadingDots from "@/components/shared/LoadingDots";
import { InlineLoadingAnimation } from "@/components/shared/LoadingSpinner";
import FullScreenLoader from "@/components/shared/FullScreenLoader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PasswordStrengthIndicator from "@/components/shared/PasswordStrengthIndicator";

const fingerPaint = Finger_Paint({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 }
};

const slideVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

const shakeAnimation = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

export default function HomePage() {
  const { mounted } = useTheme();
  const router = useRouter();

  // Authentication flow states
  const [step, setStep] = useState("username"); // username, password, details
  const [authMode, setAuthMode] = useState(null); // login or signup
  const [userExists, setUserExists] = useState(false);
  
  // Form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(25);
  const [country, setCountry] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [lettersTyped, setLettersTyped] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Error states
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    country: "",
    general: ""
  });
  
  // Validation states
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (mounted && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      if (isAuthenticated()) {
        // Skip intro for authenticated users
        setShowIntro(false);
        
        // Save current username in localStorage if available
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (userData.username) {
          setUsername(userData.username);
          setIsConfirmed(true);
          // Redirect to tests after showing welcome briefly
          setTimeout(() => {
            router.push("/tests");
          }, 1500);
        } else {
          router.push("/tests");
        }
      }
    }
  }, [mounted, router, hasCheckedAuth]);

  // Handle intro timer separately for non-authenticated users
  useEffect(() => {
    if (mounted && showIntro && !isAuthenticated()) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, showIntro]);


  // Validate password
  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (pwd, confirmPwd) => {
    if (!confirmPwd) return "Please confirm your password";
    if (pwd !== confirmPwd) return "Passwords do not match";
    return "";
  };

  // Handle username input change with letter animations
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setUsername(newText);
    setErrors({ ...errors, username: "" });
    
    // Add letter animation
    if (newText.length > username.length) {
      const newLetter = newText[newText.length - 1];
      setLettersTyped(prev => [...prev, {
        id: Date.now(),
        letter: newLetter,
        position: newText.length - 1
      }]);
    }
  };

  // Handle username confirmation
  const handleUsernameConfirm = async () => {
    if (!username.trim()) {
      setErrors({ ...errors, username: "Username is required" });
      return;
    }
    
    if (username.length < 3) {
      setErrors({ ...errors, username: "Username must be at least 3 characters" });
      return;
    }

    setIsLoading(true);
    setIsChecking(true);
    setErrors({ ...errors, username: "", general: "" });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Minimum loading time for better UX
      const response = await checkUsername(username);
      setUserExists(response.exists);
      setAuthMode(response.exists ? "login" : "signup");
      setStep("password");
    } catch (error) {
      console.error("Username check error:", error);
      setErrors({ ...errors, general: "Unable to check username. Please check your internet connection and try again." });
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  // Handle login
  const handleLogin = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ ...errors, password: passwordError });
      return;
    }

    setIsLoading(true);
    setErrors({ ...errors, password: "", general: "" });
    
    try {
      const response = await loginWithPassword({ 
        username: username, 
        password: password 
      });
      
      
      // Save username to localStorage for future visits
      localStorage.setItem("userData", JSON.stringify({ username }));
      
      // Show success message
      setSuccessMessage("Login successful! Redirecting...");
      setIsLoading(false);
      
      // Give time for cookies to be set properly and user to see message
      setTimeout(() => {
        try {
          router.push("/tests");
        } catch (err) {
          console.error("Router push failed:", err);
          // Fallback to window.location
          window.location.href = "/tests";
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Unable to sign in. ";
      if (error.status === 400) {
        errorMessage += "Invalid username or password.";
      } else if (error.status === 0 || !navigator.onLine) {
        errorMessage += "Please check your internet connection.";
      } else {
        errorMessage += "Please try again later.";
      }
      
      setErrors({ ...errors, password: errorMessage });
      
      // Animate the password field
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.classList.add('animate-shake');
        setTimeout(() => passwordInput.classList.remove('animate-shake'), 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle moving to details step for signup
  const handlePasswordForSignup = () => {
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);
    
    if (passwordError || confirmError) {
      setErrors({
        ...errors,
        password: passwordError,
        confirmPassword: confirmError
      });
      return;
    }

    setStep("details");
    setErrors({ ...errors, password: "", confirmPassword: "" });
  };

  // Handle account creation
  const handleCreateAccount = async () => {
    const newErrors = {
      ...errors,
      country: !country ? "Please select your country" : "",
      age: age && (age < 1 || age > 120) ? "Please enter a valid age" : ""
    };
    
    if (newErrors.country || newErrors.age) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({ ...errors, general: "" });
    
    try {
      const response = await createUser({ 
        username, 
        password,
        country, 
        age: age ? parseInt(age) : null 
      });
      
      
      // Save user data to localStorage
      localStorage.setItem("userData", JSON.stringify({ 
        username, 
        age, 
        country 
      }));
      
      // Show success message
      setSuccessMessage("Account created successfully! Redirecting...");
      setIsLoading(false);
      
      // Give time for cookies to be set properly and user to see message
      setTimeout(() => {
        try {
          router.push("/tests");
        } catch (err) {
          console.error("Router push failed:", err);
          // Fallback to window.location
          window.location.href = "/tests";
        }
      }, 1000);
    } catch (error) {
      console.error("Account creation error:", error);
      
      let errorMessage = "Unable to create account. ";
      if (error.status === 400 && error.message) {
        errorMessage = error.message;
      } else if (error.status === 0 || !navigator.onLine) {
        errorMessage += "Please check your internet connection.";
      } else {
        errorMessage += "Please try again later.";
      }
      
      setErrors({ ...errors, general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // If not mounted, return null
  if (!mounted) {
    return null;
  }

  const pageReady = mounted && hasCheckedAuth;

  return (
    <motion.div
      className={`relative h-screen w-full overflow-hidden ${fingerPaint.className} transition-all duration-1000 bg-white dark:bg-gray-900`}
    >
      <AnimatePresence mode="wait">
        {/* Intro Animation */}
        {showIntro && pageReady && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-gray-900"
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Floating geometric shapes */}
              {/* Squares */}
              <motion.div
                className="absolute top-10 left-10 w-16 h-16 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg"
                animate={{
                  rotate: [0, 360],
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-12 h-12 bg-orange-500/10 border-2 border-dashed border-orange-500/50 rounded"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.5, 1],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              
              {/* Triangles */}
              <motion.div
                className="absolute top-1/3 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-blue-500/50"
                animate={{
                  rotate: [0, 360],
                  y: [0, 100, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-indigo-500/40"
                animate={{
                  rotate: [0, -360],
                  x: [0, -80, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              
              {/* Circles */}
              <motion.div
                className="absolute top-1/2 left-10 w-20 h-20 bg-purple-500/10 border-2 border-purple-500/40 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, 150, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-10 right-1/3 w-14 h-14 border-2 border-dashed border-pink-500/50 rounded-full"
                animate={{
                  y: [0, 200, 0],
                  scale: [1, 0.8, 1],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              
              {/* Additional shapes for variety */}
              <motion.div
                className="absolute bottom-40 left-1/2 w-18 h-18 border-2 border-amber-500/40 rounded-lg"
                animate={{
                  rotate: [0, 45, 90, 135, 180],
                  scale: [1, 0.8, 1],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-1/4 left-1/3 w-16 h-16 bg-indigo-500/15 border-2 border-indigo-500/40 rounded-full"
                animate={{
                  x: [0, 120, 0],
                  y: [0, -60, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-2/3 right-1/4 w-10 h-10 border-2 border-purple-500/50 rounded"
                animate={{
                  scale: [1, 1.6, 1],
                  rotate: [0, -180, 0],
                }}
                transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
              />
              
              {/* Center content */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="relative inline-block"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: 0, ease: "easeInOut" }}
                >
                  <motion.h1
                    className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: 0 }}
                  >
                    IQ Test
                  </motion.h1>
                  
                  {/* Decorative elements around text */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-2 h-2 bg-amber-500 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1.5, repeat: 0, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-2 h-2 bg-orange-500 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1.5, repeat: 0, delay: 0.7 }}
                  />
                </motion.div>
                
                <motion.p
                  className="text-xl text-gray-600 dark:text-gray-400 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Discover your potential
                </motion.p>
                
                {/* Progress indicator */}
                <motion.div
                  className="mt-8 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Rotating orbit */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: 0, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full" />
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full" />
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Username Step */}
        {step === "username" && !isConfirmed && !showIntro && pageReady && (
          <motion.div
            key="username"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center h-full px-4"
          >
            <div className="relative">
              {/* Floating letters animation */}
              <AnimatePresence>
                {lettersTyped.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="absolute text-4xl font-bold text-purple-500/50"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scale: 2,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 200, 
                      y: -(Math.random() * 100 + 50),
                      scale: 1,
                      opacity: [0, 1, 0],
                      rotate: (Math.random() - 0.5) * 45
                    }}
                    transition={{ 
                      duration: 2,
                      ease: "easeOut"
                    }}
                  >
                    {item.letter}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <InputRectangle
                width={400}
                height={80}
                inputText={username}
                handleInputChange={handleInputChange}
                isConfirmed={false}
                showButton={username.length >= 3}
                handleConfirm={handleUsernameConfirm}
                isLoading={isLoading}
                error={errors.username}
              />
              
              {/* Error message */}
              <ErrorMessage error={errors.username || errors.general} />
            </div>
          </motion.div>
        )}

        {/* Password Step */}
        {step === "password" && (
          <motion.div
            key="password"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex items-center justify-center h-full px-4"
          >
            <motion.div 
              className="w-full max-w-md space-y-6"
              variants={fadeInUp}
            >
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {authMode === "login" ? `Welcome back, ${username}!` : `Nice to meet you, ${username}!`}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {authMode === "login" 
                    ? "Enter your password to continue" 
                    : "This username is available. Create your password"
                  }
                </p>
                
                {/* Free tier hosting warning */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                >
                  <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Using free tier hosting - first login may take up to 60 seconds while the server starts up
                    </span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: "" });
                        setTouched({ ...touched, password: true });
                      }}
                      onBlur={() => {
                        if (authMode === "signup") {
                          setErrors({ ...errors, password: validatePassword(password) });
                        }
                      }}
                      onKeyPress={(e) => e.key === "Enter" && (authMode === "login" ? handleLogin() : null)}
                      placeholder={authMode === "login" ? "Enter your password" : "Create a password (8+ characters)"}
                      className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                      autoFocus
                      animate={errors.password ? "shake" : ""}
                      variants={shakeAnimation}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage error={errors.password} />
                  {authMode === "signup" && (
                    <PasswordStrengthIndicator 
                      password={password} 
                      show={touched.password && !errors.password}
                    />
                  )}
                </div>

                {authMode === "signup" && (
                  <div>
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setErrors({ ...errors, confirmPassword: "" });
                          setTouched({ ...touched, confirmPassword: true });
                        }}
                        onBlur={() => {
                          setErrors({ ...errors, confirmPassword: validateConfirmPassword(password, confirmPassword) });
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handlePasswordForSignup()}
                        placeholder="Confirm your password"
                        className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </motion.div>
                    <ErrorMessage error={errors.confirmPassword} />
                  </div>
                )}

                <ErrorMessage error={errors.general} />
                
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 dark:text-green-400 font-medium"
                  >
                    {successMessage}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setStep("username");
                      setPassword("");
                      setConfirmPassword("");
                      setAuthMode(null);
                      setErrors({});
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    onClick={authMode === "login" ? handleLogin : handlePasswordForSignup}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden"
                    animate={isLoading ? {
                      background: ["linear-gradient(to right, rgb(147 51 234), rgb(99 102 241))", 
                                 "linear-gradient(to right, rgb(99 102 241), rgb(147 51 234))"]
                    } : {}}
                    transition={isLoading ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    } : {}}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <InlineLoadingAnimation />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {authMode === "login" ? "Sign In" : "Continue"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {authMode === "login" && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      setAuthMode("signup");
                      setPassword("");
                      setErrors({});
                      setTouched({});
                    }}
                    className="w-full text-sm text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Create new account with this username
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Details Step (for signup) */}
        {step === "details" && (
          <motion.div
            key="details"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex items-center justify-center h-full px-4"
          >
            <motion.div className="w-full max-w-md space-y-6">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Almost there, {username}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us a bit about yourself
                </p>
                
                {/* Free tier hosting warning */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                >
                  <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Account creation may take longer on first attempt due to free tier hosting
                    </span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Select your country
                  </p>
                  <CountrySelect value={country} onChange={setCountry} error={errors.country} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Enter your age (optional)
                  </p>
                  <AgeSelector age={age} setAge={setAge} />
                  <ErrorMessage error={errors.age} />
                </motion.div>

                <ErrorMessage error={errors.general} />
                
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 dark:text-green-400 font-medium"
                  >
                    {successMessage}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("password")}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    onClick={handleCreateAccount}
                    disabled={isLoading || !country}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden"
                    animate={isLoading ? {
                      background: ["linear-gradient(to right, rgb(147 51 234), rgb(99 102 241))", 
                                 "linear-gradient(to right, rgb(99 102 241), rgb(147 51 234))"]
                    } : {}}
                    transition={isLoading ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    } : {}}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center"
                        >
                          <InlineLoadingAnimation />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Create Account
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Welcome message for returning users */}
        {isConfirmed && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex items-center justify-center h-full"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {username}!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full screen loader for username checking */}
      <FullScreenLoader 
        isLoading={isChecking} 
        text="Checking username availability"
      />
      
      {/* Full screen loader for authentication */}
      <FullScreenLoader 
        isLoading={isLoading && (step === "password" || step === "details")} 
        text={
          step === "password" && authMode === "login" ? "Signing you in..." :
          step === "password" && authMode === "signup" ? "Verifying password..." :
          step === "details" ? "Creating your account..." :
          "Processing..."
        }
      />
    </motion.div>
  );
}