"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, ArrowDownToLine } from "lucide-react";

const DataPrivacy = () => {
  return (
    <motion.div
      className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-lg h-full overflow-y-auto flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-purple-500" />
        Data Privacy & Security
      </h3>

      <div className="space-y-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30"
            whileHover={{
              y: -5,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Secure Storage
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All your data is encrypted and stored securely on our protected
                servers
              </p>
            </div>
          </motion.div>

          <motion.div
            className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30"
            whileHover={{
              y: -5,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mb-3">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Privacy First
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We never share your personal information with third parties
              </p>
            </div>
          </motion.div>

          <motion.div
            className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30"
            whileHover={{
              y: -5,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center mb-3">
                <ArrowDownToLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Data Ownership
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You maintain full ownership and control of your data and test
                results
              </p>
            </div>
          </motion.div>
        </div>

        {/* Data Control Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-purple-500" />
            Your Data Controls
          </h4>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your test results are used to calculate global averages and
                percentiles.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your results are stored anonymously to protect your privacy.
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can delete your account and all associated data at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For more information, please read our{" "}
            <a
              href="/privacy-policy"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DataPrivacy;
