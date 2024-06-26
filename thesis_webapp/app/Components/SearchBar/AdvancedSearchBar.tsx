"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GetServerSideProps } from "next";

export default function AdvancedSearchBar() {
  const search = useSearchParams();
  const [advQuery, setAdvQuery] = useState({
    title: "",
    cast: "",
    plot: "",
  });
  const router = useRouter();

  function handleChange(e: any) {
    const name = e.target.name;
    const value = e.target.value;

    setAdvQuery((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function onSearch(event: React.FormEvent) {
    event.preventDefault();

    console.log(advQuery);
    const encodedTitle = encodeURI(advQuery.title || "");
    const encodedCast = encodeURI(advQuery.cast || "");
    const encodedPlot = encodeURI(advQuery.plot || "");

    router.push(
      `/advance_search?title=${encodedTitle}` +
        `&cast=${encodedCast}` +
        `&plot=${encodedPlot}`
    );
  }
  return (
    <div className="mx-auto p-5">
      <form className="max-w-xl mx-auto text-start" onSubmit={onSearch}>
        <div className="mb-2">
          <label className="block mb-1 text-md font-medium text-gray-900">
            Title
          </label>
          <input
            type="search"
            name="title"
            className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search here..."
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 text-md font-medium text-gray-900">
            Cast
          </label>
          <input
            type="search"
            name="cast"
            className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search here..."
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 text-md font-medium text-gray-900">
            Plot
          </label>
          <input
            type="search"
            name="plot"
            className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search here..."
            onChange={handleChange}
          />
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
