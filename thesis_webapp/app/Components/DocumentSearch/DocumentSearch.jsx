import DocumentResults from "../DocumentResults/DocumentResults";
import SearchBar from "../SearchBar/SearchBar";

export default async function DocumentSearch() {
  return (
    <div>
      <SearchBar></SearchBar>
      <DocumentResults></DocumentResults>
    </div>
  );
}
