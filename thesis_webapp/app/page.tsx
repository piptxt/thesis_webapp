import Image from "next/image";
import TopBar from "./Components/TopBar/TopBar";
import SearchBar from "./Components/SearchBar/SearchBar";
import NavBar from "./Components/NavBar/NavBar";

export default async function Home() {
  return (
    <main>
      <NavBar />
      <SearchBar />
    </main>
  );
}
