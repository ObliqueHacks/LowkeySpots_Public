import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { MapProvider } from "./context/MapProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MapProvider>
        <BrowserRouter>
          <SkeletonTheme baseColor="rgb(18, 18, 18)" highlightColor="#525252">
            <App />
          </SkeletonTheme>
        </BrowserRouter>
      </MapProvider>
    </AuthProvider>
  </React.StrictMode>
);
