import { AiFillOpenAI } from "react-icons/ai";
import { FaMeta } from "react-icons/fa6";
import { IoLogoMicrosoft } from "react-icons/io5";
import { SiPerplexity } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
const LOGOS = [
  <AiFillOpenAI
    key="openai"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <FaMeta
    key="meta"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <IoLogoMicrosoft
    key="microsoft"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <SiPerplexity
    key="perplexity"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <FaGoogle
    key="google"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <Image
    width={12}
    height={12}
    src="https://logowik.com/content/uploads/images/cohere-new9011.logowik.com.webp"
    key="cohere"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <Image
    width={12}
    height={12}
    src="https://raw.githubusercontent.com/01-ai/Yi/main/assets/Image/Yi_logo_icon_dark.svg"
    key="yi"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
  <Image
    width={12}
    height={12}
    src="https://avatars.githubusercontent.com/u/76263028?s=280&v=4"
    key="other"
    className="text-gray-200 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
  />,
];

export default function InfiniteSlider() {
  return (
    <div className="relative mx-auto overflow-hidden bg-black w-full before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[50px] sm:before:w-[100px] before:bg-gradient-to-r before:from-black before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[50px] sm:after:w-[100px] after:-scale-x-100 after:bg-gradient-to-l after:from-black after:to-transparent after:content-['']">
      <div className="animate-infinite-slider flex w-[calc(100px*10)] sm:w-[calc(125px*10)] md:w-[calc(150px*10)] lg:w-[calc(175px*10)]">
        {LOGOS.map((logo, index) => (
          <div
            className="slide flex items-center justify-center w-[100px] sm:w-[125px] md:w-[150px] lg:w-[175px]"
            key={index}
          >
            {logo}
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div
            className="slide flex items-center justify-center w-[100px] sm:w-[125px] md:w-[150px] lg:w-[175px]"
            key={index + LOGOS.length}
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
