/* eslint-disable */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ id: "", courseName: "" });
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

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      value: doc.id,
      label: doc.data().name,
    }));
    setCourses(coursesList);
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle new course input changes
  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.id || !newCourse.courseName) {
      alert("Please fill all fields for the new course.");
      return;
    }

    try {
      const courseDocRef = doc(db, `courses/${newCourse.id}`);
      await setDoc(courseDocRef, { courseName: newCourse.courseName });

      alert("Course added successfully!");
      setNewCourse({ id: "", courseName: "" });
      fetchCourses();
    } catch (error) {
      console.error("Error adding course: ", error);
      alert("Failed to add course.");
    }
  };

  // Handle input changes for tasks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (selectedOption) => {
    setTask((prev) => ({ ...prev, courseId: selectedOption.value }));
  };

  // Add a task to the selected course
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

      const dayDocRef = doc(
        db,
        `courses/${courseId}/weeks/${week}/days/${day}`
      );
      await setDoc(dayDocRef, { tasksCount: 0 }, { merge: true });

      const taskDocRef = doc(
        collection(db, `courses/${courseId}/weeks/${week}/days/${day}/tasks`)
      );
      setTask({
        courseId: "",
        week: "",
        day: "",
        activity: "",
        url: "",
        type: "Lesson",
        collaboration: "Solo",
        time: "0.25",
      });
      await setDoc(taskDocRef, {
        activity,
        url,
        type,
        collaboration,
        time,
      });

      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Failed to add task.");
    }
  };

  // Generate options for weeks and days
  const generateWeeks = (numWeeks) =>
    [...Array(numWeeks)].map((_, index) => `Week ${index + 1}`);
  const generateDays = (numDays) =>
    [...Array(numDays)].map((_, index) => `Day ${index + 1}`);

  return (
    <div>
      <h2>Admin Panel</h2>

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
              value={newCourse.courseName}
              onChange={handleNewCourseChange}
              required
            />
          </label>
          <br />
          <button className="add-task" type="submit">
            Add Course
          </button>
        </form>
      </div>

      <hr />

      {/* Add Task Form */}
      <div>
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
          <label>
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
          <br />
          <label>
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
          <label>
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
          <br />
          <label>
            Collaboration:
            <select
              name="collaboration"
              value={task.collaboration}
              onChange={handleChange}
              required
            >
              <option value="Solo">Solo</option>
              <option value="2-3 person group">2-3 person group</option>
            </select>
          </label>
          <br />
          <label>
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
            </select>
          </label>
          <br />
          <button className="add-task" type="submit">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
