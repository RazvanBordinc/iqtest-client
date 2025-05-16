import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TestStartPage from "@/components/tests/TestStartPage";
import { getQuestionsByTestType } from "@/fetch/questions";
import { getTestById } from "@/fetch/tests";
import AuthGuard from "@/components/shared/AuthGuard";

// This is a Server Component
export default async function StartPage({ searchParams }) {
  // Check for authentication token
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // If not authenticated, redirect to home
  if (!token) {
    redirect("/");
  }

  const { category } = searchParams;

  // If no category selected, redirect to tests selection page
  if (!category) {
    redirect("/tests");
  }

  // Get test type from constants
  const testData = getTestById(category);

  // Redirect if invalid test type
  if (!testData) {
    redirect("/tests");
  }

  let questionsData = [];
  let errorMessage = null;

  try {
    // Get questions from API
    questionsData = await getQuestionsByTestType(category);
  } catch (error) {
    console.error("Failed to fetch test questions:", error);
    errorMessage = error.message;
  }

  // Pass the data to the client component wrapped with AuthGuard
  return (
    <AuthGuard>
      <TestStartPage
        testType={testData}
        initialQuestions={questionsData}
        error={errorMessage}
      />
    </AuthGuard>
  );
}
