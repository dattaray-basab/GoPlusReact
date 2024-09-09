import DisplayJsonComponent from "./DisplayJsonComponent";
import SaveJsonComponent from "./SaveJsonComponent";


function App() {
  return (
    <div className='App'>
      <h1>JSON File Operations</h1>
      <SaveJsonComponent />
      <hr />
      <DisplayJsonComponent />
    </div>
  );
}

export default App;
