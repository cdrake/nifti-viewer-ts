import React from "react";
import ReactDOM from "react-dom/client";

// import { useState } from "react";
import App from "./App";

// const [counter, setCounter] = useState<number>(0);

// ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );

// const [counter, setCounter] = useState<number>(0);

// root.render(
//   <React.StrictMode>
//     Use this to run a local development environment of the library for testing
//   </React.StrictMode>
// );
