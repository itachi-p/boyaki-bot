"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
    <main className={styles.container}>
      <h1 className={styles.title}>GPT-5系 比較テスト</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className={styles.input}
          placeholder="ボヤいてください"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
      <div className={styles.results}>
        {results.map((r) => (
          <div key={r.model} className={styles.resultCard}>
            <h3 className={styles.resultTitle}>{r.model}</h3>
            <p className={styles.resultText}>{r.response}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
