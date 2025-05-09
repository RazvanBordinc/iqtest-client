import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeaderboardPage from "@/components/leaderboard/LeaderboardPage";
import { getGlobalLeaderboard, getUserRanking } from "@/fetch/leaderboard";
import { TEST_TYPES } from "@/components/constants/testTypes";

// This is a Server Component
export default async function Page() {
  // Check for authentication token
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  // If not authenticated, redirect to login
  if (!token) {
    redirect("/auth");
  }

  try {
    // Fetch global leaderboard and user ranking
    const [leaderboardData, userRankingData] = await Promise.all([
      getGlobalLeaderboard(50), // Get top 50 users
      getUserRanking(),
    ]);

    // Pass the data to the client component
    return (
      <LeaderboardPage
        initialLeaderboard={leaderboardData}
        initialUserRanking={userRankingData}
        testTypes={TEST_TYPES}
      />
    );
  } catch (error) {
    // Handle error while still allowing page to render
    console.error("Failed to fetch leaderboard data:", error);
    return (
      <LeaderboardPage
        initialLeaderboard={[]}
        initialUserRanking={null}
        testTypes={TEST_TYPES}
        error={error.message}
      />
    );
  }
}
