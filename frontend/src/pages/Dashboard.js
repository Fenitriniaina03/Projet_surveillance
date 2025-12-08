import React, { useEffect, useState, useRef } from "react";
import ServiceCard from "../components/ServiceCard";
import Navbar from "../components/Navbar";
import { getLatestChecks } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";

// Toast SweetAlert
const showToast = (message, type) => {
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
};

const normalizeUrl = (url) => url.replace(/\/$/, "");

const serviceNames = {
  "https://back-sirhi.agileinterim.mg/admin": "SIRHI Backend",
  "https://sirhi.agileinterim.mg": "SIRHI Frontend",
  "https://smart.agileconseils.com": "Smart Agile",
  "https://argos.agileinterim.mg/recrutement": "Argos Recrutement",
  "https://agileconseils.com": "Agile Conseils",
};

const computeDisplayStatus = (service, previousStatus) => {
  if (!previousStatus) return service.status;
  const isNowDown =
    service.status.startsWith("DOWN") ||
    service.status.startsWith("HTTP") ||
    !service.ssl_valid ||
    !service.keyword_found;

  if (previousStatus === "UP" && isNowDown) return "EN_COURS";
  return service.status;
};

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousStatuses = useRef({});

  const fetchServices = async () => {
    try {
      const res = await getLatestChecks();
      const data = res.data || [];

      const latestResults = Object.values(
        data.reduce((acc, item) => {
          const key = normalizeUrl(item.url);
          if (!acc[key] || new Date(item.checked_at) > new Date(acc[key].checked_at)) {
            acc[key] = item;
          }
          return acc;
        }, {})
      );

      const resultsWithNames = latestResults.map((srv) => {
        const key = normalizeUrl(srv.url);
        return {
          ...srv,
          service_name: serviceNames[key] || "Service Inconnu",
        };
      });

      resultsWithNames.forEach((service) => {
        const key = normalizeUrl(service.url);
        const previousStatus = previousStatuses.current[key];
        service.displayStatus = computeDisplayStatus(service, previousStatus);

        if (!previousStatus || previousStatus !== service.status) {
          if (service.status === "UP") {
            showToast(`${service.service_name} est UP ✅`, "success");
          } else {
            showToast(`${service.service_name} est DOWN (${service.status}) !`, "error");
          }
        }

        previousStatuses.current[key] = service.status;
      });

      setServices(resultsWithNames);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4 fw-bold text-center text-dark">
          <i className="bi bi-speedometer2 text-dark me-2"></i>
          État des services
        </h2>

        {loading ? (
          <div className="text-center text-secondary py-5">
            <div className="spinner-border text-dark mb-3" role="status"></div>
            <p>Chargement des services en cours...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <i className="bi bi-database-exclamation fs-1 text-warning mb-3"></i>
            <p>Aucun service trouvé</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {services.map((service, index) => (
              <div className="col" key={index}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
