"use client";

import { useState } from "react";

type ModelResult = {
  model: string;
  response: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ModelResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>GPT-5系 比較テスト</h1>
      <textarea
        rows={4}
        style={{ width: "100%", marginTop: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        style={{ marginTop: 10 }}
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "送信中..." : "送信"}
      </button>
      <div style={{ marginTop: 20 }}>
        {results.map((r) => (
          <div key={r.model} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{r.model}</h3>
            <p>{r.response}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
