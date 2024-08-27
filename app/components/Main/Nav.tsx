"use client"
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Desktop from './DestkopNav'
import Mobile from './MobileNav'


export default function Navbar(){
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isDesktop ? <Desktop /> : <Mobile />} 
      
    </>
  );
};

