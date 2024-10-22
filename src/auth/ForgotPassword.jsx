import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePassword } from "react-icons/md";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      setEmail(""); // Clear the email field after successful reset
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-container">
        <MdOutlinePassword style={{ fontSize: "40px", color: "#58285a" , padding:'10px'}} />

        <h3>Reset Password</h3>
        <div style={{ padding: "10px", paddingTop: "20px" }}>
          <div className="input-wrapper">
            <input
              style={{ padding: "5px" }}
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>
        <p style={{ lineHeight: "15px", fontSize: ".8rem", padding: "5%" }}>
          Please enter your email address, and we will send you a link to reset
          your password.
        </p>
        <div
          style={{
            background: "#58285a",
            display: "flex",
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <button className="login-button" onClick={handlePasswordReset}>
            Get Email
          </button>
        </div>
      </div>
      <p style={{ color: "#fff" }}>
        Just{" "}
        <Link style={{ color: "#fff", fontWeight: "600" }} to={"/login"}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
