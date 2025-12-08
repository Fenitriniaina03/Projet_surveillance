import React, { useEffect, useState } from "react";
import { getServiceDetails } from "../api";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ServiceDetails.css";

const ServiceDetails = () => {
  const { encodedUrl } = useParams();
  const decodedUrl = decodeURIComponent(encodedUrl); // 🔹 décodage

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await getServiceDetails(decodedUrl); // 🔹 utiliser l'URL décodée
        if (!res.data.service) {
          setError("Aucune donnée disponible pour ce service");
        } else {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [decodedUrl]);

  const getStatusBadge = (status) => {
    if (status === "UP") return <span className="badge bg-success">🟢 UP</span>;
    if (status === "DOWN" || status.startsWith("HTTP"))
      return <span className="badge bg-danger">🔴 DOWN</span>;
    if (status === "TIMEOUT") return <span className="badge bg-warning">⚠️ TIMEOUT</span>;
    return <span className="badge bg-secondary">⚪ UNKNOWN</span>;
  };

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  const service = data.service;

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-4">
        <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
          ← Retour
        </Link>

        <div className="service-header mb-4 p-4 shadow-sm rounded bg-white">
          <h2 className="fw-bold mb-1">{service.service_name}</h2>
          <p className="text-muted small">{service.url}</p>
          {getStatusBadge(service.status)}
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="info-card shadow-sm">
              <h5 className="info-title">Performance</h5>
              <div className="info-item">
                <span>Temps de réponse</span>
                <strong>
                  {service.response_time != null ? `${service.response_time.toFixed(2)} ms` : "-"}
                </strong>
              </div>
              <div className="info-item">
                <span>Taux d'erreur</span>
                <strong>{service.error_rate || 0}%</strong>
              </div>
              <div className="info-item">
                <span>Dernier check</span>
                <strong>{new Date(service.checked_at).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="info-card shadow-sm">
              <h5 className="info-title">Vérifications</h5>
              <div className="info-item">
                <span>SSL valide</span>
                <strong className={service.ssl_valid ? "ok" : "bad"}>
                  {service.ssl_valid ? "Oui" : "Non"}
                </strong>
              </div>
              <div className="info-item">
                <span>Mot-clé trouvé</span>
                <strong className={service.keyword_found ? "ok" : "bad"}>
                  {service.keyword_found ? "Oui" : "Non"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
