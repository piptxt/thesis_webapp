"use client";

import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import Link from "next/link";
import { useEffect, useState } from "react";

// const fetchDocuments = async (url: string) => {
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error("Failed to get Documents");
//   }

//   return response.json();
// };

export default function SearchPage() {
  // const search = useSearchParams();
  // const searchQuery = search ? search.get("basic_search") : null;
  // const searchCategory = search ? search.get("category") : null;

  // const encodedSearchQuery = encodeURIComponent(searchQuery || "");
  // const encodedCategory = encodeURI(searchCategory || "");
  // const { data, error, isLoading } = useSWR(
  //   `/api/search?basic_search=${encodedSearchQuery}&category=${encodedCategory}`,
  //   fetchDocuments
  // );

  const search = useSearchParams();
  const key = search?.get("key") || "";
  const router = useRouter();
  const [data, setData] = useState({ documents: [], query_chunks: [], category: [], initial: true });
  const [documentLoading, setDocumentLoading] = useState(false); // Separate loading state for documents
  const [chunkLoading, setChunkLoading] = useState(false); // Separate loading state for chunks
  const [expandedChunks, setExpandedChunks] = useState<{ [key: number]: boolean }>({}); // Track expanded state for chunks
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null); // Track selected chunk index

  useEffect(() => {
    if (key) {
      const storedData = sessionStorage.getItem(key);
      if (storedData) {
        setData(JSON.parse(storedData));

        if (data.initial === true) {
          setSelectedChunkIndex(0);
        }
      } else {
        setData({ documents: [], query_chunks: [], category: [], initial: false });
      }
    }
  }, [key]);

  const handleContainerClick = async (index: number) => {
    const current_query_chunks = data.query_chunks
    const queryChunk = data.query_chunks[index];
    const newQuery = { query: queryChunk, category: data.category, initial: false }; // Adjust categories as needed

    // Set both document and chunk loading states
    setDocumentLoading(true);

    // Set selected chunk index
    setSelectedChunkIndex(index);

    sessionStorage.clear();

    // Fetch new search results based on the selected chunk
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuery),
    });

    if (response.ok) {
      const newData = await response.json();
      const newKey = `search-${Date.now()}`;
      sessionStorage.setItem(newKey, JSON.stringify({ ...newData, query_chunks: current_query_chunks }));
      setDocumentLoading(false); // Reset document loading state

      // Update state with new data
      setData({ documents: newData.documents, query_chunks: current_query_chunks, category: newData.category, initial: false }); // <--- This line ensures the documents list is replaced

      router.push(`/search?key=${newKey}`);
    } else {
      setDocumentLoading(false); // Reset document loading state in case of error
      console.error('Failed to search documents');
    }
  };

  const toggleExpandChunk = (index: number) => {
    setExpandedChunks(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  let DocumentList;
  let LeftSideContainers;

  if (documentLoading) {
    DocumentList = <p className="m-5">Loading documents...</p>;
  } else if (data.documents.length === 0) {
    // Handle no documents found
    DocumentList = <p className="m-5">No Documents found.</p>;
  } else {
    DocumentList = data.documents.map((document: any) => (
      <Link
        key={document._id}
        href={{
          pathname: "document_page",
          query: {
            id: document.document_id,
            chunk: document._id,
          },
        }}
      >
        <li className="m-5 p-5 border rounded">
          <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700 ">
            {document.title}
          </h2>
          <h2 className="text-sm text-gray-600">{document.category}</h2>
          <h2 className="text-base mt-1 font-sm text-gray-600">
            Relevancy Score: {document.score}
          </h2>
          <p className="text-sm mt-4 line-clamp-2 text-gray-600">
            {document.chunk}
          </p>
        </li>
      </Link>
    ));
  }

  if (chunkLoading) {
    LeftSideContainers = <p className="m-5">Loading chunks...</p>;
  } else {
    LeftSideContainers = data.query_chunks.map((chunk: any, index: any) => (
      <div
        key={index}
        className={`border p-4 mb-4 cursor-pointer ${selectedChunkIndex === index ? 'outline outline-2 outline-blue-500 shadow-lg' : ''}`} // Apply outline and shadow classes
        onClick={() => handleContainerClick(index)}
      >
        <h3 className="font-semibold text-lg">Chunk {index + 1}</h3>
        <p>
          {expandedChunks[index] ? chunk : `${chunk.substring(0, 100)}...`} {/* Limit to 100 characters */}
          <button
            className="text-blue-500 ml-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent click event
              toggleExpandChunk(index);
            }}
          >
            {expandedChunks[index] ? "Show less" : "Show more"}
          </button>
        </p>
      </div>
    ));
  }

  return (
    <>
      <NavBar />
      <SearchBars />
      <div className="flex m-auto w-2/3">
        <div className="w-1/4 p-5">
          {LeftSideContainers}
        </div>
        <ul className="w-3/4">
          <p className="mx-5 text-xl font-semibold">Search Results:</p>
          {DocumentList}
        </ul>
      </div>
    </>
  );
}
