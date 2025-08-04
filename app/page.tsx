'use client'

import { useState } from 'react'
import styles from './page.module.css'

const styleOptions = [
  { key: 'default', label: '標準' },
  { key: 'kansai', label: '関西のおばちゃん' },
  { key: 'nekojin', label: '半獣猫人' },
  { key: 'roujin', label: 'インターネット老人会' },
  { key: 'downer', label: '脱力系' },
]

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('default')
  const [response35, setResponse35] = useState('')
  const [response4o, setResponse4o] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!userInput.trim()) return
    setLoading(true)
    setError(null)
    setResponse35('')
    setResponse4o('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          style: selectedStyle,
        }),
      })

      if (!res.ok) throw new Error(`API request failed: ${res.status}`)

      const data = await res.json()
      setResponse35(data.result_35 || '')
      setResponse4o(data.result_4o || '')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold mb-4">AIボヤキ相槌ジェネレーター</h1>

      <textarea
        placeholder="ここにボヤキを入力してください"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full h-20 p-2 border rounded mb-4 text-black bg-white dark:bg-gray-800 dark:text-white"
        style={{ resize: 'vertical' }}
      />

      <select
        value={selectedStyle}
        onChange={(e) => setSelectedStyle(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {styleOptions.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading || !userInput.trim()}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '生成中...' : '送信'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {response35 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">GPT-3.5 の応答:</h2>
          <p className="p-2 bg-gray-100 rounded dark:bg-gray-700 dark:text-white whitespace-pre-wrap">{response35}</p>
        </div>
      )}

      {response4o && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">GPT-4o の応答:</h2>
          <p className="p-2 bg-gray-100 rounded dark:bg-gray-700 dark:text-white whitespace-pre-wrap">{response4o}</p>
        </div>
      )}
    </main>
  )
}
