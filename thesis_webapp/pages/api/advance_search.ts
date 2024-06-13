import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract query parameters
    const { title: title, cast: cast, plot: plot } = req.query;

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Build the aggregation pipeline for MongoDB
    const agg: any[] = [];

    // Add text search stages based on provided fields
    if (title) {
      agg.push({
        $match: {
          title: { $regex: title as string, $options: "i" },
        },
      });
    }
    if (cast) {
      agg.push({
        $match: {
          cast: { $elemMatch: { $regex: cast as string, $options: "i" } },
        },
      });
    }
    if (plot) {
      agg.push({
        $match: {
          plot: { $regex: plot as string, $options: "i" },
        },
      });
    }

    // Default to limit results and paginate
    const limit = 10;
    agg.push({ $limit: limit });

    const movies = await db
      .collection("movies")
      .aggregate(agg)
      .limit(10)
      .toArray();

    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
