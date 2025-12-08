import ProtectedLogin from "./ProtectedLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ServiceDetails from "./pages/ServiceDetails"; // 🔹 Import ServiceDetails
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const App = () => (
  <Router>
    <Routes>
      {/* ROOT redirige vers /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <ProtectedLogin>
            <Login />
          </ProtectedLogin>
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* SERVICE DETAILS */}
      <Route
        path="/service/:encodedUrl" // 🔹 Route dynamique pour les détails
        element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        }
      />

      {/* AUTRES PAGES */}
      <Route
        path="/historique"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
     
      {/* REDIRECTION PAR DÉFAUT */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;




