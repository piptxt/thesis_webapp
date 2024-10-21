"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";
import Modal from "react-modal";

type AdvQuery = {
  query: string;
  category: string[];
  initial: boolean;

  // TOGGLE SEARCH DISPLAY ---------------
  showScores: boolean;
  showSummary: boolean;
};

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

export default function HybridSearchBar() {
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
  const [isModalOpen, setIsModalOpen] = useState(false); // For detailed explanation modal

  const categoryMapping = {
    "Acts": "Act",
    "Supreme Court Decisions": "Supreme",
    "Republic Acts": "Republic Acts",
    "Commonwealth Acts": "Commonwealth",
    "Batas Pambansa": "Batas",
  } as const;  // "as const" makes it a readonly object
  
  type CategoryKey = keyof typeof categoryMapping;  // Extract keys as type
  const displayCategories: CategoryKey[] = Object.keys(categoryMapping) as CategoryKey[];  // Correctly type the keys
  

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
    // e.preventDefault();
    const displayValue = e.target.value as CategoryKey;  // Ensure displayValue is a valid key
    const originalValue = categoryMapping[displayValue];  // Now safely index categoryMapping
  
    setAdvQuery((prev) => {
      const newCategory = prev.category.includes(originalValue)
        ? prev.category.filter((item) => item !== originalValue)
        : [...prev.category, originalValue];
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
      router.push(`/hybrid_search?key=${searchKey}&type=hybrid&showScores=${advQuery.showScores}&showSummary=${advQuery.showSummary}`);
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

    // Open and close modal
    function openModal() {
      setIsModalOpen(true);
    }
  
    function closeModal() {
      setIsModalOpen(false);
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
            {displayCategories.map((category) => (
              <label key={category} className="block mb-1">
                <input
                  type="checkbox"
                  value={category}  // Display name as value
                  checked={advQuery.category.includes(categoryMapping[category])}  // Check by original name
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
              placeholder="Hybrid Search here..."
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

            {/* Info icon to trigger modal */}
            <button
              onClick={openModal}
              className="mt-4 bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition duration-200 ease-in-out focus:outline-none"
            >
              ℹ️  What are search scores?
            </button>

            {/* Modal for detailed explanation */}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Search Scores Explanation"
              style={customStyles}
            >
              <h2 className="text-2xl font-bold mb-4">Search Scores Explained</h2>
              <button onClick={closeModal} className="absolute top-2 right-4 text-lg font-bold">
                ×
              </button>

              <p><strong>What is a Search Score?</strong></p>
              <p className="mb-4">
                A search score measures how relevant a document is to your query. Higher scores indicate stronger relevance, either through matching keywords or the document's overall meaning.
              </p>

              <p><strong>How Search Scores Are Calculated:</strong></p>
              <ul className="list-disc ml-5 mb-4">
                <li><strong>Basic Search Score (Exact Text Matching)</strong>: Based on how well the exact words in your query match the document text, using full-text search.</li>
                <li><strong>Vector Search Score (Semantic Relevance)</strong>: Calculated using cosine similarity between vector embeddings of the query and document, measuring conceptual alignment.</li>
                <li><strong>Hybrid Search Score (Rank Fusion)</strong>: Combines both scores using reciprocal rank fusion (RRF), balancing conceptual relevance with exact term matches.</li>
                </ul>
            </Modal>
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
