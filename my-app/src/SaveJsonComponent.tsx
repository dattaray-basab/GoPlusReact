// SaveJsonComponent.tsx

import React, { useState } from "react";

interface SaveJsonComponentProps {
  serverUrl: string;
}

const SaveJsonComponent: React.FC<SaveJsonComponentProps> = ({ serverUrl }) => {
  const [jsonData, setJsonData] = useState("");
  const [directory, setDirectory] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonData || !directory || !fileName) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      JSON.parse(jsonData); // Validate JSON
    } catch (e) {
      setError("Invalid JSON data.");
      return;
    }
    setError(null);
    setSuccessMessage(null);
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
      setSuccessMessage(data.message);
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error saving data: ${error.message}`);
      } else {
        setError("Error saving data");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Save JSON to File</h2>
      {error && <div className='error'>{error}</div>}
      {successMessage && <div className='success'>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>JSON Data:</label>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder='Enter valid JSON'
            required
          />
        </div>
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
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default SaveJsonComponent;


// import React, { useState } from "react";
// import axios from "axios";

// interface SaveJsonComponentProps {
//   serverUrl: string;
// }

// const SaveJsonComponent: React.FC<SaveJsonComponentProps> = ({ serverUrl }) => {
//   const [jsonData, setJsonData] = useState("");
//   const [directory, setDirectory] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!jsonData || !directory || !fileName) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     try {
//       JSON.parse(jsonData); // Validate JSON
//     } catch (e) {
//       setError("Invalid JSON data.");
//       return;
//     }
//     setError(null);
//     setSuccessMessage(null);
//     setIsLoading(true);
//     try {
//       const response = await axios.post(`${serverUrl}/api/save`, {
//         jsonData: JSON.parse(jsonData),
//         directory,
//         fileName,
//       });
//       setSuccessMessage(response.data.message);
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         setError(
//           `Error saving data: ${error.response.data.message || error.message}`
//         );
//       } else {
//         setError("Error saving data");
//       }
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Save JSON to File</h2>
//       {error && <div className='error'>{error}</div>}
//       {successMessage && <div className='success'>{successMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>JSON Data:</label>
//           <textarea
//             value={jsonData}
//             onChange={(e) => setJsonData(e.target.value)}
//             placeholder='Enter valid JSON'
//             required
//           />
//         </div>
//         <div>
//           <label>Directory:</label>
//           <input
//             type='text'
//             value={directory}
//             onChange={(e) => setDirectory(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>File Name:</label>
//           <input
//             type='text'
//             value={fileName}
//             onChange={(e) => setFileName(e.target.value)}
//             required
//           />
//         </div>
//         <button type='submit' disabled={isLoading}>
//           {isLoading ? "Saving..." : "Save"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SaveJsonComponent;
