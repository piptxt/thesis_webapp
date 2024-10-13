"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";

export default function SearchBar() {
  const { extractedText } = useExtractedText();
  const search = useSearchParams();
  const [query, setQuery] = useState(search ? search.get("q") : "");

  // Initialize selectedCategories with all categories checked by default
  const categories = [
    "Act",
    "Supreme",
    "Republic Acts",
    "Commonwealth",
    "Batas Pambansa",
  ];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categories);

  const router = useRouter();

  useEffect(() => {
    setQuery(extractedText.body);
  }, [extractedText]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        (prev) => prev.filter((c) => c !== category) // Remove the category if already selected
      );
    } else {
      setSelectedCategories((prev) => [...prev, category]); // Add the category if not selected
    }
  };

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(query || "");
    const encodedCategories = selectedCategories
      .map((cat) => encodeURIComponent(cat))
      .join(",");

    router.push(
      `/search?basic_search=${encodedSearchQuery}&category=${encodedCategories}`
    );
  }

  function onClear() {
    setQuery("");
    setSelectedCategories(categories); // Reset to all checked by default
    router.push(`/search`);
  }

  return (
    <div className="mx-auto my-2">
      <form className="max-w-6xl mx-auto" onSubmit={onSearch}>
        <div className="relative flex items-start space-x-4">
          {/* Checkbox list for categories */}
          <div className="flex flex-col space-y-2 p-4 border border-gray-300 rounded-lg">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-2"
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>

          {/* Search input */}
          <textarea
            id="default-search"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search here..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={onClear}
            >
              Clear
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
