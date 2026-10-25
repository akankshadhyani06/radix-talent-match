import React from "react";
import PageHeader from "../components/PageHeader";
import { Card, StatusBadge } from "../components/UIComponents";
import { useWorkflow } from "../state/WorkflowContext";

export default function SkillMatching() {
  const { state, setActiveModule } = useWorkflow();
  const { jdResult, profile } = state;

  return (
    <div>
      <PageHeader
        eyebrow="STEP 5 OF 5 · ROLE 5"
        title="Skill Matching"
        subtitle="Compare candidate profile directly against JD requirements to generate match score and skill gaps."
        backAction={() => setActiveModule(null)}
      />

      <Card style={{ maxWidth: "800px", margin: "0 auto 24px", borderTop: "4px solid var(--accent-mod-5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-mod-5)", textTransform: "uppercase" }}>
              MODULE PLACEHOLDER · TEAM MEMBER #5
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>
              Under Construction by Teammate #5
            </h2>
          </div>
          <StatusBadge status="under_construction" />
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          This page is owned by <strong>Team Member #5</strong>. It directly consumes the extracted requirements
          produced by <strong>Role 1 (JD Analytics)</strong> and compares them with the Candidate Profile (Role 3).
        </p>

        {/* Input Contract Received from Role 1 and Role 3 */}
        <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📥 Input from Role 1 (JD Analytics) & Role 3 (Profile):
          </h4>
          <div style={{ fontSize: "13px", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div>
              📄 <strong>JD Requirements (from Role 1): </strong>
              {jdResult ? (
                <span style={{ color: "#15803d", fontWeight: 600 }}>
                  Ready! {jdResult.skills?.length || 0} skills loaded ({jdResult.source_file}, ID: {jdResult.id || "local"})
                </span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  No JD analyzed yet. Complete Step 1 (JD Analytics) to supply requirements.
                </span>
              )}
            </div>
            <div>
              👤 <strong>Candidate Profile (from Role 3): </strong>
              {profile ? (
                <span style={{ color: "#15803d", fontWeight: 600 }}>Ready ({profile.name})</span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>Awaiting profile builder</span>
              )}
            </div>
          </div>
        </div>

        {/* Expected Output Contract */}
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-light)" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📤 Expected Output:
          </h4>
          <pre style={{ margin: 0, fontSize: "12px", background: "#ffffff", padding: "12px", borderRadius: "6px", overflowX: "auto" }}>
{`{
  "jd_source_file": "${jdResult?.source_file || "Google_SWE_JD.pdf"}",
  "match_score": 88,
  "matched_skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Matched: Required in JD and present in Profile",
      "confidence": "high"
    }
  ],
  "missing_skills": [
    {
      "skill_name": "Kubernetes",
      "category_code": "CLOUD",
      "evidence": "Required in JD, missing from Candidate Profile",
      "confidence": "high"
    }
  ]
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
