"use client"
import React, { useRef, useEffect, useState } from 'react';

const TestimonialCard = ({ name, role, imageSrc, testimonial }) => {
  return (
    <div className=" bg-gray-800 rounded-lg p-6 backdrop-filter backdrop-blur-xl bg-opacity-40 shadow-2xl border border-gray-700 mb-4">
      <div className="flex items-center mb-2">
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-green-400">{role}</p>
        </div>
      </div>
      <div className="h-24 overflow-y-auto">
        <p className="text-sm text-gray-300">
          {testimonial}
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const users = [
    {
      name: 'Just Nyde',
      role: 'Founder - DisCore',
      imageSrc: 'https://via.placeholder.com/40',
      testimonial: 'We use GreesyAI for our services. Thanks to them a lot.'
    },

    {
      name: 'Rivalth',
      role: 'Lilven',
      imageSrc: 'https://via.placeholder.com/40',
      testimonial: 'GreesyAI one of nice services i saw.'
    },
    {
      name: 'Etoila',
      role: 'Moderator - DisCore',
      imageSrc: 'https://via.placeholder.com/40',
      testimonial: 'The integration of AI with our platform has been seamless thanks to GreesyAI.'
    }
  ];

  return (
    <div className="px-4 pb-4 ">
      <h2 className="text-4xl font-semibold mb-4 text-white">Reviews </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {users.map((user, index) => (
          <TestimonialCard
            key={index}
            name={user.name}
            role={user.role}
            imageSrc={user.imageSrc}
            testimonial={user.testimonial}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;