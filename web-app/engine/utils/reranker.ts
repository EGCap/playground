import { RERANKER_MODEL, RetrievedDocument } from "../types";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_API_URL = "https://api.voyageai.com/v1/rerank";

export async function rerank(
  query: string,
  documents: RetrievedDocument[],
  model: RERANKER_MODEL = RERANKER_MODEL.VOYAGE
): Promise<RetrievedDocument[]> {
  if (model === RERANKER_MODEL.NONE || documents.length === 0) {
    return documents;
  }

  if (!VOYAGE_API_KEY) {
    console.error("Voyage API key not found. Please set VOYAGE_API_KEY environment variable.");
    return documents;
  }

  try {
    const response = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VOYAGE_API_KEY}`
      },
      body: JSON.stringify({
        model: "rerank-2",
        query: query,
        texts: documents.map(doc => doc.document)
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Voyage API error:", error);
      return documents;
    }

    const result = await response.json();
    
    // Map Voyage scores back to documents
    const rerankedDocs = documents.map((doc, index) => ({
      ...doc,
      rerank_score: result.scores[index]
    }));

    // Sort by reranking score in descending order
    return rerankedDocs.sort((a: RetrievedDocument, b: RetrievedDocument) => (b.rerank_score ?? 0) - (a.rerank_score ?? 0));
  } catch (error) {
    console.error("Reranking error:", error);
    return documents;
  }
}
