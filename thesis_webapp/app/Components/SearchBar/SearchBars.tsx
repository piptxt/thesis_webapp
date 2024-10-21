"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "./BasicSearchBar";
import VectorSearchBar from "./VectorSearch";
import HybridSearchBar from "./HybridSearch";
import QBPSearchBar from "./QBPSearch";
import Modal from "react-modal";

// Define modal style
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",           // Adjust the width of the modal
    maxWidth: "500px",       // Limit the maximum width of the modal
    padding: "20px",         // Add padding for spacing inside the modal
    borderRadius: "10px",    // Rounded corners for a cleaner look
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",  // Add a subtle shadow
  },
};

export default function SearchBars() {
  // const [searchType, setSearchType] = useState("basic");
  const searchParams = useSearchParams();
  const initialSearchType = searchParams?.get("type") || "basic";
  const [searchType, setSearchType] = useState(initialSearchType);

  const [modalIsOpen, setIsOpen] = useState(false); // State to control the modal

  useEffect(() => {
    const type = searchParams?.get("type");
    if (type) {
      setSearchType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    Modal.setAppElement('body');  // Set app element for react-modal
  }, []);

  const openModal = () => setIsOpen(true);  // Open modal
  const closeModal = () => setIsOpen(false);  // Close modal

  return (
    <div className="flex flex-col items-center mt-10 mb-10">
      <div className="flex space-x-4 mb-5">
        <button
          onClick={() => setSearchType("basic")}
          className={`border rounded-lg px-5 py-2 font-bold transition duration-300 ease-in-out ${
            searchType === "basic"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Find documents using exact keyword matching."  // Tooltip text
        >
          Basic Search
        </button>
        <button
          onClick={() => setSearchType("vector")}
          className={`border rounded-lg px-5 py-2 font-bold transition duration-300 ease-in-out ${
            searchType === "vector"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Search documents by semantic meaning and context using AI algorithms."  // Tooltip text
        >
          Vector Search
        </button>
        <button
          onClick={() => setSearchType("hybrid")}
          className={`border rounded-lg px-5 py-2 font-bold transition duration-300 ease-in-out ${
            searchType === "hybrid"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Combine keyword and semantic search for more precise results."  // Tooltip text
        >
          Hybrid Search
        </button>
        <button
          onClick={() => setSearchType("qbp")}
          className={`border rounded-lg px-5 py-2 font-bold transition duration-300 ease-in-out ${
            searchType === "qbp"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Upload a document and search for related content using the selected search mode."  // Tooltip text
        >
          Query By PDF
        </button>

        {/* Info icon to trigger modal */}
        <button
          onClick={openModal}
          className="ml-4 bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition duration-200 ease-in-out focus:outline-none"
        >
          ℹ️   How to use search options?
        </button>
      </div>
      <div className="w-full transition duration-300 ease-in-out">
        {searchType === "basic" && <SearchBar />}
        {searchType === "vector" && <VectorSearchBar />}
        {searchType === "hybrid" && <HybridSearchBar />}
        {searchType === "qbp" && <QBPSearchBar />}
      </div>

      {/* Modal for search option descriptions */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Search Options Explained"
      >
        <h2 className="text-2xl font-bold mb-4">Search Options Explained</h2>
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-lg font-bold"
        >
          ×
        </button>
        <p className="mb-2">
          <strong>Basic Search:</strong> Basic Search allows you to search documents by exact keyword matches. This method is ideal when you're looking for specific terms or phrases.
        </p>
        <p className="mb-2">
          <strong>Vector Search:</strong> Vector Search uses advanced machine learning algorithms to understand the meaning and context of your search terms. Instead of just matching keywords, it finds documents that are semantically similar.
        </p>
        <p className="mb-2">
          <strong>Hybrid Search:</strong> Hybrid Search combines the strengths of both Basic Search and Vector Search. It performs keyword matching along with a deeper semantic search to deliver more comprehensive results.
        </p>
        <p>
          <strong>Query By PDF:</strong>This option allows you to upload a PDF document as a query, and search for related content using the selected search mode.
        </p>
      </Modal>
    </div>
  );
}
