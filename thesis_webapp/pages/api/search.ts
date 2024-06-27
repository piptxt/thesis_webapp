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
      const db = client.db("Thesis");
      // const documents = await db
      //   .collection("Acts")
      //   .find({})
      //   .limit(50)
      //   .toArray();
      const documents: any = [];
      return res.status(200).json({ documents });
    }

    const agg = [
      {
        $search: {
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "text",
                },
              },
              {
                text: {
                  query: query,
                  path: "text",
                  score: {
                    boost: {
                      value: 5,
                    },
                  },
                },
              },
            ],
          },
          scoreDetails: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          text: 1,
          scoreDetails: {
            $meta: "searchScoreDetails",
          },
        },
      },
      {
        $limit: 50,
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
    const db = client.db("Thesis");
    const documents = await db.collection("Documents").aggregate(agg).toArray();

    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Documents" });
  }
}
