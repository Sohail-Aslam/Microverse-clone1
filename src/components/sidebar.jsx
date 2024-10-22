/* eslint-disable */
import React from "react";
import { RiDashboardFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { ImLoop } from "react-icons/im";
import { FaQuestionCircle } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
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

function sidebar() {
  return (
    <div className="sidebar">

      <img style={{height:'7%', paddingLeft:'30%', paddingTop:'4%', paddingBottom:'9%'}} src="src/img/logo.png" alt="" />
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
          <FaTasks className="icons" />
          View Progress
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

      <h4 className="heading">REFER</h4>
      <ul>
        <li className="pages">
          <ImLoop className="icons" />
          Refer a Freind, Earn $150
        </li>
      </ul>

      <h4 className="heading">GET HELP</h4>
      <ul>
        <li className="pages">
          <FaQuestionCircle className="icons" />
          Technical Questions
        </li>
        <li className="pages">
          <FaRegQuestionCircle className="icons" />
          FAQs and Announcements
        </li>
        <li className="pages">
          <FaAngry className="icons" />
          Report Harassment
        </li>
        <li className="pages">
          <FaHandshake className="icons" />
          Partner Collaboration help
        </li>
        <li className="pages">
          <MdGroups className="icons" />
          Group Collaboration help
        </li>
      </ul>

      <h4 className="heading">USEFUL LINKS</h4>
      <ul>
        <li className="pages">
          <FaCalendarMinus className="icons" />
          Events
        </li>
        <li className="pages">
          <FaGithub className="icons" />
          GitHub Education
        </li>
        <li className="pages">
          <RiSuitcaseFill className="icons" />
          Part-Time Microverse
        </li>
        <li className="pages">
          <MdOutlineFeed className="icons" />
          Provide Feedback
        </li>
        <li className="pages">
          <FaSlack className="icons" />
          Slack
        </li>
      </ul>
    </div>
  );
}

export default sidebar;
