import React from "react";
import PageHeader from "../components/PageHeader";
import { Card, StatusBadge } from "../components/UIComponents";
import { useWorkflow } from "../state/WorkflowContext";

export default function ResumeParsing() {
  const { state, setActiveModule } = useWorkflow();
  const { jdResult } = state;

  return (
    <div>
      <PageHeader
        eyebrow="STEP 2 OF 5 · ROLE 2"
        title="Resume Parsing"
        subtitle="Extract skills, education, and work experience from candidate resume documents."
        backAction={() => setActiveModule(null)}
      />

      <Card style={{ maxWidth: "800px", margin: "0 auto 24px", borderTop: "4px solid var(--accent-mod-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-mod-2)", textTransform: "uppercase" }}>
              MODULE PLACEHOLDER · TEAM MEMBER #2
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>
              Under Construction by Teammate #2
            </h2>
          </div>
          <StatusBadge status="under_construction" />
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          This page is owned by <strong>Team Member #2</strong>. It will accept candidate resumes (PDF/DOCX),
          invoke the extraction chain, and hand off extracted resume skills to Role 3 (Profile Builder).
        </p>

        {/* Input Contract Received from Step 1 */}
        <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📥 Input from Step 1 (JD Analytics):
          </h4>
          {jdResult ? (
            <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>
              ✅ <strong>Active JD Loaded:</strong> {jdResult.source_file} ({jdResult.skills?.length || 0} skills)
              {jdResult.company && <span> · Company: <strong>{jdResult.company}</strong></span>}
              {jdResult.role && <span> · Role: <strong>{jdResult.role}</strong></span>}
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              ℹ️ No active JD loaded yet. Complete Step 1 first or proceed independently.
            </div>
          )}
        </div>

        {/* Expected Output Contract */}
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-light)" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📤 Expected Output for Step 3 (Profile Builder):
          </h4>
          <pre style={{ margin: 0, fontSize: "12px", background: "#ffffff", padding: "12px", borderRadius: "6px", overflowX: "auto" }}>
{`{
  "source_type": "resume",
  "source_file": "candidate_cv.pdf",
  "candidate_name": "...",
  "skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Built backend services in Python",
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
