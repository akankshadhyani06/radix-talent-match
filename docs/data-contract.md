# RADIX Talent Match – Shared Data Contract
**Status:** v1 – proposed, to be locked by the team

This document defines the authoritative, shared JSON data schemas passed across the 5 modules of the RADIX Talent Match platform. All backend endpoints, service interfaces, and frontend shared workflow state MUST adhere strictly to these models to prevent integration breakage.

---

## 1. The 12 RADIX Competency Framework Categories

Every extracted or assessed skill is mapped to exactly one `category_code`. If a skill falls outside these 12 categories, it is mapped to `OTHER`.

| Category Code | Name | Definition & Examples |
|---|---|---|
| `COD` | Coding | Core programming languages & syntax (e.g. Python, Java, C++, TypeScript, Go, Rust, Ruby) |
| `DSA` | Data Structures & Algorithms | Algorithmic complexity, recursion, trees, graphs, heaps, dynamic programming |
| `OOD` | Object-Oriented Design | Design patterns, encapsulation, polymorphism, SOLID principles, class modeling |
| `APTI` | Aptitude & Problem Solving | Analytical thinking, logical reasoning, quantitative analysis, troubleshooting |
| `COMM` | Communication & Collaboration | Written/verbal communication, cross-functional teamwork, leadership, client presentations |
| `AI` | Artificial Intelligence & ML | Machine learning, deep learning, NLP, computer vision, PyTorch, TensorFlow, LLMs, GenAI |
| `CLOUD` | Cloud & DevOps | AWS, GCP, Azure, Docker, Kubernetes, CI/CD pipelines, Terraform, Linux deployment |
| `SQL` | Databases & SQL | Relational databases (PostgreSQL, MySQL, Oracle), NoSQL (MongoDB, Redis), query optimization |
| `SWE` | Software Engineering | Git version control, unit testing (pytest, JUnit), TDD, agile/scrum methodologies, code review |
| `SYSD` | System Design | Distributed systems, microservices, load balancing, caching, scalability, high availability |
| `NETW` | Networking | TCP/IP, HTTP/HTTPS, DNS, WebSockets, REST APIs, gRPC, security protocols |
| `OS` | Operating Systems | Concurrency, threading, memory management, Linux internals, process scheduling |
| `OTHER` | Miscellaneous / Other | Domain-specific tools or business skills outside the core technical categories |

---

## 2. Core Primitives

### Single Skill Model (`SkillItem`)
```json
{
  "skill_name": "PostgreSQL",
  "category_code": "SQL",
  "evidence": "3+ years of experience administering and tuning PostgreSQL clusters",
  "confidence": "high"
}
```

- **`skill_name`** (`string`): Normalized title of the tool, language, or concept.
- **`category_code`** (`enum`): One of `COD`, `DSA`, `OOD`, `APTI`, `COMM`, `AI`, `CLOUD`, `SQL`, `SWE`, `SYSD`, `NETW`, `OS`, `OTHER`.
- **`evidence`** (`string`): Short verbatim quote or direct reason extracted from the source document.
- **`confidence`** (`enum`):
  - `"high"`: Explicitly required / mandatory requirement.
  - `"medium"`: Implied, preferred, or "nice to have".
  - `"low"`: Inferred contextually.

---

## 3. Module Outputs (End-to-End Pipeline)

### Module 1: JD Analytics Output (`JDSkillList`)
*Produced by Role 1 (JD Analytics) → Persisted locally and consumed by Role 5 (Skill Matching)*
```json
{
  "source_type": "jd",
  "source_file": "Google_SWE_JD.pdf",
  "company": "Google",
  "role": "Software Engineer II",
  "skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Proficiency in one or more general-purpose languages including Python",
      "confidence": "high"
    },
    {
      "skill_name": "Distributed Systems",
      "category_code": "SYSD",
      "evidence": "Experience designing and building distributed storage systems",
      "confidence": "high"
    }
  ]
}
```
*Note: Persisted records in `backend/data/jd_results/{id}.json` also include `id` (`UUID string`) and `created_at` (`ISO-8601 string`).*

---

### Module 2: Resume Parsing Output
*Produced by Role 2 (Resume Parsing) → Consumed by Role 3 (Profile Builder)*
Identical shape to the JD output, with `source_type` set to `"resume"`:
```json
{
  "source_type": "resume",
  "source_file": "Candidate_Resume.pdf",
  "candidate_name": "Jane Doe",
  "skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Built backend services using FastAPI and Python at TechCorp",
      "confidence": "high"
    },
    {
      "skill_name": "Kubernetes",
      "category_code": "CLOUD",
      "evidence": "Deployed microservices into AWS EKS Kubernetes clusters",
      "confidence": "high"
    }
  ]
}
```

---

### Module 3: Candidate Profile
*Produced by Role 3 (Profile Builder) → Consumed by Role 4 (Talent Check) & Role 5 (Skill Matching)*
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "education": "B.Tech in Computer Science, 2024",
  "skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Built backend services using FastAPI and Python at TechCorp",
      "confidence": "high"
    }
  ],
  "hackathons": [
    "RADIX Talent Match Hackathon 2026 - Winner"
  ],
  "internships": [
    "Software Engineering Intern at TechCorp (6 months)"
  ],
  "certifications": [
    "AWS Certified Solutions Architect"
  ],
  "preferred_roles": [
    "Backend Engineer",
    "Full-Stack Developer"
  ],
  "cv_file": "Candidate_Resume.pdf"
}
```

---

### Module 4: Talent Check Result
*Produced by Role 4 (Talent Check)*
```json
{
  "company": "Google",
  "readiness_score": 82,
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
      "candidate_level": 5,
      "gap": true
    }
  ]
}
```

- **`company`** (`string`): Target company assessed against.
- **`readiness_score`** (`integer`, 0–100): Overall benchmarked readiness score.
- **`skillset_gap`** (`array`): Benchmark per category code comparing candidate competency (1–10) with company expectation (1–10).

---

### Module 5: Skill Matching Result
*Produced by Role 5 (Skill Matching)*
```json
{
  "jd_source_file": "Google_SWE_JD.pdf",
  "match_score": 85,
  "matched_skills": [
    {
      "skill_name": "Python",
      "category_code": "COD",
      "evidence": "Matched: Required in JD, verified in Candidate Profile",
      "confidence": "high"
    }
  ],
  "missing_skills": [
    {
      "skill_name": "Distributed Systems",
      "category_code": "SYSD",
      "evidence": "Required in JD, not found in Candidate Profile",
      "confidence": "high"
    }
  ]
}
```

- **`match_score`** (`integer`, 0–100): Overlap percentage between JD requirements and Candidate Profile.
- **`matched_skills`** (`array[SkillItem]`): Skills satisfying the JD requirements.
- **`missing_skills`** (`array[SkillItem]`): Gaps requiring candidate upskilling.
