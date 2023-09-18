"use client";

import { FormEvent, MouseEventHandler, useState } from "react";

export default function Home() {
  const [response, setResponse] = useState<string>("");
  const [generateAnswer, setGenerateAnswer] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const datasets = ["wikipedia", "reddit", "arxiv"];
  const embeddingModels = ["ada-002", "ada-003", "ada-004", "ada-005"];

  async function runQuery() {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        generateAnswer: generateAnswer,
      }),
    });

    const data = await response.json();
    setResponse(data.result);
  }

  const handleCheckboxChange = () => {
    setGenerateAnswer(!generateAnswer);
  };

  const handleQueryChange = (event: FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div>
        <h1 className="text-4xl font-bold">Embedding Playground</h1>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="queryString">Your query:</label>
        <input
          type="text"
          className="text-black rounded-md border border-black"
          size={75}
          name="queryString"
          onChange={handleQueryChange}
        />
        <div className="ml-3 text-sm leading-6">
          <label>
          Generate an Answer (RAG)?
          </label>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={generateAnswer}
            onChange={handleCheckboxChange}
          />
        </div>
        <button
          className="bg-primary text-teal-950 font-bold py-2 px-4 rounded"
          onClick={runQuery}
        >
          Run Query
        </button>
        <p>{response}</p>
      </div>
    </main>
  );
}
