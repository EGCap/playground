"use client"

import { FormEvent, MouseEventHandler, useState } from 'react'

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [shouldFetchDocs, setShouldFetchDocs] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  async function runQuery() {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        fetchDocs: shouldFetchDocs,
      })
    })
 
    const data = await response.json()
    setResponse(data.result)
  }

  const handleCheckboxChange = () => {
    setShouldFetchDocs(!shouldFetchDocs);
  }
  
  const handleQueryChange = (event: FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  }
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <input type="text"  className=" text-black" size={75} name="queryString"  onChange={handleQueryChange}/>
        <div/>
        <label>
          <input type="checkbox" checked={shouldFetchDocs} onChange={handleCheckboxChange}/>
          Fetch Related Documents?
        </label>
        <div/>
        <button onClick={runQuery}>Run Query</button>
      </form>
      <p>{response}</p>
    </main>
  )
}
