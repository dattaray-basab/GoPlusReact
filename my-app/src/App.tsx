import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";

function App() {
  const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const hostServerPort = process.env.REACT_APP_HOST_SERVER_PORT;

  if (!serverBaseUrl || !hostServerPort) {
    console.error(
      "Missing environment variables: REACT_APP_SERVER_BASE_URL or REACT_APP_HOST_SERVER_PORT"
    );
    return <div>Error: Missing configuration</div>;
  }

  const fullServerUrl = `${serverBaseUrl}:${hostServerPort}`;

  return (
    <div className='App'>
      <h1>JSON File Operations</h1>
      <SaveJsonComponent serverBaseUrl={fullServerUrl} />
      <hr />
      <DisplayJsonComponent serverBaseUrl={fullServerUrl} />
    </div>
  );
}

export default App;
