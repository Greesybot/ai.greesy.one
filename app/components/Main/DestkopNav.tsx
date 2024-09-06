import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import SettingsModal from "../Modals/Settings"; // Ensure this import is correct based on your project structure

export default function DestkopNav() {
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);

  return (
    <>
      <div className="flex bg-black grid grid-cols-5 mt-4 ml-6">
        <div className="LogoArea col-span-1">
          <p className="w-full font-normal bg-transparent text-[#e7e8ea] !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small peer pr-6 rtl:pr-0 rtl:pl-6 is-filled font-sans text-[25px] ml-8">
            Greesy
            <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text animate- text-transparent">
              AI
            </span>
          </p>
        </div>
        <div className="navlinkSec col-span-3 flex items-center justify-center">
          <a href="/" className="text-gray-400 font-bold text-center mx-4">
            Home
          </a>
          <a href="/blog/" className="text-gray-400 font-bold text-center mx-4">
            Blog
          </a>
          <a
            href="/models"
            className="text-gray-400 font-bold text-center mx-4"
          >
            Models
          </a>
        </div>
        <div className="col-span-1 w-full flex items-center justify-end pr-6">
          {status === "authenticated" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="flex items-center space-x-3 hover:rounded-md hover:bg-gray-800 hover:overflow-none w-40 h-10 cursor-pointer"
              onClick={() => setModal(true)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-lg font-semibold text-white">
                {session.user.name}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-700 rounded-lg"
            >
              <button className="w-32 text-white text-gray-200 h-12 rounded-lg">
                Login
              </button>
            </motion.div>
          )}
          {status === "authenticated" && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg ml-4"
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
      <div className="w-full h-8"></div>
      {modal && (
        <SettingsModal isOpen={modal} onClose={() => setModal(false)} />
      )}
    </>
  );
}
