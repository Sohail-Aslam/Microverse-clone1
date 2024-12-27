/* eslint-disable */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AdminProvider, CoursesProvider, UserProvider,  } from "./context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <CoursesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </CoursesProvider>
    </AdminProvider>
  </StrictMode>
);
