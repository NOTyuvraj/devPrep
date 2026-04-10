import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [reviewing, setReviewing] = useState(null);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    api.get("/problems").then(r => setProblems(r.data.problems));
  }, []);

  const submitReview = async (id) => {
    await api.patch(`/problems/${id}/review`, { confidence });
    const { data } = await api.get("/problems");
    setProblems(data.problems);
    setReviewing(null);
    setConfidence(null);
  };

  const s = {
    page: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" },
    body: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
    title: { fontSize: "20px", fontWeight: "bold", marginBottom: "20px" },
    row: { background: "#1e293b", borderRadius: "10px", padding: "16px", marginBottom: "10px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" },
    left: { flex: 1 },
    problemTitle: { fontSize: "14px", fontWeight: "600", color: "#e2e8f0", marginBottom: "4px" },
    meta: { fontSize: "12px", color: "#64748b" },
    badge: (d) => ({ padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "500", marginRight: "6px", background: d === "Easy" ? "#064e3b" : d === "Medium" ? "#451a03" : "#450a0a", color: d === "Easy" ? "#6ee7b7" : d === "Medium" ? "#fcd34d" : "#fca5a5" }),
    reviewBtn: { padding: "6px 14px", background: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    stars: { display: "flex", gap: "6px", marginTop: "12px" },
    star: (active) => ({ width: "32px", height: "32px", borderRadius: "6px", background: active ? "#4f46e5" : "#0f172a", border: `1px solid ${active ? "#6366f1" : "#334155"}`, color: active ? "white" : "#94a3b8", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }),
    saveBtn: { marginTop: "10px", padding: "6px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    nextReview: (date) => {
      const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
      return days <= 0 ? "Due today" : `Due in ${days}d`;
    }
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.body}>
        <div style={s.title}>All Problems ({problems.length})</div>
        {problems.map(p => (
          <div key={p._id} style={s.row}>
            <div style={s.left}>
              <div style={s.problemTitle}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "#e2e8f0", textDecoration: "none" }}>{p.title}</a>
              </div>
              <div style={s.meta}>
                <span style={s.badge(p.difficulty)}>{p.difficulty}</span>
                {p.topic} · Confidence: {p.confidence}/5 · {s.nextReview(p.nextReviewDate)}
              </div>
              {reviewing === p._id && (
                <div>
                  <div style={s.stars}>
                    {[1,2,3,4,5].map(v => (
                      <div key={v} style={s.star(confidence >= v)} onClick={() => setConfidence(v)}>{v}</div>
                    ))}
                  </div>
                  <button style={s.saveBtn} onClick={() => submitReview(p._id)} disabled={!confidence}>Save Review</button>
                </div>
              )}
            </div>
            <button style={s.reviewBtn} onClick={() => setReviewing(reviewing === p._id ? null : p._id)}>
              {reviewing === p._id ? "Cancel" : "Review"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}