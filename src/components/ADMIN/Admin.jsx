/* eslint-disable */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import { db } from "../../auth/firebase";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [newCourse, setNewCourse] = useState({ id: "", name: "" });
  const [task, setTask] = useState({
    courseId: "",
    week: "",
    day: "",
    activity: "",
    url: "",
    type: "Lesson",
    collaboration: "Solo",
    time: "0.25",
    status: false,
  });
  const [students, setStudents] = useState([]);

  const override = {
    display: "block",
    margin: "0 auto",
  };

  const fetchCourses = async () => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      value: doc.id,
      label: doc.data().name,
    }));
    setCourses(coursesList);
  };

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().username,
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students: ", error);
      alert("Failed to fetch students.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.id || !newCourse.name) {
      alert("Please fill all fields for the new course.");
      return;
    }

    try {
      const courseDocRef = doc(db, `courses/${newCourse.id}`);
      await setDoc(courseDocRef, { name: newCourse.name });

      alert("Course added successfully!");
      setNewCourse({ id: "", name: "" });
      fetchCourses();
    } catch (error) {
      console.error("Error adding course: ", error);
      alert("Failed to add course.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (selectedOption) => {
    setTask((prev) => ({ ...prev, courseId: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { courseId, week, day, activity, url, type, collaboration, time } =
      task;

    if (!courseId || !week || !day || !activity || !url) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const weekDocRef = doc(db, `courses/${courseId}/weeks/${week}`);
      await setDoc(weekDocRef, { status: "in-progress" }, { merge: true });
      setLoadingTask(true);

      const dayDocRef = doc(
        db,
        `courses/${courseId}/weeks/${week}/days/${day}`
      );
      await setDoc(dayDocRef, { tasksCount: 0 }, { merge: true });

      const taskDocRef = doc(
        collection(db, `courses/${courseId}/weeks/${week}/days/${day}/tasks`)
      );

      await setDoc(taskDocRef, {
        activity,
        url,
        type,
        collaboration,
        time,
      });

      // Reset only task-specific fields, keep dropdown selections
      setTask((prev) => ({
        ...prev,
        activity: "",
        url: "",
       
      }));
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task.");
    } finally {
      setLoadingTask(false);
    }
  };


  const generateWeeks = (numWeeks) =>
    [...Array(numWeeks)].map((_, index) => `Week ${index + 1}`);
  const generateDays = (numDays) =>
    [...Array(numDays)].map((_, index) => `Day ${index + 1}`);

  return (
    <div style={{ width: "100%" }}>
      <h2>Admin Panel</h2>

      <div
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {/* Add New Course Form */}

        <div>
          <h3>Add New Course</h3>
          <form onSubmit={handleAddCourse}>
            <label>
              Course ID:
              <input
                type="text"
                name="id"
                value={newCourse.id}
                onChange={handleNewCourseChange}
                required
              />
            </label>
            <br />
            <label>
              Course Name:
              <input
                type="text"
                name="name"
                value={newCourse.name}
                onChange={handleNewCourseChange}
                required
              />
            </label>
            <br />
            <button className="add-task" type="submit">
              {loading ? (
                <ClipLoader
                  color="white"
                  loading={loading}
                  css={override}
                  size={20}
                />
              ) : (
                "Add Course"
              )}
            </button>
          </form>
        </div>
      </div>

      <hr />

      {/* Add Task Form */}
      <div
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <h3>Add Task</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Select Course:
            <Select
              options={courses}
              onChange={handleCourseChange}
              placeholder="Select Course"
              isSearchable
              value={courses.find((course) => course.value === task.courseId)}
              required
            />
          </label>
          <br />
          <div style={{ display: "flex", gap: "8%" }}>
            <label style={{ width: "46%" }}>
              Select Week:
              <select
                name="week"
                value={task.week}
                onChange={handleChange}
                required
              >
                <option value="">Select Week</option>
                {generateWeeks(35).map((week, index) => (
                  <option key={index} value={week}>
                    {week}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ width: "46%" }}>
              Select Day:
              <select
                name="day"
                value={task.day}
                onChange={handleChange}
                required
              >
                <option value="">Select Day</option>
                {generateDays(5).map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <br />
          <label>
            Activity:
            <input
              type="text"
              name="activity"
              value={task.activity}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            URL:
            <input
              type="url"
              name="url"
              value={task.url}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <div style={{ display: "flex", gap: "7%", alignItems: "center" }}>
            <label style={{ width: "31%" }}>
              Type:
              <select
                name="type"
                value={task.type}
                onChange={handleChange}
                required
              >
                <option value="Lesson">Lesson</option>
                <option value="Feedback">Feedback</option>
                <option value="Exercise">Exercise</option>
                <option value="Scrum habits">Scrum habits</option>
                <option value="Quiz">Quiz</option>
              </select>
            </label>
            <label style={{ width: "31%" }}>
              Collaboration:
              <select
                name="collaboration"
                value={task.collaboration}
                onChange={handleChange}
                required
              >
                <option value="Solo">Solo</option>
                <option value="2-3 Group">2-3 Group</option>
              </select>
            </label>
            <label style={{ width: "31%" }}>
              Time:
              <select
                name="time"
                value={task.time}
                onChange={handleChange}
                required
              >
                <option value="0.25">0.25</option>
                <option value="0.5">0.5</option>
                <option value="0.75">0.75</option>
                <option value="1">1</option>
                <option value="1.25">1.25</option>
                <option value="1.5">1.5</option>
                <option value="1.75">1.75</option>
                <option value="2">2</option>
                <option value="2.25">2.25</option>
                <option value="2.5">2.5</option>
                <option value="2.75">2.75</option>
                <option value="3">3</option>
                <option value="3.25">3.25</option>
                <option value="3.5">3.5</option>
                <option value="3.75">3.75</option>
                <option value="4">4</option>
                <option value="4.25">4.25</option>
                <option value="4.5">4.5</option>
                <option value="4.75">4.75</option>
                <option value="5">5</option>
              </select>
            </label>
          </div>

          <br />
          <button className="add-task" type="submit" disabled={loadingTask}>
            {loadingTask ? (
              <ClipLoader
                color="white"
                loading={loadingTask}
                css={override}
                size={20}
              />
            ) : (
              "Add Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
