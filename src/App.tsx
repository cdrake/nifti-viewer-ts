import logo from "./logo.svg";
import "./App.css";
import NiftiViewer from "./NiftiViewer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div id="viewer-host"></div>
      <NiftiViewer hostId="viewer-host" />
    </div>
  );
}

export default App;
