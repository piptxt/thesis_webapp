import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// This file is for the routing of Vector Search

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { query, category, initial } = req.body;

    if (typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query" });
    }

    let response;

    // FOR CHUNKS ---------------
    // let response_query;

    // if (initial === true) {
    //   response_query = await axios.post("http://localhost:5000/split_to_chunks", { text: query });
    //   response = await axios.post("http://localhost:5000/vector_results", { text: response_query.data[0], category });
    // } else {
    //   response = await axios.post("http://localhost:5000/vector_results", { text: query, category });
    //   response_query = await axios.post("http://localhost:5000/split_to_chunks", { text: query });
    // }

    response = await axios.post("http://127.0.0.1:5000/vector_results", {
      text: query,
      category,
    });

    // FOR CHUNKS ---------------
    // if (response && response_query) {
    //   const documents = response.data;
    //   const query_chunks = response_query.data;
    //   res.status(200).json({ documents, query_chunks, category });
    // }

    if (response) {
      const documents = response.data;
      res.status(200).json({ documents, category });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}
