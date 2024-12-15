/* eslint-disable */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { FaRegQuestionCircle } from "react-icons/fa";
import Sidebar from "./components/sidebar";
import Data from "./components/Data";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { auth } from "./auth/firebase";
import "./App.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/400.css";
import ForgotPassword from "./auth/ForgotPassword";
import Admin from "./components/Admin";
import ProgressTable from "./components/ProgressTable";
import CourseData from "./components/CourseData";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          email: currentUser.email,
          uid: currentUser.uid,
          displayName: currentUser.displayName || "",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // Set the user state after checking auth
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) =>
    user ? children : <Navigate to="/login" />;

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
        {user && <Sidebar />}
        {user && <Data />}

        <div className="pages-container">
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progresstable"
              element={
                <ProtectedRoute>
                  <ProgressTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <CourseData />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <button className="support">
          <FaRegQuestionCircle />
          Support
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;
