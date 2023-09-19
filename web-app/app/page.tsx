"use client";

import { Chunk } from "@/components/Chunk";
import { EMBEDDING_MODEL, QueryResponse } from "@/engine/types";
import { FormEvent, MouseEventHandler, useState } from "react";

// Add additional embedding models to enable here
const modelsWithUserFriendlyNames = {
  [EMBEDDING_MODEL.OPEN_AI]: "text-ada-002",
  [EMBEDDING_MODEL.IMAGEBIND]: "ImageBind",
  [EMBEDDING_MODEL.MPNET_BASE_V2]: "mpnet-base-v2",
};

// Creates a dictionary of embedding models with all values set to false
const initialEmbeddingChoices = Object.keys(modelsWithUserFriendlyNames).reduce((choices, key) => {
  return { ...choices, [key]: true };
}, {});

export default function Home() {
  const [generateAnswer, setGenerateAnswer] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [embeddingChoices, setEmbeddingChoices] = useState<{[key: string]: boolean}>(initialEmbeddingChoices);
  const [queryResponse, setQueryResponse] = useState<QueryResponse>();
  
  const datasets = ["wikipedia", "reddit", "arxiv"];

  async function runQuery() {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        generateAnswer: generateAnswer,
        modelsToRetrieveDocs: embeddingChoices,
      }),
    });

    const data = await response.json();
    setQueryResponse(data);
  }

  const handleCheckboxChange = () => {
    setGenerateAnswer(!generateAnswer);
  };

  const handleQueryChange = (event: FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const displayModelChoice = () => {
    return (
      <div>
        {Object.keys(embeddingChoices).map((model: string) => (
          <div key={model}>
            <input
              type="checkbox"
              name="modelChoice"
              checked={embeddingChoices[model]}
              onChange={(e) => setEmbeddingChoices({
                ...embeddingChoices,
                [model]: e.target.checked,
              })}
            />
            <label>{model}</label>
          </div>
        ))}
      </div>
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div className="flex flex-col mx-auto">
        <div id="title">
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
            <label>Generate an Answer (RAG)?</label>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={generateAnswer}
              onChange={handleCheckboxChange}
            />
          </div>
          <div>
            <p>Embedding models:</p>
            {displayModelChoice()}
          </div>
          <button
            className="bg-primary text-teal-950 font-bold py-2 px-4 rounded"
            onClick={runQuery}
          >
            Run Query
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {queryResponse &&
          queryResponse.data.map((querydata, idx) => {
            const chunks = querydata.documents.map((chunk, index) => {
              console.log(chunk);
                return (
                  <Chunk key={index} text={chunk.value} />
                )
            });
            return (
              <div className="flex flex-col flex-1" key={idx}>
                <p>Query:{queryResponse.query}</p>
                <p>Embedding Model:{querydata.embeddingModel}</p>
                <p>Answer:{querydata.answer.response}</p>
                <p>Answer Model:{querydata.answer.model}</p>
                <div className="flex flex-col gap-4 ">
                  {chunks}
                </div>
                <div style={{ flex: 1 }}></div> {/* Add this div to fill the remaining space */}

              </div>
            );
          })}
      </div>
    </main>
  );
}
