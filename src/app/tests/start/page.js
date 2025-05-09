import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TestStartPage from "@/components/tests/TestStartPage";
import { getQuestionsByTestType } from "@/fetch/questions";
import { getTestById } from "@/fetch/tests";

// This is a Server Component
export default async function StartPage({ searchParams }) {
  // Check for authentication token
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // If not authenticated, redirect to login
  if (!token) {
    redirect("/auth");
  }

  const { category } = searchParams;

  // If no category selected, redirect to tests selection page
  if (!category) {
    redirect("/tests");
  }

  try {
    // Get test type from constants and questions from API
    const testData = getTestById(category);

    // Redirect if invalid test type
    if (!testData) {
      redirect("/tests");
    }

    // Get questions from API
    const questionsData = await getQuestionsByTestType(category);

    // Pass the data to the client component
    return (
      <TestStartPage testType={testData} initialQuestions={questionsData} />
    );
  } catch (error) {
    // Handle error while still allowing page to render
    console.error("Failed to fetch test questions:", error);
    return (
      <TestStartPage
        testType={getTestById(category)}
        initialQuestions={[]}
        error={error.message}
      />
    );
  }
}
