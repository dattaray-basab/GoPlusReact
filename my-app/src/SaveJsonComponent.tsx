// SaveJsonComponent.tsx

import React, { useState } from "react";
import axios from "axios";

interface SaveJsonComponentProps {
  serverBaseUrl: string;
}

const SaveJsonComponent: React.FC<SaveJsonComponentProps> = ({
  serverBaseUrl,
}) => {
  const [jsonData, setJsonData] = useState("");
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverBaseUrl}/api/save`, {
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
        <button type='submit'>Save</button>
      </form>
    </div>
  );
};

export default SaveJsonComponent;