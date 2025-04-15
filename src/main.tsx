import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.scss";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default queryClient;

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
      </LocalizationProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
