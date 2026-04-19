import React from "react";
import { RefObject } from "react";

const FONT = "'Times New Roman', Times, serif";

interface Item {
  id: number;
  org: string;
  date: string;
  desc: string;
  link?: string;
}

interface Section {
  id: number;
  title: string;
  items: Item[];
  isProject?: boolean;
}

interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  sections: Section[];
}

interface Props {
  data: ResumeData;
  photo: string | null;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function StandardCV({ data, photo, previewRef }: Props) {
  const socialLinks = [
    data.linkedin && { label: "LinkedIn", url: data.linkedin },
    data.github && { label: "GitHub", url: data.github },
    data.portfolio && { label: "Portfolio", url: data.portfolio },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <div
      ref={previewRef}
      id="resume-preview"
      style={{
        width: "210mm",
        backgroundColor: "#ffffff",
        padding: "15mm 18mm",
        fontFamily: FONT,
        color: "#000000",
        boxSizing: "border-box",
        lineHeight: 1.4,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: photo ? "space-between" : "center",
          alignItems: "flex-start",
          borderBottom: "2px solid #000",
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
          {/* Name */}
          <h1
            style={{
              fontSize: "26pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              lineHeight: 1.1,
              margin: "0 0 5px 0",
              color: "#000",
              fontFamily: FONT,
            }}
          >
            {data.full_name || "YOUR NAME"}
          </h1>

          {/* Contact line */}
          <div
            style={{
              fontSize: "10pt",
              color: "#222",
              lineHeight: 1.7,
              fontFamily: FONT,
            }}
          >
            {[data.email, data.phone, data.location]
              .filter(Boolean)
              .join("  |  ")}
          </div>

          {/* Social links row */}
          {socialLinks.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: photo ? "flex-start" : "center",
                flexWrap: "wrap",
                gap: "14px",
                marginTop: "4px",
              }}
            >
              {socialLinks.map(({ label, url }) => (
                <span
                  key={label}
                  style={{
                    fontSize: "9.5pt",
                    color: "#1a56db",
                    fontFamily: FONT,
                  }}
                >
                  <span style={{ color: "#444", fontWeight: "bold" }}>
                    {label}:
                  </span>{" "}
                  {url}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photo */}
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

      {/* ── SUMMARY ── */}
      {data.summary && (
        <CVSection title="Professional Profile">
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: 1.65,
              textAlign: "justify",
              color: "#000",
              margin: 0,
              fontFamily: FONT,
            }}
          >
            {data.summary}
          </p>
        </CVSection>
      )}

      {/* ── DYNAMIC SECTIONS ── */}
      {data.sections.map((sec) => (
        <CVSection key={sec.id} title={sec.title}>
          {sec.items.map((item, idx) => (
            <div key={item.id} style={{ marginTop: idx === 0 ? 0 : "10px" }}>
              {(item.org || item.date) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "10.5pt",
                    fontWeight: "bold",
                    color: "#000",
                    fontFamily: FONT,
                    marginBottom: "2px",
                  }}
                >
                  <span>{item.org}</span>
                  <span style={{ fontWeight: "normal", color: "#333" }}>
                    {item.date}
                  </span>
                </div>
              )}

              {/* Project link */}
              {item.link && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#1a56db",
                    fontFamily: FONT,
                    marginBottom: "3px",
                  }}
                >
                  🔗 {item.link}
                </div>
              )}

              {item.desc && (
                <ul
                  style={{
                    margin: "3px 0 0 20px",
                    padding: 0,
                    listStyleType: "disc",
                  }}
                >
                  {item.desc
                    .split("\n")
                    .filter((b) => b.trim())
                    .map((bullet, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "10pt",
                          lineHeight: 1.55,
                          color: "#000",
                          marginBottom: "2px",
                          fontFamily: FONT,
                        }}
                      >
                        {bullet.trim()}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </CVSection>
      ))}
    </div>
  );
}

function CVSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <h2
          style={{
            fontSize: "11pt",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
            padding: 0,
            color: "#000",
            fontFamily: "'Times New Roman', Times, serif",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "#000",
            minWidth: 0,
          }}
        />
      </div>
      {children}
    </div>
  );
}
