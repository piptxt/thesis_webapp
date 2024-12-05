import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { basic_search: query, category: category } = req.query;
    console.log(query);
    if (typeof query !== "string") {
      res.status(400).json({ error: "Invalid query" });
      return;
    }

    if (query === "" || category == "") {
      const documents: any = [];
      return res.status(200).json({ documents });
    }

    const categories = category.split(",");
    console.log(categories);

    const agg = [
      {
        $search: {
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "title",
                  score: {
                    boost: {
                      value: 2,
                    },
                  },
                },
              },
              {
                text: {
                  query: query,
                  path: "text",
                },
              },
            ],
          },
          scoreDetails: true,
        },
      },
      {
        $match: {
          category: { $in: categories },
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

    const client = await clientPromise;
    const db = client.db("Thesis");
    const documents = await db.collection("Documents").aggregate(agg).toArray();

    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Documents" });
  }
}

/**
ATLAS SEARCH INDEX:   
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "text": {
        "type": "string"
      },
      "title": {
        "type": "string"
      }
    }
  }
}
 */
