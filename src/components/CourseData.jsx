/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../auth/firebase";
import Admin from "./Admin";
import ClipLoader from "react-spinners/ClipLoader";
import Sidebar from "./sidebar";

const ADMIN_EMAILS = ["imumairhamza@gmail.com", "emsohailaslam@gmail.com"];

function CourseData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openWeeks, setOpenWeeks] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [itemsPerPage] = useState(1);
  const [loading, setLoading] = useState(false);
const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    // Simulate course loading
    const fetchData = async () => {
      setLoadingCourses(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      setLoadingCourses(false);
    };
    fetchData();
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
  };
  
  const toggleStatus = async (
    courseId,
    weekId,
    dayId,
    taskId,
    currentStatus
  ) => {
    if (!user) return;

    try {
      const taskDocRef = doc(
        db,
        `courses/${courseId}/weeks/${weekId}/days/${dayId}/tasks/${taskId}`
      );
      setLoadingTaskId(taskId); 

      // Fetch the task's current data
      const taskDoc = await getDoc(taskDocRef);
      const taskData = taskDoc.data();

      const updatedStatus = {
        ...taskData.statusByUser,
        [user.uid]: !currentStatus, 
      };
      await updateDoc(taskDocRef, {
        statusByUser: updatedStatus,
      });

      // Update local state
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course.id === courseId) {
            return {
              ...course,
              weeks: course.weeks.map((week) => {
                if (week.id === weekId) {
                  return {
                    ...week,
                    days: week.days.map((day) => {
                      if (day.id === dayId) {
                        return {
                          ...day,
                          tasks: day.tasks.map((task) => {
                            if (task.id === taskId) {
                              return {
                                ...task,
                                currentStatus: !currentStatus,
                              };
                            }
                            return task;
                          }),
                        };
                      }
                      return day;
                    }),
                  };
                }
                return week;
              }),
            };
          }
          return course;
        })
      );
    } catch (error) {
      console.error("Error toggling task status:", error);
      alert("Failed to toggle task status. Please try again.");
    } finally {
      setLoading(false);
      setLoadingTaskId(false);
    }
  };

  // Auth State
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(ADMIN_EMAILS.includes(user.email));
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  }, []);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);

        const coursesData = await Promise.all(
          coursesSnapshot.docs.map(async (courseDoc) => {
            const courseData = { id: courseDoc.id, ...courseDoc.data() };

            const weeksCollection = collection(
              db,
              `courses/${courseDoc.id}/weeks`
            );
            const weeksSnapshot = await getDocs(weeksCollection);

            courseData.weeks = await Promise.all(
              weeksSnapshot.docs.map(async (weekDoc) => {
                const weekData = { id: weekDoc.id, ...weekDoc.data() };

                const daysCollection = collection(
                  db,
                  `courses/${courseDoc.id}/weeks/${weekDoc.id}/days`
                );
                const daysSnapshot = await getDocs(daysCollection);

                weekData.days = await Promise.all(
                  daysSnapshot.docs.map(async (dayDoc) => {
                    const dayData = { id: dayDoc.id, ...dayDoc.data() };

                    const tasksCollection = collection(
                      db,
                      `courses/${courseDoc.id}/weeks/${weekDoc.id}/days/${dayDoc.id}/tasks`
                    );
                    const tasksSnapshot = await getDocs(tasksCollection);

                    dayData.tasks = tasksSnapshot.docs.map((taskDoc) => {
                      const taskData = taskDoc.data();
                      const userStatus =
                        taskData.statusByUser?.[user?.uid] || false;
                      return {
                        id: taskDoc.id,
                        ...taskData,
                        currentStatus: userStatus,
                      };
                    });

                    return dayData;
                  })
                );

                return weekData;
              })
            );

            return courseData;
          })
        );

        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses data: ", error);
      } finally {
        setLoading(false); // Set loading to false after process is complete
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = courses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Toggle week view
  const toggleWeek = (weekId) => {
    setOpenWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }));
  };

  return (
    <div className="week-container">
      {/* {isAdmin && <Admin />} */}
      {loadingCourses ? (
        <div className="loading-container">
          <ClipLoader size={50} color="#6f695c" loading={true} />
          <p>Loading courses...</p>
        </div>
      ) : (
        paginatedData.map((course) => (
          <div key={course.id}>
            <h2>{course.name}</h2>
            {course.weeks.map((week) => (
              <div className="week" key={week.id}>
                <div className="week-header">
                  <p>
                  {week.id.replace("week-", "Week")}
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

                {openWeeks[week.id] && (
                  <div className="days-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Activity</th>
                          <th>Type</th>
                          <th>Collaboration</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {week.days.map((day) => (
                          <React.Fragment key={day.id}>
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  textAlign: "center",
                                  fontSize: "1.2rem",
                                  fontWeight: "bold",
                                  backgroundColor: "#f0f0f0",
                                  padding: "10px",
                                }}
                              >
                                {day.id.replace("day-", "Day ")}
                              </td>
                            </tr>

                            {day.tasks.map((task) => (
                              <tr key={task.id}>
                                <td className="activity">
                                  <a
                                    href={task.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {task.activity}
                                  </a>
                                </td>
                                <td className="exercise">{task.type}</td>
                                <td className="collaboration">
                                  {task.collaboration}
                                </td>
                                <td className="time">{task.time}</td>
                                <td className="status">
                                  <div
                                    className={`status-toggle ${
                                      task.currentStatus
                                        ? "completed"
                                        : "uncompleted"
                                    }`}
                                  >
                                    {loadingTaskId === task.id ? (
                                      <ClipLoader
                                        color="white"
                                        loading={true}
                                        cssOverride={override}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                      />
                                    ) : task.currentStatus ? (
                                      "Completed"
                                    ) : (
                                      "Uncompleted"
                                    )}
                                  </div>
                                </td>

                                <td className="action">
                                  <button
                                    type="function"
                                    onClick={() =>
                                      toggleStatus(
                                        course.id,
                                        week.id,
                                        day.id,
                                        task.id,
                                        task.currentStatus
                                      )
                                    }
                                  >
                                    Mark as Done/UnDone
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            type="change"
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={index + 1 === currentPage ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CourseData;
