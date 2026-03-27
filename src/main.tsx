import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { withMsalProvider } from "./msal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{withMsalProvider(<App />)}</React.StrictMode>,
);
