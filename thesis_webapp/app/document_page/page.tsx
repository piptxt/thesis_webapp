import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBar from "../Components/SearchBar/BasicSearchBar";
import AdvancedSearchBar from "../Components/SearchBar/AdvancedSearchBar";
import clientPromise from "@/lib/mongodb";

export default async function DocumentPage({ searchParams }) {
  let movie: any;
  const { ObjectId } = require("mongodb");

  // LAZY AND UNPROPER WAY OF FETCHING DATA - NOT USING ROUTES - WILL FIX
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    movie = await db
      .collection("movies")
      .findOne({ _id: new ObjectId(searchParams.id) });
  } catch {}

  return (
    <>
      <NavBar />
      <SearchBar />

      <main className="mx-auto my-15 p-5 w-3/4 border rounded-lg">
        <h2 className="text-4xl mt-1 font-semibold text-sky-700 text-center">
          {movie.title}
        </h2>
        <div className="text-center mx-auto my-2 w-3/4">
          {movie.directors.map((director: any, i: any) =>
            i + 1 < movie.directors.length ? ( // if not last add comma else remove comma
              <span className="text-sm">{director}, </span>
            ) : (
              <span className="text-sm text-center">{director}</span>
            )
          )}
        </div>
        <p className="text-sm mt-4 text-gray-600 indent-4 leading-loose">
          {movie.fullplot}
        </p>
      </main>
    </>
  );
}
