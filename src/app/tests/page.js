// src/app/tests/page.js
import TestSelectionPage from "@/components/tests/TestSelectionPage";
import { TEST_TYPES } from "@/components/constants/testTypes";

// This is a Server Component
export default function TestsPage() {
  // Pass all tests to the client component
  return <TestSelectionPage initialTests={TEST_TYPES} />;
}
