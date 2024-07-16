import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import clientPromise from "@/lib/mongodb";
import SearchBars from "../Components/SearchBar/SearchBars";

export default async function DocumentPage({ searchParams }) {
  let document = null; // Initialize document as null initially
  let chunks = null;
  let highlighted_text = null;

  try {
    const { ObjectId } = require("mongodb");
    const client = await clientPromise;
    const db = client.db("Thesis");

    document = await db
      .collection("Documents")
      .findOne({ _id: new ObjectId(searchParams.id) });

    const docu = await db
      .collection("Flattened")
      .find({ document_id: new ObjectId(searchParams.id) })
      .toArray();
    chunks = docu.map((item) => item.chunk);

    const highlighted_chunk = await db
      .collection("Flattened")
      .findOne({ _id: new ObjectId(searchParams.chunk) });
    highlighted_text = highlighted_chunk ? highlighted_chunk.chunk : "";

    // if (document) {
    //   console.log("Document found:", document);
    // } else {
    //   console.log("Document not found for id:", searchParams.id);
    // }
  } catch (error) {
    console.error("Error fetching document:", error);
  }

  return (
    <>
      <NavBar />
      <SearchBars />

      <main className="mx-auto my-15 p-5 w-3/4 border rounded-lg">
        <h2 className="text-4xl mt-1 font-semibold text-sky-700 text-center">
          {document ? document.title : "Loading..."}
        </h2>

        {chunks
          ? chunks.map((chunk, i) => (
              <p
                key={i}
                className={`text-sm mt-4 indent-4 leading-loose ${
                  chunk === highlighted_text
                    ? "bg-yellow-200" // Apply yellow background if chunk matches highlighted_text
                    : ""
                }`}
              >
                {chunk}
              </p>
            ))
          : "Loading..."}
      </main>
    </>
  );
}
