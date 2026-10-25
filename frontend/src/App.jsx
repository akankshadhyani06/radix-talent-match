import { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import JDAnalytics from "./pages/JDAnalytics.jsx";
import ResumeParsing from "./pages/ResumeParsing.jsx";
import ProfileBuilder from "./pages/ProfileBuilder.jsx";
import TalentCheck from "./pages/TalentCheck.jsx";
import SkillMatching from "./pages/SkillMatching.jsx";

const modules = [
  { id: "jd-analytics", name: "JD Analytics", Page: JDAnalytics },
  { id: "resume-parsing", name: "Resume Parsing", Page: ResumeParsing },
  { id: "profile-builder", name: "Profile Builder", Page: ProfileBuilder },
  { id: "talent-check", name: "Talent Check", Page: TalentCheck },
  { id: "skill-matching", name: "Skill Matching", Page: SkillMatching },
];

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const ActivePage = modules.find((module) => module.id === activeModule)?.Page;

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          className="brand"
          href="#dashboard"
          onClick={() => setActiveModule(null)}
          aria-label="RADIX Talent Match dashboard"
        >
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>RADIX <strong>Talent Match</strong></span>
        </a>
        <span className="header-note">Candidate readiness workspace</span>
      </header>

      <main className="main-content">
        {ActivePage ? (
          <>
            <button className="back-link" onClick={() => setActiveModule(null)}>
              ← Back to dashboard
            </button>
            <ActivePage />
          </>
        ) : (
          <Dashboard modules={modules} onSelectModule={setActiveModule} />
        )}
      </main>

      <footer className="site-footer">
        Initial scaffold · Module functionality is planned, not implemented
      </footer>
    </div>
  );
}
