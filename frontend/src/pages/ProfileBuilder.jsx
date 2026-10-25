import React from "react";
import PageHeader from "../components/PageHeader";
import { Card, StatusBadge } from "../components/UIComponents";
import { useWorkflow } from "../state/WorkflowContext";

export default function ProfileBuilder() {
  const { state, setActiveModule } = useWorkflow();
  const { resumeResult, jdResult } = state;

  return (
    <div>
      <PageHeader
        eyebrow="STEP 3 OF 5 · ROLE 3"
        title="Profile Builder"
        subtitle="Synthesize resume insights and candidate inputs into a structured, unified profile."
        backAction={() => setActiveModule(null)}
      />

      <Card style={{ maxWidth: "800px", margin: "0 auto 24px", borderTop: "4px solid var(--accent-mod-3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-mod-3)", textTransform: "uppercase" }}>
              MODULE PLACEHOLDER · TEAM MEMBER #3
            </span>
            <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>
              Under Construction by Teammate #3
            </h2>
          </div>
          <StatusBadge status="under_construction" />
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          This page is owned by <strong>Team Member #3</strong>. It will combine the parsed resume data with additional
          candidate inputs (hackathons, certifications, internships, preferred roles) into a standardized Candidate Profile.
        </p>

        <div style={{ background: "var(--bg-subtle)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📥 Input from Step 2 (Resume Parsing):
          </h4>
          {resumeResult ? (
            <div style={{ fontSize: "13px", color: "var(--text-primary)" }}>
              ✅ <strong>Resume Skills Available:</strong> {resumeResult.skills?.length || 0} skills
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              ℹ️ Awaiting output from Role 2 (Resume Parsing). Target JD: {jdResult?.company || "Not set"}.
            </div>
          )}
        </div>

        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-light)" }}>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700 }}>
            📤 Expected Output for Step 4 & 5:
          </h4>
          <pre style={{ margin: 0, fontSize: "12px", background: "#ffffff", padding: "12px", borderRadius: "6px", overflowX: "auto" }}>
{`{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "education": "B.Tech Computer Science",
  "skills": [ /* list of SkillItem */ ],
  "hackathons": [],
  "internships": [],
  "certifications": [],
  "preferred_roles": [],
  "cv_file": "candidate_resume.pdf"
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
