"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AdvancedSearchBar from "./AdvancedSearchBar";
import SearchBar from "./BasicSearchBar";
import VectorSearchBar from "./VectorSearch";
import HybridSearchBar from "./HybridSearch";
import QBPSearchBar from "./QBPSearch";

export default function SearchBars() {
  // const [searchType, setSearchType] = useState("basic");
  const searchParams = useSearchParams();
  const initialSearchType = searchParams?.get("type") || "basic";
  const [searchType, setSearchType] = useState(initialSearchType);

  useEffect(() => {
    const type = searchParams?.get("type");
    if (type) {
      setSearchType(type);
    }
  }, [searchParams]);

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
        >
          Query By PDF
        </button>
      </div>
      <div className="w-full transition duration-300 ease-in-out">
        {searchType === "basic" && <SearchBar />}
        {searchType === "vector" && <VectorSearchBar />}
        {searchType === "hybrid" && <HybridSearchBar />}
        {searchType === "qbp" && <QBPSearchBar />}
      </div>
    </div>
  );
}
