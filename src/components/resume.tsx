import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";

export interface Info {
  name: string;
  role?: string;
  location?: string;
  age?: string;
  linkedin_url?: string;
  linkedin?: string;
  phone_url?: string;
  phone?: string;
  website_url?: string;
  website?: string;
  email: string;
  github_url?: string;
  github?: string;
}

export interface Job {
  role: string;
  company: string;
  url?: string;
  date: string;
  details: string[];
  stacks?: string;
}

export interface ResumeProps {
  info: Info;
  meta?: {
    role_target?: string;
    subject?: string;
    keywords?: string;
    publisher?: string;
    contributor?: string;
    rights?: string;
    coverage?: string;
  };
  summary: string;
  summary_ai?: string;
  skills_list: string[];
  experience: Job[];
  education: string[];
  certifications?: string[];
  languages: string[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.3,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontFamily: "Times-Roman",
    color: "#1f2937",
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 2,
    fontFamily: "Helvetica",
  },
  location: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 1,
  },
  age: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 2,
  },
  contactBar: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 4,
    width: "100%",
  },
  contactLink: {
    fontSize: 8.5,
    color: "#10b981",
    textDecoration: "underline",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginTop: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 2,
  },
  paragraph: {
    fontSize: 9,
    textAlign: "justify",
    lineHeight: 1.35,
  },
  italicParagraph: {
    fontSize: 9,
    textAlign: "justify",
    lineHeight: 1.35,
    fontStyle: "italic",
    color: "#4b5563",
  },
  bulletList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingLeft: 10,
  },
  bulletItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 10,
    fontSize: 9,
    color: "#2563eb",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  experienceRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#1f2937",
  },
  experienceCompany: {
    fontSize: 9,
    color: "#10b981",
    textDecoration: "underline",
  },
  experienceDate: {
    fontSize: 8.5,
    color: "#4b5563",
    fontStyle: "italic",
  },
  techStack: {
    fontSize: 8,
    color: "#4b5563",
    fontStyle: "italic",
    marginTop: 2,
  },
});

const Icon = ({ path }: { path: string }) => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Path fill="#10b981" d={path} />
  </Svg>
);

export const Resume: React.FC<ResumeProps> = ({
  info,
  meta = {},
  summary,
  summary_ai,
  skills_list,
  experience,
  education,
  certifications,
  languages,
}) => {
  return (
    <Document
      title={`${meta.role_target || "Resume"} - ${info.name}`}
      author={meta.contributor || info.name}
      subject={meta.subject || ""}
      keywords={meta.keywords || ""}
      creator={meta.publisher || "Next.js ATS Engine"}
      producer="React-PDF Generator"
      language={info.location ? "pt-BR" : "en-US"}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{info.name}</Text>
          {info.role && <Text style={styles.role}>{info.role}</Text>}
          {info.location && (
            <Text style={styles.location}>{info.location}</Text>
          )}
          {info.age && <Text style={styles.age}>{info.age}</Text>}

          <View style={styles.contactBar}>
            {info.linkedin && (
              <Link href={info.linkedin_url || ""} style={styles.contactLink}>
                <Icon path="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                {info.linkedin}
              </Link>
            )}
            {info.phone && (
              <Link href={info.phone_url || ""} style={styles.contactLink}>
                <Icon path="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                {info.phone}
              </Link>
            )}
            {info.website && (
              <Link href={info.website_url || ""} style={styles.contactLink}>
                <Icon path="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.86.64 3.57 1.71 4.94l.89-.9c.7-.7.96-1.09.96-1.54 0-.41-.31-.83-.96-1.5l-1.35-1.34V8l2.5 2.5v2.5l2.5-2.5V8.5l-2-2H9v-2h2v1l3 3 2-2h1.34c.43.95.66 2 .66 3.1 0 1.67-.53 3.23-1.44 4.5l-1.56-1.56c-.25-.26-.64-.26-.9 0-.25.26-.25.64 0 .9l1.64 1.63A7.95 7.95 0 0 0 20 12a8 8 0 0 0-8-8z" />
                {info.website}
              </Link>
            )}
            <Link href={`mailto:${info.email}`} style={styles.contactLink}>
              <Icon path="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              {info.email}
            </Link>
            {info.github && (
              <Link href={info.github_url || ""} style={styles.contactLink}>
                <Icon path="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                {info.github}
              </Link>
            )}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.paragraph}>{summary}</Text>
        </View>

        {summary_ai && (
          <View>
            <Text style={styles.sectionTitle}>AI Summary</Text>
            <Text style={styles.italicParagraph}>{summary_ai}</Text>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{skills_list.join(" | ")}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience.map((job, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceRole}>{job.role}</Text>
                {job.url ? (
                  <Link href={job.url} style={styles.experienceCompany}>
                    {job.company}
                  </Link>
                ) : (
                  <Text style={styles.experienceCompany}>{job.company}</Text>
                )}
                <Text style={styles.experienceDate}>{job.date}</Text>
              </View>

              <View style={styles.bulletList}>
                {job.details.map((detail, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{detail}</Text>
                  </View>
                ))}
              </View>

              {job.stacks && (
                <Text style={styles.techStack}>Tech Stack: {job.stacks}</Text>
              )}
            </View>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.bulletList}>
            {education.map((edu, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{edu}</Text>
              </View>
            ))}
          </View>
        </View>

        {certifications && certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.bulletList}>
              {certifications.map((cer, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{cer}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{languages.join(" | ")}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
