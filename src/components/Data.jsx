/* eslint-disable */
import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

import CourseData from "./CourseData";

function Data() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDiv = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="data-container">
      <div className="title">
        {user ? (
          <div>
            <p>
              {user.displayName || user.username}
              's Progress
            </p>{" "}
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div>
          <img className="signout" src="src/img/signout.jpg" alt="" />
          <IoMdArrowDropdown
            onClick={toggleDiv}
            style={{ color: "#6284df", width: "32px", height: "32px" }}
          />
          {isOpen && (
            <div className="dropdown-menu" onClick={handleSignOut}>
              <p>Sign Out</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <CourseData />
        <div>
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
