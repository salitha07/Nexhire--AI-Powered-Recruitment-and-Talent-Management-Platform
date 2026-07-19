import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://localhost:7000/api"; // change to your port

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    await axios.put(`${API}/admin/users/${id}/role`, { newRole }, { headers });
    fetchUsers();
  };

  const toggleStatus = async (id, isActive) => {
    await axios.put(`${API}/admin/users/${id}/status`, { isActive: !isActive }, { headers });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API}/admin/users/${id}`, { headers });
    fetchUsers();
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="hiring_manager">Hiring Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{u.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => toggleStatus(u.id, u.isActive)}>
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;