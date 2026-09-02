import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async () => {
    try {
      const response = await api.get(
        "/attendance/today"
      );

      setAttendance(response.data.attendance);
    } catch (error) {
      console.error(
        "Failed to load attendance:",
        error
      );
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      await api.post("/attendance/check-in");

      await loadAttendance();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Check-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      await api.post("/attendance/check-out");

      await loadAttendance();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Check-out failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const formatTime = (time) => {
    if (!time) return "--";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatWorkingHours = () => {
    if (!attendance?.workingMinutes) {
      return "0h 0m";
    }

    const hours = Math.floor(
      attendance.workingMinutes / 60
    );

    const minutes =
      attendance.workingMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const status =
    attendance?.status || "Not Marked";

  return (
    <div className="dashboard">

      {/* Navigation */}
      <div className="navigation">

        <button
          onClick={() =>
            navigate("/employee/dashboard")
          }
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            navigate("/employee/attendance")
          }
        >
          Attendance History
        </button>

        <button
          onClick={() =>
            navigate("/employee/leave")
          }
        >
          Leave Management
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>


      {/* Welcome Section */}
      <div className="welcome-section">

        <h1>
          Welcome, {user?.name}
        </h1>

        <p>
          Employee ID:{" "}
          <strong>{user?.employeeId}</strong>
        </p>

      </div>


      {/* Today's Attendance */}
      <div className="dashboard-card">

        <div className="section-heading">
          <div>
            <h2>Today's Attendance</h2>
            <p>
              Track your attendance and working hours
            </p>
          </div>
        </div>


        {/* Statistics */}
        <div className="stats-grid">

          <div className="stat-card">
            <span className="stat-label">
              Check In
            </span>

            <span className="stat-value">
              {formatTime(attendance?.checkIn)}
            </span>
          </div>


          <div className="stat-card">
            <span className="stat-label">
              Check Out
            </span>

            <span className="stat-value">
              {formatTime(attendance?.checkOut)}
            </span>
          </div>


          <div className="stat-card">
            <span className="stat-label">
              Working Hours
            </span>

            <span className="stat-value">
              {formatWorkingHours()}
            </span>
          </div>


          <div className="stat-card">
            <span className="stat-label">
              Status
            </span>

            <span className="stat-value">
              {status}
            </span>
          </div>

        </div>


        {/* Attendance Actions */}
        <div className="attendance-actions">

          <button
            className="primary-button"
            onClick={handleCheckIn}
            disabled={
              loading ||
              Boolean(attendance?.checkIn)
            }
          >
            {loading
              ? "Processing..."
              : "Check In"}
          </button>


          <button
            className="secondary-button"
            onClick={handleCheckOut}
            disabled={
              loading ||
              !attendance?.checkIn ||
              Boolean(attendance?.checkOut)
            }
          >
            {loading
              ? "Processing..."
              : "Check Out"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default EmployeeDashboard;