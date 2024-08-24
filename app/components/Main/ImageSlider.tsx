"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Interface for image data
interface ImageData {
  src: StaticImageData;
}

// Image data array
const images: ImageData[] = [
  {
    "src": "https://raw.githubusercontent.com/meta-llama/PurpleLlama/main/logo.png",
  },
  {
   "src": "https://images.unsplash.com/photo-1720048171419-b515a96a73b8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    "src": "https://images.unsplash.com/photo-1720048171419-b515a96a73b8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function ImageSlider(): JSX.Element {
  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // State to determine if the image is being hovered over
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Function to show the previous slide
  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Function to show the next slide
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // useEffect hook to handle automatic slide transition
  useEffect(() => {
    // Start interval for automatic slide change if not hovered
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      // Cleanup the interval on component unmount
      return () => {
        clearInterval(interval);
      };
    }
  }, [isHovered]);

  // Handle mouse over event
  const handleMouseOver = (): void => {
    setIsHovered(true);
  };

  // Handle mouse leave event
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  return (
    <div className="imgcard z-0 relative mr-8 w-full md:w-full md:justify-start  mx-auto mt-4">
      <div
        className=" relative h-[460px] mr-4 mx-6 group hover:-translate-y-2"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={images[currentIndex].src}
          alt={`Slider Image ${currentIndex + 1}`}
          onMouseOver={handleMouseOver}
          layout="fill"
          objectFit="cover"
          className="rounded-xl transition-all duration-500 ease-in-out cursor-pointer"
        />
      </div>

      <div className="flex z-0 justify-center mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${index === currentIndex
                ? "bg-[#3437eb] rounded-xl"
                : "bg-gray-300 rounded-xl"
              } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
} 