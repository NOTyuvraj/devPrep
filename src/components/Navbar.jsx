import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#1e293b", padding: "14px 24px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", borderBottom: "1px solid #334155"
    }}>
      <span style={{ color: "#6366f1", fontWeight: "bold", fontSize: "18px" }}>
        DevPrep 🧠
      </span>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Dashboard</Link>
        <Link to="/problems" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Problems</Link>
        <button onClick={logout} style={{
          background: "transparent", border: "1px solid #334155",
          color: "#94a3b8", padding: "6px 12px", borderRadius: "6px",
          cursor: "pointer", fontSize: "13px"
        }}>Logout</button>
      </div>
    </nav>
  );
}