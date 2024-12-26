/* eslint-disable */
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { collection, addDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import { auth, db } from "./firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
  };
  const handleSaveUsername = async (user) => {
    try {
      const studentsCollection = collection(db, "students");
      await addDoc(studentsCollection, {
        username: name,
        timestamp: new Date(),
        userUid: user.uid,
      });
      console.log("Username saved successfully!");
    } catch (error) {
      alert(error);
    }
  };
  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      
    } catch (error) {
      alert("Error sending verification email:", error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setShowPopup(false);

    if (name === "") {
      setError("Please Fill Form");
      setTimeout(() => {
        setShowPopup(false);
        setError(""); // Clear the popup message
      }, 6000);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      setLoading(true);

      await sendVerificationEmail(user);
      await updateProfile(user, { displayName: name });
      await handleSaveUsername(user);
      setShowPopup(true);
      setPopup("Signup successful! A verification email sent.");
      setTimeout(() => {
        setShowPopup(false);
        setError(""); // Clear the popup message
      }, 5000);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/network-request-failed":
          setError("Check Interenet connection");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/admin-restricted-operation":
          setError("This operation is restricted to administrators only.");
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false); // Set loading to false after process is complete
    }
  };

  return (
    <div className="signup-container">
      <div className="popup" style={{ display: showPopup ? "block" : "none" }}>
        {popup}
      </div>

      <form className="signup-box" onSubmit={handleSignup}>
        <div className="signup-header">
          <img src="src/img/logo.png" alt="logo" className="signup-logo" />
          <h3>Sign Up</h3>
        </div>
        <div className="signup-inputs">
          <div className="input-wrapper">
            <i className="icon-email">
              <CgProfile />
            </i>
            <input
              type="text"
              placeholder="Enter Username..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="input-wrapper">
            <i className="icon-email">
              <MdEmail />
            </i>
            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              value={password}
              required
            />
          </div>
        </div>
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
            onClick={handleSignup}
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
              "Sign Up"
            )}{" "}
          </button>
        </div>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
