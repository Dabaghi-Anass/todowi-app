import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./sass/index.scss";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
if (!navigator.onLine)
  document
    .getElementById("appIcon")
    ?.setAttribute("href", "/iconDisconnected.svg");
else {
  document.getElementById("appIcon")?.setAttribute("href", "/icon.svg");
}

const handleOnlineStatusChange = () => {
  if (navigator.onLine) {
    document.getElementById("appIcon")?.setAttribute("href", "/icon.svg");
    document.title = "TODOWI";
  } else {
    document.title = "😥 no internet connection";
    document
      .getElementById("appIcon")
      ?.setAttribute("href", "/iconDisconnected.svg");
  }
};
window.addEventListener("online", handleOnlineStatusChange);
window.addEventListener("offline", handleOnlineStatusChange);
