import { AiFillOpenAI } from "react-icons/ai";
import { FaMeta } from "react-icons/fa6";
import { IoLogoMicrosoft } from "react-icons/io5";
import { SiPerplexity } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";
const LOGOS = [
  <AiFillOpenAI width={28} height={28} className="text-gray-200" />,
  <FaMeta width={28} height={28} className="text-gray-200" />,
  <IoLogoMicrosoft width={28} height={28} className="text-gray-200" />,
  <SiPerplexity width={28} height={28} className="text-gray-200" />,
  <FaGoogle width={28} height={28} className="text-gray-200" />,
];

export default function InfiniteSlider() {
  return (
    <div className="relative m-auto w-screen overflow-hidden bg-black before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,black_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,black_0%,rgba(255,255,255,0)_100%)] after:content-['']">
      <div className="animate-infinite-slider flex w-[calc(125px*8)]">
        {LOGOS.map((logo, index) => (
          <div
            className="slide flex w-[125px] items-center justify-center"
            key={index}
          >
            {logo}
          </div>
        ))}
        {LOGOS.map((logo, index) => (
          <div
            className="slide flex w-[125px] items-center justify-center"
            key={index + LOGOS.length}
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
