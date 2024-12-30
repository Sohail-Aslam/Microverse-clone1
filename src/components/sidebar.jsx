/* eslint-disable */
import React, { useContext } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/300.css";
import { RiAdminFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context"; // Import the context

function sidebar() {
  const {isAdmin} = useContext(AdminContext)
  return (
    <div className="sidebar">
      <img
        style={{
          height: "7%",
          paddingLeft: "30%",
          paddingTop: "4%",
          paddingBottom: "9%",
        }}
        src="src/img/logo.png"
        alt=""
      />
      {!isAdmin && (
        <>
          <h4 className="heading">HOME</h4>
          <ul>
            <li className="pages">
              <NavLink to="/dashboard">
                <p className="tab-text">
                  <RiDashboardFill className="icons" />
                  Dashboard
                </p>
              </NavLink>
            </li>
          </ul>
        </>
      )}

      <h4 className="heading">LEARN</h4>
      <ul>
        {!isAdmin && (
          <li className="pages">
            <NavLink to="/">
              <p className="tab-text">
                <FaTasks className="icons" />
                View Progress
              </p>
            </NavLink>
          </li>
        )}

        <li className="pages">
          <MdFeedback className="icons" />
          Professional Skills Feedback
        </li>
        <li className="pages">
          <FaCalendarAlt className="icons" />
          Attendance & Engagement
        </li>
        <li className="pages">
          <FaBook className="icons" />
          Daily Rituals
        </li>
      </ul>
      {isAdmin && (
        <div>
          <h4 className="heading">ADMIN</h4>
          <ul>
            <li className="pages">
              <NavLink to="/admin">
                <p className="tab-text">
                  <RiAdminFill className="icons" />
                  Admin Panel
                </p>
              </NavLink>
            </li>
            <li className="pages">
              <NavLink to="/assign-courses">
                <p className="tab-text">
                  <RiAdminFill className="icons" />
                  Assign Courses
                </p>
              </NavLink>
            </li>
            <li className="pages">
              <NavLink to="/progresstable">
                <p className="tab-text">
                  <RiAdminFill className="icons" />
                  User Progress
                </p>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default sidebar;
