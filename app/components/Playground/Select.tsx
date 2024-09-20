import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RiAttachmentLine } from "react-icons/ri";

function ModelSelect({ size, disabled, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = options.filter((model) =>
    model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleModelChange = (model) => {
    setSelectedModel(model);
    onChange(model); // Call the onChange function when the model changes
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`border border-md border-gray-700 ${size} flex items-center justify-between text-white text-[9px] h-10 px-2 py-2 rounded-md`}
      >
        <span className="truncate mr-1">{selectedModel}</span>
        <IoIosArrowDown className="flex-shrink-0" size={12} />
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search model by name"
            className="w-full p-2 bg-gray-700 text-white rounded-t-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 overflow-auto">
            {filteredModels.map((model) => (
              <li
                key={model}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                onClick={() => {
                  handleModelChange(model); // Call the handleModelChange function when a model is selected
                  setIsOpen(false);
                }}
              >
                {model}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ModelSelect;
