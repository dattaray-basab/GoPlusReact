// import DisplayJsonComponent from "./DisplayJsonComponent";
// import SaveJsonComponent from "./SaveJsonComponent";


// function App() {
//   return (
//     <div className='App'>
//       <h1>JSON File Operations</h1>
//       <SaveJsonComponent />
//       <hr />
//       <DisplayJsonComponent />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";

interface Config {
  SERVER_BASE_URL: string;
  HOST_SERVER_PORT: number;
}

function App() {
  const [serverBaseUrl, setServerBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Read and parse the JSON file synchronously
      const configPath = path.join(process.cwd(), "siteConfig.json");
      const rawConfig = fs.readFileSync(configPath, "utf8");
      const config: Config = JSON.parse(rawConfig);

      const baseUrl = `${config.SERVER_BASE_URL}:${config.HOST_SERVER_PORT}`;
      setServerBaseUrl(baseUrl);
    } catch (error) {
      console.error("Error loading config:", error);
      // Handle error appropriately
    }
  }, []);

  if (!serverBaseUrl) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className='App'>
      <h1>JSON File Operations</h1>
      <SaveJsonComponent serverBaseUrl={serverBaseUrl} />
      <hr />
      <DisplayJsonComponent serverBaseUrl={serverBaseUrl} />
    </div>
  );
}

export default App;