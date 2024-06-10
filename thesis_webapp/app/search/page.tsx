"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "../Components/NavBar/NavBar";
import SearchBar from "../Components/SearchBar/SearchBar";
import { comment } from "postcss";
import useSWR from "swr";

const fetchMovies = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to get Movies");
  }

  return response.json();
};

export default function SearchPage() {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;

  const encodedSearchQuery = encodeURIComponent(searchQuery || "");
  const { data, error, isLoading } = useSWR(
    `/api/search?q=${encodedSearchQuery}`,
    fetchMovies
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data || !data.movies) return <div>No movies found</div>;

  let i = 1;
  data.movies.map((movie: any) => {
    console.log(i + ". " + movie.title + ": ");
    console.log(movie.scoreDetails);
    console.log("\n");
    i++;
  });

  return (
    <>
      <NavBar />
      <SearchBar />
      <ul className="m-auto w-2/3">
        <p className="mx-5 text-2xl font-semibold">Search Results:</p>
        {data.movies.map((movie: any) => (
          <li key={movie._id} className="m-5 p-5 border rounded">
            <h2 className="text-xl mt-1 font-semibold no-underline hover:underline cursor-pointer text-sky-700 ">
              {movie.title}
            </h2>
            {movie.directors.map((director: any, i: any) =>
              i + 1 < movie.directors.length ? ( // if not last add comma else remove comma
                <span className="text-sm">{director}, </span>
              ) : (
                <span className="text-sm">{director}</span>
              )
            )}
            <p className="text-sm mt-4 line-clamp-2 text-gray-600">
              {movie.fullplot}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
