import React, { useEffect, useState } from "react";
import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";

function App() {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = process.env.REACT_APP_cks_GIN_HOST;
    const port = process.env.REACT_APP_cks_GIN_PORT;

    if (!host || !port) {
      setError(
        "Server configuration is missing. Please check environment variables."
      );
    } else {
      setServerUrl(`http://${host}:${port}`);
    }
  }, []);

  return (
    <div className='App'>
      <h1>JSON File Operations</h1>
      {error && <div className='error'>{error}</div>}
      {serverUrl ? (
        <>
          <SaveJsonComponent serverUrl={serverUrl} />
          <hr />
          <DisplayJsonComponent serverUrl={serverUrl} />
        </>
      ) : (
        <div>Loading server configuration...</div>
      )}
    </div>
  );
}

export default App;
