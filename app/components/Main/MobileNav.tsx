import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { HiBars2 } from "react-icons/hi2";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import SettingsModal from "../Modals/Settings";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(false);
  const { data: session, status } = useSession();
  const pr = [
    { name: "Github", icon: <FaGithub size={20} />, id: "github" },
    { name: "Google", icon: <FaGoogle size={20} />, id: "google" },
    { name: "Discord", icon: <FaDiscord size={20} />, id: "discord" },
  ];

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <>
      <div className="flex flex-col gap-4 fixed backdrop-filter bg-black bg-opacity-40 backdrop-blur-lg z-20 bg-opacity-30 w-full md:w-full lg:w-full h-16 mx-auto items-center justify-between select-none">
        <div className="flex w-full mx-auto items-center justify-between space-x-8 mx-auto mb-4">
          <p className="w-full font-normal bg-transparent text-[#e7e8ea] !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small peer pr-6 rtl:pr-0 rtl:pl-6 is-filled font-sans text-[25px] ml-8">
            Greesy
            <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text animate- text-transparent stroke-red-400">
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

      {open && (
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
              transition={{ delay: 0.5, duration: 0.4 }}
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
              transition={{ delay: 0.7, duration: 0.4 }}
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
          {login && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="flex justify-center mx-auto items-center w-full mr-7 hover:rounded-lg rounded-lg"
            >
              <div
                id="login-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed inset-0 z-50 flex items-center justify-center w-full h-full max-h-full overflow-y-auto overflow-x-hidden"
              >
                <div className="relative w-full max-w-md max-h-full p-4">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Sign Into With
                      </h3>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 p-1 text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="crypto-modal"
                        aria-label="Close modal"
                        onClick={() => setLogin(false)}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Connect Us using these providers
                      </p>
                      <ul className="my-4 space-y-3">
                        {pr.map((provider) => (
                          <li key={provider.id}>
                            <a
                              onClick={() => signIn(provider.id)}
                              className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white space-x-4"
                              aria-label={`Connect with ${provider.name}`}
                            >
                              {provider.icon}
                              <span className="ml-2"> {provider.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {modal && <SettingsModal isOpen={modal} onClose={() => setModal(false)} />}
          <motion.footer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="fixed bottom-12 left-0 w-full bg-opacity-50 backdrop-filter backdrop-blur-lg text-white mx-1 p-5 rounded-lg shadow-lg flex items-center justify-between"
          >
            {status === "authenticated" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="flex items-center space-x-3 hover:rounded-md hover:bg-gray-800 hover:overflow-none w-40 h-10"
                onClick={() => setModal(true)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                  <Image
                    width={20}
                    height={20}
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
                  transition={{ delay: 1.3, duration: 0.4 }}
                  className="flex justify-center mx-auto items-center bg-gradient-to-br from-blue-500 to-sky-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer"
                  onClick={() => signIn()}
                >
                  Sign In
                </motion.div>
            )}
            {status === "authenticated" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="flex justify-center mx-auto items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer ml-20"
                onClick={() => signOut()}
              >
                Log Out
              </motion.div>
            )}
          </motion.footer>
        </motion.div>
      )}
    </>
  );
}