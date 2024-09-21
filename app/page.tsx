import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { PiDotsThreeCircleThin } from "react-icons/pi";

import ImageSlider from "./components/Main/ImageSlider";
import Nav from "./components/Main/Nav";
import CompanySlider from "./components/Main/CompanySlider";
import Hero from "./components/Main/Hero";
import Models from "./components/Models/Card";

export default async function Home() {
  return (
    <>
      <Nav />
      <div className="flex w-full flex-col mx-auto z-0">
        <main className="flex flex-col gap-8 items-center sm:items-start">
          <Hero />
          <CompanySlider />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start mt-12 sm:mt-24 mx-4 sm:mx-8 lg:mx-16 space-y-12 lg:space-y-0 lg:space-x-16">
            {/* GreesyGuard Section */}
            <div
              className="flex flex-col justify-center items-start sm:items-start sm:justify-between"
              id="greesyguard"
              {/*onClick={() => window.location.href("https://huggingface.co/OnlyCheeini/greesychat-turbo*/}
            >
              <h1
                className="text-3xl sm:text-4xl font-extrabold font-sans text-[#ecedef] text-left"
                style={{ marginLeft: "1.5rem" }}
              >
                <span
                  className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text text-transparent"
                  style={{ marginRight: "0.4rem" }}
                >
                  Try
                </span>
                GreesyGuard
              </h1>
              <p
                className="mt-2 text-lg sm:text-xl text-[#85868b] break-all font-semibold text-left"
                style={{ marginLeft: "1.6rem" }}
              >
                GreesyGuard is our next-gen moderation model.
              </p>
              <ImageSlider />
            </div>

            {/* GreesyChat Section */}
            <div
              className="flex flex-col justify-center items-start sm:items-start sm:justify-between"
              id="greesychat"
            >
              <h1
                className="text-3xl sm:text-4xl font-extrabold font-sans text-[#ecedef] text-left"
                style={{ marginLeft: "1.5rem" }}
              >
                <span
                  className="bg-gradient-to-bl from-green-500 to-yellow-800 bg-clip-text text-transparent"
                  style={{ marginRight: "0.4rem" }}
                >
                  Explore
                </span>
                GreesyChat
              </h1>
              <p
                className="mt-2 text-lg sm:text-xl text-[#85868b] break-all font-semibold text-left"
                style={{ marginLeft: "1.6rem" }}
              >
                GreesyChat is our advanced conversational AI.
              </p>
              <ImageSlider />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
