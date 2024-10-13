"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";

type AdvQuery = {
  query: string;
  category: string[];
  initial: boolean;
};

export default function HybridSearchBar() {
  const { extractedText } = useExtractedText();
  const [advQuery, setAdvQuery] = useState<AdvQuery>({
    query: "",
    category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"], // Default to all categories
    initial: true
  });
  const router = useRouter();

  const categories = [
    "Act",
    "Supreme",
    "Republic Acts",
    "Commonwealth",
    "Batas",
  ];

  useEffect(() => {
    setAdvQuery((prev) => ({
      ...prev,
      query: extractedText.body,
    }));
  }, [extractedText]);

  function handleChange(e: any) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;

    setAdvQuery((prev) => {
      return { ...prev, [name]: value };
    });
  }

  // Handles the Categories Filter
  function handleCheckboxChange(e: any) {
    e.preventDefault();
    const value = e.target.value;

    setAdvQuery((prev) => {
      const newCategory = prev.category.includes(value)
        ? prev.category.filter((item) => item !== value)
        : [...prev.category, value];
      return { ...prev, category: newCategory };
    });
  }

  // function onSearch(event: React.FormEvent) {
  //   event.preventDefault();
  //   const encodedQuery = encodeURI(advQuery.query || "");
  //   const encodedCategory = encodeURI(advQuery.category.join(",") || "");

  //   router.push(
  //     `/hybrid_search?query=${encodedQuery}` +
  //       `&category=${encodedCategory}&type=hybrid`
  //   );
  // }

  // SESSION STORAGE -----------------------
  async function onSearch(event: React.FormEvent) {
    event.preventDefault();

    // Clear the session storage before storing new data
    sessionStorage.clear();

    // Fetch data from API
    const response = await fetch('/api/hybrid_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(advQuery),
    });

    // Route to Page with Hybrid Search Results
    if (response.ok) {
      const data = await response.json();
      const searchKey = `search-${Date.now()}`;

      sessionStorage.clear();
      
      sessionStorage.setItem(searchKey, JSON.stringify(data));
      router.push(`/hybrid_search?key=${searchKey}&type=hybrid`);
    } else {
      console.error('Failed to search documents');
    }
  }

    // Function for Clear Button (search bar)
  function onClear() {
    setAdvQuery({
      query: "",
      category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"],
      initial: true
    });
  }

  // Return statement for HTML of Vector Search Page
  return (
    <div className="mx-auto p-5">
      <form
        className="max-w-5xl min-h-2 mx-auto text-start"
        onSubmit={onSearch}
      >
        <div className="flex">
          <div className="mb-2 p-4 border border-gray-300 rounded-lg">
            {categories.map((category) => (
              <label key={category} className="block mb-1">
                <input
                  type="checkbox"
                  value={category}
                  checked={advQuery.category.includes(category)}
                  onChange={handleCheckboxChange}
                />
                {category}
              </label>
            ))}
          </div>
          <div className="mb-2 flex-grow">
            <textarea
              name="query"
              className="block w-full h-24 p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ml-2"
              placeholder="Hybrid Search here..."
              value={advQuery.query}
              onChange={handleChange}
            />
          </div>
        </div>
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
