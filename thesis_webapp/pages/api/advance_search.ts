import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract query parameters
    const { title: title, category: category, body: body } = req.query;

    const client = await clientPromise;
    const db = client.db("Thesis");

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
    if (category) {
      agg.push({
        $match: {
          category: {
            $elemMatch: { $regex: category as string, $options: "i" },
          },
        },
      });
    }
    if (body) {
      agg.push({
        $match: {
          raw_full_body: { $regex: body as string, $options: "i" },
        },
      });
    }

    // If empty
    if (!agg) {
      const movies = await db.collection("Acts").find({}).limit(10);
      res.status(200).json({ movies });
    }

    // Default to limit results and paginate
    const limit = 50;
    agg.push({ $limit: limit });

    const movies = await db
      .collection("Acts")
      .aggregate(agg)
      .limit(10)
      .toArray();

    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
