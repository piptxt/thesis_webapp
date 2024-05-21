import Image from "next/image";
import TopBar from "./Components/TopBar/TopBar.jsx";
import SearchBar from "./Components/SearchBar/SearchBar.jsx";
import DocumentResults from "./Components/DocumentResults/DocumentResults";
import NavBar from "./Components/NavBar/NavBar.jsx";
import clientPromise from "../lib/mongodb";

export default async function Home() {
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const movies = await db
    .collection("movies")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  return (
    <main>
      {/* <TopBar /> */}
      <NavBar />
      <SearchBar />
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <h2>{movie.title}</h2>
            <h3>{movie.metacritic}</h3>
            <p>{movie.plot}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
