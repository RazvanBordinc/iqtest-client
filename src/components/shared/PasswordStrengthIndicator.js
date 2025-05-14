"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { id: "lowercase", label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { id: "number", label: "One number", test: (pwd) => /\d/.test(pwd) },
  { id: "special", label: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export default function PasswordStrengthIndicator({ password, show = false }) {
  const calculateStrength = () => {
    const passed = passwordRequirements.filter(req => req.test(password)).length;
    if (passed === 0) return { level: 0, label: "Very Weak", color: "bg-red-500" };
    if (passed <= 2) return { level: 1, label: "Weak", color: "bg-orange-500" };
    if (passed <= 3) return { level: 2, label: "Fair", color: "bg-yellow-500" };
    if (passed <= 4) return { level: 3, label: "Good", color: "bg-green-500" };
    return { level: 4, label: "Strong", color: "bg-green-600" };
  };

  const strength = calculateStrength();

  return (
    <motion.div
      initial={false}
      animate={{
        height: show && password ? "auto" : 0,
        opacity: show && password ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-2 space-y-2">
        {/* Strength Bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${strength.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength.level + 1) * 20}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Strength Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs font-medium ${
            strength.level < 2 ? 'text-red-600 dark:text-red-400' :
            strength.level < 4 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}
        >
          Password Strength: {strength.label}
        </motion.p>

        {/* Requirements List */}
        <motion.ul className="space-y-1">
          {passwordRequirements.map((req, index) => {
            const isMet = req.test(password);
            return (
              <motion.li
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center text-xs"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="mr-2"
                >
                  {isMet ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                </motion.div>
                <span className={isMet ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
                  {req.label}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </motion.div>
  );
}