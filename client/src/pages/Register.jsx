import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: ""
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post(
        "/auth/register",
        form
      );

      setMessage(response.data.message);
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

      setMessage("");
    }
  };

  return (
    <div className="auth-container">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <h1>Create Account</h1>

        {error && (
          <p className="error">{error}</p>
        )}

        {message && (
          <p className="success">{message}</p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="employeeId"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;