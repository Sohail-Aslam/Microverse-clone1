/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
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
  const [showDropdown, setShowDropdown] = useState(false);

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

  // const handleAssignCourse = async () => {
  //   if (selectedUser && selectedCourse) {
  //     try {
  //       const userDoc = doc(db, "students", selectedUser);
  //       const userSnapshot = await getDoc(userDoc); // Fetch user data

  //       if (userSnapshot.exists()) {
  //         const userData = userSnapshot.data();
  //         const assignedCourses = userData.assignedCourses || [];

  //         // Check if the course is already assigned
  //         if (assignedCourses.includes(selectedCourse)) {
  //           alert("This course is already assigned to the user.");
  //         } else {
  //           // Assign course if not already assigned
  //           await updateDoc(userDoc, {
  //             assignedCourses: arrayUnion(selectedCourse),
  //           });
  //           alert("Course assigned successfully!");
  //         }
  //       }
  //     } catch (error) {
  //       alert(`Failed to assign course: ${error.message}`);
  //     }
  //   } else {
  //     alert("Please select a user and a course.");
  //   }
  // };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleUserSelect = (user) => {
  setSelectedUser(user.id);
  setSearchTerm(user.username); // Set input to selected username
  setShowDropdown(false); // Hide dropdown
};

const handleAssignCourse = async () => {
  if (selectedUser && selectedCourse) {
    try {
      const userDoc = doc(db, "students", selectedUser);
      const userSnapshot = await getDoc(userDoc); // Fetch user data

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const assignedCourses = userData.assignedCourses || [];

        // Check if the course is already assigned
        if (assignedCourses.includes(selectedCourse)) {
          alert("This course is already assigned to the user.");
        } else {
          // Assign course if not already assigned
          await updateDoc(userDoc, {
            assignedCourses: arrayUnion(selectedCourse),
          });
          alert("Course assigned successfully!");
        }
      }
    } catch (error) {
      alert(`Failed to assign course: ${error.message}`);
    }
  } else {
    alert("Please select a user and a course.");
  }
};


  return (
    <div
      style={{ background: "#f4f4f4", padding: "10px", borderRadius: "10px" }}
    >
      <h3>Admin - Assign Course</h3>

      {/* Search bar with dropdown */}
      <div style={{ display: "flex", gap: "6%" }}>
        <div style={{ width: "46%" }}>
          <input
            style={{ background: "#e7e7e7", padding: "10px" }}
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true); // Show dropdown while typing
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 300); // Delay hiding the dropdown
            }}
            onFocus={() => setShowDropdown(true)} // Show dropdown on focus
          />
          {showDropdown && filteredUsers.length > 0 && (
            <ul
              style={{
                position: "absolute",
                zIndex: 10,
                background: "#fff",
                border: "1px solid #ccc",
                width: "35%",
                maxHeight: "150px",
                overflowY: "auto",
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          style={{ width: "46%" }}
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
      </div>

      {/* Button to assign course */}
      <button className="add-task" onClick={handleAssignCourse}>
        Assign Course
      </button>
    </div>
  );
};

export default AdminAssignCourse;
