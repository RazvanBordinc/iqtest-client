"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  Globe, 
  Heart, 
  Code,
  Linkedin,
  Brain
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/RazvanBordinc", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/valentin-r%C4%83zvan-bord%C3%AEnc-30686a298/", label: "LinkedIn" },
    { icon: Globe, href: "https://bordincrazvan.com", label: "Personal Site" }
  ];

  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main footer content */}
        <div className="flex flex-col items-center text-center">
          {/* Brand section */}
          <Link href="/" className="flex items-center gap-2 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TestIQ
            </span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Discover your cognitive potential with our scientifically designed IQ tests.
          </p>
          
          {/* Social links */}
          <div className="flex gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <span>© {currentYear} TestIQ. Built with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                </motion.div>
                <span>by</span>
                <a
                  href="https://bordincrazvan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Răzvan
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/privacy-policy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookie-policy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Tech stack */}
            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-600">
              <Code className="w-3 h-3" />
              <span>Built with Next.js, React, Tailwind CSS, and .NET</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Minimal footer for test pages
export const MinimalFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 py-3 px-4 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>© {currentYear} TestIQ</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/RazvanBordinc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://bordincrazvan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            aria-label="Personal Website"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;