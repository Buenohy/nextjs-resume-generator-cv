import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
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
          {(info.location || info.age) && (
            <Text style={styles.location}>
              {[info.location, info.age].filter(Boolean).join(" | ")}
            </Text>
          )}

          <View style={styles.contactBar}>
            {info.linkedin && (
              <Link href={info.linkedin_url || ""} style={styles.contactLink}>
                {info.linkedin}
              </Link>
            )}
            {info.phone && (
              <Link href={info.phone_url || ""} style={styles.contactLink}>
                {info.phone}
              </Link>
            )}
            {info.website && (
              <Link href={info.website_url || ""} style={styles.contactLink}>
                {info.website}
              </Link>
            )}
            <Link href={`mailto:${info.email}`} style={styles.contactLink}>
              {info.email}
            </Link>
            {info.github && (
              <Link href={info.github_url || ""} style={styles.contactLink}>
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
            {skills_list.map((skill, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{skill}</Text>
              </View>
            ))}
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
