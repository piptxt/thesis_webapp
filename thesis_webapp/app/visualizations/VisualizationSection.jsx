"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import H2 from "/public/heading/h2";
import H3 from "/public/heading/h3";
import P from '/public/heading/P';

const isGif = (url) => {
  return url.endsWith(".gif");
};

const folders = [
  "Acts",
  "Batas Pambansa",
  "Commonwealth Acts",
  "Republic Acts",
  "Supreme Court",
];

const imagesSet1 = [
  
  "/images/UMAP/cosine_umap_visualization_3d.gif",
  "/images/UMAP/cosine_query_3d_umap_zoom.gif",
];

const imagesSet2 = [
  "/images/WordClouds/Thesis Data_wordcloud.png",
  "/images/WordClouds/Acts_wordcloud.png",
  "/images/WordClouds/Batas Pambata_wordcloud.png",
  "/images/WordClouds/Commonwealth Acts_wordcloud.png",
  "/images/WordClouds/Republic Acts_wordcloud.png",
  "/images/WordClouds/Supreme Court Jurisprudence_wordcloud.png",
];

const subtitlesSet2 = [
  "All Legal Documents",
  "Acts",
  "Batas Pambansa",
  "Commonwealth Acts",
  "Republic Acts",
  "Supreme Court",
];

const VisualSection = ({ initialImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState(initialImages);
  const [selectedFolder, setSelectedFolder] = useState(folders[0]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentImages.length) % currentImages.length
    );
  };

  const handleDropdownChange = async (event) => {
    const folder = event.target.value;
    setSelectedFolder(folder);
    const response = await fetch(`/api/getImagePaths?folderName=${folder}`);
    const images = await response.json();
    setCurrentImages(images);
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentImages]);

  return (
    
    <div>
      <style jsx>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .image-container {
          position: relative;
          width: 100%;
          padding-bottom: 75%; /* 4:3 aspect ratio */
        }
        .image-container img,
        .image-container .next-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .small-image-container {
          position: relative;
          width: 50%; /* Adjust the width as needed */
          padding-bottom: 50%; /* Adjusted aspect ratio for smaller image */
          margin: 0 auto; /* Center the container */
        }
        .navigation-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        .navigation-buttons button {
          padding: 10px 20px;
          cursor: pointer;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
        }
        .navigation-buttons button:hover {
          background-color: #005bb5;
        }
      `}</style>
      <div className="container mx-auto my-10">
        <H2 className="text-center text-3xl font my-5">
          Embedding Projector Visuals
        </H2>
        <P className="text-center text-2xl font my-5 mt-10">The embedding projector from Tensorflow is an engaging visualization of different dimensionality reduction methods. UMAP, PCA and t-SNE are selectable options in order to view how the embeddings of the documents in the vector database behave or are positioned in a vector space.</P>
        <iframe
          src="http://localhost:6006/#projector"
          width="90%"
          height="800px"
          className="mx-auto"
        ></iframe>
      </div>
      <div className="container mx-auto my-10">
        <H2 className="text-center text-3xl font my-5">UMAP Visuals</H2>
        <P className="text-center text-2xl font my-5">This is a UMAP visualization that shows how a query is positioned on the whole database of documents. This is essentially how vector search operates when being measured using a distance metric. The most semantically similar points are the ones closest to the query.</P>
        <div className="grid grid-cols-2 gap-4">
          {imagesSet1.map((image, idx) => (
            <div
              key={idx}
              className="image-container"
              style={{ animation: `floatIn 1s ${idx * 0.2 + 0.5}s both` }}
            >
              {isGif(image) ? (
                <img
                  src={image}
                  alt={`UMAP Image ${idx + 1}`}
                  className="rounded-lg"
                  loop
                  autoPlay
                />
              ) : (
                <Image
                  src={image}
                  alt={`UMAP Image ${idx + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className="next-image rounded-lg"
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>

        <H2 className="text-center text-3xl font my-5 mt-10">
          Wordcloud Visuals
        </H2>
        <P className="text-center text-2xl font my-5 mt-10">Open Law also offers other visualizations to engage users on the essence of different texts and words comprising of the different documents in the Open Law database.</P>
        <div
          className="flex justify-center mb-6"
          style={{ animation: `floatIn 1s both` }}
        >
          <div className="small-image-container">
            {isGif(imagesSet2[0]) ? (
              <img
                src={imagesSet2[0]}
                alt={`Wordcloud`}
                className="rounded-lg"
                loop
                autoPlay
              />
            ) : (
              <Image
                src={imagesSet2[0]}
                alt={`Wordcloud`}
                layout="fill"
                objectFit="contain"
                className="next-image rounded-lg"
                unoptimized
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {imagesSet2.slice(1, 5).map((image, idx) => (
            <div
              key={idx}
              className="image-container"
              style={{ animation: `floatIn 1s ${idx * 0.2 + 0.5}s both` }}
            >
              {isGif(image) ? (
                <img
                  src={image}
                  alt={subtitlesSet2[idx + 1]}
                  className="rounded-lg"
                  loop
                  autoPlay
                />
              ) : (
                <Image
                  src={image}
                  alt={subtitlesSet2[idx + 1]}
                  layout="fill"
                  objectFit="contain"
                  className="next-image rounded-lg"
                  unoptimized
                />
              )}
              <H3 className="text-center mt-2">{subtitlesSet2[idx + 1]}</H3>
            </div>
          ))}
          <div
            key={5}
            className="image-container col-start-3"
            style={{ animation: `floatIn 1s 2.5s both` }}
          >
            {isGif(imagesSet2[5]) ? (
              <img
                src={imagesSet2[5]}
                alt={subtitlesSet2[5]}
                className="rounded-lg"
                loop
                autoPlay
              />
            ) : (
              <Image
                src={imagesSet2[5]}
                alt={subtitlesSet2[5]}
                layout="fill"
                objectFit="contain"
                className="next-image rounded-lg"
                unoptimized
              />
            )}
            <H3 className="text-center mt-2">{subtitlesSet2[5]}</H3>
          </div>
        </div>

        <H2 className="text-center text-3xl font my-5 mt-10">
          Wordcount Visuals
        </H2>
        <P className="text-center text-2xl font my-5 mt-10">Wordcounts from different years also offer a little extra insight on the most prominently used words for each year, and within the given document type.</P>
        <div
          className="flex justify-center mb-6"
          style={{ animation: `floatIn 1s both` }}
        >
          <div className="small-image-container">
            {isGif(currentImages[currentImageIndex]) ? (
              <img
                src={currentImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="rounded-lg"
                loop
                autoPlay
              />
            ) : (
              <Image
                src={currentImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                className="next-image rounded-lg"
                unoptimized
              />
            )}
          </div>
        </div>
        <div className="navigation-buttons">
          <button onClick={prevImage}>Previous</button>
          <button onClick={nextImage}>Next</button>
        </div>

        {/* Dropdown to select image set */}
        <div className="flex justify-center mt-10">
          <select
            onChange={handleDropdownChange}
            value={selectedFolder}
            className="p-2 border rounded"
          >
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default VisualSection;
