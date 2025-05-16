"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Trophy, Award, CheckCircle2, Clock, Brain, 
  Calendar, Target, Activity, Zap, Medal, BarChart3,
  TrendingUp, Star, MapPin, Edit, Save, X, ChevronUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProfile, updateCountry, updateAge } from '@/fetch/profile';
import LoadingAnimation from '@/components/shared/LoadingAnimation';
import ErrorMessage from '@/components/shared/ErrorMessage';
import CountrySelect from '@/components/shared/CountrySelect';
import Header from '@/components/start/Header';
import DataPrivacy from '@/components/profile/DataPrivacy';

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
  'number-logic': {
    name: 'Numerical Reasoning',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  'word-logic': {
    name: 'Verbal Intelligence',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  'memory': {
    name: 'Memory & Recall',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/10',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  'mixed': {
    name: 'Comprehensive IQ',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCountry, setEditingCountry] = useState(false);
  const [editingAge, setEditingAge] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [newAge, setNewAge] = useState('');
  const [savingCountry, setSavingCountry] = useState(false);
  const [savingAge, setSavingAge] = useState(false);
  const ageInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProfile();
      setProfile(data);
      setNewCountry(data.country || '');
      setNewAge(data.age?.toString() || '');
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryUpdate = async () => {
    if (!newCountry) return;
    
    try {
      setSavingCountry(true);
      await updateCountry(newCountry);
      setProfile(prev => ({ ...prev, country: newCountry }));
      setEditingCountry(false);
    } catch (err) {
      setError('Failed to update country. Please try again.');
      console.error('Country update error:', err);
    } finally {
      setSavingCountry(false);
    }
  };

  const handleAgeUpdate = async () => {
    if (!newAge || isNaN(Number(newAge)) || Number(newAge) < 1 || Number(newAge) > 120) return;
    
    try {
      setSavingAge(true);
      await updateAge(Number(newAge));
      setProfile(prev => ({ ...prev, age: Number(newAge) }));
      setEditingAge(false);
    } catch (err) {
      setError('Failed to update age. Please try again.');
      console.error('Age update error:', err);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Profile
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Track your progress and achievements
          </motion.p>
        </motion.div>

        {/* User Info Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8 relative overflow-visible"
          style={{ zIndex: 10 }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
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
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center space-x-6">
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
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {profile.username}
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {profile.email}
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap items-start gap-4 mt-4"
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
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-[9999]"
                      >
                        <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 p-4 rounded-2xl shadow-xl min-w-[280px]">
                          <div className="flex items-center space-x-3 mb-3">
                            <MapPin className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Country</span>
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
                                  setNewCountry(profile.country || '');
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
                                {savingCountry ? 'Saving...' : 'Save'}
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
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl 
                                      group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-all border border-transparent 
                                      group-hover:border-gray-300 dark:group-hover:border-gray-600">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {profile.country || 'Add country'}
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
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Age</span>
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
                              <span className="text-sm text-gray-600 dark:text-gray-400">years old</span>
                            </div>
                            <div className="flex items-center justify-end space-x-2 pt-2">
                              <button
                                onClick={() => {
                                  setEditingAge(false);
                                  setNewAge(profile.age?.toString() || '');
                                }}
                                disabled={savingAge}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAgeUpdate}
                                disabled={savingAge || !newAge || Number(newAge) < 1 || Number(newAge) > 120}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {savingAge ? 'Saving...' : 'Save'}
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
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl 
                                      group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-all border border-transparent 
                                      group-hover:border-gray-300 dark:group-hover:border-gray-600">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {profile.age && profile.age > 0 ? `${profile.age} years old` : 'Add age'}
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
                      Joined {formatDate(profile.createdAt)}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Stats */}
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                {profile.totalTestsCompleted}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Tests Completed</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Test Statistics */}
        {profile.testStats && profile.testStats.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {profile.testStats.map((stat, index) => {
              const info = testTypeInfo[stat.testTypeId] || {};
              return (
                <motion.div
                  key={stat.testTypeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg backdrop-blur-md border ${info.borderColor} p-6 relative overflow-hidden`}
                >
                  {/* Decorative gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-5`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center">
                          <motion.div 
                            className={`p-3 rounded-xl bg-gradient-to-r ${info.color} mr-3 shadow-lg`}
                            whileHover={{ rotate: 15 }}
                          >
                            {React.cloneElement(info.icon, { className: "w-6 h-6 text-white" })}
                          </motion.div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {stat.testTypeName}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div 
                          className="text-3xl font-bold text-gray-900 dark:text-white"
                          whileHover={{ scale: 1.1 }}
                        >
                          {stat.testsCompleted}
                        </motion.div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attempts</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className="flex items-center mb-1">
                          <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Best</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {stat.bestScore}/100
                        </p>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className="flex items-center mb-1">
                          <Target className="w-4 h-4 mr-1 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {stat.averageScore}/100
                        </p>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Best Time</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {stat.bestTime}
                        </p>
                      </motion.div>
                    </div>

                    {stat.testTypeId === 'mixed' && stat.iqScore && (
                      <motion.div 
                        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Brain className="w-5 h-5 mr-2 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">IQ Score</span>
                          </div>
                          <motion.p 
                            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {stat.iqScore}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div 
                      className="mt-4 pt-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
                      whileHover={{ color: '#6B7280' }}
                    >
                      Last attempt: {formatDate(stat.lastAttempt)}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Recent Results */}
        {profile.recentResults && profile.recentResults.length > 0 && (
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-2xl font-semibold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Recent Results
            </motion.h2>
            <motion.div 
              className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50/80 dark:bg-gray-900/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Test
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Percentile
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      {profile.recentResults.some(r => r.testTypeId === 'mixed' && r.iqScore) && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          IQ Score
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 dark:bg-gray-800/80 divide-y divide-gray-200 dark:divide-gray-700">
                    {profile.recentResults.map((result, index) => {
                      const info = testTypeInfo[result.testTypeId] || {};
                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <motion.div 
                                className={`p-2 rounded-lg bg-gradient-to-r ${info.color} mr-3`}
                                whileHover={{ rotate: 15 }}
                              >
                                {React.cloneElement(info.icon, { className: "w-4 h-4 text-white" })}
                              </motion.div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.testTypeName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {result.score}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                /100
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex text-sm font-medium px-2.5 py-1 rounded-full ${
                              result.percentile <= 1
                                ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                                : result.percentile <= 5
                                ? 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30'
                                : result.percentile <= 10
                                ? 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30'
                                : 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/30'
                            }`}>
                              Top {result.percentile < 1 
                                ? result.percentile.toFixed(2) 
                                : result.percentile < 10 
                                ? result.percentile.toFixed(1) 
                                : Math.round(result.percentile)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              {result.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            <div>{formatDate(result.completedAt)}</div>
                            <div className="text-xs text-gray-500">{formatTime(result.completedAt)}</div>
                          </td>
                          {profile.recentResults.some(r => r.testTypeId === 'mixed' && r.iqScore) && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              {result.testTypeId === 'mixed' && result.iqScore ? (
                                <motion.span 
                                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {result.iqScore}
                                </motion.span>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                          )}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {profile.totalTestsCompleted === 0 && (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Trophy className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            </motion.div>
            <motion.h3 
              className="text-xl font-medium text-gray-900 dark:text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              No tests completed yet
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start your journey and take your first test
            </motion.p>
            <motion.button
              onClick={() => router.push('/tests')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-xl 
                       hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 cursor-pointer"
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

        {/* Data Privacy Section */}
        {profile && (
          <DataPrivacy />
        )}
      </motion.div>
    </div>
  );
}