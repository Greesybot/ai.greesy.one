import React from "react";
import "../../Button.css";

const Header = () => {
  return (
    <div className="flex w-96 header border-b-2 border-gray-900">
      <h1 className="title ml-2 text-md">
        <span className="purple-text">Explore faster</span> Greesychat llm
      </h1>
      <button
        className="flex h-8 gradient-button text-center items-center"
        value="Greesy"
      >
        <span className="flex flex-col"> Greesy Chat</span>
      </button>
    </div>
  );
};

export default Header;
