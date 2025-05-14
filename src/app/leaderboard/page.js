// src/app/leaderboard/page.js
import LeaderboardPage from "@/components/leaderboard/LeaderboardPage";

// This is a Server Component
export default function Page() {
  // Use client-side rendering only to avoid hydration issues
  return <LeaderboardPage />;
}
