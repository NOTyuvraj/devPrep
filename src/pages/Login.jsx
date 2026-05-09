import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup ? { name, email, password } : { email, password };
      const { data } = await api.post(endpoint, body);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      background: "#1e293b",
      borderRadius: "12px",
      padding: "32px",
      width: "360px",
      border: "1px solid #334155",
    },
    title: {
      color: "#e2e8f0",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    sub: { color: "#94a3b8", fontSize: "14px", marginBottom: "24px" },
    label: {
      color: "#94a3b8",
      fontSize: "13px",
      marginBottom: "6px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      background: "#0f172a",
      border: "1px solid #334155",
      borderRadius: "8px",
      color: "#e2e8f0",
      fontSize: "14px",
      marginBottom: "16px",
      boxSizing: "border-box",
    },
    btn: {
      width: "100%",
      padding: "12px",
      background: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "16px",
    },
    toggle: {
      color: "#6366f1",
      textAlign: "center",
      fontSize: "13px",
      cursor: "pointer",
    },
    error: {
      background: "#450a0a",
      color: "#fca5a5",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "13px",
      marginBottom: "16px",
    },
    googleBtn: {
      width: "100%",
      padding: "12px",
      background: "#ffffff",
      color: "#111827",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "16px",
    },
    divider: {
      textAlign: "center",
      color: "#64748b",
      marginBottom: "16px",
      fontSize: "13px",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>DevPrep 🧠</div>
        <div style={s.sub}>
          {isSignup ? "Create your account" : "Welcome back"}
        </div>
        {error && <div style={s.error}>{error}</div>}
        {isSignup && (
          <>
            <label style={s.label}>Name</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </>
        )}
        <label style={s.label}>Email</label>
        <input
          style={s.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <label style={s.label}>Password</label>
        <input
          style={s.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <button style={s.btn} onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>
        <div style={s.divider}>OR</div>
        <button
          style={s.googleBtn}
          onClick={() => {
            window.location.href = `${API_URL}/api/auth/google`;
          }}
        >
          Continue with Google
        </button>
        <div style={s.toggle} onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </div>
      </div>
    </div>
  );
}