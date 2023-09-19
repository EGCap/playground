"use client";

import { EMBEDDING_MODEL, QueryResponse } from "@/engine/types";
import { FormEvent, MouseEventHandler, useState } from "react";

export default function Home() {
  const [generateAnswer, setGenerateAnswer] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [embeddingModelChoice, setEmbeddingModelChoice] = useState<
    string | null
  >(null);
  const [queryResponse, setQueryResponse] = useState<QueryResponse>();

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
        modelToRetrieveDocs: embeddingModelChoice,
      }),
    });

    const data = await response.json();
    console.log("DATA:", data);
    setQueryResponse(data);
  }

  const handleCheckboxChange = () => {
    setGenerateAnswer(!generateAnswer);
  };

  const handleQueryChange = (event: FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const displayModelChoice = () => {
    const modelsWithUserFriendlyNames = [
      [EMBEDDING_MODEL.OPEN_AI, "text-ada-002"],
      [EMBEDDING_MODEL.IMAGEBIND, "ImageBind"],
      [EMBEDDING_MODEL.MPNET_BASE_V2, "mpnet-base-v2"],
    ];
    return (
      <div>
        {modelsWithUserFriendlyNames.map((model) => (
          <div key={model[0]}>
            <input
              type="radio"
              value={model[0]}
              name="modelChoice"
              checked={embeddingModelChoice === model[0]}
              onChange={(e) => setEmbeddingModelChoice(e.target.value)}
            />
            <label>{model[1]}</label>
          </div>
        ))}
      </div>
    );
  };

  // const displayModelResponse = () => {
  //   if (modelResponse) {
  //     return (
  //       <div>
  //         <p>
  //           <h3>Model Response:</h3>
  //           {modelResponse}
  //         </p>
  //       </div>
  //     )
  // }
  // }

  // const displayRetrievedDocs = () => {
  //   if (retrievedDocs.length > 0) {
  //     return (
  //       <div className="flex flex-col gap-4">
  //         {retrievedDocs.map((doc, idx)  => (
  //           <div key={idx} className="bg-gray-100 rounded-md">
  //             <h4 className="font-bold">Doc {idx}:</h4>
  //             <p>{doc.slice(0, 1000)}</p>
  //             {/* Add expandable functionality here */}

  //           </div>
  //         ))}
  //       </div>
  //     )
  //   }
  // }

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
      <div>
        {queryResponse &&
          queryResponse.data.map((querydata, idx) => {
            const chunks = querydata.documents.map((chunk) => {
              return (
                <>
                  <p>{chunk.value}</p>
                </>
              );
            });
            return (
              <div className="" key={idx}>
                <p>Query:{queryResponse.query}</p>
                <p>Embedding Model:{querydata.embeddingModel}</p>
                {chunks}
              </div>
            );
          })}
      </div>
    </main>
  );
}
