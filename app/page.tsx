'use client'

import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResponse('')

    // ユーザー入力を使い、APIに送るプロンプトを作成
  const prompt = `あなたはユーモアのセンスが抜群なAI相槌職人です。ユーザーの不満には、少し皮肉や比喩、ネットミームなどを交えた軽快な一言で返してください。くどくならず、1行でシュールかつ笑える返事をお願いします。不満：「${input}」 返事：`

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })  // promptを送信
    })

    if (!res.ok) {
      setResponse(`エラー発生: ${res.status} ${res.statusText}`)
      setLoading(false)
      return
    }

    const data = await res.json()
    setResponse(data.result.trim())
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">ぼやき相槌ボット</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          placeholder="なんかぼやいてください…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 mb-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? '考え中…' : 'ぼやく'}
        </button>
      </form>
      {response && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-md text-gray-700">
          <p><strong>返事：</strong>{response}</p>
        </div>
      )}
    </main>
  )
}
