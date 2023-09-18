"use client"

import { EMBEDDING_MODEL } from '@/engine/types';
import { FormEvent, useState } from 'react'

export default function Home() {
  const [shouldFetchDocs, setShouldFetchDocs] = useState<boolean>(false);
  const [embeddingModelChoice, setEmbeddingModelChoice] = useState<string | null>(null);
  const [queryResponse, setQueryResponse] = useState<string>('');

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
        modelToRetrieveDocs: embeddingModelChoice,
      })
    })
 
    const data = await response.json()
    setQueryResponse(data.result)
  }

  const handleCheckboxChange = () => {
    setShouldFetchDocs(!shouldFetchDocs);
    // If we're toggling this, we should also clear out the existing model choice.
    setEmbeddingModelChoice(null);
  }

  const displayModelChoice = () => {
    if (shouldFetchDocs) {
      const modelsWithUserFriendlyNames = [
        [EMBEDDING_MODEL.OPEN_AI, 'text-ada-002'],
        [EMBEDDING_MODEL.IMAGEBIND, 'ImageBind'],
        [EMBEDDING_MODEL.MPNET_BASE_V2, 'mpnet-base-v2']
      ]
      return (
        <div>
          {modelsWithUserFriendlyNames.map(model => (
            <div key={model[0]}>
            <input
              type="radio"
              value={model[0]}
              name="modelChoice"
              checked={embeddingModelChoice === model[0]}
              onChange={e => setEmbeddingModelChoice(e.target.value)}
            />
            <label>{model[1]}</label>
          </div>
          ))}
        </div>
      )
    }
  }
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={runQuery}>
        <input type="text" className=" text-black" size={75} name="queryString" />
        <div/>
        <label>
          <input type="checkbox" checked={shouldFetchDocs} onChange={handleCheckboxChange}/>
          Fetch Related Documents?
        </label>
        <div/>
        {displayModelChoice()}
        <button type="submit">Run Query</button>
      </form>
      <p>{queryResponse}</p>
    </main>
  )
}
