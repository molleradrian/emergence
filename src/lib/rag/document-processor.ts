import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export interface DocumentChunk {
    id: string;
    content: string;
    source: string;
    metadata: Record<string, any>;
}

export class DocumentProcessor {
    private docsPath: string;

    constructor(docsPath: string) {
        this.docsPath = docsPath;
    }

    async *processFilesGenerator(): AsyncGenerator<DocumentChunk[]> {
        const files = this.getFilesRecursively(this.docsPath);

        console.log(`[RAG] Found ${files.length} documents in ${this.docsPath}`);

        for (const file of files) {
            try {
                const content = await this.extractText(file);
                if (content.trim().length > 0) {
                    const fileChunks = this.chunkText(content, 1000, file); // 1000 char chunks
                    if (fileChunks.length > 0) {
                        yield fileChunks;
                    }
                }
            } catch (error) {
                console.error(`[RAG] Failed to process ${file}:`, error);
            }
        }
    }

    async processAll(): Promise<DocumentChunk[]> {
        const chunks: DocumentChunk[] = [];
        for await (const fileChunks of this.processFilesGenerator()) {
            chunks.push(...fileChunks);
        }
        return chunks;
    }

    private getFilesRecursively(dir: string): string[] {
        let results: string[] = [];
        if (!fs.existsSync(dir)) return [];
        
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(this.getFilesRecursively(filePath));
            } else {
                // Filter for supported extensions
                if (/\.(md|txt|pdf|docx)$/i.test(file)) {
                    results.push(filePath);
                }
            }
        });
        return results;
    }

    private async extractText(filePath: string): Promise<string> {
        const ext = path.extname(filePath).toLowerCase();
        
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: dataBuffer });
            const result = await parser.getText();
            return result.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else {
            // Text or Markdown
            return fs.readFileSync(filePath, 'utf-8');
        }
    }

    private chunkText(text: string, chunkSize: number, source: string): DocumentChunk[] {
        const chunks: DocumentChunk[] = [];
        const fileName = path.basename(source);
        
        // Simple overlap chunking
        const overlap = 100;
        let start = 0;

        while (start < text.length) {
            const end = Math.min(start + chunkSize, text.length);
            const content = text.slice(start, end).trim();
            
            if (content.length > 50) { // Ignore tiny chunks
                chunks.push({
                    id: crypto.randomUUID(),
                    content,
                    source: fileName,
                    metadata: {
                        fullPath: source,
                        chunkIndex: chunks.length
                    }
                });
            }
            
            start += (chunkSize - overlap);
        }

        return chunks;
    }
}
