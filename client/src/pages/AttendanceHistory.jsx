import { useEffect, useState } from "react";
import api from "../services/api";

function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await api.get("/attendance/my");

        setAttendance(response.data.attendance);
      } catch (error) {
        console.error(
          "Failed to load attendance:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const formatTime = (time) => {
    if (!time) return "--";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatWorkingHours = (minutes) => {
    if (!minutes) return "0h 0m";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusClass = (status) => {
    if (status === "Present") {
      return "status-badge present";
    }

    if (status === "Half Day") {
      return "status-badge half-day";
    }

    if (status === "Absent") {
      return "status-badge absent";
    }

    return "status-badge";
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1>Attendance History</h1>
          <p>Loading your attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* Page Header */}
      <div className="page-header">
        <h1>Attendance History</h1>

        <p>
          View your previous attendance and working
          hours.
        </p>
      </div>


      {/* Summary */}
      <div className="attendance-summary">

        <div className="summary-card">
          <span>Total Records</span>
          <strong>{attendance.length}</strong>
        </div>

        <div className="summary-card">
          <span>Present</span>
          <strong>
            {
              attendance.filter(
                (record) =>
                  record.status === "Present"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Half Days</span>
          <strong>
            {
              attendance.filter(
                (record) =>
                  record.status === "Half Day"
              ).length
            }
          </strong>
        </div>

      </div>


      {/* Attendance Table */}
      <div className="dashboard-card">

        <h2>Attendance Records</h2>

        {attendance.length === 0 ? (
          <p className="empty-message">
            No attendance records found.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((record) => (
                  <tr key={record._id}>

                    <td>{record.date}</td>

                    <td>
                      {formatTime(record.checkIn)}
                    </td>

                    <td>
                      {formatTime(record.checkOut)}
                    </td>

                    <td>
                      {formatWorkingHours(
                        record.workingMinutes
                      )}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          record.status
                        )}
                      >
                        {record.status || "Not Marked"}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default AttendanceHistory;