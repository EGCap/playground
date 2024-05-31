import { rerankDocumentsCohere } from "../clients/cohere";
import { rerankDocumentsJina } from "../clients/jina";
import { rerankDocumentsVoyage } from "../clients/voyage";
import { RERANKING_MODEL, RetrievedDocument } from "../types";

export const rerankDocuments = async (
    query: string,
    documents: RetrievedDocument[],
    rerankingModel: RERANKING_MODEL,
    maxDocuments: number,
) => {
    if (maxDocuments > documents.length) {
        maxDocuments = documents.length;
    }
    for (let i = 0; i < 4; i++) {
        try {
            switch (rerankingModel as RERANKING_MODEL) {
                case RERANKING_MODEL.NONE:
                    return documents;
                case RERANKING_MODEL.COHERE:
                    return rerankDocumentsCohere(query, documents, maxDocuments);
                case RERANKING_MODEL.VOYAGE:
                    return rerankDocumentsVoyage(query, documents, maxDocuments);
                case RERANKING_MODEL.JINA:
                    return rerankDocumentsJina(query, documents, maxDocuments);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}