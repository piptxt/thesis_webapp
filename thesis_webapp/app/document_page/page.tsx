import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBar from "../Components/SearchBar/BasicSearchBar";
import AdvancedSearchBar from "../Components/SearchBar/AdvancedSearchBar";
import clientPromise from "@/lib/mongodb";
import SearchBars from "../Components/SearchBar/SearchBars";

export default async function DocumentPage({ searchParams }) {
  let document = null; // Initialize document as null initially

  try {
    const { ObjectId } = require("mongodb");
    const client = await clientPromise;
    const db = client.db("Thesis");

    document = await db
      .collection("Documents")
      .findOne({ _id: new ObjectId(searchParams.id) });

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
        <p className="text-sm mt-4 text-gray-600 indent-4 leading-loose">
          {document ? document.text : "Loading..."}
        </p>
      </main>
    </>
  );
}
