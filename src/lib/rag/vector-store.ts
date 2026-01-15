import fs from 'fs';
import path from 'path';
import { ai } from '@/ai/genkit';
import cosineSimilarity from 'cosine-similarity';
import { DocumentChunk } from './document-processor';

interface VectorDocument extends DocumentChunk {
    embedding: number[];
}

const STORE_PATH = path.resolve(process.cwd(), 'src/data/vector-store.json');

export class VectorStore {
    private documents: VectorDocument[] = [];

    constructor() {
        this.load();
    }

    private load() {
        if (fs.existsSync(STORE_PATH)) {
            try {
                const data = fs.readFileSync(STORE_PATH, 'utf-8');
                this.documents = JSON.parse(data);
                console.log(`[RAG] Loaded ${this.documents.length} vectors from store.`);
            } catch (e) {
                console.error("[RAG] Failed to load vector store:", e);
                this.documents = [];
            }
        }
    }

    private save() {
        // Ensure dir exists
        const dir = path.dirname(STORE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(STORE_PATH, JSON.stringify(this.documents, null, 2));
    }

    async addDocuments(chunks: DocumentChunk[]) {
        console.log(`[RAG] Embedding ${chunks.length} chunks...`);
        
        // Batch process to avoid rate limits
        const BATCH_SIZE = 10;
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            
            // Generate embeddings in parallel for the batch
            const promises = batch.map(async (chunk) => {
                try {
                    const result = await ai.embed({
                        embedder: 'googleai/text-embedding-004',
                        content: chunk.content,
                    });
                    const embedding = result[0].embedding;
                    return { ...chunk, embedding } as VectorDocument;
                } catch (e) {
                    console.error(`[RAG] Embedding failed for chunk ${chunk.id}`, e);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            const validResults = results.filter(r => r !== null) as VectorDocument[];
            this.documents.push(...validResults);
            
            console.log(`[RAG] Processed ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
        }

        this.save();
        console.log("[RAG] Vector store updated and saved.");
    }

    async similaritySearch(query: string, limit: number = 3): Promise<DocumentChunk[]> {
        if (this.documents.length === 0) return [];

        try {
            const result = await ai.embed({
                embedder: 'googleai/text-embedding-004',
                content: query,
            });
            const queryVector = result[0].embedding;

            // Calculate similarity for all docs
            const scoredDocs = this.documents.map(doc => ({
                doc,
                score: cosineSimilarity(queryVector, doc.embedding)
            }));

            // Sort by score (descending)
            scoredDocs.sort((a, b) => b.score - a.score);

            // Return top N
            return scoredDocs.slice(0, limit).map(d => d.doc);

        } catch (e) {
            console.error("[RAG] Search failed:", e);
            return [];
        }
    }
    
    getStats() {
        return {
            count: this.documents.length,
            path: STORE_PATH
        };
    }
    
    clear() {
        this.documents = [];
        this.save();
    }
}
