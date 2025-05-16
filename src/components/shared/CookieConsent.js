"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, X } from "lucide-react";
import Link from "next/link";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    functional: true,
    performance: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const savePreferences = (acceptAll = false) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      preferences: acceptAll
        ? { essential: true, functional: true, performance: true }
        : preferences,
      acceptAll,
    };

    // Save to localStorage
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    
    // Set cookie for server-side checking
    document.cookie = `cookieConsent=${acceptAll ? 'all' : 'custom'}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=strict`;
    
    // Hide banner
    setShowBanner(false);
  };

  const acceptAll = () => {
    savePreferences(true);
  };

  const rejectAll = () => {
    setPreferences({
      essential: true,
      functional: false,
      performance: false,
    });
    savePreferences(false);
  };

  const saveCustom = () => {
    savePreferences(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Background overlay when details are shown */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetails(false)}
            />
          )}

          {/* Main banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 md:left-auto md:right-8 md:w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cookie Settings
                </h3>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {!showDetails ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We use cookies to enhance your experience. By continuing to use our site, you agree to our use of cookies.{" "}
                    <Link
                      href="/cookie-policy"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>

                  {/* Quick actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={rejectAll}
                      className="flex-1 py-2.5 px-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Customize
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Choose which cookies you want to accept. Required cookies are always enabled.
                  </p>

                  {/* Cookie categories */}
                  <div className="space-y-4 mb-6">
                    {/* Essential cookies */}
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Essential Cookies
                          </h4>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                            Always Enabled
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Required for the website to function properly. These include authentication and session management.
                        </p>
                      </div>
                    </div>

                    {/* Functional cookies */}
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences({ ...preferences, functional: e.target.checked })
                        }
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Functional Cookies
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Remember your preferences and enhance your experience, such as theme settings and test history.
                        </p>
                      </div>
                    </div>

                    {/* Performance cookies */}
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={preferences.performance}
                        onChange={(e) =>
                          setPreferences({ ...preferences, performance: e.target.checked })
                        }
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Performance Cookies
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Help us understand how visitors use our website by collecting anonymous statistics.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={saveCustom}
                      className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Privacy badge */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                <span>
                  Your privacy is important to us. Read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;