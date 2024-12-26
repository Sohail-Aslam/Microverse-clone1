/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../auth/firebase";

const AdminAssignCourse = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For searching users

  useEffect(() => {
    // Fetch all users and courses for the admin interface
    const fetchUsersAndCourses = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, "students"));
        setUsers(
          usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username, // Ensure "username" exists in Firestore
          }))
        );

        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        setCourses(
          coursesSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name, // Ensure "name" exists in Firestore
          }))
        );
      } catch (error) {
        alert(`Failed to fetch data: ${error.message}`);
      }
    };

    fetchUsersAndCourses();
  }, []);

  const handleAssignCourse = async () => {
    if (selectedUser && selectedCourse) {
      try {
        const userDoc = doc(db, "students", selectedUser);
        await updateDoc(userDoc, {
          assignedCourses: arrayUnion(selectedCourse),
        });
        alert("Course assigned successfully!");
      } catch (error) {
        alert(`Failed to assign course: ${error.message}`);
      }
    } else {
      alert("Please select a user and a course.");
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Admin - Assign Course</h3>

      {/* Search bar to filter users */}
      <input
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User selection dropdown */}
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        value={selectedUser}
      >
        <option value="">Select User</option>
        {filteredUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      {/* Course selection dropdown */}
      <select
        onChange={(e) => setSelectedCourse(e.target.value)}
        value={selectedCourse}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {/* Button to assign course */}
      <button onClick={handleAssignCourse}>Assign Course</button>
    </div>
  );
};

export default AdminAssignCourse;
