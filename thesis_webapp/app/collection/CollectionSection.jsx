'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link"
import H2 from '/public/heading/h2';
import P from '/public/heading/P';

const cards = [
    {
      id: 1,
      title: "All Legal Documents",
      text: "Explore our comprehensive collection of Philippine legal documents, encompassing various laws, regulations, and judicial decisions. This repository serves as a one-stop resource for legal practitioners, students, and the general public seeking legal information. Browse through an extensive array of documents to find exactly what you need for your legal inquiries.",
      imgSrc: "/images/collection/all_collection.png",
      link: "/"
    },
    {
      id: 2,
      title: "Supreme Court Jurisprudence",
      text: "Engage yourself  into the rich repository of Philippine Supreme Court decisions that have shaped the legal landscape of the nation. This collection provides authoritative interpretations of laws and precedents essential for legal research and practice. Gain insights from landmark rulings and current jurisprudence that influence various aspects of Philippine law.",
      imgSrc: "/images/collection/supreme_collection.jpg",
      link: "/"
    },
    {
      id: 3,
      title: "Acts",
      text: "Access a wide range of Acts passed by the Philippine legislature, which form a crucial part of the country's statutory laws. This collection includes historical and contemporary acts that have been enacted to govern various sectors and activities in the Philippines. Ideal for students, legal professionals, and researchers looking for specific legislative documents.",
      imgSrc: "/images/collection/acts_collection.png",
      link: "/"
    },
    {
      id: 4,
      title: "Batas Pambansa",
      text: "Explore the collection of Batas Pambansa, laws enacted by the former Batasang Pambansa (National Assembly) of the Philippines. These laws cover various aspects of national interest and social reform enacted during the period of parliamentary government. A valuable resource for understanding the legal transitions and reforms of the past.",
      imgSrc: "/images/collection/batas_pambata.png",
      link: "/"
    },
    {
      id: 5,
      title: "Commonwealth Acts",
      text: "Discover our archive of Commonwealth Acts, laws enacted during the Commonwealth period of the Philippines, which laid down the administrative foundation of the modern Philippine Republic. These acts address a range of issues from economic policies to social welfare, reflecting the challenges and aspirations of the pre-independence era.",
      imgSrc: "/images/collection/commonwealth_collection.png",
      link: "/"
    },
    {
      id: 6,
      title: "Republic Acts",
      text: "Browse through the collection of Republic Acts, which are laws passed by the Congress of the Philippines. These documents encompass a broad spectrum of legal frameworks essential for the governance, development, and protection of the Filipino people and the national territory. A crucial resource for anyone engaged in legal, academic, or governmental research.",
      imgSrc: "/images/collection/republic_collection.png",
      link: "/"
    }
  ];

const CollectionSection = () => {
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
      `}</style>
      <div className="container mx-auto my-10">
        <H2 className="text-center text-3xl font my-5">Read Open Law</H2>
        {/* <p className="text-center mb-10">Welcome to our Collection Page!</p> */}
        <div className="grid grid-cols-1 gap-5 items-center justify-center">
          {cards.map((card, index) => (
            <div key={card.id} className="flex bg-slate-800 text-gray-100 p-4 rounded-lg shadow-lg transform transition duration-500 ease-in-out hover:translate-y-2 mx-auto w-3/4" style={{ animation: `floatIn 1s ${index * 0.2 + 0.5}s both` }}>
              <div className="w-1/3">
                <Image src={card.imgSrc} alt={card.title} width={300} height={200} layout="responsive" className="rounded-l-lg" />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p>{card.text}</p>
                <Link href={card.link} className="text-blue-400 hover:text-blue-500 mt-2 inline-block">View More ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CollectionSection;
