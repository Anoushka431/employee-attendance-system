import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function Leave() {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeaves = useCallback(async () => {
    try {
      const response = await api.get("/leaves/my");

setLeaves(response.data.leaves);

setLeaveBalance(response.data.leaveBalance);
    } catch (error) {
      console.error("Failed to load leaves:", error);
    }
  }, []);

useEffect(() => {
  
  loadLeaves();
}, [loadLeaves]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/leaves", form);

      setMessage(response.data.message);

      setForm({
        startDate: "",
        endDate: "",
        reason: ""
      });

      await loadLeaves();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to submit leave request"
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="leave-balance-card">
  <h2>Leave Balance</h2>
  <p>
    Remaining Leave:
    <strong> {leaveBalance} days</strong>
  </p>
</div>

      <h1>Leave Management</h1>

      <div className="attendance-card">

        <h2>Request Leave</h2>

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />

          <label>
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />

          <label>
            Reason
          </label>

          <textarea
            name="reason"
            placeholder="Enter reason for leave"
            value={form.reason}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Submit Leave Request
          </button>

        </form>

      </div>

      <div className="table-container">

        <h2>My Leave Requests</h2>

        {leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>

            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {leaves.map((leave) => (
                <tr key={leave._id}>

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
                    {leave.status}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default Leave;