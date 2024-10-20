// // import { MongoClient } from 'mongodb';
// // import { SentenceTransformer } from 'sentence-transformers';
// // import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// // const client = new MongoClient(process.env.MONGODB_URI);
// const model = new SentenceTransformer('Alibaba-NLP/gte-large-en-v1.5');

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 8000,
//   chunkOverlap: 50,
//   separators: ['\n\n', '\n', '(?<=\\. )', ' '],
//   lengthFunction: (text: string) => text.length,
// });

// export async function generate_embedding(text: string): Promise<number[]> {
//   return await model.encode(text);
// }

// export function split_chunks(text: string): string[] {
//   return textSplitter.split(text);
// }

// // export async function aggregateQueryResults(query: string) {
// //   const db = client.db('Thesis');
// //   const collection = db.collection('Documents');

// //   const queryVector = await generateEmbedding(query);

// //   const results = await collection.aggregate([
// //     {
// //       $vectorSearch: {
// //         queryVector,
// //         path: 'text_chunk_embedding',
// //         numCandidates: 100,
// //         limit: 5,
// //         index: 'default_gte_1024',
// //         includeMetadata: true,
// //       },
// //     },
// //     {
// //       $project: {
// //         title: 1,
// //         text_chunk: 1,
// //         score: { $meta: 'vectorSearchScore' },
// //       },
// //     },
// //   ]).toArray();

// //   return results;
// // }

// // export async function aggregateLongQueryResults(query: string | Buffer) {
// //   const chunks = typeof query === 'string' ? splitChunks(query) : splitChunks(query.toString());
// //   const allResults = [];

// //   for (const chunk of chunks) {
// //     const results = await aggregateQueryResults(chunk);
// //     allResults.push(...results.map(result => ({ ...result, query_chunk: chunk })));
// //   }

// //   return allResults;
// // }
