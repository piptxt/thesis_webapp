import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { basic_search: query } = req.query;
    if (typeof query !== "string") {
      res.status(400).json({ error: "Invalid query" });
      return;
    }

    if (query === "") {
      const client = await clientPromise;
      const db = client.db("sample_mflix");
      const movies = await db.collection("movies").find({}).limit(20).toArray();
      return res.status(200).json({ movies });
    }

    // SIMPLE QUERY
    const agg = [
      {
        $search: {
          text: {
            query: query,
            path: "plot",
          },
          scoreDetails: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          directors: 1,
          fullplot: 1,
          scoreDetails: {
            $meta: "searchScoreDetails",
          },
        },
      },
      {
        $limit: 10,
      },
    ];

    // MORE COMPLEX QUERY
    // const agg = [
    //   {
    //     $search: {
    //       compound: {
    //         should: [
    //           {
    //             text: {
    //               query: query,
    //               path: "plot",
    //             },
    //           },
    //           {
    //             text: {
    //               query: query,
    //               path: "title",
    //             },
    //           },
    //         ],
    //       },
    //       scoreDetails: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       title: 1,
    //       directors: 1,
    //       fullplot: 1,
    //       scoreDetails: {
    //         $meta: "searchScoreDetails",
    //       },
    //     },
    //   },
    //   {
    //     $limit: 10,
    //   },
    // ];

    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = await db
      .collection("movies")
      .aggregate(agg)
      .limit(50)
      .toArray();

    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
