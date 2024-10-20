"use client";

// This file is to display the Search Results of Hybrid Search

import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import Link from "next/link";
import { useEffect, useState } from "react";
//summary pop up
const SummaryPopup = ({ document, onClose }: any) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-8 rounded-lg max-h-[80vh] w-3/4 overflow-y-auto">
        {/* Close "X" button */}
        <button
          className="absolute top-4 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">{document.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{document.summary}</p>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
// const fetchMovies = async (url: string) => {
//   const response = await fetch(url, {
//     headers: {
//       "Cache-Control": "no-cache",
//       Pragma: "no-cache",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to get Documents");
//   }

//   return response.json();
// };

export default function AdvancedSearchResultsPage() {
  // const search = useSearchParams();
  // const query = search ? search.get("query") : "";
  // const category = search ? search.get("category") : "";

  // const encodedQuery = encodeURIComponent(query || "");
  // const encodedCategory = encodeURIComponent(category || "");

  // const { data, error, isLoading } = useSWR(
  //   `/api/hybrid_search?query=${encodedQuery}&category=${encodedCategory}&type=hybrid`,
  //   fetchMovies
  // );

  const search = useSearchParams();
  const key = search?.get("key") || "";
  const router = useRouter();

  // TOGGLE SEARCH DISPLAY ---------------
  const showScores = search?.get("showScores") === "true";
  const showSummary = search?.get("showSummary") === "true";

  // ------ FOR CHUNKS ---------
  // const [data, setData] = useState({ documents: [], query_chunks: [], category: [], initial: true });
  const [data, setData] = useState({
    documents: [],
    category: [],
    initial: true,
  });

  const [documentLoading, setDocumentLoading] = useState(false); // Separate loading state for documents
  const [selectedDocument, setSelectedDocument] = useState(null); //keep track for showing which document to have summary be read

  // ------ FOR CHUNKS ---------
  // const [chunkLoading, setChunkLoading] = useState(false); // Separate loading state for chunks
  // const [expandedChunks, setExpandedChunks] = useState<{ [key: number]: boolean }>({}); // Track expanded state for chunks
  // const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null); // Track selected chunk index

  useEffect(() => {
    if (key) {
      const storedData = sessionStorage.getItem(key);
      if (storedData) {
        setData(JSON.parse(storedData));
        setDocumentLoading(false);

        // ------ FOR CHUNKS ---------
        // if (data.initial === true) {
        //   setSelectedChunkIndex(0);
        // }
      } else {
        // ------ FOR CHUNKS ---------
        // setData({ documents: [], query_chunks: [], category: [], initial: false });
        setData({ documents: [], category: [], initial: false });
        setDocumentLoading(true);
      }
    }
  }, [key]);

  // ------ FOR CHUNKS ---------
  // const handleContainerClick = async (index: number) => {
  //   const current_query_chunks = data.query_chunks
  //   const queryChunk = data.query_chunks[index];
  //   const newQuery = { query: queryChunk, category: data.category, initial: false }; // Adjust categories as needed

  //   // Set both document and chunk loading states
  //   setDocumentLoading(true);

  //   // Set selected chunk index
  //   setSelectedChunkIndex(index);

  //   sessionStorage.clear();

  //   // Fetch new search results based on the selected chunk
  //   const response = await fetch('/api/hybrid_search', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(newQuery),
  //   });

  //   if (response.ok) {
  //     const newData = await response.json();
  //     const newKey = `search-${Date.now()}`;
  //     sessionStorage.setItem(newKey, JSON.stringify({ ...newData, query_chunks: current_query_chunks }));
  //     setDocumentLoading(false); // Reset document loading state

  //     // Update state with new data
  //     setData({ documents: newData.documents, query_chunks: current_query_chunks, category: newData.category, initial: false }); // <--- This line ensures the documents list is replaced

  //     router.push(`/hybrid_search?key=${newKey}&type=hybrid`);
  //   } else {
  //     setDocumentLoading(false); // Reset document loading state in case of error
  //     console.error('Failed to search documents');
  //   }
  // };

  // ------ FOR CHUNKS ---------
  // const toggleExpandChunk = (index: number) => {
  //   setExpandedChunks(prevState => ({
  //     ...prevState,
  //     [index]: !prevState[index]
  //   }));
  // };

  let DocumentList;

  // ------ FOR CHUNKS ---------
  // let LeftSideContainers;

  // if (documentLoading) {
  //   DocumentList = <p className="m-5">Loading documents...</p>;
  // } else if (data.documents.length === 0) {
  //   // Handle no documents found
  //   DocumentList = <p className="m-5">No Documents found.</p>;
  // } else {
  //   DocumentList = data.documents.map((document: any) => (
  //     <Link
  //       key={document._id}
  //       href={{
  //         pathname: "document_page",
  //         query: {
  //           id: document._id,
  //           // chunk: document._id,
  //         },
  //       }}
  //     >
  //       <li className="m-5 p-5 border rounded">
  //         <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700 ">
  //           {document.title}
  //         </h2>
  //         <h2 className="text-sm text-gray-600">{document.category}</h2>
  //         {showScores && (
  //           <h2 className="text-base mt-1 font-sm text-gray-600">
  //             Relevancy Score: {document.score}
  //           </h2>
  //         )}
  //         {showScores && (
  //           <h2 className="text-base mt-0 font-sm text-gray-600">
  //             Reciprocal Rank Score: {document.rrf_score}
  //           </h2>
  //         )}
  //         {showSummary && (
  //           <p className="text-sm mt-4 line-clamp-5 text-gray-600">
  //             {document.summary}
  //           </p>
  //         )}
  //         <button
  //           className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //           onClick={() => setSelectedDocument(document)}
  //         >
  //           View Summary
  //         </button>
  //       </li>
  //     </Link>
  //   ));
  // }
  if (documentLoading) {
    DocumentList = <p className="m-5">Loading documents...</p>;
  } else if (data.documents.length === 0) {
    // Handle no documents found
    DocumentList = <p className="m-5">No Documents found.</p>;
  } else {
    DocumentList = data.documents.map((document: any) => (
      <li key={document._id} className="m-5 p-5 border rounded">
        {/* Wrap only the document title with Link */}
        <Link
          href={{
            pathname: "document_page",
            query: {
              id: document._id,
            },
          }}
        >
          <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700">
            {document.title}
          </h2>
        </Link>

        <h2 className="text-sm text-gray-600">{document.category}</h2>

        {showScores && (
          <>
            <h2 className="text-base mt-1 font-sm text-gray-600">
              Relevancy Score: {document.score}
            </h2>
            <h2 className="text-base mt-0 font-sm text-gray-600">
              Reciprocal Rank Score: {document.rrf_score}
            </h2>
          </>
        )}

        {showSummary && (
          <p className="text-sm mt-4 line-clamp-5 text-gray-600">
            {document.summary}
          </p>
        )}

        {/* Button to show the summary in a popup */}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setSelectedDocument(document)}
        >
          View AI-Generated Summary
        </button>
      </li>
    ));
  }

  // ------ FOR CHUNKS ---------
  // if (chunkLoading) {
  //   LeftSideContainers = <p className="m-5">Loading chunks...</p>;
  // } else {
  //   LeftSideContainers = data.query_chunks.map((chunk: any, index: any) => (
  //     <div
  //       key={index}
  //       className={`border p-4 mb-4 cursor-pointer ${selectedChunkIndex === index ? 'outline outline-2 outline-blue-500 shadow-lg' : ''}`} // Apply outline and shadow classes
  //       onClick={() => handleContainerClick(index)}
  //     >
  //       <h3 className="font-semibold text-lg">Chunk {index + 1}</h3>
  //       <p>
  //         {expandedChunks[index] ? chunk : `${chunk.substring(0, 100)}...`} {/* Limit to 100 characters */}
  //         <button
  //           className="text-blue-500 ml-2"
  //           onClick={(e) => {
  //             e.stopPropagation(); // Prevent triggering the parent click event
  //             toggleExpandChunk(index);
  //           }}
  //         >
  //           {expandedChunks[index] ? "Show less" : "Show more"}
  //         </button>
  //       </p>
  //     </div>
  //   ));
  // }

  // ------ FOR CHUNKS ---------
  // return (
  //   <>
  //     <NavBar />
  //     <SearchBars />
  //     <div className="flex m-auto w-2/3">
  //       <div className="w-1/4 p-5">
  //         {LeftSideContainers}
  //       </div>
  //       <ul className="w-3/4">
  //         <p className="mx-5 text-xl font-semibold">Hybrid Search Results:</p>
  //         {DocumentList}
  //       </ul>
  //     </div>
  //   </>
  // );

  return (
    <>
      <NavBar />
      <SearchBars />
      {/* <div className="flex m-auto w-2/3"> */}
      <ul className="m-auto w-2/3">
        <p className="mx-5 text-xl font-semibold">Hybrid Search Results:</p>
        {DocumentList}
      </ul>
      {selectedDocument && (
        <SummaryPopup
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
      {/* </div> */}
    </>
  );
}
