/* eslint-disable */
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

function ProgressTable() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUserUid, setSelectedUserUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        userUid: doc.data().userUid,
        username: doc.data().username,
      }));
      setStudents(studentsList);
      setLoading(false);
    } catch (error) {
      alert("Failed to fetch students.");
      setLoading(false);
    }
  };

  const fetchCourses = async (uid) => {
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
                    const userStatus = taskData.statusByUser?.[uid] || false;

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses data: ", error);
      alert("Failed to fetch courses.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserUid) {
      setLoading(true);
      fetchCourses(selectedUserUid);
    }
  }, [selectedUserUid]);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const handleUserSelect = (e) => {
    const selectedUid = e.target.value;
    console.log("Selected User UID:", selectedUid);
    setSelectedUserUid(selectedUid);
  };

  const handleWeekSelect = (weekId) => {
    setSelectedWeek((prevSelectedWeek) =>
      prevSelectedWeek === weekId ? null : weekId
    );
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <h3>User Performance</h3>
      <div>
        <label>Select User: </label>
        <select onChange={handleUserSelect} value={selectedUserUid}>
          <option value="">Select a user</option>
          {students.map((student) => (
            <option key={student.userUid} value={student.userUid}>
              {student.username}
            </option>
          ))}
        </select>
      </div>

      {/* Mapping through courses, weeks, days, and tasks */}
      {courses.map((course) => (
        <div className="course" key={course.id}>
          <h2>{course.name}</h2>

          {course.weeks.map((week) => (
            <div className="week" key={week.id}>
              <div className="week-header">
                {week.id.replace("week-", "Week")}
                <FaChevronDown
                  className="week-dropdown"
                  onClick={() => handleWeekSelect(week.id)}
                  style={{
                    color: "#6f695c",
                    width: "18px",
                    height: "29px",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Toggle days visibility based on selected week */}
              {selectedWeek === week.id && (
                <div className="days-container">
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
                    <tbody>
                      {week.days.map((day) => (
                        <React.Fragment key={day.id}>
                          <tr>
                            <td
                              colSpan="5"
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

                          {day.tasks.map((task) => {
                            const userStatus = task.currentStatus;

                            return (
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
                                      userStatus ? "completed" : "uncompleted"
                                    }`}
                                  >
                                    {loadingTaskId === task.id ? (
                                      <ClipLoader
                                        color="white"
                                        loading
                                        size={20}
                                        aria-label="Loading Spinner"
                                      />
                                    ) : userStatus ? (
                                      "Completed"
                                    ) : (
                                      "Uncompleted"
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProgressTable;
