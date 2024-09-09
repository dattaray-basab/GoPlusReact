import React, { useState } from "react";
import axios from "axios";

const DisplayJsonComponent: React.FC = () => {
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8080/api/fetch?directory=${directory}&fileName=${fileName}`
      );
      setJsonData(response.data);
    } catch (error) {
      alert("Error fetching data");
      console.error(error);
      setJsonData(null);
    }
  };

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
        <button type='submit'>Fetch</button>
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
