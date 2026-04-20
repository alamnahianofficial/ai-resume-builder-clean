import React from "react";

const F = "'Times New Roman', Times, serif";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface EduEntry {
  id: number;
  institution: string;
  degree: string;
  cgpa: string;
  duration: string;
}
export interface ExpEntry {
  id: number;
  role: string;
  org: string;
  duration: string;
  desc: string;
}
export interface ProjectEntry {
  id: number;
  name: string;
  link: string;
  duration: string;
  desc: string;
}
export interface SkillEntry {
  id: number;
  category: string;
  skills: string;
}
export interface CertEntry {
  id: number;
  name: string;
  issuer: string;
  date: string;
}
export interface ExtraEntry {
  id: number;
  label: string;
  value: string;
}
export interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: EduEntry[];
  experience: ExpEntry[];
  projects: ProjectEntry[];
  skills: SkillEntry[];
  certifications: CertEntry[];
  extras: ExtraEntry[];
}

interface Props {
  data: ResumeData;
  photo: string | null;
  previewRef: React.RefObject<HTMLDivElement>;
}

// ─── SHARED SUB-COMPONENTS ────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "7px",
      }}
    >
      <h2
        style={{
          fontFamily: F,
          fontSize: "11pt",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          margin: 0,
          padding: 0,
          color: "#000",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: "1.5px",
          backgroundColor: "#000",
          minWidth: 0,
        }}
      />
    </div>
  );
}

