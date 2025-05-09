// src/app/tests/page.js
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import TestSelectionPage from "@/components/tests/TestSelectionPage";
import { TEST_TYPES } from "@/components/constants/testTypes";

// This is a Server Component
export default async function TestsPage() {
  // Check for authentication token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // If not authenticated, redirect to login
  if (!token) {
    redirect("/auth");
  }

  // No need to fetch tests - they're defined in constants
  return <TestSelectionPage initialTests={TEST_TYPES} />;
}
