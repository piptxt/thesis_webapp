"use client"; 

// This file is to display the Search Page of Vector Search

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";

type AdvQuery = {
  query: string;
  category: string[];
  initial: boolean;

  // TOGGLE SEARCH DISPLAY ---------------
  showScores: boolean;
  showSummary: boolean;
};

export default function VectorSearchBar() {
  const { extractedText } = useExtractedText();
  const [advQuery, setAdvQuery] = useState<AdvQuery>({
    query: "",
    category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"], // Default to all categories
    initial: true,

    // TOGGLE SEARCH DISPLAY ---------------
    showScores: false,
    showSummary: true, // default to showing summary
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

  // Handles Toggle Search Display Change
  function handleToggleChange(e: any) {
    const { name, checked } = e.target;
    setAdvQuery((prev) => ({ ...prev, [name]: checked }));
  }
  

  // function onSearch(event: React.FormEvent) {
  //   event.preventDefault();
  //   const encodedQuery = encodeURI(advQuery.query || "");
  //   const encodedCategory = encodeURI(advQuery.category.join(",") || "");

  //   router.push(
  //     `/advance_search?query=${encodedQuery}&category=${encodedCategory}&type=vector`
  //   );
  // }

  // LOCAL STORAGE ------------------------
  // async function onSearch(event: React.FormEvent) {
  //   event.preventDefault();
  //   const response = await fetch('/api/advance_search', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(advQuery),
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     const searchKey = `search-${Date.now()}`;
  //     const compressedData = LZString.compressToUTF16(JSON.stringify(data));
  //     localStorage.setItem(searchKey, compressedData);
  //     router.push(`/advance_search?key=${searchKey}`);
  //   } else {
  //     console.error('Failed to search documents');
  //   }
  // }

  // SESSION STORAGE -----------------------
  async function onSearch(event: React.FormEvent) {
    event.preventDefault();

    // Clear the session storage before storing new data
    sessionStorage.clear();

    // Fetch data from API
    const response = await fetch('/api/advance_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(advQuery),
    });

    // Route to Page with Vector Search Results
    if (response.ok) {
      const data = await response.json();
      const searchKey = `search-${Date.now()}`;
      sessionStorage.setItem(searchKey, JSON.stringify(data));
      // router.push(`/advance_search?key=${searchKey}&type=vector`);

      // TOGGLE SEARCH DISPLAY ---------------
      router.push(`/advance_search?key=${searchKey}&type=vector&showScores=${advQuery.showScores}&showSummary=${advQuery.showSummary}`);

    } else {
      console.error('Failed to search documents');
    }
  }

  // Function for Clear Button (search bar)
  function onClear() {
    setAdvQuery({
      query: "",
      category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"],
      initial: true,

      // TOGGLE SEARCH DISPLAY ---------------
      showScores: false,
      showSummary: true
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
          <h4 className="text-lg font-semibold mb-2">Categories</h4>
          <hr className="font-semibold mb-3"></hr>
            {categories.map((category) => (
              <label key={category} className="block mb-1">
                <input
                  type="checkbox"
                  value={category}
                  checked={advQuery.category.includes(category)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
          <div className="mb-2 flex-grow">
            <textarea
              name="query"
              className="block w-full h-24 p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ml-2"
              placeholder="Vector Search here..."
              value={advQuery.query}
              onChange={handleChange}
            />
          </div>

          {/* Toggle Container SEARCH DISPLAY ------------- */}
          <div className="mb-2 p-4 border border-gray-300 ml-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Search Display Options</h4>
          <hr className="font-semibold mb-3"></hr>
            <label className="block mb-1">
              <input
                type="checkbox"
                name="showScores"
                checked={advQuery.showScores}
                onChange={handleToggleChange}
                className="mr-2"
              />
              Show Search Scores
            </label>
            <label className="block mb-1">
              <input
                type="checkbox"
                name="showSummary"
                checked={advQuery.showSummary}
                onChange={handleToggleChange}
                className="mr-2"
              />
              Show Summary Field
            </label>
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
