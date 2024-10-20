/* eslint-disable */
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openWeeks, setOpenWeeks] = useState({}); // Track open state for each week

  const toggleWeek = (id) => {
    setOpenWeeks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const itemsPerPage = 5;

  const weekData = [
    { id: 1, text: "Week 1 - Intro and Collaboration", status: "COMPLETED" },
    {
      id: 2,
      text: "Week 2 - HTML Forms and Responsiveness",
      status: "COMPLETED",
    },
    {
      id: 3,
      text: "Week 3 - Accessibility and CSS Frameworks",
      status: "COMPLETED",
    },
    {
      id: 4,
      text: "Week 4 - JavaScript and DOM Manipulation",
      status: "COMPLETED",
    },
    { id: 5, text: "Week 5 - First Capstone Project", status: "COMPLETED" },
    { id: 6, text: "Week 6 - Advanced JavaScript", status: "IN PROGRESS" },
    { id: 7, text: "Week 7 - React Basics", status: "NOT STARTED" },
    { id: 8, text: "Week 8 - React Advanced", status: "NOT STARTED" },
    {
      id: 9,
      text: "Week 9 - State Management with Redux",
      status: "NOT STARTED",
    },
    {
      id: 10,
      text: "Week 10 - React Hooks and Context API",
      status: "NOT STARTED",
    },
    { id: 11, text: "Week 11 - Testing in React", status: "NOT STARTED" },
    {
      id: 12,
      text: "Week 12 - Introduction to TypeScript",
      status: "NOT STARTED",
    },
    { id: 13, text: "Week 13 - Working with APIs", status: "NOT STARTED" },
    {
      id: 14,
      text: "Week 14 - State Management with Context API",
      status: "NOT STARTED",
    },
    {
      id: 15,
      text: "Week 15 - Building a Full-Stack Application",
      status: "NOT STARTED",
    },
    {
      id: 16,
      text: "Week 16 - Performance Optimization",
      status: "NOT STARTED",
    },
    { id: 17, text: "Week 17 - Deployment and Hosting", status: "NOT STARTED" },
    {
      id: 18,
      text: "Week 18 - Introduction to GraphQL",
      status: "NOT STARTED",
    },
    {
      id: 19,
      text: "Week 19 - Building Progressive Web Apps",
      status: "NOT STARTED",
    },
    {
      id: 20,
      text: "Week 20 - Final Project and Review",
      status: "NOT STARTED",
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = weekData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(weekData.length / itemsPerPage);

  return (
    <div className="week-container">
      {/* Displaying paginated data */}
      {paginatedData.map((week) => (
        <div className="week" key={week.id}>
          <div className="week-header">
            <p className="text">
              {week.text} <br />
              STATUS: {week.status}
            </p>
            <FaChevronDown
              className="week-dropdown"
              onClick={() => toggleWeek(week.id)}
              style={{
                color: "#6f695c",
                width: "18px",
                height: "29px",
                cursor: "pointer",
              }}
            />
          </div>

          {/* Expand days for each week */}
          {openWeeks[week.id] && (
            <div className="days-container">
              {/* Day 1 */}
              <div className="days">
                <table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Type</th>
                      <th>Collaboration</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <h4 className="day">DAY 1 </h4>
                  <tbody>
                    <tr>
                      <td>Morning session: Diversity and Global Citizenship</td>
                      <td>Exercise</td>
                      <td>Morning session team</td>
                      <td>0.5</td>
                      <td>
                        <span className="status-completed">COMPLETED</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Morning session: Diversity and Global Citizenship</td>
                      <td>Exercise</td>
                      <td>Morning session team</td>
                      <td>0.5</td>
                      <td>
                        <span className="status-completed">COMPLETED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Type</th>
                      <th>Collaboration</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                    <h4 className="day">DAY 2</h4>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Morning session: Diversity and Global Citizenship</td>
                      <td>Exercise</td>
                      <td>Morning session team</td>
                      <td>0.5</td>
                      <td>
                        <span className="status-completed">COMPLETED</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Morning session: Diversity and Global Citizenship</td>
                      <td>Exercise</td>
                      <td>Morning session team</td>
                      <td>0.5</td>
                      <td>
                        <span className="status-completed">COMPLETED</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Morning session: Diversity and Global Citizenship</td>
                      <td>Exercise</td>
                      <td>Morning session team</td>
                      <td>0.5</td>
                      <td>
                        <span className="status-completed">COMPLETED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Add more days as needed */}
            </div>
          )}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;
