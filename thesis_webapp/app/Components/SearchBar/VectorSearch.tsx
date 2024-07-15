"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdvQuery = {
  query: string;
  category: string[];
};

export default function VectorSearchBar() {
  const [advQuery, setAdvQuery] = useState<AdvQuery>({
    query: "",
    category: ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"], // Default to all categories
  });
  const router = useRouter();

  const categories = ["Act", "Supreme", "Republic Acts", "Commonwealth", "Batas"];

  function handleChange(e: any) {
    const name = e.target.name;
    const value = e.target.value;

    setAdvQuery((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleCheckboxChange(e: any) {
    const value = e.target.value;

    setAdvQuery((prev) => {
      const newCategory = prev.category.includes(value)
        ? prev.category.filter((item) => item !== value)
        : [...prev.category, value];
      return { ...prev, category: newCategory };
    });
  }

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const encodedQuery = encodeURI(advQuery.query || "");
    const encodedCategory = encodeURI(advQuery.category.join(",") || "");

    router.push(
      `/advance_search?query=${encodedQuery}` +
        `&category=${encodedCategory}`
    );
  }

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
              placeholder="Search here...VECTORR"
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </form>
    </div>
  );
}
