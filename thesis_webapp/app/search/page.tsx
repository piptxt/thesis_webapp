"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBars from "../Components/SearchBar/SearchBars";
import useSWR from "swr";
import Link from "next/link";

const fetchMovies = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to get Movies");
  }

  return response.json();
};

export default function SearchPage() {
  const search = useSearchParams();
  const searchQuery = search ? search.get("basic_search") : null;

  const encodedSearchQuery = encodeURIComponent(searchQuery || "");
  const { data, error, isLoading } = useSWR(
    `/api/search?basic_search=${encodedSearchQuery}`,
    fetchMovies
  );

  let MovieList;

  if (isLoading) {
    // Handle loading state
    MovieList = <p className="m-5">Loading...</p>;
  } else if (error) {
    // Handle error state
    MovieList = <p className="m-5">Error: {error.message}</p>;
  } else if (!data || !data.movies || data.movies.length === 0) {
    // Safeguard against undefined data
    MovieList = <p className="m-5">No movies found.</p>;
  } else {
    MovieList = data.movies.map((movie: any) => (
      <Link
        key={movie._id}
        href={{
          pathname: "document_page",
          query: {
            id: movie._id,
          },
        }}
      >
        <li className="m-5 p-5 border rounded">
          <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700 ">
            {movie.title}
          </h2>
          {movie.directors.map((director: any, i: any) =>
            i + 1 < movie.directors.length ? (
              <span key={i} className="text-sm">
                {director},{" "}
              </span>
            ) : (
              <span key={i} className="text-sm">
                {director}
              </span>
            )
          )}
          <h2 className="text-base mt-1 font-normal">
            Relevancy Score: {movie.scoreDetails.value}
          </h2>
          <p className="text-sm mt-4 line-clamp-2 text-gray-600">
            {movie.fullplot}
          </p>
        </li>
      </Link>
    ));
  }

  return (
    <>
      <NavBar />
      <SearchBars />
      <ul className="m-auto w-2/3">
        <p className="mx-5 text-xl font-semibold">Search Results:</p>
        {MovieList}
      </ul>
    </>
  );
}
