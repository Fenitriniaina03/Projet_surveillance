import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedLogin = ({ children }) => {
  // 🔹 Toujours afficher le login au premier lancement
  const firstVisit = !sessionStorage.getItem("visited");

  // Marquer que l'utilisateur a visité le login
  if (firstVisit) sessionStorage.setItem("visited", "true");

  // Vérifier token
  const token =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token");

  // Rediriger vers dashboard uniquement si token existe **et que ce n'est pas le premier affichage**
  if (token && !firstVisit) return <Navigate to="/dashboard" replace />;

  // Sinon → afficher login
  return children;
};

export default ProtectedLogin;
