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
  Rect,
  Circle,
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

export interface ResumeTranslations {
  professionalSummary: string;
  ai: string;
  skills: string;
  experience: string;
  stacks: string;
  education: string;
  certifications: string;
  languages: string;
}

export interface ResumeProps {
  locale?: string;
  info: Info;
  company?: string;
  meta?: {
    role_target?: string;
    subject?: string;
    keywords?: string | string[];
    publisher?: string;
    contributor?: string;
    rights?: string;
    coverage?: string;
  };
  summary: string;
  ai?: string;
  skills_list: string[];
  experience: Job[];
  education: string[];
  certifications?: string[];
  languages: string[];
  translations: ResumeTranslations;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.3,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontFamily: "Times-Roman",
    color: "#1f2937",
    marginBottom: 4,
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
  age: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 2,
  },
  contactBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    width: "100%",
  },
  contactGroupLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  contactGroupCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 80,
    justifyContent: "center",
  },
  contactGroupRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-start",
  },
  contactLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textDecoration: "none",
  },
  linkText: {
    fontSize: 8.5,
    color: "#10b981",
    textDecoration: "underline",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginTop: 2,
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
    marginBottom: 2,
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
    flex: 1,
    textAlign: "left",
  },
  experienceCompany: {
    fontSize: 9,
    color: "#10b981",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  experienceCompanyFallback: {
    fontSize: 9,
    color: "#10b981",
    flex: 1,
    textAlign: "center",
  },
  experienceDate: {
    fontSize: 8.5,
    color: "#4b5563",
    fontStyle: "italic",
    flex: 1,
    textAlign: "right",
  },
  techStack: {
    fontSize: 8,
    color: "#4b5563",
    fontStyle: "italic",
    marginTop: 2,
  },
});

// ICON CONSTANTS (Standardized size 9x9)

const LinkedinIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Path
      fill="#10b981"
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Path
      fill="#10b981"
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
    />
  </Svg>
);

const WebsiteIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="#10b981"
      strokeWidth="1.5"
    />
    <Path
      fill="none"
      stroke="#10b981"
      strokeWidth="1.2"
      d="M12 2a5 10 0 0 0 0 20 5 10 0 0 0 0-20z"
    />
    <Path fill="none" stroke="#10b981" strokeWidth="1.2" d="M12 2v20" />
    <Path fill="none" stroke="#10b981" strokeWidth="1.2" d="M2 12h20" />
    <Path
      fill="none"
      stroke="#10b981"
      strokeWidth="1.2"
      d="M3.8 7a18 18 0 0 1 16.4 0M3.8 17a18 18 0 0 0 16.4 0"
    />
  </Svg>
);

const EmailIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Path
      fill="#10b981"
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
    />
  </Svg>
);

const GithubIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 9, height: 9, marginRight: 3, alignSelf: "center" }}
  >
    <Path
      fill="#10b981"
      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12a10 10 0 0 0-12-10z"
    />
  </Svg>
);

const ExternalLinkIcon = ({ isTrailing = false }: { isTrailing?: boolean }) => (
  <Svg
    viewBox="0 0 24 24"
    style={{
      width: 9,
      height: 9,
      marginLeft: isTrailing ? 2 : 3,
      alignSelf: "center",
    }}
  >
    <Path
      fill="#10b981"
      d="M14 3v2h3.59L7.76 14.83l1.41 1.41L19 6.41V10h2V3M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"
    />
  </Svg>
);

