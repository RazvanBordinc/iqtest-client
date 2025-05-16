"use client";

import { useState } from "react";

export default function TestAPI() {
  const [results, setResults] = useState("");

  const testDirectBackend = async () => {
    try {
      // Use relative path to leverage Next.js API proxy
      const response = await fetch('/api/test/types', {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const text = await response.text();
      setResults(
        (prev) =>
          prev +
          `Direct Backend Response:\n${JSON.stringify(
            {
              status: response.status,
              statusText: response.statusText,
              data: text,
            },
            null,
            2
          )}\n\n`
      );
    } catch (error) {
      setResults((prev) => prev + `Direct Backend Error: ${error.message}\n\n`);
    }
  };

  const testAPIClient = async () => {
    try {
      const { default: api } = await import("@/fetch/api");
      const response = await api.get("test/types");
      setResults(
        (prev) =>
          prev +
          `API Client Response:\n${JSON.stringify(response, null, 2)}\n\n`
      );
    } catch (error) {
      setResults((prev) => prev + `API Client Error: ${error.message}\n\n`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <div className="space-x-4 mb-4">
        <button
          onClick={testDirectBackend}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Direct Backend
        </button>
        <button
          onClick={testAPIClient}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test API Client
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{results}</pre>
    </div>
  );
}