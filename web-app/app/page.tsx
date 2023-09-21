"use client";

import { Chunk } from "@/components/Chunk";
import { embeddingModelsInProd, userFriendlyNameByModel } from "@/engine/constants";
import { EMBEDDING_MODEL, QueryData, QueryResponse } from "@/engine/types";
import { FormEvent, useState } from "react";

// Used for determinstic ordering of models / results.
const modelSorter = (model1: string | null, model2: string | null) => {
  const idx1 = model1 ? embeddingModelsInProd.indexOf(EMBEDDING_MODEL[model1 as keyof typeof EMBEDDING_MODEL]) : -1;
  const idx2 = model2 ? embeddingModelsInProd.indexOf(EMBEDDING_MODEL[model2 as keyof typeof EMBEDDING_MODEL]) : -1;
  return idx1 - idx2;
}

// Creates a dictionary of embedding models with all values set to false
const initialEmbeddingChoices = embeddingModelsInProd.reduce(
  (choices, key) => {
    return { ...choices, [key]: true };
  },
  {}
);

export default function Home() {
  const [generateAnswer, setGenerateAnswer] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [embeddingChoices, setEmbeddingChoices] = useState<{
    [key: string]: boolean;
  }>(initialEmbeddingChoices);
  const [queryResponse, setQueryResponse] = useState<QueryResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  async function runQuery() {

    if(!query) {
      alert("Please enter a query");
      return;
    }
    setLoading(true);
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
    setLoading(false);
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
        {Object.keys(embeddingChoices).sort(modelSorter).map((model: string) => (
          <div key={model}>
            <input
              type="checkbox"
              name="modelChoice"
              checked={embeddingChoices[model]}
              onChange={(e) =>
                setEmbeddingChoices({
                  ...embeddingChoices,
                  [model]: e.target.checked,
                })
              }
            />
            <label>{userFriendlyNameByModel.get(model)}</label>
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
            <label>Generate an Answer (RAG)? </label>
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
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              <p>Run Query</p>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {queryResponse &&
          queryResponse.data.sort((a: QueryData, b: QueryData) => {
            return modelSorter(a.embeddingModel, b.embeddingModel);
          }).map((querydata, idx) => {
            const chunks = querydata.documents.map((chunk, index) => {
              return <Chunk key={index} dataset={chunk.dataset} text={chunk.document} similarity={chunk.similarity} />;
            });
            return (
              <div className="flex flex-col flex-1" key={idx}>
                <p><b>Embedding Model</b>: {querydata.embeddingModel ? userFriendlyNameByModel.get(querydata.embeddingModel) : 'No context retrieved'}</p>
                <p><b>Answer</b>: { querydata.answer.response}</p>
                <div className="flex flex-col gap-4 ">{chunks}</div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
