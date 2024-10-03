"use client"
import React, { useRef, useEffect, useState } from 'react';
import ModelCard from './Card';

const Carousel = () => {
  const carouselRef = useRef(null);
  const [models, setModels] = useState([]);

  useEffect(() => {
    // Fetch models from OpenAI API
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/v1/models', {
          headers: {
            
          }
        });
        const data = await response.json();
        console.log(data.data)
        setModels(data.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);

    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative">
      <h2 className="text-4xl ml-1.5 font-semibold mb-4 text-white">Popular Models </h2>
      
      {/* Sparkle SVG */}
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 736.000000 744.000000"
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-2 right-4 text-yellow-300 opacity-75"
      >
        <g
          transform="translate(0.000000,744.000000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
          <path
            d="M3756 7373 c-20 -197 -91 -698 -137 -973 -113 -669 -256 -1149 -441
-1475 -162 -285 -344 -485 -596 -653 -462 -309 -1154 -493 -2472 -655 l-105
-13 -3 -47 c-2 -26 0 -47 3 -47 18 0 631 -85 795 -110 342 -53 701 -128 953
-199 851 -241 1294 -617 1573 -1333 149 -382 251 -833 362 -1603 l38 -260 76
-3 77 -3 5 33 c3 18 17 121 31 228 53 396 145 891 214 1147 210 777 485 1192
988 1497 172 103 503 236 777 311 279 75 673 151 1116 215 157 22 300 43 318
46 l32 5 0 74 c0 69 -2 75 -22 80 -20 4 -465 70 -558 82 -77 10 -432 75 -540
99 -311 69 -577 146 -778 225 -95 38 -318 149 -390 195 -296 189 -528 448
-691 773 -199 395 -354 1010 -467 1846 -17 131 -74 573 -74 580 0 3 -17 5 -39
5 l-39 0 -6 -67z"
          />
        </g>
      </svg>
      
      <div 
        ref={carouselRef} 
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
      >
        {models.map((model) => (
          <div key={model.id} className="snap-center shrink-0 p-2">
            <ModelCard models={[model]} searchQuery={model.id}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
