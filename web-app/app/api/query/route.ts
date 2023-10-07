import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '@/engine/utils/query'
import { DATASET, EMBEDDING_MODEL } from '@/engine/types';

// Routes on the free plan timeout after 5 seconds (504 - error).
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { query, modelsToRetrieveDocs, generateAnswer, datasets, maxDocuments } = body;


    // Get embedding models list from dictionary of toggles.
    let embeddingModels = [];
    if (modelsToRetrieveDocs) {
        for (let model in modelsToRetrieveDocs) {
            if (body.modelsToRetrieveDocs[model]) {
                embeddingModels.push(model as EMBEDDING_MODEL);
            }
        }
    }

    // Get datasets to filter the result set from from dictionary of toggles.
    let filterDatasets: DATASET[] | null = [];
    if (datasets) {
        for (let dataset in datasets) {
            if (body.datasets[dataset]) {
                filterDatasets.push(dataset as DATASET);
            }
        }
    }
    if (filterDatasets.length == 0) {
        filterDatasets = null;
    }

    // If we are generating an answer, include "no model" as well.
    if (generateAnswer) {
        embeddingModels.push(null);
    }

    const queryResult = await handleQuery(query, embeddingModels, filterDatasets, maxDocuments, generateAnswer)

    return NextResponse.json(queryResult);
}
