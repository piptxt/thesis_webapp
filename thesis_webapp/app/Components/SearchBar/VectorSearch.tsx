"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";
import axios from "axios";  // for chunking query

type AdvQuery = {
  query: string;
  category: string[];
};

export default function VectorSearchBar() {
  const { extractedText } = useExtractedText();
  const [advQuery, setAdvQuery] = useState<AdvQuery>({
    query: "",
    category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"], // Default to all categories
  });
  const [chunks, setChunks] = useState<string[]>([]);
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

  async function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const encodedQuery = encodeURI(advQuery.query || "");
    const encodedCategory = encodeURI(advQuery.category.join(",") || "");

    try {
      // Split text into chunks
      const response = await axios.post("http://localhost:5000/split_to_chunks", { text: advQuery.query });
      console.log("HEREEEEEEEEEEEEEEEE")
      console.log(response.data)
      setChunks(response.data);

      // Pass chunks as query parameter
      const urlObject = {
        pathname: '/advance_search',
        query: { query: encodedQuery, category: encodedCategory, type: 'vector', chunks: JSON.stringify(response.data) }
      };
      router.push(urlObject); // Pass the object directly without casting
    } catch (error) {
      console.error("Error splitting text:", error);
    }
  }

  function onClear() {
    setAdvQuery({
      query: "",
      category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"],
    });
    setChunks([]); // Clear the chunks
  }

  function handleChunkClick(chunk: string) {
    const encodedQuery = encodeURI(chunk);
    const encodedCategory = encodeURI(advQuery.category.join(",") || "");

    router.push(`/advance_search?query=${encodedQuery}&category=${encodedCategory}&type=vector&chunks=${JSON.stringify(chunks)}`);
  }

  return (
    <div className="flex mx-auto p-5">
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h3 className="text-xl font-semibold mb-4">Chunks</h3>
        <ul>
          {chunks.map((chunk, index) => (
            <li key={index} className="mb-2">
              <button
                className="text-blue-700 hover:underline"
                onClick={() => handleChunkClick(chunk)}
              >
                {chunk.slice(0, 50)}...
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4">
        <form className="max-w-5xl min-h-2 mx-auto text-start" onSubmit={onSearch}>
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
                placeholder="Search here...VECTORR"
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
    </div>
  );
}
