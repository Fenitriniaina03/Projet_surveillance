import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api";
import Swal from "sweetalert2";
import "../pages/Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiLogin({ username, password });

      // stocker le token JWT
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("auth_token", data.access);

      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard"); // redirection vers dashboard
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Échec de connexion",
        text: err.detail || "Nom d'utilisateur ou mot de passe incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h3>Agile Monitor</h3>
          <p>Surveillance des services & uptime</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nom d’utilisateur</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="ex: fenitriniaina"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control mb-4"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label className="ms-1" htmlFor="remember">Se souvenir</label>
            </div>

            <button className="btn login-btn" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </div>
        </form>

        <p className="login-footer">
          © {new Date().getFullYear()} AgileConseils
        </p>
      </div>
    </div>
  );
};

export default Login;
