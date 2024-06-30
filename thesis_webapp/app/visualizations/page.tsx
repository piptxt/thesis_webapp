import React from "react";
import NavBar from "../Components/NavBar/NavBar.jsx";
import VisualSection from "./VisualizationSection.jsx";
import { getImagePaths } from "../../lib/getImagePaths";

const Collection = async () => {
  const wordCountBargraphsImages = getImagePaths('images/Wordcount_Bargraphs/Acts_Plots');

  return (
    <div>
      <NavBar />
      <VisualSection wordCountBargraphsImages={wordCountBargraphsImages} />
    </div>
  );
};

export default Collection;