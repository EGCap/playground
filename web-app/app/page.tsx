"use client";

import { Chunk } from "@/components/Chunk";
import {
  DATASET,
  EMBEDDING_MODEL,
  QueryData,
  QueryResponse,
  enabledDatasets,
  enabledEmbeddingModels,
  userFriendlyNameByDataset,
  userFriendlyNameByModel,
} from "@/engine/types";
import { FormEvent, useState } from "react";

const DEFAULT_MAX_DOCUMENTS: number = 5;
const MAX_DOCUMENTS_UPPER_BOUND: number = 20;

// Used for determinstic ordering of models / results.
const modelSorter = (model1: string | null, model2: string | null) => {
  const idx1 = model1 ? enabledEmbeddingModels.indexOf(EMBEDDING_MODEL[model1 as keyof typeof EMBEDDING_MODEL]) : -1;
  const idx2 = model2 ? enabledEmbeddingModels.indexOf(EMBEDDING_MODEL[model2 as keyof typeof EMBEDDING_MODEL]) : -1;
  return idx1 - idx2;
}


// Creates a dictionary of embedding models with all values set to true
const initialEmbeddingChoices = enabledEmbeddingModels.reduce((acc, model) => {
  return { ...acc, [model]: true };
}, {});

const initialDatasetChoices = enabledDatasets.reduce((acc, dataset) => {
  return { ...acc, [dataset]: true };
}, {});

const formStates = ["Search", "Upload"];

