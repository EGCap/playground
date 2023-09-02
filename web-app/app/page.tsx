"use client"

import { FormEvent, useState } from 'react'

export default function Home() {
  const [response, setResponse] = useState<string>('');

  async function runQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.get('queryString'))
    })
 
    const data = await response.json()
    setResponse(data.result)
  }
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={runQuery}>
        <input type="text" name="queryString" />
        <button type="submit">Query</button>
      </form>
      <p>{response}</p>
    </main>
  )
}
