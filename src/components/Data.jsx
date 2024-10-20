/* eslint-disable */
import React from "react";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import Pagination from "./Pagination";

function Data() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDiv = () => {
    setIsOpen((prev) => !prev); // Toggle the open state
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
            >
              <p>SignOut</p>
            </div>
          )}
        </div>
      </div>
      <Pagination />
      <button className="support">
        <FaRegQuestionCircle />
        Support
      </button>
    </div>
  );
}

export default Data;
