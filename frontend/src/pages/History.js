import React, { useEffect, useState } from "react";
import { getHistory } from "../api";
import Navbar from "../components/Navbar";
import "./History.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };

    load(); // Charger au démarrage

    const interval = setInterval(() => {
      load(); // 🔄 Rafraîchissement automatique
    }, 10000); // ➤ rafraîchit toutes les 10 secondes

    return () => clearInterval(interval); // Nettoyage propre
  }, []);

  // Résumé
  const total = history.length;
  const upCount = history.filter((h) => h.status === "UP").length;
  const downCount = history.filter((h) => h.status.startsWith("HTTP")).length;
  const timeoutCount = history.filter((h) => h.status === "TIMEOUT").length;

  // Filtrage + Recherche
  const filtered = history.filter((h) => {
    const matchSearch = h.url.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "ALL"
        ? true
        : filterStatus === h.status ||
          (filterStatus === "DOWN" && h.status.startsWith("HTTP"));

    return matchSearch && matchStatus;
  });

  const getStatusIcon = (status) => {
    if (status === "UP") return "🟢";
    if (status.startsWith("HTTP")) return "🔴";
    if (status === "TIMEOUT") return "⚠️";
    return "⚪";
  };

  const getRowClass = (status) => {
    if (status === "UP") return "row-up";
    if (status.startsWith("HTTP")) return "row-down";
    if (status === "TIMEOUT") return "row-timeout";
    return "";
  };

  return (
    <>
      <Navbar />

      <div className="history-page">
        <div className="container history-container shadow-sm">

          <h2 className="title">📊 Historique des vérifications</h2>

          {/* Résumé KPIs */}
          <div className="row mb-4 kpi-row">
            <div className="col-md-3">
              <div className="kpi-card">
                <p className="kpi-label">Total</p>
                <p className="kpi-value">{total}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="kpi-card up">
                <p className="kpi-label">UP</p>
                <p className="kpi-value">{upCount}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="kpi-card down">
                <p className="kpi-label">DOWN</p>
                <p className="kpi-value">{downCount}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="kpi-card timeout">
                <p className="kpi-label">Timeout</p>
                <p className="kpi-value">{timeoutCount}</p>
              </div>
            </div>
          </div>

          {/* Recherche + Filtre */}
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control search-input"
                placeholder="🔍 Rechercher une URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-2">
              <select
                className="form-select filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Tous les statuts</option>
                <option value="UP">UP</option>
                <option value="DOWN">DOWN (HTTP 4xx/5xx)</option>
                <option value="TIMEOUT">Timeout</option>
              </select>
            </div>
          </div>

          {/* Tableau */}
          <div className="table-responsive">
            <table className="table history-table shadow-sm">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Statut</th>
                  <th>Temps réponse</th>
                  <th>Date vérification</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-muted">
                      Aucun résultat trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((h, i) => (
                    <tr key={i} className={getRowClass(h.status)}>
                      <td>{h.url}</td>
                      <td className="fw-bold">
                        {getStatusIcon(h.status)} {h.status}
                      </td>
                      <td>
                        {h.response_time != null
                          ? h.response_time.toFixed(2) + " ms"
                          : "-"}
                      </td>
                      <td>{new Date(h.checked_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default History;
