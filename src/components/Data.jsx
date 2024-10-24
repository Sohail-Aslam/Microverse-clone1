import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import Pagination from "./pagination";
import { auth, db } from "../auth/firebase";
import { doc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Data() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const usersDb = collection(db, "students");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
            <p>{user.displayName || user.username}'s Progress</p>{" "}
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
        <Pagination />
        <div
          style={{
            position: "relative",
            height: "20%",
            width: "auto",
            bottom: "0",
            right: "0",
          }}
        >
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
