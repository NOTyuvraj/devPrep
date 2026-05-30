import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [due, setDue] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get("/problems/stats").then(r => setStats(r.data));
    api.get("/problems/due").then(r => setDue(r.data.problems));
  }, []);

  const getInsights = async () => {
    setLoadingInsights(true);
    const { data } = await api.get("/ai/insights");
    setInsights(data.insights);
    setLoadingInsights(false);
  };

  const copyToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const s = {
    page: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" },
    body: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" },
    card: { background: "#1e293b", borderRadius: "12px", padding: "20px", border: "1px solid #334155" },
    cardTitle: { color: "#94a3b8", fontSize: "13px", marginBottom: "8px" },
    cardValue: { color: "#e2e8f0", fontSize: "32px", fontWeight: "bold" },
    sectionTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#e2e8f0" },
    btn: { padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
    insightBox: { background: "#1e293b", borderRadius: "12px", padding: "20px", border: "1px solid #334155", marginTop: "16px", lineHeight: "1.7", fontSize: "14px", color: "#cbd5e1" },
    dueItem: { background: "#1e293b", borderRadius: "8px", padding: "12px 16px", marginBottom: "8px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" },
    badge: (d) => ({ padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "500", background: d === "Easy" ? "#064e3b" : d === "Medium" ? "#451a03" : "#450a0a", color: d === "Easy" ? "#6ee7b7" : d === "Medium" ? "#fcd34d" : "#fca5a5" }),
    tokenCard: { background: "#1e293b", borderRadius: "12px", padding: "20px", border: "1px solid #334155", marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    tokenBtn: { padding: "8px 16px", background: copied ? "#064e3b" : "#334155", color: copied ? "#6ee7b7" : "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.2s", whiteSpace: "nowrap" },
  };

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#6366f1"];

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.body}>
        <div style={s.grid}>
          <div style={s.card}>
            <div style={s.cardTitle}>Total Problems</div>
            <div style={s.cardValue}>{stats?.totalProblems ?? "—"}</div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Due Today</div>
            <div style={{ ...s.cardValue, color: due.length > 0 ? "#f97316" : "#22c55e" }}>{due.length}</div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Weak Topics</div>
            <div style={s.cardValue}>{stats?.weakTopics?.length ?? "—"}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={s.card}>
            <div style={s.sectionTitle}>Weak Topics by Confidence</div>
            {stats?.weakTopics?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.weakTopics}>
                  <XAxis dataKey="topic" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" }} />
                  <Bar dataKey="avgConfidence" radius={[4, 4, 0, 0]}>
                    {stats.weakTopics.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={{ color: "#64748b", fontSize: "13px" }}>No data yet</p>}
          </div>

          <div style={s.card}>
            <div style={s.sectionTitle}>Due for Review</div>
            {due.length === 0
              ? <p style={{ color: "#64748b", fontSize: "13px" }}>Nothing due today 🎉</p>
              : due.slice(0, 5).map(p => (
                <div key={p._id} style={s.dueItem}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", fontSize: "13px" }}>{p.title}</a>
                  <span style={s.badge(p.difficulty)}>{p.difficulty}</span>
                </div>
              ))}
          </div>
        </div>

        <div style={{ ...s.card, marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={s.sectionTitle}>AI Insights</div>
            <button style={s.btn} onClick={getInsights} disabled={loadingInsights}>
              {loadingInsights ? "Analyzing..." : "Get Insights"}
            </button>
          </div>
          {insights
            ? <div style={s.insightBox}>{insights}</div>
            : <p style={{ color: "#64748b", fontSize: "13px" }}>Click "Get Insights" to analyze your weak areas.</p>}
        </div>

      </div>
    </div>
  );
}