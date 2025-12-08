import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceCard.css"; // 👉 Nouveau fichier CSS (ci-dessous)

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    if (status === "UP")
      return { label: "UP", color: "success", icon: "bi-check-circle-fill" };

    if (status.startsWith("HTTP") || status === "DOWN")
      return { label: "DOWN", color: "danger", icon: "bi-x-circle-fill" };

    if (status === "TIMEOUT")
      return { label: "TIMEOUT", color: "warning", icon: "bi-exclamation-triangle-fill" };

    return { label: "UNKNOWN", color: "secondary", icon: "bi-question-circle-fill" };
  };

  const statusInfo = getStatusConfig(service.status);

  return (
    <div className="service-card">
      <div className={`status-ribbon bg-${statusInfo.color}`}>
        <i className={`bi ${statusInfo.icon} me-1`}></i>
        {statusInfo.label}
      </div>

      <div className="card-body-custom">
        <h5 className="service-title">{service.service_name}</h5>
        <p className="service-url">{service.url}</p>

        <div className="info-row">
          <div className="info-block">
            <span className="label">Latence :</span>
            <span className="value">
              {service.response_time != null
                ? `${service.response_time.toFixed(2)} ms`
                : "-"}
            </span>
          </div>

          <div className="info-block">
            <span className="label">SSL :</span>
            <span className={service.ssl_valid ? "ssl-ok" : "ssl-bad"}>
              {service.ssl_valid ? "Valide" : "Invalide"}
            </span>
          </div>
        </div>

        <button className="btn btn-outline-primary w-100 mt-3" onClick={() => navigate(`/service/${encodeURIComponent(service.url)}`)}>
          Voir détails
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
