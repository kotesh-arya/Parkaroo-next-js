'use client';

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", backgroundColor: "#f9fafb", padding: "1rem" }}>
      <h1 style={{ fontSize: "2rem", color: "#dc2626", marginBottom: "1rem" }}>Unauthorized</h1>
      <p style={{ fontSize: "1rem", color: "#374151", marginBottom: "1.5rem" }}>
        You do not have permission to access this page.
      </p>
      <button
        onClick={() => router.back()}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.9rem"
        }}
      >
        Go Back
      </button>
    </div>
  );
}
