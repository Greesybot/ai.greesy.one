import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { PiDotsThreeCircleThin } from "react-icons/pi";

import ImageSlider from './components/Main/ImageSlider';
import Nav from './components/Main/Nav';
import Hero from './components/Main/Hero';

export default async function Home() {
  return (
    <>
      <Nav />
      <div className="flex w-full flex-col mx-auto z-0">
        <main className="flex flex-col gap-8 items-center sm:items-start">
          <Hero />
          <div 
            className="flex flex-col justify-center items-center sm:items-start sm:justify-between mt-12 sm:mt-24 mx-4 sm:mx-8 lg:mx-16" 
            id="greesyguard"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-[#ecedef] text-center sm:text-left">
              <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text text-transparent">
                Try
              </span> 
              GreesyGuard
            </h1>
            <p className="mt-2 text-lg sm:text-xl text-[#85868b] font-semibold text-center sm:text-left">
              Greesy Guard is our next-gen moderation <a className="underline" href="https://www.ibm.com/topics/ai-model">model</a>.
            </p>
            <ImageSlider />
          </div>
        </main>
      </div>
    </>
  );
}