export const Resume: React.FC<ResumeProps> = ({
  locale = "en",
  info,
  company,
  meta = {},
  summary,
  ai,
  skills_list,
  experience,
  education,
  certifications,
  languages,
  translations,
}) => {
  /* 
    LOCALE CONVERSION
    Dynamically maps 'pt' or 'en' site locales to specific standard PDF ISO language tags.
  */
  const pdfLanguage = locale === "pt" ? "pt-BR" : "en-US";

  /* 
    KEYWORDS FORMATTER
    Flattens keywords array into a standard comma-separated string for PDF metadata indexing.
  */
  const keywordsStr = Array.isArray(meta.keywords)
    ? meta.keywords.join(", ")
    : meta.keywords || "";

  // Document title dynamically including the company name
  const documentTitle = `${meta.role_target || "Resume"} - ${info.name}${company ? ` - ${company}` : ""}`;

  return (
    <Document
      title={documentTitle}
      author={meta.contributor || info.name}
      subject={meta.subject || ""}
      keywords={keywordsStr}
      creator={meta.publisher || "Next.js ATS Engine"}
      producer="React-PDF Generator"
      language={pdfLanguage}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* Header Section */}
          <Text style={styles.name}>{info.name}</Text>
          {info.role && <Text style={styles.role}>{info.role}</Text>}
          {info.location && (
            <Text style={styles.location}>{info.location}</Text>
          )}
          {info.age && <Text style={styles.age}>{info.age}</Text>}

          {/* Links Section */}
          <View style={styles.contactBar}>
            <View style={styles.contactGroupLeft}>
              {info.linkedin && (
                <Link href={info.linkedin_url || ""} style={styles.contactLink}>
                  <LinkedinIcon />
                  <Text style={styles.linkText}>{info.linkedin}</Text>
                  <ExternalLinkIcon isTrailing={true} />
                </Link>
              )}
              {info.phone && (
                <Link href={info.phone_url || ""} style={styles.contactLink}>
                  <PhoneIcon />
                  <Text style={styles.linkText}>{info.phone}</Text>
                  <ExternalLinkIcon isTrailing={true} />
                </Link>
              )}
            </View>
            <View style={styles.contactGroupCenter}>
              {info.website && (
                <Link href={info.website_url || ""} style={styles.contactLink}>
                  <WebsiteIcon />
                  <Text style={styles.linkText}>{info.website}</Text>
                  <ExternalLinkIcon isTrailing={true} />
                </Link>
              )}
            </View>
            <View style={styles.contactGroupRight}>
              <Link href={`mailto:${info.email}`} style={styles.contactLink}>
                <EmailIcon />
                <Text style={styles.linkText}>{info.email}</Text>
                <ExternalLinkIcon isTrailing={true} />
              </Link>
              {info.github && (
                <Link href={info.github_url || ""} style={styles.contactLink}>
                  <GithubIcon />
                  <Text style={styles.linkText}>{info.github}</Text>
                  <ExternalLinkIcon isTrailing={true} />
                </Link>
              )}
            </View>
          </View>
        </View>

        {/* Professional Summary Section */}
        <View>
          <Text style={styles.sectionTitle}>
            {translations.professionalSummary}
          </Text>
          <Text style={styles.paragraph}>{summary}</Text>
        </View>

        {/* Ai Section */}
        {ai && (
          <View>
            <Text style={styles.sectionTitle}>{translations.ai}</Text>
            <Text style={styles.paragraph}>{ai}</Text>
          </View>
        )}

        {/* Skills Section */}
        <View>
          <Text style={styles.sectionTitle}>{translations.skills}</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{skills_list.join(" | ")}</Text>
            </View>
          </View>
        </View>

        {/* Experience Section */}
        <View>
          <Text style={styles.sectionTitle}>{translations.experience}</Text>
          {experience.map((job, index) => (
            <View key={index} style={styles.experienceItem}>
              {/* Experience Section Header */}
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceRole}>{job.role}</Text>
                {job.url ? (
                  <Link href={job.url} style={styles.experienceCompany}>
                    <Text style={{ textDecoration: "underline" }}>
                      {job.company}
                    </Text>
                    <ExternalLinkIcon />
                  </Link>
                ) : (
                  <Text style={styles.experienceCompanyFallback}>
                    {job.company}
                  </Text>
                )}
                <Text style={styles.experienceDate}>{job.date}</Text>
              </View>

              {/* Experience Section Details */}
              <View style={styles.bulletList}>
                {job.details.map((detail, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{detail}</Text>
                  </View>
                ))}
              </View>

              {/* Experience Section Stacks */}
              {job.stacks && (
                <Text style={styles.techStack}>
                  {translations.stacks}: {job.stacks}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Education Section */}
        <View>
          <Text style={styles.sectionTitle}>{translations.education}</Text>
          <View style={styles.bulletList}>
            {education.map((edu, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{edu}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>
              {translations.certifications}
            </Text>
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

        {/* Languages Section */}
        <View>
          <Text style={styles.sectionTitle}>{translations.languages}</Text>
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
