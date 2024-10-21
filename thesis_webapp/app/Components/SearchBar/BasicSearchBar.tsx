"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";
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

export default function SearchBar() {
  const { extractedText } = useExtractedText();
  const search = useSearchParams();
  const [query, setQuery] = useState(search ? search.get("q") : "");
  const [showScores, setShowScores] = useState(false); // Add state for Show Scores
  const categories = [
    "Acts",
    "Supreme Court Decisions",
    "Republic Acts",
    "Commonwealth Acts",
    "Batas Pambansa",
  ];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categories);

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // For detailed explanation modal

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

    // Include the showScores state in the query parameters
    router.push(
      `/search?basic_search=${encodedSearchQuery}&category=${encodedCategories}&showScores=${showScores}`
    );
  }

  function onClear() {
    setQuery("");
    setSelectedCategories(categories); // Reset to all checked by default
    setShowScores(false); // Reset the showScores state
    router.push(`/search`);
  }

    // Open and close modal
    function openModal() {
      setIsModalOpen(true);
    }
  
    function closeModal() {
      setIsModalOpen(false);
    }

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
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
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
              placeholder="Basic Search here..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {/* Toggle Container SEARCH DISPLAY ------------- */}
          <div className="mb-2 p-4 border border-gray-300 ml-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">
              Search Display Options
            </h4>
            <hr className="font-semibold mb-3"></hr>
            <label className="block mb-1">
              <input
                type="checkbox"
                name="showScores"
                checked={showScores}
                onChange={() => setShowScores(!showScores)} // Update state on toggle
                className="mr-2"
              />
              Show Search Scores
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
