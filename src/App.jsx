/* eslint-disable */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Data from "./components/Data";
import Login from './auth/Login';
import Signup from './auth/Signup';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/firebase"; // Import your firebase configuration
import "./App.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/400.css";
import ForgotPassword from './auth/ForgotPassword'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      {" "}
      {/* Corrected BrowserRouter */}
      <div className="container">
        <Routes>
          <Route path="/forgotPassword" element={<ForgotPassword />} />{" "}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <Data />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
