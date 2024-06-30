"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GetServerSideProps } from "next";

export default function VectorSearchBar() {
  const search = useSearchParams();
  const [advQuery, setAdvQuery] = useState({
    title: "",
    category: "",
    body: "",
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
    const encodedCategory = encodeURI(advQuery.category || "");
    const encodedBody = encodeURI(advQuery.body || "");

    router.push(
      `/advance_search?title=${encodedTitle}` +
        `&category=${encodedCategory}` +
        `&body=${encodedBody}`
    );
  }
  return (
    <div className="mx-auto p-5">
      <form
        className="max-w-5xl min-h-2 mx-auto text-start"
        onSubmit={onSearch}
      >
        <div className="mb-2">
          <textarea
            name="title"
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
