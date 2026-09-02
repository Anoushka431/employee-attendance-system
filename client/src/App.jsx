import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendanceHistory from "./pages/AttendanceHistory";
import Leave from "./pages/Leave";
import HRDashboard from "./pages/HRDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/attendance"
          element={
            <ProtectedRoute role="employee">
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/leave"
          element={
            <ProtectedRoute role="employee">
              <Leave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute role="hr">
              <HRDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;