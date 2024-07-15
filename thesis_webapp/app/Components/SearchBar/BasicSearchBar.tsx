"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect} from "react";
import { useExtractedText } from '../Contexts/ExtractedTextContext';

export default function SearchBar() {
  const { extractedText } = useExtractedText();
  const search = useSearchParams();
  const [query, setQuery] = useState(search ? search.get("q") : null);
  const [category, setCategory] = useState("all"); // Add state for dropdown
  const router = useRouter();

  useEffect(() => {
    setQuery(extractedText.body);
  }, [extractedText]);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(query || "");
    const encodedCategory = encodeURI(category || "");
    router.push(
      `/search?basic_search=${encodedSearchQuery}&category=${encodedCategory}`
    );
  }

  function onClear() {
    setQuery("");
    setCategory("all");
  }

  return (
    <>
      <div className="mx-auto my-2">
        <form className="max-w-6xl mx-auto" onSubmit={onSearch}>
          <div className="relative flex items-center">
            <select
              className="block p-4 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Act">Acts</option>
              <option value="Supreme">Supreme Court</option>
              <option value="Republic Acts">Republic Acts</option>
              <option value="Commonwealth">Commonwealth Acts</option>
              <option value="Batas">Batas Pambansa</option>
            </select>
            <textarea
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ml-2"
              placeholder="Search here..."
              value={query || ""}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 ml-2"
              onClick={onClear}
            >
              Clear
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ml-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
