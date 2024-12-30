/* eslint-disable */
import React, { useContext, useState, useEffect } from "react";
import { useUsers } from "../context";
import { CoursesContext } from "../context";
import { FaChevronDown } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const UsersList = () => {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    courses: contextCourses,
    user: currentUser,
    loading: coursesLoading,
    error: coursesError,
  } = useContext(CoursesContext);

  const override = {
    display: "block",
    margin: "0 auto",
  };

  const [openWeeks, setOpenWeeks] = useState({});
  const [loadingTasks, setLoadingTasks] = useState({});
  const [preparedCourses, setPreparedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const weeksPerPage = 5; // Number of weeks per page

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!user?.uid || !users || !contextCourses) {
      setPreparedCourses([]);
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const studentsCollection = collection(db, "students");
        const userQuery = query(
          studentsCollection,
          where("userUid", "==", user.uid)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          console.warn("User not found in students collection.");
          setPreparedCourses([]);
          return;
        }

        const userData = userSnapshot.docs[0].data();
        const { assignedCourses } = userData;

        if (!assignedCourses || assignedCourses.length === 0) {
          console.warn("No assigned courses for this user.");
          setPreparedCourses([]);
          return;
        }

        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);

        const coursesData = await Promise.all(
          coursesSnapshot.docs
            .filter((courseDoc) => assignedCourses.includes(courseDoc.id))
            .map(async (courseDoc) => {
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

        setPreparedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, users, contextCourses]);

  const toggleWeek = (weekId) => {
    setOpenWeeks((prev) => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  if (usersLoading || coursesLoading || loading) return <p>Loading...</p>;
  if (usersError) return <p>Error fetching users: {usersError}</p>;
  if (coursesError) return <p>Error fetching courses: {coursesError}</p>;

  const toggleTaskStatus = async (
    courseId,
    weekId,
    dayId,
    taskId,
    currentStatus
  ) => {
    setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));

    try {
      const taskDocRef = doc(
        db,
        `courses/${courseId}/weeks/${weekId}/days/${dayId}/tasks/${taskId}`
      );

      const updatedStatus = !currentStatus;

      await updateDoc(taskDocRef, {
        [`statusByUser.${user.uid}`]: updatedStatus,
      });

      setPreparedCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                weeks: course.weeks.map((week) =>
                  week.id === weekId
                    ? {
                        ...week,
                        days: week.days.map((day) =>
                          day.id === dayId
                            ? {
                                ...day,
                                tasks: day.tasks.map((task) =>
                                  task.id === taskId
                                    ? { ...task, currentStatus: updatedStatus }
                                    : task
                                ),
                              }
                            : day
                        ),
                      }
                    : week
                ),
              }
            : course
        )
      );
    } catch (error) {
      console.error("Error toggling task status:", error);
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  return (
    <div>
      {preparedCourses.length === 0 ? (
        <div>
          <p>No courses available.</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src="src/img/nodata.jpg" alt="" height="60%" width="60%" />
          </div>
        </div>
      ) : (
        preparedCourses.map((course) => (
          <div key={course.id}>
            <h2>{course.name}</h2>
            {course.weeks
              .slice(
                (currentPage - 1) * weeksPerPage,
                currentPage * weeksPerPage
              )
              .map((week) => (
                <div className="week" key={week.id}>
                  <div className="week-header">
                    <p>{week.id.replace("week-", "Week")}</p>
                    <FaChevronDown
                      className="week-dropdown"
                      onClick={() => toggleWeek(week.id)}
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
                                  <td className="exercise">
                                    {task.type || "N/A"}
                                  </td>
                                  <td className="collaboration">
                                    {task.collaboration || "N/A"}
                                  </td>
                                  <td className="time">{task.time || "N/A"}</td>
                                  <td className="status">
                                    <div
                                      className={`status-toggle ${
                                        task.currentStatus
                                          ? "completed"
                                          : "uncompleted"
                                      }`}
                                    >
                                      {loadingTasks[task.id] ? (
                                        <ClipLoader
                                          cssOverride={override}
                                          size={20}
                                          color="#fff"
                                        />
                                      ) : task.currentStatus ? (
                                        "Completed"
                                      ) : (
                                        "Uncompleted"
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        toggleTaskStatus(
                                          course.id,
                                          week.id,
                                          day.id,
                                          task.id,
                                          task.currentStatus
                                        )
                                      }
                                    >
                                      {task.currentStatus
                                        ? "Set to Undone"
                                        : "Set to Done"}
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
            {/* Pagination controls */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
              >
                Prev.
              </button>
              <span
                style={{
                  color: "white",
                  background: "#3f6ad9",
                  padding: "10px",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                }}
              >
                {" "}
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage * weeksPerPage >= course.weeks.length}
              >
                Next
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UsersList;
