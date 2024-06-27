import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBar from "../Components/SearchBar/BasicSearchBar";
import AdvancedSearchBar from "../Components/SearchBar/AdvancedSearchBar";
import clientPromise from "@/lib/mongodb";
import SearchBars from "../Components/SearchBar/SearchBars";

export default async function DocumentPage({ searchParams }) {
  let document: any;
  const { ObjectId } = require("mongodb");

  // LAZY AND UNPROPER WAY OF FETCHING DATA - NOT USING ROUTES - WILL FIX
  try {
    const client = await clientPromise;
    const db = client.db("Thesis");
    document = await db
      .collection("Documents")
      .findOne({ _id: new ObjectId(searchParams.id) });
  } catch {}

  return (
    <>
      <NavBar />
      <SearchBars />

      <main className="mx-auto my-15 p-5 w-3/4 border rounded-lg">
        <h2 className="text-4xl mt-1 font-semibold text-sky-700 text-center">
          {document.title}
        </h2>
        <p className="text-sm mt-4 text-gray-600 indent-4 leading-loose">
          {document.text}
        </p>
      </main>
    </>
  );
}
