'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import H2 from '/public/heading/h2';
import H3 from '/public/heading/h3';

const imagesSet1 = [
  "/images/UMAP/cosine_umap_visualization.png",
  "/images/UMAP/cosine_query_umap_visualization.png",
  "/images/UMAP/cosine_umap_visualization_3d.gif",
  "/images/UMAP/cosine_query_3d_umap_zoom.gif"
];

const imagesSet2 = [
  "/images/WordClouds/Thesis Data_wordcloud.png",
  "/images/WordClouds/Acts_wordcloud.png",
  "/images/WordClouds/Batas Pambata_wordcloud.png",
  "/images/WordClouds/Commonwealth Acts_wordcloud.png",
  "/images/WordClouds/Republic Acts_wordcloud.png",
  "/images/WordClouds/Supreme Court Jurisprudence_wordcloud.png"
];

const subtitlesSet2 = [
  "All Law Documents Wordcloud",
  "Acts Wordcloud",
  "Batas Pambata Wordcloud",
  "Commonwealth Acts Wordcloud",
  "Republic Acts Wordcloud",
  "Supreme Court Wordcloud"
];

const isGif = (url) => {
  return url.endsWith('.gif');
}

const VisualSection = () => {
  const pathname = usePathname();
  
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
        .image-container img, .image-container .next-image {
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
      `}</style>
      <div className="container mx-auto my-10">
        <H2 className="text-center text-3xl font my-5">UMAP Visuals</H2>
        <div className="grid grid-cols-2 gap-4">
          {imagesSet1.map((image, idx) => (
            <div key={idx} className="image-container" style={{ animation: `floatIn 1s ${idx * 0.2 + 0.5}s both` }}>
              {isGif(image) ? (
                <img src={image} alt={`UMAP Image ${idx + 1}`} className="rounded-lg" loop autoPlay />
              ) : (
                <Image src={image} alt={`UMAP Image ${idx + 1}`} layout="fill" objectFit="contain" className="next-image rounded-lg" unoptimized />
              )}
            </div>
          ))}
        </div>
        
        <H2 className="text-center text-3xl font my-5 mt-10">Wordcloud Visuals</H2>
        <div className="flex justify-center mb-6" style={{ animation: `floatIn 1s both` }}>
          <div className="small-image-container">
            {isGif(imagesSet2[0]) ? (
              <img src={imagesSet2[0]} alt={`Wordcloud`} className="rounded-lg" loop autoPlay />
            ) : (
              <Image src={imagesSet2[0]} alt={`Wordcloud`} layout="fill" objectFit="contain" className="next-image rounded-lg" unoptimized />
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {imagesSet2.slice(1,5).map((image, idx) => (
            <div key={idx} className="image-container" style={{ animation: `floatIn 1s ${idx * 0.2 + 0.5}s both` }}>
              {isGif(image) ? (
                <img src={image} alt={subtitlesSet2[idx + 1]} className="rounded-lg" loop autoPlay />
              ) : (
                <Image src={image} alt={subtitlesSet2[idx + 1]} layout="fill" objectFit="contain" className="next-image rounded-lg" unoptimized />
              )}
              <H3 className="text-center mt-2">{subtitlesSet2[idx + 1]}</H3>
            </div>
          ))}
          <div key={5} className="image-container col-start-3" style={{ animation: `floatIn 1s 2.5s both` }}>
            {isGif(imagesSet2[5]) ? (
              <img src={imagesSet2[5]} alt={subtitlesSet2[5]} className="rounded-lg" loop autoPlay />
            ) : (
              <Image src={imagesSet2[5]} alt={subtitlesSet2[5]} layout="fill" objectFit="contain" className="next-image rounded-lg" unoptimized />
            )}
            <H3 className="text-center mt-2">{subtitlesSet2[5]}</H3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSection;