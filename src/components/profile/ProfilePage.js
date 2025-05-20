"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Brain,
  Calendar,
  Target,
  Activity,
  Zap,
  Medal,
  BarChart3,
  TrendingUp,
  Star,
  MapPin,
  Edit,
  Save,
  X,
  ChevronUp,
  Trash2,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getProfile, updateCountry, updateAge } from "@/fetch/profile";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import ErrorMessage from "@/components/shared/ErrorMessage";
import CountrySelect from "@/components/shared/CountrySelect";
import Header from "@/components/start/Header";
import DataPrivacy from "@/components/profile/DataPrivacy";
import TestHistory from "@/components/profile/TestHistory";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Map test type IDs to display info
const testTypeInfo = {
  "number-logic": {
    name: "Number Logic",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    lightColor: "text-blue-600 dark:text-blue-400",
  },
  "word-logic": {
    name: "Verbal Intelligence",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    lightColor: "text-emerald-600 dark:text-emerald-400",
  },
  memory: {
    name: "Memory & Recall",
    icon: <Brain className="w-5 h-5" />,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    lightColor: "text-amber-600 dark:text-amber-400",
  },
  mixed: {
    name: "Comprehensive IQ",
    icon: <Trophy className="w-5 h-5" />,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/10",
    borderColor: "border-purple-200 dark:border-purple-800",
    lightColor: "text-purple-600 dark:text-purple-400",
  },
};

