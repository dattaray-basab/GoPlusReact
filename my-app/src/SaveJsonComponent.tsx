// SaveJsonComponent.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const SaveJsonComponent: React.FC = () => {
  const [jsonData, setJsonData] = useState("");
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = process.env.REACT_APP_cks_SERVER1_HOST;
    const port = process.env.REACT_APP_cks_SERVER1_PORT;

    if (!host || !port) {
      setError(
        "SaveJsonComponent: Server configuration is missing. Please check environment variables."
      );
    } else {
      setServerUrl(`http://${host}:${port}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl) {
      setError("Server URL is not set. Cannot proceed with the request.");
      return;
    }
    try {
      const response = await axios.post(`${serverUrl}/api/save`, {
        jsonData: JSON.parse(jsonData),
        directory,
        fileName,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Error saving data");
      console.error(error);
    }
  };

  if (error) {
    return <div className='error'>{error}</div>;
  }

  return (
    <div>
      <h2>Save JSON to File</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>JSON Data:</label>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder='Enter valid JSON'
          />
        </div>
        <div>
          <label>Directory:</label>
          <input
            type='text'
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
          />
        </div>
        <div>
          <label>File Name:</label>
          <input
            type='text'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <button type='submit' disabled={!serverUrl}>
          Save
        </button>
      </form>
    </div>
  );
};

export default SaveJsonComponent;
