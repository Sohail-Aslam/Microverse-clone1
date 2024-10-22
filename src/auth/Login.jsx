import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

function Login() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

   const handleLogin = async (e) => {
     e.preventDefault();
     try {
       // Sign in the user
       const userCredential = await signInWithEmailAndPassword(
         auth,
         email,
         password
       );
       const user = userCredential.user;

       // Check if the email is verified
       if (user.emailVerified) {
         // Email is verified, proceed with login
         console.log("Login successful!");
         navigate('/')
         // Redirect user to the dashboard or a protected page
         // For example: navigate("/dashboard");
       } else {
         // Email not verified, block login
         alert("Please verify your email before logging in.");
         // Optionally, send verification email again
         await user.sendEmailVerification();
         console.log("Verification email sent again.");

         // Sign the user out since email is not verified
         await auth.signOut(); // This ensures the user is logged out
       }
     } catch (error) {
       console.log("Login failed: " + error.message);
     }
   };


    const handlePasswordReset = () => {
        navigate('/forgotPassword')      
    };
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="src/img/logo.png" height='40px' alt="logo" className="login-logo" />
          <h3>Microverse Dashboard</h3>
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
        <div
          style={{
            background: "#58285a",
            display: "flex",
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <button type="submit" className="login-button" onClick={handleLogin}>
            Log In
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
