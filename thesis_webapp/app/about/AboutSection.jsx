'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import H2 from '/public/heading/h2';
import P from '/public/heading/P';

const slides = [
  {
    title: "What is Open Law?",
    subTitle: "Hard to Navigate Documents.",
    desc: "Open Law Philippines is a search system study that explores the application of advanced NLP concepts such as vector embeddings from Large Language Models in order to get the semantic meaning of a particular query. It explores not only keyword-based search systems for documents but also sets out to investigate and improve the effectiveness of search in the Philippine legal sector.",
    img: "/images/about/law_img1.jpg",
  },
  {
    title: "Semantic Search?",
    subTitle: "More Natural Searches.",
    desc: "Semantic search systems implement the Retrieval Augmented Generation (RAG) technique which involves Large Language Models to interpret the given query. Think of it as searching through your own files while something like ChatGPT, Copilot, Claude, etc. is interpreting which kind of document that you want. The collection of documents are converted to vector embeddings and are then stored in a vector database to ensure fast retrieval. In addition, this study is combined with implementations of classic and effective keyword searches like BM25 in order to compare and investigate the best search results possible.",
    img: "/images/about/law_search_img.png",
  },
  {
    title: "The Team",
    subTitle: "Welcome to Our Study!",
    desc: "We are a group of undergraduate students from De La Salle University who are setting out to study this case in legal retrieval. Being students quite keen and interested on Natural Language Processing and Data Science, we want to contribute to this sector in the Philippines as it would spur implications about these advancing technologies today.",
    img: "/images/about/school_img.png",
  }
];

const AboutSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const [showTitleBlock, setShowTitleBlock] = useState(false);
  const [showArrows, setShowArrows] = useState(false);  // State to control arrow visibility

  useEffect(() => {
    setFade(true);
    setShowTitleBlock(false);
    setShowArrows(false);  // Hide arrows during the transition
    const titleTimer = setTimeout(() => {
      setShowTitleBlock(true);
      setShowArrows(true);  // Show arrows after the transition
    }, 500);
    return () => clearTimeout(titleTimer);
  }, [activeSlide]);

  const changeSlide = (newSlide) => {
    setFade(false);
    setShowArrows(false);  // Hide arrows when changing slide
    setTimeout(() => {
      setActiveSlide(newSlide);
      setFade(true);
      setShowArrows(true);  // Show arrows again after changing slide
    }, 500);
  };

  const handleNext = () => {
    changeSlide((activeSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    changeSlide((activeSlide - 1 + slides.length) % slides.length);
  };

  const { title, subTitle, desc, img } = slides[activeSlide];

  return (
    <section className="container mx-auto py-10 relative">
      <div className="my-10 flex justify-center relative">
        <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'} w-full max-w-3xl relative`}>
          <Image src={img} height={450} width={700} layout="responsive" quality={100} alt={subTitle} />
          <div className="bg-white py-12 px-4 shadow-xl mt-4">
            <H2><span className="text-gray-800"> {subTitle}</span></H2>
            <P>{desc}</P>
          </div>
          {showTitleBlock && (
            <div className="absolute top-0 left-0 bg-white text-gray-800 p-8 max-w-xs -ml-20 mt-8 shadow-2xl animate-swipeReveal">
              <H2>{title}</H2>
            </div>
          )}
        </div>
      </div>
      <div className={`absolute top-1/2 left-4 transform -translate-y-1/2 transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={handlePrev} className="text-white bg-gray-800 hover:bg-gray-600 p-3 rounded-full">
          &#8592;  {/* Left Arrow */}
        </button>
      </div>
      <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={handleNext} className="text-white bg-gray-800 hover:bg-gray-600 p-3 rounded-full">
          &#8594;  {/* Right Arrow */}
        </button>
      </div>
    </section>
  );
};

export default AboutSection;

