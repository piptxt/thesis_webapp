"use client";

import { useState } from "react";
import AdvancedSearchBar from "./AdvancedSearchBar";
import SearchBar from "./BasicSearchBar";
import VectorSearchBar from "./VectorSearch";

export default function SearchBars() {
  const [searchType, setSearchType] = useState("basic");

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
          onClick={() => setSearchType("advanced")}
          className={`border rounded-lg px-5 py-2 font-bold transition duration-300 ease-in-out ${
            searchType === "advanced"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Vector Search
        </button>
      </div>
      <div className="w-full transition duration-300 ease-in-out">
        {searchType === "basic" ? <SearchBar /> : <VectorSearchBar />}
      </div>
    </div>
  );
}
