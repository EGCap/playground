"use client"

import { FormEvent, useState } from 'react'

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [shouldFetchDocs, setShouldFetchDocs] = useState<boolean>(false);

  async function runQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: formData.get('queryString'),
        fetchDocs: shouldFetchDocs,
      })
    })
 
    const data = await response.json()
    setResponse(data.result)
  }

  const handleCheckboxChange = () => {
    setShouldFetchDocs(!shouldFetchDocs);
  }
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={runQuery}>
        <input type="text" size={75} name="queryString" />
        <div/>
        <label>
          <input type="checkbox" checked={shouldFetchDocs} onChange={handleCheckboxChange}/>
          Fetch Related Documents?
        </label>
        <div/>
        <button type="submit">Run Query</button>
      </form>
      <p>{response}</p>
    </main>
  )
}
