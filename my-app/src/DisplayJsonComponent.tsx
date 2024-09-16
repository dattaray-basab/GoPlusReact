import React, { useState } from "react";
import axios from "axios";

interface DisplayJsonComponentProps {
  serverUrl: string;
}

const DisplayJsonComponent: React.FC<DisplayJsonComponentProps> = ({
  serverUrl,
}) => {
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
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
    <div>
      <h2>Display JSON from File</h2>
      {error && <div className='error'>{error}</div>}
      <form onSubmit={handleFetch}>
        <div>
          <label>Directory:</label>
          <input
            type='text'
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>File Name:</label>
          <input
            type='text'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? "Fetching..." : "Fetch"}
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
