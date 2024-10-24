import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import ClipLoader from "react-spinners/ClipLoader";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowPopup(false); // Initially hide popup

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        setPopup("Login successful!");
        setShowPopup(true); // Show popup for successful login
        navigate("/");
      } else {
        setShowPopup(true); // Show popup if email not verified
        setPopup("Please verify your email before logging in.");

        await user.sendEmailVerification();

        setPopup("Verification email sent again.");
        setShowPopup(true); // Keep popup open after email verification
        await auth.signOut();
      }
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          setError("Email or Password Incorrect.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/network-request-failed":
          setError("Check Internet connection.");
          break;
        case "auth/admin-restricted-operation":
          setError("This operation is restricted to administrators only.");
          break;
        case "auth/missing-email":
          setError("Please enter Email & Password.");
          break;
        case "auth/too-many-requests":
          setError(
            "This account is suspended. For quick recovery, reset the password."
          );
          break;
        default:
          setError(err.message); // Default error message
      }

      console.log(err.message); // Log the error message directly
    } finally {
      setLoading(false); // Set loading to false after process is complete
    }
  };

  const handlePasswordReset = () => {
    navigate("/forgotPassword");
  };

  setTimeout(() => {
    setShowPopup(false);
    setError(""); // Clear the popup message
  }, 8000);
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
                size={20} // Set size of spinner
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
        Don't have an account? <Link to={"/signup"}>Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
