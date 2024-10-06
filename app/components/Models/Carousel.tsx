"use client"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

const Carousel = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {

    const fetchModels = async () => {
      try {
        const response = await fetch('/api/v1/models', {
          headers: {

          }
        });
        const data = await response.json();
        setModels(data.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative">
      <h2 className="text-4xl text-center font-semibold mb-4 text-white">Popular Models</h2>
      
      <Swiper
        scrollbar={{ hide: true }} // Enable the scrollbar
        spaceBetween={10}
        slidesPerView={1.5}
        modules={[Scrollbar]}
        className="mySwiper"
      >
        {models.map((model) => (
          <SwiperSlide key={model.id}>
            <div className="bg-gray-800 border border-gray-700  backdrop-filter backdrop-blur-xl bg-opacity-40 shadow-2xl rounded-lg shadow-lg p-6 gap-2 w-56 md:w-64 h-44 md:h-80 flex flex-col justify-between">
              <div className="text-center">
                <h3 className="text-lg text-white  font-semibold mb-2">{model.id}</h3>
                <p className="text-sm text-gray-600 mb-4">{model.description || "No description available"}</p>
              </div>
              <div className="flex justify-center mt-4">

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;