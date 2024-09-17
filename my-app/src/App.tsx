import React, { useEffect, useState } from "react";
import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";

function App() {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [port, setPort] = useState<string | null>(null);

  useEffect(() => {
    const hostValue = process.env.REACT_APP_cks_EXPRESS_HOST;
    const portValue = process.env.REACT_APP_cks_EXPRESS_PORT;

    setHost(hostValue || null);
    setPort(portValue || null);

    if (!hostValue || !portValue) {
      setError(
        "Server configuration is missing. Please check environment variables."
      );
    } else {
      setServerUrl(`http://${hostValue}:${portValue}`);
    }
  }, []);

  return (
    <div className='App max-w-4xl mx-auto p-6'>
      <h1 className='text-4xl font-extrabold mb-6 text-center text-blue-600'>
        JSON File Operations
      </h1>
      {(host || port) && (
        <div className='mb-8 p-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-lg'>
          <p className='text-xl text-white font-bold mb-4 text-center'>
            Server Configuration:
          </p>
          <div className='flex justify-center items-center space-x-10'>
            {host && (
              <div className='bg-white px-6 py-3 rounded-lg shadow-lg border-l-4 border-blue-600'>
                <span className='text-gray-800 font-medium'>Host: </span>
                <span className='ml-2 text-blue-900 font-bold'>{host}</span>
              </div>
            )}
            {port && (
              <div className='bg-white px-6 py-3 rounded-lg shadow-lg border-l-4 border-green-600'>
                <span className='text-gray-800 font-medium'>Port: </span>
                <span className='ml-2 text-green-900 font-bold'>{port}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {error && (
        <div className='error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6'>
          {error}
        </div>
      )}
      {serverUrl ? (
        <>
          <SaveJsonComponent serverUrl={serverUrl} />
          <hr className='my-8 border-t border-gray-300' />
          <DisplayJsonComponent serverUrl={serverUrl} />
        </>
      ) : (
        <div className='text-gray-600 text-center text-lg'>
          Loading server configuration...
        </div>
      )}
    </div>
  );
}

export default App;
