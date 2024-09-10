import React, { useState } from "react";
import axios from "axios";

interface DisplayJsonComponentProps {
  serverBaseUrl: string;
}

const DisplayJsonComponent: React.FC<DisplayJsonComponentProps> = ({
  serverBaseUrl,
}) => {
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const response = await axios.get(`${serverBaseUrl}/api/fetch`, {
        params: { directory, fileName },
      });
      setJsonData(response.data);
    } catch (error) {
      alert("Error fetching data");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Fetch JSON from File</h2>
      <div>
        <label>Directory: </label>
        <input
          type='text'
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
        />
      </div>
      <div>
        <label>File Name: </label>
        <input
          type='text'
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <button onClick={handleFetch}>Fetch JSON</button>
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
