"use client";

// This file is to display the Search Results of Vector Search

import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdvancedSearchResultsPage() {
  const search = useSearchParams();
  const key = search?.get("key") || ""; // Gets the session storage key from the search data (?)
  const router = useRouter();
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

  // ------ FOR CHUNKS ---------
  // const [data, setData] = useState({ documents: [], query_chunks: [], category: [], initial: true });
  const showScores = search?.get("showScores") === "true";
  const [data, setData] = useState({
    documents: [],
    category: [],
    initial: true,
  });

  const [documentLoading, setDocumentLoading] = useState(false); // Separate loading state for documents
  const [selectedDocument, setSelectedDocument] = useState(null); // Keep track of which document is selected for viewing summary
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

  let DocumentList;
  // let LeftSideContainers; // FOR CHUNKS

  // This shows the loading state of documents, and if there are documents found
  // Else statament is HTML for cards for each document result
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

        {/* Display the scores based on the showScores state */}
        {showScores && (
          <>
            <h2 className="text-base mt-1 font-sm text-gray-600">
              Relevancy Score: {document.score}
            </h2>
          </>
        )}

        <p className="text-sm mt-4 line-clamp-5 text-gray-600">
          {document.summary}
        </p>

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

  return (
    <>
      <NavBar />
      <SearchBars />
      {/* <div className="flex m-auto w-2/3"> */}
      {/* <div className="w-1/4 p-5">
          {LeftSideContainers}
        </div> */}
      <ul className="m-auto w-2/3">
        <p className="mx-5 text-xl font-semibold">Vector Search Results:</p>
        {DocumentList}
      </ul>
      {/* </div> */}
      {/* Render the summary popup when a document is selected */}
      {selectedDocument && (
        <SummaryPopup
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
}
