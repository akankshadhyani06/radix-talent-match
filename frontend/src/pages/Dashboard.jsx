const descriptions = {
  "JD Analytics": "Explore the requirements described in a job posting.",
  "Resume Parsing": "Turn candidate-provided resume information into structured data.",
  "Profile Builder": "Create or update a candidate profile with additional inputs.",
  "Talent Check": "Review readiness against approved company expectations.",
  "Skill Matching": "Compare a candidate profile with a specific job description.",
};

export default function Dashboard({ modules, onSelectModule }) {
  return (
    <section aria-labelledby="dashboard-title">
      <p className="eyebrow">Candidate readiness, made clearer</p>
      <h1 id="dashboard-title">Understand your fit. Plan your next step.</h1>
      <p className="intro-copy">
        RADIX Talent Match will bring job requirements and candidate skills
        together to help candidates understand readiness for a role.
      </p>

      <h2 className="section-heading">Explore the workspace</h2>
      <div className="module-grid">
        {modules.map(({ id, name }, index) => (
          <button
            className="module-card"
            key={id}
            onClick={() => onSelectModule(id)}
            aria-label={`Open ${name}`}
          >
            <span className="module-number">0{index + 1}</span>
            <h2>{name}</h2>
            <p>{descriptions[name]}</p>
          </button>
        ))}
      </div>
      <p className="workflow-note">
        Planned workflow: Job Description → Resume Parsing → Candidate Profile
        → Talent Check → Skill Matching
      </p>
    </section>
  );
}
