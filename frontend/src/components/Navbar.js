import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import logo from "../assets/logo.png"; // 🖼️ chemin vers ton logo

const Navbar = () => {
  const navigate = useNavigate();

  // 🔐 Popup de confirmation pour la déconnexion
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
    }).then((result) => {
      if (result.isConfirmed) {
        // Suppression des tokens
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");

        // Redirection vers login
        navigate("/");
      }
    });
  };

  return (
    <nav
      className="navbar shadow"
      style={{
        backgroundColor: "white",
        minHeight: "64px",
        borderBottom: "3px solid #A6A6A6",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Logo */}
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "48px",
              width: "auto",
              marginRight: "10px",
            }}
          />
          <span style={{ color: "#000000", fontWeight: "bold", fontSize: "1.2rem" }}>
            Agile Monitor
          </span>
        </div>

        {/* Boutons */}
        <div className="d-flex gap-2">

          <button
            className="btn"
            style={{
              border: "1px solid #C9C3C4",
              color: "black",
              backgroundColor: "transparent",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </button>

          <button
            className="btn"
            style={{
              border: "1px solid #C9C3C4",
              color: "black",
              backgroundColor: "transparent",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/historique")}
          >
            <i className="bi bi-clock-history me-2"></i>
            Historique
          </button>
{/* Déconnexion */}
<button
  className="btn btn-outline-light"
  style={{
    border: "1px solid red",
    color: "red",          
    backgroundColor: "white", 
    fontWeight: "bold",     
  }}
  onClick={handleLogout}
>
  <i className="bi bi-box-arrow-right me-2"></i>
  Déconnexion
</button>

 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

