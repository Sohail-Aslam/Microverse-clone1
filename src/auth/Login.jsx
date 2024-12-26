/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import ClipLoader from "react-spinners/ClipLoader";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

 const override = {
   display: "block",
   margin: "0 auto",
 };

useEffect(() => {
  setLoading(true);
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      if (currentUser.emailVerified) {
        navigate("/");
      } else {
        setPopup("Please verify your email before accessing the dashboard.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 6000);
        auth.signOut();
      }
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [navigate]);


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setShowPopup(false);

  try {
  
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

  
    if (user.emailVerified) {
      setPopup("Login successful!");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 6000);
      navigate("/");
    } else {
      setPopup(
        "Please verify your email before logging in. A verification email has been sent to your inbox."
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 6000);

      await sendEmailVerification(user);
      await auth.signOut();
    }
  } catch (err) {
    setError(getErrorMessage(err));
    setTimeout(() => {
      setError("");
    }, 6000);
  } finally {
    setLoading(false);
  }
};


  const getErrorMessage = (err) => {
    switch (err.code) {
      case "auth/user-not-found":
        return "User doesn't exist. Please sign up first.";
      case "auth/invalid-credential":
        return "User dosen't exsist.";
      case "auth/wrong-password":
        return "Email or Password Incorrect.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/network-request-failed":
        return "Check Internet connection.";
      case "auth/admin-restricted-operation":
        return "This operation is restricted to administrators only.";
      case "auth/missing-email":
        return "Please enter Email & Password.";
      case "auth/too-many-requests":
        return "This account is suspended. For quick recovery, reset the password.";
      default:
        return err.message;
    }
  };

  const handlePasswordReset = () => {
    navigate("/forgotPassword");
  };

  return (
    <div className="login-container">
      <div className="popup" style={{ display: showPopup ? "block" : "none" }}>
        {popup}
      </div>

      <div className="login-box">
        <div className="login-header">
          <img
            src="src/img/logo.png"
            height="40px"
            alt="logo"
            className="login-logo"
          />
          <h3>emHamza Dashboard</h3>
        </div>
        <div className="login-inputs">
          <div className="input-wrapper">
            <i className="icon-email">
              <MdEmail />
            </i>
            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <i className="icon-password">
              <RiLockPasswordFill />
            </i>
            <input
              type="password"
              placeholder="Password..."
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <p className="forgot">
          Don't remember your{" "}
          <p style={{ cursor: "pointer" }} onClick={handlePasswordReset}>
            Password
          </p>
        </p>
        {error && (
          <p
            style={{
              color: "red",
              border: "1px solid red",
              background: "#f5b8b8",
              borderRadius: "3px",
              margin: "0 1rem 1rem 1rem",
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            background: "#58285a",
            display: "flex",
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <button
            type="submit"
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
            style={{ background: loading ? "#6f695c" : "" }}
          >
            {loading ? (
              <ClipLoader
                color="white"
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Log In"
            )}{" "}
          </button>
        </div>
      </div>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
