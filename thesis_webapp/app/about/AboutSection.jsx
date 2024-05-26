'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import H2 from './ui/heading/h2';
import H3 from './ui/heading/h3';
import P from './ui/heading/P';

const slides = [
  {
    title: "What is Open Law?",
    subTitle: "Hard to Navigate files",
    desc: "Description of the first topic.",
    img: "/images/about/law_img1.jpg",
  },
  {
    title: "Semantic Search?",
    subTitle: "Our Approach",
    desc: "Explanation of how you handle these files.",
    img: "/images/about/law_search_img.png",
  },
  {
    title: "The Team",
    subTitle: "Our Team",
    desc: "Details about the team.",
    img: "/images/about/law_img1.jpg",
  }
];

const AboutSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const [showTitleBlock, setShowTitleBlock] = useState(false);

  useEffect(() => {
    setFade(true);
    setShowTitleBlock(false);
    const titleTimer = setTimeout(() => {
      setShowTitleBlock(true);
    }, 500);
    return () => clearTimeout(titleTimer);
  }, [activeSlide]);

  const changeSlide = (newSlide) => {
    setFade(false);
    setTimeout(() => {
      setActiveSlide(newSlide);
      setFade(true);
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
            <H2>
              <span className="text-red-500 underline">{title}</span>
              <span className="text-gray-800"> {subTitle}</span>
            </H2>
            <H3>More Details</H3>
            <P>{desc}</P>
          </div>
          {showTitleBlock && (
            <div className="absolute top-0 left-0 bg-white text-gray-800 p-8 max-w-xs -ml-20 mt-8 shadow-2xl animate-swipeReveal">
              <H2>{title}</H2>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button onClick={handlePrev} className="text-white bg-gray-800 hover:bg-gray-600 p-3 rounded-full">
          &#8592;  {/* Left Arrow */}
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button onClick={handleNext} className="text-white bg-gray-800 hover:bg-gray-600 p-3 rounded-full">
          &#8594;  {/* Right Arrow */}
        </button>
      </div>
    </section>
  );
};

export default AboutSection;


