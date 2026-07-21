import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api";

const ROLE_META = {
  candidate: { label: "Candidate", color: "#0369a1", bg: "#e0f2fe" },
  recruiter: { label: "Recruiter", color: "#7c3aed", bg: "#ede9fe" },
  hiring_manager: { label: "Hiring Manager", color: "#b45309", bg: "#fef3c7" },
  admin: { label: "Admin", color: "#be123c", bg: "#ffe4e6" },
};

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarColor(name = "") {
  const palette = ["#4f46e5", "#0891b2", "#c026d3", "#ea580c", "#16a34a", "#be123c"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Couldn't load users. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const changeRole = async (id, newRole) => {
    setBusyId(id);
    try {
      await axios.put(`${API}/admin/users/${id}/role`, { newRole }, { headers });
      setMessage({ type: "success", text: "Role updated." });
      fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Couldn't update role." });
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = async (id, isActive) => {
    setBusyId(id);
    try {
      await axios.put(`${API}/admin/users/${id}/status`, { isActive: !isActive }, { headers });
      setMessage({ type: "success", text: !isActive ? "Account activated." : "Account deactivated." });
      fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Couldn't update status." });
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This can't be undone.`)) return;
    setBusyId(id);
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers });
      setMessage({ type: "success", text: "User deleted." });
      fetchUsers();
    } catch {
      setMessage({ type: "error", text: "Couldn't delete user." });
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const admins = users.filter((u) => u.role === "admin").length;
    return { total, active, inactive: total - active, admins };
  }, [users]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.eyebrow}>ADMIN</div>
            <h1 style={styles.title}>User Management</h1>
            <p style={styles.subtitle}>Manage accounts, roles, and access across the platform.</p>
          </div>
          <div style={styles.headerActions}>
            <Link to="/admin/analytics" style={styles.analyticsBtn}>
              <ChartIcon />
              View Analytics
            </Link>
            <button style={styles.refreshBtn} onClick={fetchUsers} disabled={loading}>
              <RefreshIcon spinning={loading} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={styles.statsRow}>
          <StatPill label="Total users" value={stats.total} color="#4f46e5" />
          <StatPill label="Active" value={stats.active} color="#16a34a" />
          <StatPill label="Inactive" value={stats.inactive} color="#dc2626" />
          <StatPill label="Admins" value={stats.admins} color="#be123c" />
        </div>

        {/* Toast message */}
        {message && (
          <div
            style={{
              ...styles.toast,
              backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: message.type === "success" ? "#15803d" : "#b91c1c",
              borderColor: message.type === "success" ? "#bbf7d0" : "#fecaca",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All roles</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
            <option value="hiring_manager">Hiring Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.stateBox}>
              <Spinner />
              <p style={styles.stateText}>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.stateBox}>
              <EmptyIcon />
              <p style={styles.stateText}>
                {search || roleFilter !== "all" ? "No users match your filters." : "No users yet."}
              </p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const roleMeta = ROLE_META[u.role] || { label: u.role, color: "#334155", bg: "#f1f5f9" };
                  const rowBusy = busyId === u.id;
                  return (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={{ ...styles.avatar, backgroundColor: avatarColor(u.fullName) }}>
                            {getInitials(u.fullName)}
                          </div>
                          <div>
                            <div style={styles.userName}>{u.fullName}</div>
                            <div style={styles.userEmail}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          disabled={rowBusy}
                          style={{
                            ...styles.roleSelect,
                            color: roleMeta.color,
                            backgroundColor: roleMeta.bg,
                          }}
                        >
                          <option value="candidate">Candidate</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="hiring_manager">Hiring Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusCell}>
                          <span
                            style={{
                              ...styles.dot,
                              backgroundColor: u.isActive ? "#16a34a" : "#dc2626",
                            }}
                          />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.dateText}>
                          {new Date(u.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button
                          onClick={() => toggleStatus(u.id, u.isActive)}
                          disabled={rowBusy}
                          style={{ ...styles.iconBtn, ...styles.toggleIconBtn }}
                          title={u.isActive ? "Deactivate" : "Activate"}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id, u.fullName)}
                          disabled={rowBusy}
                          style={{ ...styles.iconBtn, ...styles.deleteIconBtn }}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredUsers.length > 0 && (
          <div style={styles.footerRow}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI pieces ---------- */

function StatPill({ label, value, color }) {
  return (
    <div style={styles.statPill}>
      <span style={{ ...styles.statDot, backgroundColor: color }} />
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div style={styles.spinnerWrap}>
      <div style={styles.spinner} />
    </div>
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

function ChartIcon() {
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
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    marginBottom: "24px",
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
  analyticsBtn: {
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
    textDecoration: "none",
  },
  refreshBtn: {
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
  },
  statsRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  statPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px 16px",
  },
  statDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  statValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
  },
  statLabel: {
    fontSize: "12.5px",
    color: "#64748b",
  },
  toast: {
    border: "1px solid",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13.5px",
    fontWeight: 500,
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: "1 1 260px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "9px 14px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    color: "#0f172a",
  },
  filterSelect: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "9px 14px",
    fontSize: "13.5px",
    color: "#334155",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "13px 20px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontWeight: 600,
    fontSize: "12px",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userName: {
    fontWeight: 600,
    color: "#0f172a",
    fontSize: "14px",
  },
  userEmail: {
    fontSize: "12.5px",
    color: "#94a3b8",
    marginTop: "1px",
  },
  roleSelect: {
    border: "none",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
  },
  statusCell: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13.5px",
    color: "#334155",
    fontWeight: 500,
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
  },
  dateText: {
    color: "#64748b",
    fontSize: "13.5px",
  },
  iconBtn: {
    border: "1px solid transparent",
    padding: "7px 12px",
    borderRadius: "7px",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
    marginLeft: "6px",
  },
  toggleIconBtn: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
  },
  deleteIconBtn: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },
  stateBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
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
  footerRow: {
    marginTop: "14px",
    fontSize: "13px",
    color: "#94a3b8",
    textAlign: "right",
  },
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("admin-dashboard-keyframes")) {
  const styleTag = document.createElement("style");
  styleTag.id = "admin-dashboard-keyframes";
  styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleTag);
}

export default AdminDashboard;