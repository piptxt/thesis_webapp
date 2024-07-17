import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

function aggregate_keyword(query: any, category: any) {
  let categoryFilters = category.map((cat: string) => ({
    term: {
      path: "category",
      query: cat
    }
  }));
  
  let agg = [
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
          filter: [
            {
              compound: {
                should: category.map((cat: string) => ({
                  term: {
                    path: "category",
                    query: cat
                  }
                })),
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
  
  
  
  
  return agg
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { basic_search: query, category: category } = req.query;
    // if (typeof query !== "string") {
    //   res.status(400).json({ error: "Invalid query" });
    //   return;
    // }

    // if (query === "") {
    //   const documents: any = [];
    //   return res.status(200).json({ documents });
    // }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { query, category, initial } = req.body;

    if (typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid query' });
    }

    

    // let agg: any = [];
    // if (category === "All" || category == "all") {
    //   agg = [
    //     {
    //       $search: {
    //         compound: {
    //           should: [
    //             {
    //               text: {
    //                 query: query,
    //                 path: "title",
    //                 score: {
    //                   boost: {
    //                     value: 2,
    //                   },
    //                 },
    //               },
    //             },
    //             {
    //               text: {
    //                 query: query,
    //                 path: "text",
    //               },
    //             },
    //             // {
    //             //   text: {
    //             //     query: query,
    //             //     path: "text",
    //             //     score: {
    //             //       boost: {
    //             //         value: 5,
    //             //       },
    //             //     },
    //             //   },
    //             // },
    //           ],
    //         },
    //         scoreDetails: true,
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         title: 1,
    //         category: 1,
    //         text: 1,
    //         scoreDetails: {
    //           $meta: "searchScoreDetails",
    //         },
    //       },
    //     },
    //     {
    //       $limit: 50,
    //     },
    //   ];
    // } else {
    //   agg = [
    //     {
    //       $search: {
    //         compound: {
    //           should: [
    //             {
    //               text: {
    //                 query: query,
    //                 path: "text",
    //               },
    //             },
    //             {
    //               text: {
    //                 query: query,
    //                 path: "text",
    //                 score: {
    //                   boost: {
    //                     value: 5,
    //                   },
    //                 },
    //               },
    //             },
    //           ],
    //           filter: [
    //             {
    //               text: {
    //                 query: category,
    //                 path: "category",
    //               },
    //             },
    //           ],
    //         },
    //         scoreDetails: true,
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         title: 1,
    //         category: 1,
    //         text: 1,
    //         scoreDetails: {
    //           $meta: "searchScoreDetails",
    //         },
    //       },
    //     },
    //     {
    //       $limit: 50,
    //     },
    //   ];
    // }
    
    

    
    

    const client = await clientPromise;
    const db = client.db("Thesis");
    // const documents = await db.collection("Documents").aggregate(agg).toArray();

    let response;
    let response_query;
    let agg;

    if (initial === true) {
      response_query = await axios.post("http://localhost:5000/split_to_smaller_chunks", { text: query });
      agg = aggregate_keyword(response_query.data[0], category)
      response = await db.collection("Documents").aggregate(agg).toArray();
    } else {
      agg = aggregate_keyword(query, category)
      response = await db.collection("Documents").aggregate(agg).toArray();
      response_query = await axios.post("http://localhost:5000/split_to_smaller_chunks", { text: query });
    }

    console.log("Aggregation Pipeline:", JSON.stringify(agg, null, 2)); // Log the aggregation pipeline


    if (response && response_query) {
      const documents = response;
      console.log(documents)
      const query_chunks = response_query.data;
      res.status(200).json({ documents, query_chunks, category });
    }

    // res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Documents" });
  }
}
