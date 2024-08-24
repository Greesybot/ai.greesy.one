import React from 'react';
import ImageSlider from './ImageSlider'
export default function Hero() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen z-5 bg-opacity-40 backdrop-filter backdrop-blur-md text-white px-4 xl:w-full">
        {/* Version badge */}<div 
  className="inline-flex p-px rounded-[calc(1.5rem-1px)] items-center justify-center px-4 py-1 text-sm font-semibold mb-6 shadow-sm" 
  style={{
    boxShadow: '0 0 0 2px #3B82F6', // Adjust the color here
    color: 'linear-gradient(to right, #00ff00, #0000ff)', 
    borderColor: 'linear-gradient(to right, #00ff00, #0000ff)' 
  }}
>
  <span 
    className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:text-blue-400"
    style={{
      borderColor: '#3B82F6' // Ensure border color is consistent
    }}
  >
    <svg
      className="w-3 h-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fill="currentColor"
        d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"
      />
      <path
        fill="#fff"
        d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"
      />
    </svg>
    <span className="sr-only">Icon description</span>
  </span>

  <span style={{color: '#3B82F6'}}>Greesy Guard 2 Available</span>
</div>


        {/* Main heading */}
        <h1 className="text-center text-4xl sm:text-5xl font-bold leading-tight text-wrap">
          New <span className="bg-clip-text text-transparent animate-text ">GenAI</span> Models
          <br />
          for Community
          <br />

        </h1>

        {/* Subheading */}
        <p className="text-center mt-6 text-lg text-gray-400">
          API Support cooming soon.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
            Get Started →
          </button>
          <button className="px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Github
          </button>
        </div>

      </div>

    </>
  );
}