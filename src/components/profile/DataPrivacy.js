"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import api from "@/fetch/api";
import { removeCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { showError } from "@/components/shared/ErrorModal";

const DataPrivacy = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/userdata/export");
      const data = response;
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iqtest-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      showError(error.message || "Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete("/userdata/delete");
      
      // Clear all cookies and redirect to home
      removeCookie("token");
      removeCookie("refreshToken");
      removeCookie("userData");
      localStorage.clear();
      
      router.push("/");
    } catch (error) {
      showError(error.message || "Failed to delete data");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-neutral-800 rounded-lg border-2 border-neutral-200 dark:border-neutral-700">
      <h3 className="text-lg font-semibold mb-4">Data Privacy</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleDataExport}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export My Data
          </button>
          <p className="text-sm text-neutral-500 mt-1">
            Download all your data in JSON format
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
          <p className="text-sm text-neutral-500 mt-1">
            Permanently delete your account and all data
          </p>
        </div>
      </div>

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-md w-full mx-4"
          >
            <h4 className="text-lg font-semibold mb-4">
              Are you sure you want to delete your account?
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              This action cannot be undone. All your data, test results, and
              leaderboard entries will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDataDelete}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1 bg-neutral-200 dark:bg-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DataPrivacy;