// Helper function to ensure consistent property access regardless of casing
const getProp = (obj, prop) => {
  if (!obj) return undefined;

  // Try direct access first
  if (obj[prop] !== undefined) return obj[prop];

  // Try camelCase
  const camelCase = prop.charAt(0).toLowerCase() + prop.slice(1);
  if (obj[camelCase] !== undefined) return obj[camelCase];

  // Try PascalCase
  const pascalCase = prop.charAt(0).toUpperCase() + prop.slice(1);
  if (obj[pascalCase] !== undefined) return obj[pascalCase];

  return undefined;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCountry, setEditingCountry] = useState(false);
  const [editingAge, setEditingAge] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [newAge, setNewAge] = useState("");
  const [savingCountry, setSavingCountry] = useState(false);
  const [savingAge, setSavingAge] = useState(false);
  const ageInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProfile();
      console.log("Profile data received:", data);
      console.log("CreatedAt field:", getProp(data, "createdAt"));

      // Store the data as-is, we'll use the getProp function to access fields
      setProfile(data);
      setNewCountry(getProp(data, "country") || "");
      setNewAge(getProp(data, "age")?.toString() || "");
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryUpdate = async () => {
    if (!newCountry) return;

    try {
      setSavingCountry(true);
      await updateCountry(newCountry);
      setProfile((prev) => ({ ...prev, country: newCountry }));
      setEditingCountry(false);
    } catch (err) {
      setError("Failed to update country. Please try again.");
      console.error("Country update error:", err);
    } finally {
      setSavingCountry(false);
    }
  };

  const handleAgeUpdate = async () => {
    if (
      !newAge ||
      isNaN(Number(newAge)) ||
      Number(newAge) < 1 ||
      Number(newAge) > 120
    )
      return;

    try {
      setSavingAge(true);
      await updateAge(Number(newAge));
      setProfile((prev) => ({ ...prev, age: Number(newAge) }));
      setEditingAge(false);
    } catch (err) {
      setError("Failed to update age. Please try again.");
      console.error("Age update error:", err);
    } finally {
      setSavingAge(false);
    }
  };

  useEffect(() => {
    if (editingAge && ageInputRef.current) {
      ageInputRef.current.focus();
    }
  }, [editingAge]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage error={error} />
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const formatDate = (dateString) => {
    try {
      if (!dateString) {
        return "Date not available";
      }

      // Check if the date is in ISO format or another format
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date string:", dateString);
        return "Date not available";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error(
        "Date format error:",
        error,
        "for date string:",
        dateString
      );
      return "Date not available";
    }
  };

  const formatTime = (dateString) => {
    try {
      if (!dateString) {
        return "Time not available";
      }

      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date string for time formatting:", dateString);
        return "Time not available";
      }

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error(
        "Time format error:",
        error,
        "for date string:",
        dateString
      );
      return "Time not available";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <Header />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with improved design */}
        <motion.div variants={itemVariants} className="mb-8 relative">
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
          </div>

          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Profile
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Track your cognitive journey, view past test results, and monitor
            your progress over time
          </motion.p>
        </motion.div>

        {/* User Info Card - Enhanced */}
        <motion.div
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8 relative overflow-visible"
          style={{ zIndex: 10 }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                x: [0, -10, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info - Left Column */}
            <div className="flex flex-col gap-5">
              <div className="flex sm:flex-row items-start gap-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                <div>
                  <motion.h2
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {getProp(profile, "username")}
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {getProp(profile, "email")}
                  </motion.p>
                </div>
              </div>

              <motion.div
                className="flex flex-wrap items-start gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                  {/* Country */}
                  <AnimatePresence mode="wait">
                    {editingCountry ? (
                      <motion.div
                        key="country-edit"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, y: -5 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-[9999]"
                      >
                        <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 p-4 rounded-2xl shadow-xl min-w-[280px]">
                          <div className="flex items-center space-x-3 mb-3">
                            <MapPin className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Update Country
                            </span>
                          </div>
                          <div className="space-y-3">
                            <CountrySelect
                              value={newCountry}
                              onChange={setNewCountry}
                              className="w-full"
                            />
                            <div className="flex items-center justify-end space-x-2 pt-2">
                              <button
                                onClick={() => {
                                  setEditingCountry(false);
                                  setNewCountry(profile.country || "");
                                }}
                                disabled={savingCountry}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleCountryUpdate}
                                disabled={savingCountry || !newCountry}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {savingCountry ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="country-display"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-2 group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setEditingCountry(true)}
                      >
                        <div
                          className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl 
                                      group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-all border border-transparent 
                                      group-hover:border-gray-300 dark:group-hover:border-gray-600"
                        >
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {getProp(profile, "country") || "Add country"}
                          </span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Age */}
                  <AnimatePresence mode="wait">
                    {editingAge ? (
                      <motion.div
                        key="age-edit"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-[9999]"
                      >
                        <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 p-4 rounded-2xl shadow-xl">
                          <div className="flex items-center space-x-3 mb-3">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Update Age
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                ref={ageInputRef}
                                type="number"
                                value={newAge}
                                onChange={(e) => setNewAge(e.target.value)}
                                className="w-20 px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                placeholder="Age"
                                min="1"
                                max="120"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                years old
                              </span>
                            </div>
                            <div className="flex items-center justify-end space-x-2 pt-2">
                              <button
                                onClick={() => {
                                  setEditingAge(false);
                                  setNewAge(profile.age?.toString() || "");
                                }}
                                disabled={savingAge}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAgeUpdate}
                                disabled={
                                  savingAge ||
                                  !newAge ||
                                  Number(newAge) < 1 ||
                                  Number(newAge) > 120
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {savingAge ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="age-display"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-2 group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setEditingAge(true)}
                      >
                        <div
                          className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl 
                                      group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-all border border-transparent 
                                      group-hover:border-gray-300 dark:group-hover:border-gray-600"
                        >
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {getProp(profile, "age") &&
                            getProp(profile, "age") > 0
                              ? `${getProp(profile, "age")} years old`
                              : "Add age"}
                          </span>
                          <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Member since */}
                  <motion.div
                    className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Joined {formatDate(getProp(profile, "createdAt"))}
                    </span>
                  </motion.div>
                </motion.div>
                
              {/* User Stats - Animated Facts Section */}
              <motion.div
                className="mt-5 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Cognitive Strength */}
                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-3 border border-blue-200/30 dark:border-blue-600/20 shadow-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                >
                  <div className="flex items-center mb-1">
                    <Brain className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400 font-medium">Cognitive Strength</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getProp(profile, "testStats") && getProp(profile, "testStats").some(s => (s.BestScore || s.bestScore) >= 90) ? "Exceptional" : 
                     getProp(profile, "testStats") && getProp(profile, "testStats").some(s => (s.BestScore || s.bestScore) >= 75) ? "Advanced" : 
                     getProp(profile, "testStats") && getProp(profile, "testStats").some(s => (s.BestScore || s.bestScore) >= 60) ? "Proficient" : 
                     getProp(profile, "totalTestsCompleted") > 0 ? "Developing" : "Untested"}
                  </span>
                </motion.div>
                
                {/* Testing Streak */}
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-3 border border-green-200/30 dark:border-green-600/20 shadow-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
                >
                  <div className="flex items-center mb-1">
                    <Zap className="w-4 h-4 mr-1.5 text-emerald-500" />
                    <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-medium">Testing Streak</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.min(getProp(profile, "totalTestsCompleted") || 0, 7)} day{getProp(profile, "totalTestsCompleted") !== 1 ? "s" : ""}  
                  </span>
                </motion.div>
                
                {/* Best Performance */}
                <motion.div 
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-xl p-3 border border-amber-200/30 dark:border-amber-600/20 shadow-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)" }}
                >
                  <div className="flex items-center mb-1">
                    <Trophy className="w-4 h-4 mr-1.5 text-amber-500" />
                    <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium">Best Performance</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getProp(profile, "testStats") && getProp(profile, "testStats").reduce((max, stat) => 
                      Math.max(max, stat.BestScore || stat.bestScore || 0), 0) || 0}%
                  </span>
                </motion.div>
                
                {/* Test Variety */}
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-xl p-3 border border-purple-200/30 dark:border-purple-600/20 shadow-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
                >
                  <div className="flex items-center mb-1">
                    <Target className="w-4 h-4 mr-1.5 text-violet-500" />
                    <span className="text-xs uppercase tracking-wider text-violet-700 dark:text-violet-400 font-medium">Test Variety</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getProp(profile, "testStats") ? getProp(profile, "testStats").length : 0}/4 types
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats - Enhanced with 3D-like card */}
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="bg-gradient-to-br from-purple-800/5 via-indigo-500/10 to-purple-600/5 dark:from-purple-500/20 dark:via-indigo-500/15 dark:to-purple-400/10 
                        rounded-2xl p-8 border border-purple-300/30 dark:border-purple-500/30 shadow-xl backdrop-blur-md
                        relative overflow-hidden transition-all duration-500 h-full"
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 30px -12px rgba(79, 70, 229, 0.3)",
                  borderColor: "rgba(139, 92, 246, 0.5)",
                }}
              >
                {/* Decorative elements with enhanced effects */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 dark:from-violet-400/15 dark:to-fuchsia-400/15 rounded-full blur-xl" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/15 dark:to-purple-400/15 rounded-full blur-xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 dark:bg-white/5 rounded-full blur-2xl opacity-50" />

                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 backdrop-blur-sm rounded-2xl opacity-30" />

                <div className="relative">
                  {/* Trophy icon with animation */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg"
                      animate={{ 
                        y: [0, -5, 0],
                        boxShadow: [
                          "0 4px 12px rgba(234, 179, 8, 0.3)",
                          "0 8px 20px rgba(234, 179, 8, 0.5)",
                          "0 4px 12px rgba(234, 179, 8, 0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        repeatType: "loop" 
                      }}
                    >
                      <Trophy className="w-6 h-6 text-white drop-shadow-md" />
                    </motion.div>
                  </div>

                  <div className="pt-7 text-center">
                    <p className="text-sm uppercase tracking-wider text-purple-700 dark:text-purple-300 font-semibold mb-2">TEST ACHIEVEMENT</p>
                    
                    <motion.div
                      className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 dark:from-purple-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent mb-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      {getProp(profile, "totalTestsCompleted")}
                    </motion.div>
                    
                    <div className="inline-flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-400/20 dark:to-indigo-400/20 px-4 py-1 rounded-full mb-4">
                      <Star className="w-4 h-4 text-amber-500" />
                      <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        Tests Completed
                      </p>
                    </div>

                    {/* Test count by type with enhanced styling */}
                    {getProp(profile, "testStats") &&
                      getProp(profile, "testStats").length > 0 && (
                        <div className="pt-3 flex flex-col gap-2 mt-2 border-t border-purple-200/50 dark:border-purple-700/30">
                          {getProp(profile, "testStats").map((stat) => {
                            const info =
                              testTypeInfo[stat.TestTypeId] ||
                              testTypeInfo[stat.testTypeId];
                            if (!info) {
                              console.error(
                                "No test type info found for:",
                                stat.TestTypeId || stat.testTypeId
                              );
                              return null;
                            }
                            return (
                              <motion.div
                                key={stat.TestTypeId || stat.testTypeId}
                                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                                whileHover={{ x: 2 }}
                              >
                                <div className="flex items-center">
                                  {React.cloneElement(info.icon, {
                                    className: `w-4 h-4 mr-2 ${info.lightColor}`,
                                  })}
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {info.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span
                                    className={`font-semibold text-lg ${info.lightColor}`}
                                  >
                                    {stat.TestsCompleted || stat.testsCompleted}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">tests</span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Achievement Badges - Enhanced Section */}
          {getProp(profile, "totalTestsCompleted") > 0 && (
            <motion.div
              className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="h-10 w-1.5 bg-gradient-to-b from-purple-600 to-indigo-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Medal className="w-5 h-5 mr-2 text-amber-400" />
                  Achievement Badges
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* First Test Badge */}
                {getProp(profile, "totalTestsCompleted") >= 1 && (
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800/50 rounded-lg shadow-lg overflow-hidden">
                      {/* Badge background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-grid-blue-500/30 bg-[linear-gradient(to_right,theme(colors.blue.500/20)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.blue.500/20)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                      </div>
                      
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md mb-3 ring-2 ring-white dark:ring-gray-900 relative">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        First Test
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Started your journey
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Explorer Badge */}
                {getProp(profile, "totalTestsCompleted") >= 5 && (
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800/50 rounded-lg shadow-lg overflow-hidden">
                      {/* Badge background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-grid-emerald-500/30 bg-[linear-gradient(to_right,theme(colors.emerald.500/20)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.emerald.500/20)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                      </div>
                      
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-md mb-3 ring-2 ring-white dark:ring-gray-900 relative">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Explorer
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        5+ tests completed
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Dedicated Badge */}
                {getProp(profile, "totalTestsCompleted") >= 10 && (
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800/50 rounded-lg shadow-lg overflow-hidden">
                      {/* Badge background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-grid-amber-500/30 bg-[linear-gradient(to_right,theme(colors.amber.500/20)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.amber.500/20)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                      </div>
                      
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md mb-3 ring-2 ring-white dark:ring-gray-900 relative">
                        <motion.div
                          animate={{ rotate: [0, 15, 0, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Zap className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Dedicated
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        10+ tests completed
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* High IQ Badge */}
                {getProp(profile, "testStats") &&
                  getProp(profile, "testStats").some(
                    (s) => (s.testTypeId === "mixed" || s.TestTypeId === "mixed") && 
                          (s.iqScore > 120 || s.IQScore > 120)
                  ) && (
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800/50 rounded-lg shadow-lg overflow-hidden">
                        {/* Badge background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-grid-purple-500/30 bg-[linear-gradient(to_right,theme(colors.purple.500/20)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.purple.500/20)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                        </div>
                        
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md mb-3 ring-2 ring-white dark:ring-gray-900 relative">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Brain className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          High IQ
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          120+ IQ score
                        </span>
                      </div>
                    </motion.div>
                  )}

                {/* Excellence Badge */}
                {getProp(profile, "testStats") &&
                  getProp(profile, "testStats").some(
                    (s) => (s.bestScore >= 90 || s.BestScore >= 90)
                  ) && (
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-900 border border-pink-200 dark:border-pink-800/50 rounded-lg shadow-lg overflow-hidden">
                        {/* Badge background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-grid-pink-500/30 bg-[linear-gradient(to_right,theme(colors.pink.500/20)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.pink.500/20)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
                        </div>
                        
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-md mb-3 ring-2 ring-white dark:ring-gray-900 relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          >
                            <Trophy className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          Excellence
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          90%+ test score
                        </span>
                      </div>
                    </motion.div>
                  )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Test Statistics - Enhanced with better cards */}
        {getProp(profile, "testStats") &&
          getProp(profile, "testStats").length > 0 && (
            <motion.div variants={itemVariants}>
              <motion.h2
                className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <BarChart3 className="w-6 h-6 mr-2 text-purple-500" />
                Test Performance
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {getProp(profile, "testStats").map((stat, index) => {
                  const testTypeId = stat.TestTypeId || stat.testTypeId;
                  const info = testTypeInfo[testTypeId] || {};
                  if (!info || !testTypeId) {
                    console.error("Missing test type info for stat:", stat);
                    return null;
                  }
                  return (
                    <motion.div
                      key={testTypeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      className={`bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg backdrop-blur-md border ${info.borderColor} p-6 relative overflow-hidden transition-all duration-300`}
                    >
                      {/* Enhanced decorative gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-5`}
                      />

                      {/* Decorative circles */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full blur-xl" />
                      <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full blur-xl" />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <div className="flex items-center">
                              <motion.div
                                className={`p-3 rounded-xl bg-gradient-to-r ${info.color} mr-3 shadow-lg`}
                                whileHover={{ rotate: 15 }}
                              >
                                {React.cloneElement(info.icon, {
                                  className: "w-6 h-6 text-white",
                                })}
                              </motion.div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {stat.TestTypeName || stat.testTypeName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Last attempt:{" "}
                                  {formatDate(
                                    stat.LastAttempt || stat.lastAttempt
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <motion.div
                              className="text-3xl font-bold text-gray-900 dark:text-white"
                              whileHover={{ scale: 1.1 }}
                            >
                              {stat.TestsCompleted || stat.testsCompleted}
                            </motion.div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Attempts
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center mb-1">
                              <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Best
                              </span>
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {stat.BestScore || stat.bestScore}/100
                            </p>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center mb-1">
                              <Target className="w-4 h-4 mr-1 text-blue-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Average
                              </span>
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {stat.AverageScore || stat.averageScore}/100
                            </p>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                            <div className="flex items-center mb-1">
                              <Clock className="w-4 h-4 mr-1 text-green-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Best Time
                              </span>
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {stat.BestTime || stat.bestTime}
                            </p>
                          </div>
                        </div>

                        {(testTypeId === "mixed" || testTypeId === "mixed") &&
                          (stat.IQScore || stat.iqScore) && (
                            <motion.div
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    IQ Score
                                  </span>
                                </div>
                                <motion.p
                                  className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {stat.IQScore || stat.iqScore}
                                </motion.p>
                              </div>
                            </motion.div>
                          )}

                        {/* Progress visualization - New */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Progress
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {stat.BestScore || stat.bestScore}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${info.color}`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${stat.BestScore || stat.bestScore}%`,
                              }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}


        {/* Empty State - Enhanced with better visuals */}
        {getProp(profile, "totalTestsCompleted") === 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-10 text-center py-16 mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-xl transform scale-150" />
              <Trophy className="w-24 h-24 mx-auto text-purple-300 dark:text-purple-600 relative" />
            </motion.div>
            <motion.h3
              className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Begin Your Cognitive Journey
            </motion.h3>
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Take your first test to discover your cognitive strengths and
              track your progress over time
            </motion.p>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-xl 
                       hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 cursor-pointer
                       shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Tests
            </motion.button>
          </motion.div>
        )}

        {/* Test History Section - Full width */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Clock className="w-6 h-6 mr-2 text-purple-500" />
            Test History
          </motion.h2>
          
          <TestHistory />
        </motion.div>

        {/* Data Privacy Section */}
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            variants={itemVariants}
            className="min-h-[300px] flex flex-col"
          >
            <div className="flex-grow flex flex-col h-full">
              <DataPrivacy />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
