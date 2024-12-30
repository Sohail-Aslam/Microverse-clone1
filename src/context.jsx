/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { auth, app, db } from "./auth/firebase";

// Creating Admin Context
const ADMIN_EMAILS = ["imumairhamza@gmail.com", "emsohailaslam@gmail.com"];

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(ADMIN_EMAILS.includes(user.email || ""));
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// Creating Courses Context
export const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null); // Track the user

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null); // Set user to null if the user is logged out
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
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
                      return {
                        id: taskDoc.id,
                        ...taskData,
                        currentStatus:
                          taskData.statusByUser?.[user?.uid] || false,
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
        console.error("Error fetching courses:", error);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]); // Re-run the effect when the user changes

  return (
    <CoursesContext.Provider value={{ courses, user }}>
      {children}
    </CoursesContext.Provider>
  );
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const studentsCollection = collection(db, "students");

      try {
        const snapshot = await getDocs(studentsCollection);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
