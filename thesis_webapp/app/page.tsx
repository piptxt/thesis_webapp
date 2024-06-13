import Image from "next/image";
import TopBar from "./Components/TopBar/TopBar";
import SearchBar from "./Components/SearchBar/BasicSearchBar";
import NavBar from "./Components/NavBar/NavBar";
import AdvancedSearchBar from "./Components/SearchBar/AdvancedSearchBar";
import SearchBars from "./Components/SearchBar/SearchBars";

export default async function Home() {
  return (
    <main>
      <NavBar />
      <SearchBars />
    </main>
  );
}
