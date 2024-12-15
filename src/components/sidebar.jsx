/* eslint-disable */
import React, {useState, useEffect} from "react";
import { RiDashboardFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { ImLoop } from "react-icons/im";
import { FaQuestionCircle } from "react-icons/fa";
import { FaAngry } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaCalendarMinus } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { RiSuitcaseFill } from "react-icons/ri";
import { MdOutlineFeed } from "react-icons/md";
import { FaSlack } from "react-icons/fa";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/300.css";
import { RiAdminFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase";

const ADMIN_EMAILS = ["imumairhamza@gmail.com", "emsohailaslam@gmail.com"];

function sidebar() {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdmin(ADMIN_EMAILS.includes(user.email));
        } else {
          setIsAdmin(false);
        }
      });
    }, []);
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
      <h4 className="heading">HOME</h4>
      <ul>
        <li className="pages">
          <RiDashboardFill className="icons" />
          Dashboard
        </li>
      </ul>

      <h4 className="heading">LEARN</h4>
      <ul>
          <li className="pages">
        <NavLink to="/">
            <p className="tab-text">
            <FaTasks className="icons" />

            View Progress
            </p>
        </NavLink>
          </li>
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
