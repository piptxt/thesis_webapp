"use client";

import { useSearchParams } from "next/navigation";
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

  console.log("Search Params:", searchQuery);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data || !data.movies) return <div>No movies found</div>;

  return (
    <>
      <p>Search Results:</p>
      <ul>
        {data.movies.map((movie) => (
          <li key={movie._id} className="m-5">
            <h2>Title: {movie.title}</h2>
            <h3>Metacritic: {movie.metacritic}</h3>
            <p>Plot: {movie.plot}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
