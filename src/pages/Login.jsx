const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
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
      padding: "40px 32px",
      width: "360px",
      border: "1px solid #334155",
      textAlign: "center",
    },
    title: {
      color: "#e2e8f0",
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    sub: {
      color: "#94a3b8",
      fontSize: "14px",
      marginBottom: "8px",
    },
    tagline: {
      color: "#64748b",
      fontSize: "13px",
      marginBottom: "32px",
      lineHeight: "1.5",
    },
    googleBtn: {
      width: "100%",
      padding: "13px",
      background: "#ffffff",
      color: "#111827",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    hint: {
      color: "#475569",
      fontSize: "12px",
      marginTop: "20px",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>DevPrep 🧠</div>
        <div style={s.sub}>Track your DSA prep.</div>
        <div style={s.tagline}>Nail your next interview.</div>

        <button
          style={s.googleBtn}
          onClick={() => {
            window.location.href = `${API_URL}/api/auth/google`;
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={s.hint}>No password needed. Just your Google account.</div>
      </div>
    </div>
  );
}