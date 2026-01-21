import 'dotenv/config';
import { DocumentProcessor } from '../src/lib/rag/document-processor.ts';
import { VectorStore } from '../src/lib/rag/vector-store.ts';
import path from 'path';

async function main() {
    console.log("[RAG] Starting Manual Ingestion...");
    console.log("[DEBUG] GOOGLE_API_KEY length:", process.env.GOOGLE_API_KEY?.length || 0);

    const searchPaths = [
        path.resolve(process.cwd(), 'docs'),
        path.resolve(process.cwd(), 'User Input')
    ];

    const store = new VectorStore();
    store.clear();

    let totalChunks = 0;

    for (const dirPath of searchPaths) {
        console.log(`[RAG] Scanning directory: ${dirPath}`);
        const processor = new DocumentProcessor(dirPath);

        for await (const fileChunks of processor.processFilesGenerator()) {
            if (fileChunks.length > 0) {
                console.log(`[RAG] Ingesting ${fileChunks.length} chunks from ${fileChunks[0].source}...`);
                await store.addDocuments(fileChunks);
                totalChunks += fileChunks.length;
            }
        }
    }

    console.log(`[RAG] Successfully ingested ${totalChunks} chunks into the vector store.`);
}

main().catch((err) => {
    console.error("[RAG] Ingestion failed:", err);
    process.exit(1);
});