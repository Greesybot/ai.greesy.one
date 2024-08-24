"use client"
import BlogCard from '../components/Blog/Card'
import Nav from '../components/Main/Nav'
import { TiWarning } from "react-icons/ti";
import { useEffect, useState } from 'react'

export default function Blog() {
  const [datas, setDatas] = useState([]);
  const [status, setStatus] = useState(null);
  const [error,setError] = useState({})
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/blogs/get");
          
        const result = await response.json();
        if(result.status === 404) {
          setStatus(404)
       //   setError(result)
          
        } else {
       console.log(result.blogs)
        setDatas(result.blogs || []);
        setStatus(response.status);
        }
      } catch (error) {
        setStatus(500);
        setDatas({ message: "Failed to fetch data" });
      }
    }

    fetchData();
  }, []);

  return (
    <>
    <Nav/>

      <div className="bg- text-white p-6 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-8">News Overview</h2>
        </div>
        {(status === 200 && datas !== []) ? (
          datas.map((data, index) => (
            
                        <BlogCard key={index} data={data}/>
 
          ))
        ) : (
          <> 
          <div className="flex shadow shadow-xl border-dotted w-80 h-12 justify-between rounded-md mx-auto mt-14 border-gray-500 border  text-center ">
                       <div className="flex flex-row-2 font-bold font-sans  mx-auto space-x-2 justify-between mt-2">
                         <span className="text-rose-400 mt-1 mx-auto"><TiWarning/></span> <h1 className="text-gray-200">No blogs published recently</h1>
                       </div>
          </div>
          </>
        )}
      </div>
    </>
  );
}