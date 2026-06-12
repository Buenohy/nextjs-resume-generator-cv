export const META_FIELDS = [
  "role_target",
  "subject",
  "category",
  "contributor",
  "coverage",
  "identifier",
  "publisher",
  "relation",
  "rights",
  "source",
  "type",
  "notes",
];

export const PERSONAL_FIELDS = [
  { id: "personal-name", key: "name" },
  { id: "personal-role", key: "role" },
  { id: "personal-location", key: "city" },
  { id: "personal-age", key: "age" },
];

export const LINKS_FIELDS = [
  { id: "links-linkedin", key: "linkedin" },
  { id: "links-phone", key: "phone" },
  { id: "links-websiteName", key: "website" },
  { id: "links-websiteUrl", key: "website_url" },
  { id: "links-email", key: "email" },
  { id: "links-github", key: "github" },
];

// Dictionary used to synchronize parent section collapse state on element scroll spy
export const PARENT_SECTIONS: Record<string, string> = {
  company: "company-info",
  meta: "meta-ats",
  personal: "personal-info",
  links: "links",
  experience: "experience",
  education: "education",
  certification: "certifications",
  languages: "languages",
};
