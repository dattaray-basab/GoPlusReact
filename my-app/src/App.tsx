import React, { useEffect, useState } from "react";
import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";

const IS_EXPRESS_SERVER = false; // Set this to true if using Express

function App() {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [port, setPort] = useState<string | null>(null);


  useEffect(() => {
    let hostValue = process.env.REACT_APP_cks_EXPRESS_HOST;
    let portValue = process.env.REACT_APP_cks_EXPRESS_PORT;
    if (!IS_EXPRESS_SERVER) {
      hostValue = process.env.REACT_APP_cks_GIN_HOST;
      portValue = process.env.REACT_APP_cks_GIN_PORT;
    }

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
        <div className='container mx-auto px-4'>
          <div className='flex flex-col lg:flex-row lg:space-x-8'>
            <div className='w-full lg:w-1/2 mb-8 lg:mb-0'>
              <SaveJsonComponent serverUrl={serverUrl} />
            </div>
            <div className='w-full lg:w-1/2'>
              <DisplayJsonComponent serverUrl={serverUrl} />
            </div>
          </div>
        </div>
      ) : (
        <div className='text-gray-600 text-center text-lg'>
          Loading server configuration...
        </div>
      )}
    </div>
  );
}

export default App;
