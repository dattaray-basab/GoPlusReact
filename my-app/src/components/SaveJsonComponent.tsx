import React, { useState } from "react";

interface SaveJsonComponentProps {
  serverUrl: string;
}

interface Message {
  type: "error" | "success";
  content: string;
}

const SaveJsonComponent: React.FC<SaveJsonComponentProps> = ({ serverUrl }) => {
  const [jsonData, setJsonData] = useState("{}");
  const [directory, setDirectory] = useState("_Data");
  const [fileName, setFileName] = useState("x0.json");
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonData || !directory || !fileName) {
      setMessage({ type: "error", content: "Please fill in all fields." });
      return;
    }
    try {
      JSON.parse(jsonData); // Validate JSON
    } catch (e) {
      setMessage({ type: "error", content: "Invalid JSON data." });
      return;
    }
    setMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonData: JSON.parse(jsonData),
          directory,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ type: "success", content: data.message });
    } catch (error) {
      if (error instanceof Error) {
        setMessage({
          type: "error",
          content: `Error saving data: ${error.message}`,
        });
      } else {
        setMessage({ type: "error", content: "Error saving data" });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
        Save JSON to File
      </h2>
      {message && (
        <div
          className={`border-l-4 p-4 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
          }`}>
          <p className='whitespace-normal break-words'>{message.content}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='jsonData'
            className='block text-sm font-medium text-gray-700 mb-1'>
            JSON Data:
          </label>
          <textarea
            id='jsonData'
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            rows={6}
          />
        </div>
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
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default SaveJsonComponent;
