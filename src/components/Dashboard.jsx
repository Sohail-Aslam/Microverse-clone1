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
  const [selectedCourse, setSelectedCourse] = useState(null); // Selected course for the graph
  const [selectedWeek, setSelectedWeek] = useState(null); // Selected week
  const [weekProgress, setWeekProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    percentage: 0,
  });
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
            id: course.id,
            name: course.name,
            completionRatio, // Store the completion ratio as a percentage
            weeks: course.weeks, // Include weeks for dropdown
          };
        })
        .filter(Boolean);

      setCourseProgress(progressData);
      setSelectedCourse(progressData[0]); // Automatically select the first course
      setLoading(false);
    };

    calculateCourseProgress();
  }, [usersLoading, coursesLoading, users, courses, currentUser?.uid]);

  const handleWeekSelection = (weekId) => {
    if (!selectedCourse) return;

    const week = selectedCourse.weeks[weekId];
    if (!week) {
      setWeekProgress({ totalTasks: 0, completedTasks: 0, percentage: 0 });
      return;
    }

    let totalTasks = 0;
    let completedTasks = 0;

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

    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    setWeekProgress({ totalTasks, completedTasks, percentage });
    setSelectedWeek(weekId);
  };

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

      {/* Week Dropdown */}
      {selectedCourse && (
        <div>
          <label htmlFor="week-select">Select Week:</label>
          <select
            id="week-select"
            onChange={(e) => handleWeekSelection(e.target.value)}
          >
            <option value="">-- Select a Week --</option>
            {Object.keys(selectedCourse.weeks).map((weekId) => (
              <option key={weekId} value={weekId}>
                Week {weekId}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Visualize Week Progress */}
      {selectedWeek && (
        <div>
          <h3>Progress for Week {selectedWeek}</h3>
          <div
            style={{
              width: "100%",
              background: "#b6b6b6",
              borderRadius: "8px",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                width: `${weekProgress.percentage}%`,
                background: "#4caf50",
                height: "25px",
                borderRadius: "8px",
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <p>
            {weekProgress.completedTasks} / {weekProgress.totalTasks} tasks
            completed ({Math.round(weekProgress.percentage)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
