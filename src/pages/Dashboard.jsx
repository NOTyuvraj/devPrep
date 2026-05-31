import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [due, setDue] = useState([]);

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
  };

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#6366f1"];

  const showOnboarding = stats !== null && stats.totalProblems === 0;

  return (
    <div style={s.page}>
      <Navbar />

      {/* Onboarding banner — only shown when user has no problems yet */}
      {showOnboarding && (
        <div style={{
          background: "#0f2744",
          borderBottom: "1px solid #1e3a5f",
          padding: "14px 24px",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "13px", color: "#93c5fd", fontWeight: "600", whiteSpace: "nowrap" }}>
              🚀 Get started in 3 steps
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { num: "1", text: "Install the DevPrep Chrome Extension" },
                { num: "2", text: "Open any LeetCode problem and solve it" },
                { num: "3", text: "Rate your confidence in the extension — it syncs here automatically" },
              ].map(step => (
                <div key={step.num} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "#1e3a5f", color: "#93c5fd",
                    fontSize: "11px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>{step.num}</div>
                  <span style={{ fontSize: "13px", color: "#7db4e6" }}>{step.text}</span>
                </div>
              ))}
            </div>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noreferrer"
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                background: "#4f46e5",
                color: "white",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Install Extension →
            </a>
          </div>
        </div>
      )}

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