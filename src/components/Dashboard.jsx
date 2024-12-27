/* eslint-disable */
import React, { useContext, useState, useEffect } from "react";
import { useUsers } from "../context";
import { CoursesContext } from "../context";
import ClipLoader from "react-spinners/ClipLoader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    courses,
    user: currentUser,
    loading: coursesLoading,
    error: coursesError,
  } = useContext(CoursesContext);

  const [courseProgress, setCourseProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usersLoading || coursesLoading) return;

    const matchedUser = users.find((user) => user.userUid === currentUser?.uid);
    if (!matchedUser) {
      setCourseProgress([]);
      setLoading(false);
      return;
    }

    const calculateCourseProgress = () => {
      const progressData = matchedUser.assignedCourses
        .map((courseId) => {
          const course = courses.find((c) => c.id === courseId);
          if (!course) return null;

          let totalTasks = 0;
          let completedTasks = 0;

          for (let weekId in course.weeks) {
            const week = course.weeks[weekId];
            for (let dayId in week.days) {
              const day = week.days[dayId];
              for (let taskId in day.tasks) {
                const task = day.tasks[taskId];
                totalTasks++;
                if (task.statusByUser?.[currentUser?.uid]) {
                  completedTasks++;
                }
              }
            }
          }

          const completionRatio =
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return {
            name: course.name,
            completionRatio, // Store the completion ratio as a percentage
          };
        })
        .filter(Boolean);

      setCourseProgress(progressData);
      setLoading(false);
    };

    calculateCourseProgress();
  }, [usersLoading, coursesLoading, users, courses, currentUser?.uid]);

  if (loading) {
    return <ClipLoader size={50} color="#58285a" />;
  }

  if (usersError) return <p>Error fetching users: {usersError}</p>;
  if (coursesError) return <p>Error fetching courses: {coursesError}</p>;

  // Prepare data for the bar chart
  const chartData = {
    labels: courseProgress.map((course) => course.name),
    datasets: [
      {
        label: "Completion Percentage",
        data: courseProgress.map((course) => course.completionRatio),
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw}% completed`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        title: {
          display: true,
          text: "Completion (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Courses",
        },
      },
    },
  };

  return (
    <div>
      <h2>Course Progress</h2>
      <div style={{ width: "600px", margin: "auto" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
