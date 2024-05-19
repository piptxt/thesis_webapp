import Image from "next/image";
import TopBar from "./Components/TopBar/TopBar.jsx";
import SearchBar from "./Components/SearchBar/SearchBar.jsx";
import DocumentResults from "./Components/DocumentResults/DocumentResults.jsx";
import NavBar from "./Components/NavBar/NavBar.jsx";


export default function Home() {
  return (
    <main>
      {/* <TopBar /> */}
      <NavBar />
      <SearchBar />
    </main>
  );
}
