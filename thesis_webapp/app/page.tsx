import Image from "next/image";
import TopBar from "./Components/TopBar/TopBar";
import SearchBar from "./Components/SearchBar/SearchBar";
import DocumentResults from "./Components/DocumentResults/DocumentResults";
import NavBar from "./Components/NavBar/NavBar";

export default async function Home() {
  let movies: any = [];
  let query = "";

  return (
    <main>
      {/* <TopBar /> */}
      <DocumentResults query={""} />
    </main>
  );
}