export default function Home() {
  const [generateAnswer, setGenerateAnswer] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [embeddingChoices, setEmbeddingChoices] = useState<{
    [key: string]: boolean;
  }>(initialEmbeddingChoices);
  const [datasetsChoices, setDatasetsChoices] = useState<{
    [key: string]: boolean;
  }>(initialDatasetChoices);
  const [queryResponse, setQueryResponse] = useState<QueryResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadText, setUploadText] = useState<string>("");
  const [formState, setFormState] = useState<string>("Search");
  const [maxDocuments, setMaxDocuments] = useState<number>(DEFAULT_MAX_DOCUMENTS);

  async function runQuery() {
    if (!query) {
      alert("Please enter a query.");
      return;
    }

    if (!Number.isInteger(maxDocuments) || maxDocuments <= 0 || maxDocuments > MAX_DOCUMENTS_UPPER_BOUND) {
      alert(`Please enter a value between 1 and ${MAX_DOCUMENTS_UPPER_BOUND} for the number of documents to fetch.`);
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
        datasets: datasetsChoices,
        maxDocuments: maxDocuments,
      }),
    });

    const data = await response.json();
    setQueryResponse(data);
    setLoading(false);
  }

  const handleCheckboxChange = () => {
    setGenerateAnswer(!generateAnswer);
  };

  const handleMaxDocumentsChange = (event: FormEvent<HTMLInputElement>) => {
    setMaxDocuments(Number(event.currentTarget.value));
  }

  const handleQueryChange = (event: FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleUploadText = async () => {
    // uploadText state variable
    if (!uploadText) {
      alert("Please enter text to upload");
      return;
    }
    setLoading(true);
    const toUploadText = uploadText;
    setUploadText("");
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: toUploadText,
      }),
    });
    
    setLoading(false);
  };

  const displayDatasets = () => {
    return (
      <div>
        {Object.keys(datasetsChoices).map((dataset: string) => {
          const datasetName = DATASET[dataset as keyof typeof DATASET];
          const friendlyName = userFriendlyNameByDataset.get(datasetName);
          return (
            <div key={dataset}>
              <input
                type="checkbox"
                name="dataset"
                checked={datasetsChoices[dataset]}
                onChange={(e) =>
                  setDatasetsChoices({
                    ...datasetsChoices,
                    [dataset]: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label className="pl-2">{friendlyName}</label>
            </div>
          );
        })}
      </div>
    );
  };

  const displayModelChoice = () => {
    return (
      <div>
        {Object.keys(embeddingChoices).sort(modelSorter).map((model: string) => {
          const modelName =
            EMBEDDING_MODEL[model as keyof typeof EMBEDDING_MODEL];
          const friendlyName = userFriendlyNameByModel.get(modelName);
          return (
            <div key={model}>
              <input
                type="checkbox"
                name="modelChoice"
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                checked={embeddingChoices[model]}
                onChange={(e) =>
                  setEmbeddingChoices({
                    ...embeddingChoices,
                    [model]: e.target.checked,
                  })
                }
              />
              <label className="pl-2">{friendlyName}</label>
            </div>
          );
        })}
      </div>
    );
  };

  const uploadTextComponent = () => {
    return (
      <div className="mt-4 flex flex-col gap-1">
        <p>Enter text to upload:</p>
        <textarea
          className="p-2 mt-2 border-black block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:border-emerald-300 focus:ring-emerald-500"
          rows={4}
          cols={50}
          onChange={(e) => {
            setUploadText(e.target.value);
          }}
          value={uploadText}
          style={{ resize: "none" }}
        />
        <button
          className="bg-primary text-teal-950 font-bold py-2 px-4 rounded mt-6"
          onClick={handleUploadText}
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
            <p>Upload</p>
          )}
        </button>
      </div>
    );
  };
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const FormStateComponent = () => {
    return (
      <div className="mt-4 rounded-md">
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={"search"}
              onChange={(e) => setFormState(e.target.value)}
            >
              {formStates.map((formState) => (
                <option key={formState}>{formState}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {formStates.map((state) => (
                <a
                  key={state}
                  href={"#"}
                  className={classNames(
                    formState == state
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-500 hover:text-gray-700",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                  aria-current={formState == state ? "page" : undefined}
                  onClick={() => setFormState(state)}
                >
                  {state}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col sm:items-center gap-4 p-4 sm:p-24">
      <div className="flex flex-col mx-auto w-full sm:w-1/2">
        <div id="title">
          <h1 className="text-4xl font-bold">Embedding Battleground</h1>
        </div>

        <div id="author" className="flex flex-col gap-2 mt-4">
          <h3>Built by {" "}
            <a className="hover-link" href="https://twitter.com/shreyanj98">Shreyan Jain</a>, {" "}
            <a className="hover-link" href="https://twitter.com/davidtsong">David Song</a>, and {" "}
            <a className="hover-link" href="https://twitter.com/eladgil">Elad Gil</a>
          </h3>
        </div>

        {FormStateComponent()}

        {formState === "Upload" && uploadTextComponent()}

        {formState === "Search" && (
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="queryString">Search for relevant documents</label>
            <input
              type="text"
              className="border-black p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:border-emerald-300 focus:ring-emerald-500"
              autoComplete="off"
              size={75}
              name="queryString"
              onChange={handleQueryChange}
            />

            <div className="flex flex-row gap-12">
              <div>
                {/* Embedding models */}
                <div className="mt-4">
                  <p className="font-bold">Embedding models</p>
                  {displayModelChoice()}
                </div>
              </div>
              <div>
                {/* Dataset options */}
                <div className="mt-4">
                  <p className="font-bold">Datasets</p>
                  {displayDatasets()}
                </div>

                {/* Additional options */}
                <div className="leading-6 mt-2">
                  <p className="font-bold">Extra:</p>
                  <div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                      checked={generateAnswer}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ml-2">Generate an Answer (RAG)?</label>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max={MAX_DOCUMENTS_UPPER_BOUND}
                      step="1"
                      className="h-8 rounded border-gray-300 focus:ring-emerald-600"
                      value={maxDocuments}
                      onChange={handleMaxDocumentsChange}
                    />
                    <label className="ml-2">Number of Documents to Fetch</label>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="bg-primary text-teal-950 font-bold py-2 px-4 rounded mt-6"
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
        )}
      </div>
      <div className="flex flex-row gap-4 mt-6 overflow-x-auto">
        {queryResponse &&
          queryResponse.data.sort((a: QueryData, b: QueryData) => {
            return modelSorter(a.embeddingModel, b.embeddingModel);
          }).map((querydata, idx) => {
            const chunks = querydata.documents.map((chunk, index) => {
              return (
                <Chunk
                  key={index}
                  dataset={chunk.dataset}
                  text={chunk.document}
                  similarity={chunk.similarity}
                />
              );
            });
            return (
              <div className="flex flex-col min-w-[50%] sm:min-w-0 text-xs sm:text-base sm:flex-1" key={idx}>
                <p>
                  <b>Embedding Model</b>:{" "}
                  {querydata.embeddingModel ? userFriendlyNameByModel.get(querydata.embeddingModel) : 'No context retrieved'}
                </p>
                <p><b>Answer</b>: {querydata.answer.response}</p>
                <div className="flex flex-col gap-4 sm:flex-1">{chunks}</div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
