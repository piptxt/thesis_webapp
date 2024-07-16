import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract query parameters
    const { query: query, category: category } = req.query;
    if (typeof query !== "string") {
      res.status(400).json({ error: "Invalid query" });
      return;
    }

    console.log(category)
    console.log(typeof(category))

    if (query === "") {
      const documents: any = [];
      return res.status(200).json({ documents });
    }

    const response = await axios.post(
      "http://localhost:5000/vector_results",
      { text: query, category: category }
    );
    // console.log(response.data);
    const documents = response.data;
    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}
