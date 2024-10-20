import React from "react";
import NavBar from "../Components/NavBar/NavBar.jsx";
import VisualSection from "./VisualizationSection.jsx";
import { getImagePaths } from "../../lib/getImagePaths";

const Collection = async () => {
  const initialImages = getImagePaths('Acts');

  return (
    <div>
      <NavBar />
      <VisualSection initialImages={initialImages} />
    </div>
  );
};

export default Collection;
