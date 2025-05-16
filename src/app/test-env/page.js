"use client";

export default function TestEnv() {
  const envInfo = {
    "NEXT_PUBLIC_API_URL": process.env.NEXT_PUBLIC_API_URL,
    "NODE_ENV": process.env.NODE_ENV,
    "Direct process.env access": {
      "NEXT_PUBLIC_API_URL": process.env.NEXT_PUBLIC_API_URL || "undefined",
    },
    "API URL used": process.env.NEXT_PUBLIC_API_URL || "http://localhost:5164",
    "Window location": typeof window !== "undefined" ? {
      "protocol": window.location.protocol,
      "hostname": window.location.hostname,
      "port": window.location.port,
      "origin": window.location.origin,
    } : "Server-side"
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envInfo, null, 2)}
      </pre>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Test API Call</h2>
        <button
          onClick={async () => {
            try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5164";
              console.log("Using API_URL:", API_URL);
              const response = await fetch(`${API_URL}/api/test/types`);
              console.log("Response:", response);
              const data = await response.text();
              console.log("Data:", data);
              alert(`API Response: ${response.status} - ${data.substring(0, 100)}`);
            } catch (error) {
              console.error("Error:", error);
              alert(`Error: ${error.message}`);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
}