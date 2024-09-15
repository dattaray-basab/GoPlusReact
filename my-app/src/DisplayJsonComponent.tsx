// DisplayJsonComponent.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const DisplayJsonComponent: React.FC = () => {
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = process.env.REACT_APP_cks_SERVER1_HOST;
    const port = process.env.REACT_APP_cks_SERVER1_PORT;

    if (!host || !port) {
      setError(
        "DisplayJsonComponent: Server configuration is missing. Please check environment variables."
      );
    } else {
      setServerUrl(`http://${host}:${port}`);
    }
  }, []);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl) {
      setError("Server URL is not set. Cannot proceed with the request.");
      return;
    }
    try {
      const response = await axios.get(
        `${serverUrl}/api/fetch?directory=${directory}&fileName=${fileName}`
      );
      setJsonData(response.data);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
      console.error(error);
      setJsonData(null);
    }
  };

  if (error) {
    return <div className='error'>{error}</div>;
  }

  return (
    <div>
      <h2>Display JSON from File</h2>
      <form onSubmit={handleFetch}>
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
          Fetch
        </button>
      </form>
      {jsonData && (
        <div>
          <h3>Fetched JSON Data:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DisplayJsonComponent;
