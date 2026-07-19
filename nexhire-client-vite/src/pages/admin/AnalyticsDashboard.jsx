import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api";

const CARD_META = {
  "Total Users": { color: "#4f46e5", bg: "#eef2ff" },
  "Candidates": { color: "#0891b2", bg: "#ecfeff" },
  "Recruiters": { color: "#7c3aed", bg: "#f5f3ff" },
  "Total Jobs": { color: "#d97706", bg: "#fffbeb" },
  "Open Jobs": { color: "#16a34a", bg: "#f0fdf4" },
  "Applications": { color: "#db2777", bg: "#fdf2f8" },
  "Hired": { color: "#059669", bg: "#ecfdf5" },
  "Interviews": { color: "#4338ca", bg: "#eef2ff" },
};

const APP_STATUS_COLORS = {
  Applied: "#6366f1",
  Shortlisted: "#0891b2",
  Hired: "#16a34a",
  Rejected: "#dc2626",
};

function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [jobStatus, setJobStatus] = useState([]);
  const [appStatus, setAppStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, monthlyRes, jobStatusRes, appStatusRes] = await Promise.all([
        axios.get(`${API}/analytics/summary`, { headers }),
        axios.get(`${API}/analytics/applications-per-month`, { headers }),
        axios.get(`${API}/analytics/jobs-per-status`, { headers }),
        axios.get(`${API}/analytics/applications-per-status`, { headers }),
      ]);
      setSummary(summaryRes.data);
      setMonthly(monthlyRes.data);
      setJobStatus(jobStatusRes.data);
      setAppStatus(appStatusRes.data);
    } catch (err) {
      console.error(err);
      setError("Couldn't load analytics data. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = summary
    ? [
        { label: "Total Users", value: summary.totalUsers },
        { label: "Candidates", value: summary.totalCandidates },
        { label: "Recruiters", value: summary.totalRecruiters },
        { label: "Total Jobs", value: summary.totalJobs },
        { label: "Open Jobs", value: summary.openJobs },
        { label: "Applications", value: summary.totalApplications },
        { label: "Hired", value: summary.totalHired },
        { label: "Interviews", value: summary.totalInterviews },
      ]
    : [];

  const maxMonthly = Math.max(1, ...monthly.map((m) => m.count));
  const totalAppStatus = appStatus.reduce((sum, s) => sum + s.count, 0) || 1;
  const totalJobStatus = jobStatus.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.eyebrow}>ADMIN</div>
            <h1 style={styles.title}>System Analytics</h1>
            <p style={styles.subtitle}>Overview of platform activity and performance.</p>
          </div>
          <div style={styles.headerActions}>
            <Link to="/admin/users" style={styles.backBtn}>
              <ArrowLeftIcon />
              Back to Users
            </Link>
            <button style={styles.refreshBtn} onClick={fetchAll} disabled={loading}>
              <RefreshIcon spinning={loading} />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.stateBox}>
            <Spinner />
            <p style={styles.stateText}>Loading analytics...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={styles.errorBox}>
            <ErrorIcon />
            {error}
          </div>
        )}

        {!loading && !error && summary && (
          <>
            {/* Stat cards */}
            <div style={styles.grid}>
              {cards.map((card) => {
                const meta = CARD_META[card.label] || { color: "#334155", bg: "#f1f5f9" };
                return (
                  <div key={card.label} style={styles.card}>
                    <div style={{ ...styles.cardIconWrap, backgroundColor: meta.bg }}>
                      <div style={{ ...styles.cardIconDot, backgroundColor: meta.color }} />
                    </div>
                    <div>
                      <div style={styles.cardValue}>{card.value}</div>
                      <div style={styles.cardLabel}>{card.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts row */}
            <div style={styles.panelsRow}>
              {/* Monthly applications bar chart */}
              <div style={styles.panel}>
                <h3 style={styles.panelTitle}>Applications Per Month</h3>
                {monthly.length === 0 ? (
                  <p style={styles.panelEmpty}>No application data yet.</p>
                ) : (
                  <div style={styles.barChart}>
                    {monthly.map((m) => (
                      <div key={m.month} style={styles.barCol}>
                        <div style={styles.barTrack}>
                          <div
                            style={{
                              ...styles.barFill,
                              height: `${(m.count / maxMonthly) * 100}%`,
                            }}
                          />
                        </div>
                        <div style={styles.barValue}>{m.count}</div>
                        <div style={styles.barLabel}>{m.month}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job status breakdown */}
              <div style={styles.panel}>
                <h3 style={styles.panelTitle}>Job Status</h3>
                {jobStatus.length === 0 ? (
                  <p style={styles.panelEmpty}>No job data yet.</p>
                ) : (
                  <div style={styles.statusList}>
                    {jobStatus.map((s) => {
                      const pct = Math.round((s.count / totalJobStatus) * 100);
                      const color = s.status === "Active" ? "#16a34a" : "#94a3b8";
                      return (
                        <div key={s.status} style={styles.statusRow}>
                          <div style={styles.statusRowHead}>
                            <span style={styles.statusRowLabel}>
                              <span style={{ ...styles.statusRowDot, backgroundColor: color }} />
                              {s.status}
                            </span>
                            <span style={styles.statusRowCount}>{s.count}</span>
                          </div>
                          <div style={styles.progressTrack}>
                            <div
                              style={{
                                ...styles.progressFill,
                                width: `${pct}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Application status breakdown */}
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Application Status Breakdown</h3>
              {appStatus.length === 0 ? (
                <p style={styles.panelEmpty}>No application data yet.</p>
              ) : (
                <>
                  <div style={styles.stackedBar}>
                    {appStatus.map((s) => (
                      <div
                        key={s.status}
                        style={{
                          width: `${(s.count / totalAppStatus) * 100}%`,
                          backgroundColor: APP_STATUS_COLORS[s.status] || "#94a3b8",
                        }}
                        title={`${s.status}: ${s.count}`}
                      />
                    ))}
                  </div>
                  <div style={styles.legendRow}>
                    {appStatus.map((s) => (
                      <div key={s.status} style={styles.legendItem}>
                        <span
                          style={{
                            ...styles.legendDot,
                            backgroundColor: APP_STATUS_COLORS[s.status] || "#94a3b8",
                          }}
                        />
                        <span style={styles.legendLabel}>{s.status}</span>
                        <span style={styles.legendCount}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI pieces ---------- */

function Spinner() {
  return (
    <div style={styles.spinnerWrap}>
      <div style={styles.spinner} />
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: spinning ? "spin 0.8s linear infinite" : "none" }}
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f5f9",
    padding: "40px 20px",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#6366f1",
    marginBottom: "6px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "6px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    color: "#334155",
    padding: "9px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#4f46e5",
    border: "1px solid #4f46e5",
    color: "#fff",
    padding: "9px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  stateBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },
  stateText: {
    marginTop: "12px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  spinnerWrap: {
    display: "flex",
  },
  spinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  },
  cardIconWrap: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardIconDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  cardValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.2,
  },
  cardLabel: {
    fontSize: "12.5px",
    color: "#64748b",
    fontWeight: 500,
    marginTop: "2px",
  },
  panelsRow: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  panel: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    marginBottom: "16px",
  },
  panelTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#0f172a",
    marginTop: 0,
    marginBottom: "18px",
  },
  panelEmpty: {
    fontSize: "13.5px",
    color: "#94a3b8",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    height: "180px",
    paddingTop: "10px",
  },
  barCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
  barTrack: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  barFill: {
    width: "60%",
    backgroundColor: "#6366f1",
    borderRadius: "6px 6px 0 0",
    minHeight: "4px",
    transition: "height 0.3s ease",
  },
  barValue: {
    fontSize: "11.5px",
    fontWeight: 700,
    color: "#334155",
    marginTop: "6px",
  },
  barLabel: {
    fontSize: "10.5px",
    color: "#94a3b8",
    marginTop: "2px",
    textAlign: "center",
  },
  statusList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  statusRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statusRowHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusRowLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
  },
  statusRowDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  statusRowCount: {
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#0f172a",
  },
  progressTrack: {
    height: "8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },
  stackedBar: {
    display: "flex",
    height: "14px",
    borderRadius: "999px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginBottom: "16px",
  },
  legendRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
  },
  legendLabel: {
    fontSize: "13px",
    color: "#334155",
    fontWeight: 500,
  },
  legendCount: {
    fontSize: "13px",
    color: "#94a3b8",
  },
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("admin-dashboard-keyframes")) {
  const styleTag = document.createElement("style");
  styleTag.id = "admin-dashboard-keyframes";
  styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleTag);
}

export default AnalyticsDashboard;