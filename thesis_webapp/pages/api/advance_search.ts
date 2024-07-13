import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract query parameters
    const { title: title, category: category, body: body } = req.query;
    if (typeof title !== "string") {
      res.status(400).json({ error: "Invalid query" });
      return;
    }

    if (title === "") {
      const documents: any = [];
      return res.status(200).json({ documents });
    }

    // const client = await clientPromise;
    // const db = client.db("supreme_court_jurisprudence");
    // const collection = db.collection("flattened_zip_2021_gte");
    // const flattened_client = pymongo.MongoClient("mongodb+srv://priscillalicup:wovkk5sxg01rXYLW@cluster0.1xyfpdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    // const flattened_db = flattened_client.supreme_court_jurisprudence
    // const flattened_collection = flattened_db["flattened_zip_2021_gte"]

    // Build the aggregation pipeline for MongoDB
    // const agg: any[] = [];

    // Split the query into chunks
    // const chunks = splitChunks(title);

    // let allResults: any[] = [];

    // for (const chunk of chunks) {
    //   const results = await collection.aggregate([
    //     {
    //       $vectorSearch: {
    //         queryVector: generateEmbedding(chunk),
    //         path: "text_chunk_embedding",
    //         numCandidates: 100,
    //         limit: 5,
    //         index: "default_gte_1024",
    //         includeMetadata: true,
    //       },
    //     },
    //     {
    //       $project: {
    //         title: 1,
    //         text_chunk: 1,
    //         score: { $meta: "vectorSearchScore" },
    //       },
    //     },
    //   ]).toArray();

    //   results.forEach((result: any) => {
    //     result.query_chunk = chunk;
    //     allResults.push(result);
    //   });
    // }

    // Add text search stages based on provided fields
    // if (title) {
    //   agg.push({
    //     $match: {
    //       title: { $regex: title as string, $options: "i" },
    //     },
    //   });
    // }
    // if (category) {
    //   agg.push({
    //     $match: {
    //       category: {
    //         $elemMatch: { $regex: category as string, $options: "i" },
    //       },
    //     },
    //   });
    // }
    // if (body) {
    //   agg.push({
    //     $match: {
    //       raw_full_body: { $regex: body as string, $options: "i" },
    //     },
    //   });
    // }

    // // If empty
    // if (!agg) {
    //   const movies = await db.collection("Acts").find({}).limit(10);
    //   res.status(200).json({ movies });
    // }

    // // Default to limit results and paginate
    // const limit = 50;
    // agg.push({ $limit: limit });

    // const movies = await db
    //   .collection("Acts")
    //   .aggregate(agg)
    //   .limit(10)
    //   .toArray();

    const response = await axios.post(
      "http://localhost:5000/aggregate_results",
      { text: title }
    );
    console.log(response.data);
    const documents = response.data;
    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}
