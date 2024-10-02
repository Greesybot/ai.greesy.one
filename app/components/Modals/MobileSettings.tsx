import React, { useState, useEffect, useCallback } from 'react';
import { Sheet } from 'react-modal-sheet';

const App = ({ isOpen: initialIsOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [apiKey, setApiKey] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true); // For loading state

  const settingsItems = [
    { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity={0.5}></path>
      <path fill="currentColor" d="M16.807 19.011A8.46 8.46 0 0 1 12 20.5a8.46 8.46 0 0 1-4.807-1.489c-.604-.415-.862-1.205-.51-1.848C7.41 15.83 8.91 15 12 15s4.59.83 5.318 2.163c.35.643.093 1.433-.511 1.848M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
    </svg>), text: 'Profile' },
    { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
        <path strokeLinejoin="round" d="M11 20h3c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12s0-5.657-1.172-6.828S17.771 4 14 4H6.5c-.464 0-.697 0-.892.02a4 4 0 0 0-3.589 3.588C2 7.803 2 8.036 2 8.5V11" opacity={0.5}></path>
        <path d="M11 20a9 9 0 0 0-9-9"></path>
        <path d="M8 20a6 6 0 0 0-6-6m3 6a3 3 0 0 0-3-3"></path>
      </g>
    </svg>), text: 'Provider Settings' },
  ];

  // Fetch API Key and Premium status when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/key')
        .then(res => res.json())
        .then(data => {
          setApiKey(data.key);
          setIsPremium(data.premium);
        })
        .catch(error => {
          console.error('Error fetching API key:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // Clipboard copy handling with fallback for unsupported environments
  const copyApiKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiKey).then(() => {
        alert('API Key copied to clipboard!');
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = apiKey;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('API Key copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const regenerateApiKey = () => {
    setApiKey('new' + Math.random().toString(36).substring(7));
    alert('API Key regenerated!');
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose();
  }, [onClose]);

  const handleSnap = useCallback((index) => {
    if (index === 0) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={handleClose}
      onSnap={handleSnap}
      snapPoints={[0, 300, 500]}
      initialSnap={2}
      style={{
        background: 'black',
        color: 'white',
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bg-black text-white p-4 overflow-y-min" style={{ minHeight: '100vh', maxHeight: 'calc(100vh - 50px)' }}>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>

            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <>
                {/* Subscription Info */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-md mx-auto mb-4">
                  <h3 className="text-lg font-semibold mb-2">Subscription</h3>
                  <p>{isPremium ? 'You are a Premium user' : 'You are on a Basic plan'}</p>
                </div>

                {/* API Key Section */}
                <div className="bg-gray-900 mt-4 p-6 rounded-xl shadow-lg max-w-md mx-auto mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">API Key</h2>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${isPremium ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300'}`}>
                      {isPremium ? 'Premium' : 'Basic'}
                    </span>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg mb-4">
                    <p className="text-gray-300 font-mono truncate">{apiKey}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                      onClick={copyApiKey}
                    >
                      Copy API Key
                    </button>
                    <button disabled={true} className="bg-red-900 hover:bg-red-800 text-red-300 font-bold py-2 px-4 rounded-lg transition duration-300">
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  {settingsItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded">
                      <span className="font-bold text-xl">{item.icon}</span>
                      <span className="font-extrabold">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex space-x-4 mb-4">
                  <button className="flex-1 bg-red-600 text-white py-2 rounded">
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};

export default App;