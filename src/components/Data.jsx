/* eslint-disable */
import React from "react";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import Pagination from "./Pagination";
import { auth } from "../auth/firebase";

function Data() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDiv = () => {
    setIsOpen((prev) => !prev); // Toggle the open state
  };
 const handleSignOut = async () => {
   try {
     await auth.signOut();
     console.log("User signed out successfully");
   } catch (error) {
     console.error("Error signing out:", error);
   }
 };


  return (
    <div className="data-container">
      <div className="title">
        <p>Hamaza's Progress</p>
        <div>
          <img className="signout" src="src/img/signout.jpg" alt="" />
          <IoMdArrowDropdown
            onClick={toggleDiv}
            style={{ color: "#6284df", width: "32px", height: "32px" }}
          />
          {isOpen && (
            <div
              style={{
                position: "absolute",
                background: "white",
                right: "5%",
                cursor: "pointer",
                willChange: "transform",
                top: "0px",
                left: "0px",
                transform: "translate3d(700px, 60px, 0px)",
                width: "15rem",
              }}
              onClick={handleSignOut}
            >
              <p>SignOut</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <Pagination />
        <div style={{position:'relative', height:'20%', width:'auto', bottom:'0', right:'0'}}>
          <button className="support">
            <FaRegQuestionCircle />
            Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default Data;
