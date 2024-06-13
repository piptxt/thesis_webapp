"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AdvancedSearchBar from "./AdvancedSearchBar";
import SearchBar from "./BasicSearchBar";
import { useState } from "react";

export default function SearchBars() {
  const [searchType, setSearchType] = useState(false);

  function handleSetSearch() {
    if (searchType) {
      setSearchType(false);
    } else {
      setSearchType(true);
    }
  }

  return (
    <div className="grid-cols-1 mx-auto mt-10 items-center text-center">
      <button
        onClick={handleSetSearch}
        className="border rounded-lg px-5 py-2 bg-white font-bold hover:bg-gray-100"
      >
        {searchType === false ? "Basic Search" : "Advanced Search"}
      </button>
      {searchType === false ? <SearchBar /> : <AdvancedSearchBar />}
    </div>
  );
}
