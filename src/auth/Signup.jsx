import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      await sendVerificationEmail(user);
      alert("Signup successful! A verification email has been sent.");

      // Clear form after signup
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.message); // Display error message
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      // Send verification email to the signed-up user
      await sendEmailVerification(user);
      console.log("Verification email sent.");
    } catch (error) {
      alert("Error sending verification email:", error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <img src="src/img/logo.png" alt="logo" className="signup-logo" />
          <h3>Sign Up</h3>
        </div>
        <div className="signup-inputs">
          <div className="input-wrapper">
            <i className="icon-email">
              <MdEmail />
            </i>
            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)} // Update email state
              value={email} // Bind input value to email state
            />
          </div>
          <div className="input-wrapper">
            <i className="icon-password">
              <RiLockPasswordFill />
            </i>
            <input
              type="password"
              placeholder="Password..."
              onChange={(e) => setPassword(e.target.value)} // Update password state
              value={password} // Bind input value to password state
            />
          </div>
        </div>
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
            className="signup-button"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
      <p className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