function BoldDate({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span
      style={{
        fontFamily: F,
        fontSize: "10pt",
        fontWeight: "bold",
        color: "#000",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {text}
    </span>
  );
}

function Bullets({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul style={{ margin: "3px 0 0 18px", padding: 0, listStyleType: "disc" }}>
      {lines.map((line, i) => (
        <li
          key={i}
          style={{
            fontFamily: F,
            fontSize: "10pt",
            lineHeight: 1.55,
            color: "#000",
            marginBottom: "2px",
          }}
        >
          {line}
        </li>
      ))}
    </ul>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function StandardCV({ data, photo, previewRef }: Props) {
  const contacts = [data.email, data.phone, data.location].filter(Boolean);
  const socials = [
    data.linkedin && { label: "LinkedIn", url: data.linkedin },
    data.github && { label: "GitHub", url: data.github },
    data.portfolio && { label: "Portfolio", url: data.portfolio },
  ].filter(Boolean) as { label: string; url: string }[];

  const hasEdu = data.education.some((e) => e.institution || e.degree);
  const hasExp = data.experience.some((e) => e.role || e.org);
  const hasProj = data.projects.some((p) => p.name);
  const hasSkill = data.skills.some((s) => s.skills);
  const hasCert = data.certifications.some((c) => c.name);
  const hasExtra = data.extras.some((e) => e.label && e.value);

  return (
    <div
      ref={previewRef}
      id="resume-preview"
      style={{
        width: "210mm",
        backgroundColor: "#fff",
        fontFamily: F,
        color: "#000",
        boxSizing: "border-box",
        lineHeight: 1.45,
        padding: "14mm 18mm 16mm 18mm",
      }}
    >
      {/* ══ HEADER ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          justifyContent: photo ? "space-between" : "center",
          alignItems: "flex-start",
          borderBottom: "2.5px solid #000",
          paddingBottom: "12px",
          marginBottom: "14px",
          gap: "14px",
        }}
      >
        <div
          style={{
            flex: photo ? 1 : undefined,
            textAlign: photo ? "left" : "center",
          }}
        >
          <h1
            style={{
              fontFamily: F,
              fontSize: "26pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              lineHeight: 1.05,
              margin: "0 0 5px 0",
              color: "#000",
            }}
          >
            {data.full_name || "YOUR NAME"}
          </h1>

          {contacts.length > 0 && (
            <div
              style={{
                fontFamily: F,
                fontSize: "10pt",
                color: "#222",
                lineHeight: 1.7,
              }}
            >
              {contacts.join("  |  ")}
            </div>
          )}

          {socials.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "4px",
                justifyContent: photo ? "flex-start" : "center",
              }}
            >
              {socials.map(({ label, url }) => (
                <span
                  key={label}
                  style={{ fontFamily: F, fontSize: "9.5pt", color: "#000" }}
                >
                  <span style={{ fontWeight: "bold" }}>{label}:</span>{" "}
                  <span style={{ color: "#1a56db" }}>{url}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {photo && (
          <div
            style={{
              width: "100px",
              height: "126px",
              flexShrink: 0,
              border: "1.5px solid #000",
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={photo}
              alt="Profile"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>
        )}
      </div>

      {/* ══ PROFESSIONAL PROFILE ════════════════════════════════════════════════ */}
      {data.summary && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Professional Profile" />
          <p
            style={{
              fontFamily: F,
              fontSize: "10.5pt",
              lineHeight: 1.65,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* ══ EDUCATION ═══════════════════════════════════════════════════════════ */}
      {hasEdu && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Education" />
          {data.education
            .filter((e) => e.institution || e.degree)
            .map((edu, idx) => (
              <div key={edu.id} style={{ marginTop: idx === 0 ? 0 : "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {edu.institution}
                  </span>
                  <BoldDate text={edu.duration} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: "10pt",
                      color: "#222",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.degree}
                  </span>
                  {edu.cgpa && (
                    <span
                      style={{ fontFamily: F, fontSize: "10pt", color: "#333" }}
                    >
                      CGPA:{" "}
                      <span style={{ fontWeight: "bold" }}>{edu.cgpa}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ══ WORK EXPERIENCE ═════════════════════════════════════════════════════ */}
      {hasExp && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Work Experience" />
          {data.experience
            .filter((e) => e.role || e.org)
            .map((exp, idx) => (
              <div key={exp.id} style={{ marginTop: idx === 0 ? 0 : "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {exp.role}
                  </span>
                  <BoldDate text={exp.duration} />
                </div>
                {exp.org && (
                  <div
                    style={{
                      fontFamily: F,
                      fontSize: "10pt",
                      color: "#333",
                      marginBottom: "2px",
                    }}
                  >
                    {exp.org}
                  </div>
                )}
                <Bullets text={exp.desc} />
              </div>
            ))}
        </div>
      )}

      {/* ══ PROJECTS / THESIS ═══════════════════════════════════════════════════ */}
      {hasProj && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Projects / Thesis" />
          {data.projects
            .filter((p) => p.name)
            .map((proj, idx) => (
              <div key={proj.id} style={{ marginTop: idx === 0 ? 0 : "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {proj.name}
                  </span>
                  <BoldDate text={proj.duration} />
                </div>
                {proj.link && (
                  <div
                    style={{
                      fontFamily: F,
                      fontSize: "9.5pt",
                      color: "#1a56db",
                      marginBottom: "2px",
                    }}
                  >
                    🔗 {proj.link}
                  </div>
                )}
                <Bullets text={proj.desc} />
              </div>
            ))}
        </div>
      )}

      {/* ══ SKILLS ══════════════════════════════════════════════════════════════ */}
      {hasSkill && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Skills" />
          {data.skills
            .filter((s) => s.skills)
            .map((row) => (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "3px",
                  fontFamily: F,
                  fontSize: "10pt",
                  color: "#000",
                }}
              >
                {row.category && (
                  <span
                    style={{
                      fontWeight: "bold",
                      flexShrink: 0,
                      minWidth: "120px",
                    }}
                  >
                    {row.category}:
                  </span>
                )}
                <span>{row.skills}</span>
              </div>
            ))}
        </div>
      )}

      {/* ══ CERTIFICATIONS ══════════════════════════════════════════════════════ */}
      {hasCert && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Certifications" />
          {data.certifications
            .filter((c) => c.name)
            .map((cert, idx) => (
              <div
                key={cert.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginTop: idx === 0 ? 0 : "5px",
                }}
              >
                <span
                  style={{ fontFamily: F, fontSize: "10pt", color: "#000" }}
                >
                  {cert.name}
                  {cert.issuer ? (
                    <span style={{ color: "#444", fontStyle: "italic" }}>
                      {" "}
                      — {cert.issuer}
                    </span>
                  ) : (
                    ""
                  )}
                </span>
                <BoldDate text={cert.date} />
              </div>
            ))}
        </div>
      )}

      {/* ══ ADDITIONAL INFORMATION ══════════════════════════════════════════════ */}
      {hasExtra && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle title="Additional Information" />
          {data.extras
            .filter((e) => e.label && e.value)
            .map((row) => (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "3px",
                  fontFamily: F,
                  fontSize: "10pt",
                  color: "#000",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    flexShrink: 0,
                    minWidth: "140px",
                  }}
                >
                  {row.label}:
                </span>
                <span>{row.value}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
