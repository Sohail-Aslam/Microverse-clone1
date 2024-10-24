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
import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (name === "") {
      alert("Please enter a username.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendVerificationEmail(user);
      await updateProfile(user, { displayName: name });
      await handleSaveUsername(user);

      alert("Signup successful! A verification email has been sent.");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      alert(err);
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent.");
    } catch (error) {
      alert("Error sending verification email:", error.message);
    }
  };

  const handleSaveUsername = async (user) => {
    try {
      const studentsCollection = collection(db, "students");
      await addDoc(studentsCollection, {
        username: name,
        timestamp: new Date(),
        userUid: user.uid,
      });
      alert("Username saved successfully!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="signup-container">
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
              placeholder="Full Name..."
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
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
