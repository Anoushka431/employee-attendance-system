import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function HRDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] =
    useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const loadLeaves = async () => {
    try {
      const response = await api.get("/leaves/all");

      setLeaves(response.data.leaves || []);
    } catch (error) {
      console.error(
        "Failed to load leaves:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      const response = await api.get(
        "/attendance/all"
      );

      setAttendance(
        response.data.attendance || []
      );
    } catch (error) {
      console.error(
        "Failed to load attendance:",
        error
      );
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
    loadAttendance();
  }, []);

  const handleLeaveAction = async (
    id,
    status
  ) => {
    try {
      await api.put(`/leaves/${id}/status`, {
        status
      });

      setMessage(
        `Leave ${status.toLowerCase()} successfully`
      );

      await loadLeaves();
    } catch (error) {
      console.error(
        "Failed to update leave:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to update leave"
      );
    }
  };

  const getLeaveStatusClass = (status) => {
    if (status === "Approved") {
      return "status-badge approved";
    }

    if (status === "Rejected") {
      return "status-badge rejected";
    }

    if (status === "Pending") {
      return "status-badge pending";
    }

    return "status-badge";
  };

  const getAttendanceStatusClass = (status) => {
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

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  return (
    <div className="page-container">

      {/* Navigation */}
      <div className="navigation">

        <button
          onClick={() =>
            navigate("/hr/dashboard")
          }
        >
          Dashboard
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>


      {/* Header */}
      <div className="hr-header">

        <div>
          <h1>HR Dashboard</h1>

          <p>
            Welcome back, HR Manager. Manage
            employee attendance and leave requests.
          </p>
        </div>

      </div>


      {/* Message */}
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}


      {/* Summary Cards */}
      <div className="hr-summary">

        <div className="summary-card">
          <span>Total Leave Requests</span>

          <strong>
            {leaves.length}
          </strong>
        </div>


        <div className="summary-card">
          <span>Pending Requests</span>

          <strong>
            {pendingLeaves}
          </strong>
        </div>


        <div className="summary-card">
          <span>Approved Leaves</span>

          <strong>
            {approvedLeaves}
          </strong>
        </div>


        <div className="summary-card">
          <span>Attendance Records</span>

          <strong>
            {attendance.length}
          </strong>
        </div>

      </div>


      {/* Leave Requests */}
      <div className="dashboard-card">

        <div className="section-heading">
          <div>
            <h2>Leave Requests</h2>

            <p>
              Review and manage employee leave
              requests.
            </p>
          </div>
        </div>


        {loading ? (
          <p>Loading leave requests...</p>
        ) : leaves.length === 0 ? (
          <p className="empty-message">
            No leave requests found.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>

                {leaves.map((leave) => (
                  <tr key={leave._id}>

                    <td>
                      {leave.employee?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {leave.employee?.employeeId ||
                        "-"}
                    </td>

                    <td>
                      {new Date(
                        leave.startDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        leave.endDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {leave.numberOfDays}
                    </td>

                    <td>
                      {leave.reason}
                    </td>

                    <td>
                      <span
                        className={getLeaveStatusClass(
                          leave.status
                        )}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td>

                      {leave.status ===
                      "Pending" ? (
                        <div className="action-buttons">

                          <button
                            className="approve-button"
                            onClick={() =>
                              handleLeaveAction(
                                leave._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-button"
                            onClick={() =>
                              handleLeaveAction(
                                leave._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>

                        </div>
                      ) : (
                        <span className="no-action">
                          -
                        </span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* Attendance Records */}
      <div className="dashboard-card">

        <div className="section-heading">

          <div>
            <h2>Attendance Records</h2>

            <p>
              View employee attendance and working
              hours.
            </p>
          </div>

        </div>


        {attendanceLoading ? (
          <p>Loading attendance...</p>
        ) : attendance.length === 0 ? (
          <p className="empty-message">
            No attendance records found.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {attendance.map((record) => {

                  const workingMinutes =
                    record.workingMinutes || 0;

                  const hours = Math.floor(
                    workingMinutes / 60
                  );

                  const minutes =
                    workingMinutes % 60;

                  return (
                    <tr key={record._id}>

                      <td>
                        {record.employee?.name ||
                          "Unknown"}
                      </td>

                      <td>
                        {record.employee
                          ?.employeeId || "-"}
                      </td>

                      <td>
                        {record.date}
                      </td>

                      <td>
                        {record.checkIn
                          ? new Date(
                              record.checkIn
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )
                          : "--"}
                      </td>

                      <td>
                        {record.checkOut
                          ? new Date(
                              record.checkOut
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )
                          : "--"}
                      </td>

                      <td>
                        {hours}h {minutes}m
                      </td>

                      <td>
                        <span
                          className={getAttendanceStatusClass(
                            record.status
                          )}
                        >
                          {record.status ||
                            "Not Marked"}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default HRDashboard;