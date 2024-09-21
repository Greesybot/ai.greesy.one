"use client";
import React from "react";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import { useSession } from "next-auth/react";

import { getProviders, signIn } from "next-auth/react";
import Nav from "../components/Main/Nav";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) return router.push("/");
  //  if(session) return router.push("/")
  return (
    <>
      <Nav />
      <div className="bg-black min-h-screen text-white p-6">
        <div className="max-w-sm mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full relative">
                <div className="w-1.5 h-1.5 bg-black rounded-full absolute -top-2 -right-2"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full absolute -bottom-2 -right-2"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-200 mb-1 ml-4 mx-auto text-center">
            Welcome to{" "}
            <span className="w-full text-center font-normal bg-transparent text-[#e7e8ea] !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small peer pr-6 rtl:pr-0 rtl:pl-6 is-filled font-sans text-[30px] font-bold">
              Greesy
              <span className="bg-gradient-to-bl from-blue-500 to-purple-800 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            Welcome back! Please log in to continue.
          </p>

          <div className="text-gray-500 text-xs text-center mb-4">
            OR CONTINUE WITH
          </div>

          {[
            { name: "Github", icon: <FaGithub size={20} />, id: "github" },
            { name: "Google", icon: <FaGoogle size={20} />, id: "google" },
            { name: "Discord", icon: <FaDiscord size={20} />, id: "discord" },
          ].map(({ name, id, icon }) => (
            <button
              key={name}
              onClick={() => signIn(id)}
              className="w-full p-3 mb-3 bg-gray-900 text-white rounded-full font-semibold flex items-center justify-center"
              aria-label={`Continue with ${name}`}
            >
              <span className="mr-2">{icon}</span>
              {name}
            </button>
          ))}

          <p className="text-gray-400 text-xs text-center mt-4">
            By clicking continue, you agree to our{" "}
            <a href="/terms-of-service" className="text-white underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-white underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
