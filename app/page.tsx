import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { PiDotsThreeCircleThin } from "react-icons/pi";

import ImageSlider from "./components/Main/ImageSlider";
import Nav from "./components/Main/Nav";
import UserComments from "./components/Main/UserComments";
import Hero from "./components/Main/Hero";
import Models from "./components/Models/Card";

export default async function Home() {
  return (
    <>
      <Nav />
      <div className="flex w-full flex-col mx-auto  bg-[rgba(0, 0, 0, 0.4)">
        <main className="main bg-transparent flex flex-col gap-8 items-center sm:items-start">
          <Hero />

<UserComments/>
      <footer className="border border-b-0 border-gray-700 w-full py-8 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Main Pages */}
          <div>
            <h3 className="text-lg font-bold mb-4">Main Pages</h3>
            <ul>
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Blogs</a></li>
              <li><a href="#" className="hover:underline">Models</a></li>
            </ul>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-bold mb-4">Documents</h3>
            <ul>
              <li><a href="/privacy/" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms-of-service/" className="hover:underline">Terms of Service</a></li>
              <li><a href="/status" className="hover:underline">Status</a></li>
            </ul>
          </div>

          {/* Others */}
          <div>
            <h3 className="text-lg font-bold mb-4">Others</h3>
            <ul>
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Discord Server</a></li>

            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
</div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">© 2024 GreesyAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
        </main>
      </div>
    </>
  );
}
