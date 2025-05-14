"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated as checkAuth } from "@/fetch/auth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = checkAuth();
    
    if (!authenticated) {
      router.push("/");
      return;
    }
    
    setIsAuthenticated(true);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    // Optional: Show a loading state while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}