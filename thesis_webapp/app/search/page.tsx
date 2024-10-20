"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import useSWR from "swr";
import Link from "next/link";

const fetchDocuments = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to get Documents");
  }

  return response.json();
};

export default function SearchPage() {
  const search = useSearchParams();
  const searchQuery = search ? search.get("basic_search") : null;
  const searchCategory = search ? search.get("category") : null;
  const showScores = search ? search.get("showScores") === "true" : false; // Read showScores from query

  const encodedSearchQuery = encodeURIComponent(searchQuery || "");
  const encodedCategory = encodeURI(searchCategory || "");
  const { data, error, isLoading } = useSWR(
    `/api/search?basic_search=${encodedSearchQuery}&category=${encodedCategory}`,
    fetchDocuments
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
          {/* Conditionally show the relevancy score */}
          {showScores && (
            <h2 className="text-base mt-1 font-sm text-gray-600">
              Relevancy Score: {document.scoreDetails.value}
            </h2>
          )}
          <p className="text-sm mt-4 line-clamp-2 text-gray-600">
            {document.text}
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
