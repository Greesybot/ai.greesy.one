"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { HiBars2 } from "react-icons/hi2";
import Header from "./Announce";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import SettingsModal from "../Modals/Settings";
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (open) {

      document.body.classList.add("overflow-hidden");
    } else {

      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <>
      <div className="flex flex-col gap-4 fixed backdrop-filter bg-opacity-40 backdrop-blur-lg z-20 bg-opacity-30 w-96 md:w-full lg:w-full h-16 mx-auto items-center justify-between  select-none">
        <div className="flex  w-full mx-auto items-center justify-between space-x-8 mx-auto mb-4">
          <p className="w-full font-normal bg-transparent text-[#e7e8ea] !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small peer pr-6 rtl:pr-0 rtl:pl-6 is-filled font-sans text-[25px] ml-8">
            Greesy
            <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text animate- text-transparent">
              AI
            </span>
          </p>
          <div className="right-4 p-4 mr-8 flex space-x-3">
            <div className="text-[#e7e8ea]">
              <FaGithub size="25px" />
            </div>
            <button
              className="hover:bg-opacity-40 text-[#e7e8ea]"
              onClick={() => setOpen(!open)}
            >
              {!open ? <HiBars2 size={25} /> : <IoCloseSharp size={25} />}
            </button>
          </div>
        </div>
      </div>
      <div className="h-16 w-96"></div>

      {open ? (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex mt-12 fixed top-0 left-0 w-screen h-full bg-black z-20 mx-auto bg-opacity-30 backdrop-filter backdrop-blur-lg text-white mx-4 p-5 transition-all duration-100 delay-150"
        >
          <div className="absolute top-6 ml-4 mt-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }} // Gecikmeyi artırdım
              className="pagesCol fixed ml-auto mt-auto"
            >
              <a
                href="/"
                className="link font-sans text-gray-300 bg-opacity-50 text-xl delay-100 transition-all font-semibold"
              >
                Home
              </a>
            </motion.div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }} // Gecikmeyi artırdım
              className="pagesCol fixed ml-auto mt-16"
            >
              <a
                href="/blog"
                className="link font-sans text-gray-300 bg-opacity-50 text-xl delay-100 transition-all font-semibold"
              >
                Blogs
              </a>
            </motion.div>
          </div>
<SettingsModal isOpen={modal} onClose={() => setModal(false)} />
          <motion.footer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }} // Gecikmeyi artırdım
            className="fixed bottom-12 left-0 w-full bg-opacity-50 backdrop-filter backdrop-blur-lg text-white mx-4 p-5 rounded-lg shadow-lg flex items-center justify-between"
          >
            {status === "authenticated" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }} // Gecikmeyi artırdım
                className="flex items-center space-x-3 hover:rounded-md hover:bg-gray-800 hover:overflow-none w-40 h-10 "
                onClick={() => setModal(true)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg  ">
                  <img
                    src={`${session.user.image}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold">{session.user.name}</div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }} // Gecikmeyi artırdım
                className="flex justify-center mx-auto items-center bg-gradient-to-br from-blue-500 to-sky-500 w-full mr-7 hover:rounded-lg rounded-lg"
              >
                <button className="w-full hover:bg-gradient-to-br hover:from-blue-700 hover:to-sky-700 text-gray-200 h-12 hover:rounded-lg">
                  Login
                </button>
              </motion.div>
            )}
            {status === "authenticated" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }} // Gecikmeyi artırdım
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg ml-auto mr-4"
              >
                Logout
              </motion.button>
            )}
          </motion.footer>
        </motion.div>
      ) : null}
    </>
  );
}
