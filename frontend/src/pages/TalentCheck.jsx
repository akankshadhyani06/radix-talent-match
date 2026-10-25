import React from "react";
import PageHeader from "../components/PageHeader";
import { Card, StatusBadge } from "../components/UIComponents";
import { useWorkflow } from "../state/WorkflowContext";

export default function TalentCheck() {
  const { state, setActiveModule } = useWorkflow();
  const { profile, selectedCompany, jdResult } = state;

  return (
    <div>
      <PageHeader
        eyebrow="STEP 4 OF 5 · ROLE 4"
        title="Talent Check"
        subtitle="Benchmark candidate readiness against target company expectations across the 12 competency categories."
        backAction={() => setActiveModule(null)}
      />

      <Card style={{ maxWidth: "800px", margin: "0 auto 24px", borderTop: "4px solid var(--accent-mod-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-mod-4)", textTransform: "uppercase" }}>
              MODULE PLACEHOLDER · TEAM MEMBER #4
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>
              Under Construction by Teammate #4
            </h2>
          </div>
          <StatusBadge status="under_construction" />
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          This page is owned by <strong>Team Member #4</strong>. It assesses the candidate against company-level
          benchmarks across the 12 competency dimensions (COD, DSA, OOD, APTI, COMM, AI, CLOUD, SQL, SWE, SYSD, NETW, OS).
        </p>

        <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📥 Input from Pipeline:
          </h4>
          <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>
            <div>🏢 <strong>Target Company:</strong> {selectedCompany || jdResult?.company || "Not selected yet"}</div>
            <div>👤 <strong>Candidate Profile:</strong> {profile ? profile.name : "Awaiting Step 3 output"}</div>
          </div>
        </div>

        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-light)" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📤 Expected Output:
          </h4>
          <pre style={{ margin: 0, fontSize: "12px", background: "#ffffff", padding: "12px", borderRadius: "6px", overflowX: "auto" }}>
{`{
  "company": "${selectedCompany || "Google"}",
  "readiness_score": 85,
  "skillset_gap": [
    {
      "category_code": "COD",
      "required_level": 8,
      "candidate_level": 9,
      "gap": false
    },
    {
      "category_code": "SYSD",
      "required_level": 8,
      "candidate_level": 6,
      "gap": true
    }
  ]
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
