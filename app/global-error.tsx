"use client";

// Replaces the whole page when the root layout itself fails, so it carries its own tiny styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Georgia, serif", background: "#F6EFE6", color: "#5B1F2E", textAlign: "center", padding: "20vh 24px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 400 }}>Lace &amp; Luxe</h1>
        <p>Something went wrong on our side. Please try again in a moment.</p>
        <button onClick={reset} style={{ marginTop: 16, padding: "12px 28px", background: "#5B1F2E", color: "#F6EFE6", border: 0, borderRadius: 999, fontSize: 14, cursor: "pointer" }}>Try again</button>
      </body>
    </html>
  );
}
