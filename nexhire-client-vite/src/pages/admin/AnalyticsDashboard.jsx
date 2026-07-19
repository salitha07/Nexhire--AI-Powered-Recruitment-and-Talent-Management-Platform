import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://localhost:7000/api";

function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/analytics/summary`, { headers })
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!summary) return <p>Loading analytics...</p>;

  const cardStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "150px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>System Analytics</h2>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={cardStyle}><h3>{summary.totalUsers}</h3><p>Total Users</p></div>
        <div style={cardStyle}><h3>{summary.totalCandidates}</h3><p>Candidates</p></div>
        <div style={cardStyle}><h3>{summary.totalRecruiters}</h3><p>Recruiters</p></div>
        <div style={cardStyle}><h3>{summary.totalJobs}</h3><p>Total Jobs</p></div>
        <div style={cardStyle}><h3>{summary.openJobs}</h3><p>Open Jobs</p></div>
        <div style={cardStyle}><h3>{summary.totalApplications}</h3><p>Applications</p></div>
        <div style={cardStyle}><h3>{summary.totalHired}</h3><p>Hired</p></div>
        <div style={cardStyle}><h3>{summary.totalInterviews}</h3><p>Interviews</p></div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;