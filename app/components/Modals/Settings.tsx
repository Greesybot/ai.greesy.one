import React, { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { useSession } from "next-auth/react";

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("api");
  const { data: session, status } = useSession();

  return (
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-40 border border-gray-800">
      <div className="bg-transparent backdrop-filter backdrop-blur-lg shadow-xl rounded-xl shadow-xl w-full max-w-md mx-4 text-gray-200 border border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("api")}
            className={`flex-1 py-2 px-4 font-semibold ${
              activeTab === "api"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            API Settings
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-2 px-4 font-semibold ${
              activeTab === "user"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            User Settings
          </button>
        </div>
        {activeTab === "user" && <UserSettings session={session} />}
        {activeTab === "api" && <ApiSettings />}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const UserSettings = ({ session }) => (
  <div className="p-4 max-h-96 overflow-y-auto">
    <div className="mb-4">
      <label
        className="block text-gray-300 text-sm font-bold mb-2"
        htmlFor="username"
      >
        Username
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder="Username"
        value={session.user.name}
        disabled
      />
    </div>
    <div className="mb-4">
      <label
        className="block text-gray-300 text-sm font-bold mb-2"
        htmlFor="email"
      >
        Email
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
        value={session.user.email}
        disabled
      />
    </div>
    <div className="mb-4">
      <label
        className="block text-gray-300 text-sm font-bold mb-2"
        htmlFor="notifications"
      >
        Notifications
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        id="notifications"
      >
        <option>All notifications</option>
        <option>Important only</option>
        <option>None</option>
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-bold mb-2">
        Theme
      </label>
      <div className="mt-2">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="theme"
            value="light"
          />
          <span className="ml-2">light purple</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="theme"
            selected={true}
            value="dark"
          />
          <span className="ml-2">Dark Blue</span>
        </label>
      </div>
    </div>
    {/*<div className="mb-4">
      <label
        className="block text-gray-300 text-sm font-bold mb-2"
        htmlFor="language"
      >
        Language
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        id="language"
      >
        <option>English</option>
        <option>Spanish</option>
        <option>French</option>
        <option>German</option>
      </select>
    </div>*/}
  </div>
);

const ApiSettings = () => {
  const { data: session } = useSession();
  const [reqTimeout, setReqTimeout] = useState(() => {
    return parseInt(window.localStorage.getItem("request-timeout") || "30", 10);
  });
  const [reqRetries, setReqRetries] = useState(() => {
    return parseInt(window.localStorage.getItem("request-retries") || "3", 10);
  });

  const [copied, setCopied] = useState(false);

  const copyKey = async () => {
    try {
      const response = await fetch("/api/key", {
        headers: {
          Authorization: session?.user?.email || "",
          "X-Force-UI": process.env.key ?? "UIGREESY",
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.localStorage.setItem("key", data.key);
        window.localStorage.setItem("request-timeout", reqTimeout.toString());
        window.localStorage.setItem("request-retries", reqRetries.toString());

        if (navigator.clipboard && window.isSecureContext) {
          // For modern browsers
          await navigator.clipboard.writeText(data.key);
        } else {
          // Fallback for older browsers and non-HTTPS environments
          const textArea = document.createElement("textarea");
          textArea.value = data.key;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
          } catch (err) {
            console.error("Failed to copy: ", err);
          }
          document.body.removeChild(textArea);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error("Failed to fetch API key:", response.status);
      }
    } catch (error) {
      console.error("Error copying API key:", error);
    }
  };

  const handleTimeoutChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setReqTimeout(isNaN(value) ? 1 : Math.max(1, Math.min(60, value)));
  };

  const handleRetriesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setReqRetries(isNaN(value) ? 0 : Math.max(0, Math.min(5, value)));
  };

  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="apiKey"
        >
          API Key
        </label>
        <button
          className="flex items-center justify-center shadow bg-gradient-to-br from-blue-700 to-sky-700 rounded-lg w-full hover:bg-gradient-to-br hover:from-blue-700 hover:to-sky-700 text-gray-200 h-12 hover:rounded-lg"
          onClick={copyKey}
          id="copy-button"
        >
          <span className="mr-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="currentColor" d="M9.5 2A1.5 1.5 0 0 0 8 3.5v1A1.5 1.5 0 0 0 9.5 6h5A1.5 1.5 0 0 0 16 4.5v-1A1.5 1.5 0 0 0 14.5 2z"></path>
	<path fill="currentColor" fillRule="evenodd" d="M6.5 4.037c-1.258.07-2.052.27-2.621.84C3 5.756 3 7.17 3 9.998v6c0 2.829 0 4.243.879 5.122c.878.878 2.293.878 5.121.878h6c2.828 0 4.243 0 5.121-.878c.879-.88.879-2.293.879-5.122v-6c0-2.828 0-4.242-.879-5.121c-.569-.57-1.363-.77-2.621-.84V4.5a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3zM7 13.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" clipRule="evenodd"></path>
</svg>
          </span>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="timeout"
        >
          Request Timeout (seconds)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          id="timeout"
          value={reqTimeout}
          onChange={handleTimeoutChange}
          type="number"
          min="1"
          max="60"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="retries"
        >
          Max Retries
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          id="retries"
          value={reqRetries}
          onChange={handleRetriesChange}
          type="number"
          min="0"
          max="5"
        />
      </div>
    </div>
  );
};

export default SettingsModal;
