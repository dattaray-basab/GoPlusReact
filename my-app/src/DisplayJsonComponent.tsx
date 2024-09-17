import React, { useState } from "react";
import axios from "axios";

interface DisplayJsonComponentProps {
  serverUrl: string;
}

const DisplayJsonComponent: React.FC<DisplayJsonComponentProps> = ({
  serverUrl,
}) => {
  const [directory, setDirectory] = useState("_Data");
  const [fileName, setFileName] = useState("x1.json");
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directory || !fileName) {
      setError("Please fill in both directory and file name.");
      return;
    }
    setError(null);
    setJsonData(null);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${serverUrl}/api/fetch?directory=${encodeURIComponent(
          directory
        )}&fileName=${encodeURIComponent(fileName)}`
      );
      setJsonData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Error fetching data: ${error.response.data.error || error.message}`
        );
      } else {
        setError("Error fetching data");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
        Display JSON from File
      </h2>
      {error && (
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded'>
          {error}
        </div>
      )}
      <form onSubmit={handleFetch} className='space-y-6 mb-6'>
        <div>
          <label
            htmlFor='directory'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Directory:
          </label>
          <input
            id='directory'
            type='text'
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </div>
        <div>
          <label
            htmlFor='fileName'
            className='block text-sm font-medium text-gray-700 mb-1'>
            File Name:
          </label>
          <input
            id='fileName'
            type='text'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {isLoading ? "Fetching..." : "Fetch"}
        </button>
      </form>
      {jsonData && (
        <div className='mt-8'>
          <h3 className='text-xl font-semibold mb-3 text-gray-700'>
            Fetched JSON Data:
          </h3>
          <pre className='bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm'>
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DisplayJsonComponent;
