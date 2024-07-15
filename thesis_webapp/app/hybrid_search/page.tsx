"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import Link from "next/link";
import useSWR from "swr";

const fetchMovies = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Documents");
  }

  return response.json();
};

export default function AdvancedSearchResultsPage() {
  const search = useSearchParams();
  const query = search ? search.get("query") : "";
  const category = search ? search.get("category") : "";

  const encodedQuery = encodeURIComponent(query || "");
  const encodedCategory = encodeURIComponent(category || "");

  const { data, error, isLoading } = useSWR(
    `/api/hybrid_search?query=${encodedQuery}&category=${encodedCategory}`,
    fetchMovies
  );

  let DocumentList;

  if (isLoading) {
    // Handle loading state
    DocumentList = <p className="m-5">Loading...</p>;
  } else if (error) {
    // Handle error state
    DocumentList = <p className="m-5">Error: {error.message}</p>;
  } else if (!data || !data.documents || data.documents.length === 0) {
    // Safeguard against undefined data
    DocumentList = <p className="m-5">No Documents found.</p>;
  } else {
    console.log(data.documents);
    DocumentList = data.documents.map((document: any) => (
      <Link
        key={document._id}
        href={{
          pathname: "document_page",
          query: {
            id: document._id,
          },
        }}
      >
        <li className="m-5 p-5 border rounded">
          <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700 ">
            {document.title}
          </h2>
          <h2 className="text-sm text-gray-600">{document.category}</h2>
          <h2 className="text-base mt-1 font-sm text-gray-600">
            Relevancy Score: {document.rrf_score}
          </h2>
          <p className="text-sm mt-4 line-clamp-2 text-gray-600">
            {document.chunk}
          </p>
        </li>
      </Link>
    ));
  }

  return (
    <>
      <NavBar />
      <SearchBars />
      <ul className="m-auto w-2/3">
        <p className="mx-5 text-xl font-semibold">Search Results:</p>
        {DocumentList}
      </ul>
    </>
  );
}
