// OCF TypeScript types — derived from the JSON Schema
// These are the working types for the editor, not a 1:1 mirror of the schema.

export interface PartialDate {
  year?: number;
  month?: number;
  day?: number;
  present?: true;
}

export interface DateRange {
  start: PartialDate;
  end?: PartialDate;
  dateIsPrivate?: boolean;
}

export type Visibility = "public" | "shared" | "private";

export interface Location {
  city?: string;
  region?: string;
  country?: string;
  remote?: boolean;
}

export interface Contact {
  kind: "email" | "phone" | "url" | "linkedin" | "github" | "social" | "other";
  value: string;
  label?: string;
  primary?: boolean;
}

export interface Link {
  url: string;
  label?: string;
  kind?: "press" | "talk" | "code" | "artifact" | "publication" | "internal" | "social" | "other";
}

export interface Metric {
  kind: string;
  value?: number;
  from?: number;
  to?: number;
  unit?: string;
  period?: string;
  note?: string;
}

export interface Achievement {
  id?: string;
  statement: string;
  shortStatement?: string;
  longform?: string;
  kind?: "accomplishment" | "responsibility" | "project" | "recognition" | "other";
  metrics?: Metric[];
  skills?: string[];
  links?: Link[];
  importance?: number;
  audiences?: string[];
  dateRange?: DateRange;
  visibility?: Visibility;
}

export interface Competency {
  label: string;
  description?: string;
  category?: "leadership" | "domain" | "technical" | "process" | "other";
  visibility?: Visibility;
}

export interface OccupationalCode {
  system?: string;
  code?: string;
  title?: string;
}

export interface Position {
  id?: string;
  title: string;
  seniority?: string;
  grade?: string;
  occupationalCode?: OccupationalCode;
  employmentType?: string;
  placedAt?: string;
  workArrangement?: "onsite" | "hybrid" | "remote";
  workArrangementDetail?: string;
  dateRange: DateRange;
  locations?: Location[];
  summary?: string;
  achievements?: Achievement[];
  deployments?: Deployment[];
  fundedBy?: string;
  hoursPerWeek?: number;
  supervisor?: Supervisor;
  compensation?: Compensation;
  techStack?: string[];
  competencies?: Competency[];
  projects?: NestedProject[];
  patents?: Patent[];
  importance?: number;
  audiences?: string[];
}

export interface Deployment {
  name?: string;
  location?: Location;
  dateRange?: DateRange;
  description?: string;
  combat?: boolean;
  visibility?: Visibility;
}

export interface Supervisor {
  name?: string;
  title?: string;
  contact?: Contact;
  mayContact?: boolean;
  visibility?: Visibility;
}

export interface Compensation {
  amount?: number;
  currency?: string;
  period?: string;
  note?: string;
  visibility?: Visibility;
}

export interface NestedProject {
  name: string;
  role?: string;
  client?: string;
  dateRange?: DateRange;
  description?: string;
  category?: string;
  scale?: string;
  renderAs?: string;
  achievements?: Achievement[];
  funding?: Funding[];
  links?: Link[];
  importance?: number;
  audiences?: string[];
  visibility?: Visibility;
}

export interface ExperienceEntry {
  id?: string;
  kind?: string;
  name: string;
  url?: string;
  industry?: string;
  branch?: string;
  serviceType?: string;
  discharge?: {
    type?: string;
    date?: PartialDate;
    repiCode?: string;
    separationDocument?: string;
    visibility?: Visibility;
  };
  importance?: number;
  audiences?: string[];
  contextAtTime?: {
    stage?: string;
    sizeAtJoin?: number;
    sizeAtExit?: number;
    productLine?: string;
  };
  lineage?: {
    event: string;
    counterparty?: string;
    date?: PartialDate;
  }[];
  description?: string;
  dateRange?: DateRange;
  locations?: Location[];
  positions?: Position[];
  spanning?: Achievement[];
  progression?: {
    finalTitle?: string;
    promotionCount?: number;
    note?: string;
  };
  exitContext?: {
    reason?: string;
    statement?: string;
    longform?: string;
    visibility?: Visibility;
  };
  notes?: string;
  notesVisibility?: Visibility;
}

export interface Skill {
  name: string;
  category?: string;
  proficiency?: "learning" | "working" | "proficient" | "expert";
  dateRange?: DateRange;
  aliases?: string[];
  importance?: number;
  audiences?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  location?: Location;
  kind?: string;
  degree?: string;
  field?: string;
  minor?: string;
  thesis?: string;
  dateRange?: DateRange;
  status?: "completed" | "in-progress" | "incomplete" | "audited";
  gpa?: number;
  gpaScale?: number;
  honors?: string[];
  notableCourses?: string[];
  achievements?: Achievement[];
  links?: Link[];
  importance?: number;
  audiences?: string[];
}

export interface Certification {
  id?: string;
  type?: string;
  name: string;
  issuer?: string;
  jurisdiction?: string;
  family?: string;
  level?: string;
  dateRange?: DateRange;
  credentialId?: {
    number?: string;
    label?: string;
    visibility?: Visibility;
  };
  url?: string;
  status?: "active" | "expired" | "lapsed" | "in-progress" | "revoked";
  expectedCompletion?: PartialDate;
  renewals?: { date?: PartialDate; validUntil?: PartialDate }[];
  continuingEducation?: {
    required?: number;
    completed?: number;
    unit?: string;
    cycle?: string;
  };
  supersedes?: string;
  importance?: number;
  audiences?: string[];
}

export interface Funding {
  grantor?: string;
  grantNumber?: string;
  grantId?: string;
  title?: string;
  amount?: number;
  currency?: string;
  role?: string;
  dateRange?: DateRange;
  status?: string;
  visibility?: Visibility;
}

export interface Patent {
  title?: string;
  number?: string;
  status?: "filed" | "pending" | "granted" | "expired";
  date?: PartialDate;
  inventors?: string[];
  url?: string;
  importance?: number;
  audiences?: string[];
}

export interface Publication {
  title: string;
  kind?: string;
  venue?: string;
  publisher?: string;
  date?: PartialDate;
  url?: string;
  identifier?: string;
  authors?: string[];
  role?: string;
  edition?: string;
  series?: string;
  genre?: string;
  abstract?: string;
  peerReviewed?: boolean;
  citations?: number;
  production?: {
    produced?: boolean;
    productionCompany?: string;
    releaseDate?: PartialDate;
    network?: string;
    imdbUrl?: string;
  };
  links?: Link[];
  importance?: number;
  audiences?: string[];
  visibility?: Visibility;
}

export interface Governance {
  id?: string;
  organization: string;
  url?: string;
  role: string;
  roleTitle?: string;
  committees?: string[];
  dateRange?: DateRange;
  compensated?: boolean;
  equity?: boolean;
  context?: string;
  achievements?: Achievement[];
  importance?: number;
  audiences?: string[];
}

export interface Teaching {
  id?: string;
  institution?: string;
  role?: string;
  subject: string;
  courseId?: string;
  dateRange?: DateRange;
  recurring?: boolean;
  audience?: string;
  achievements?: Achievement[];
  links?: Link[];
  importance?: number;
  audiences?: string[];
}

export interface Speaking {
  id?: string;
  title: string;
  event?: string;
  kind?: string;
  date?: PartialDate;
  location?: Location;
  abstract?: string;
  links?: Link[];
  importance?: number;
  audiences?: string[];
}

export interface Membership {
  id?: string;
  organization: string;
  role?: string;
  dateRange?: DateRange;
  achievements?: Achievement[];
  importance?: number;
  audiences?: string[];
}

export interface Service {
  id?: string;
  organization: string;
  role?: string;
  kind?: string;
  dateRange?: DateRange;
  description?: string;
  achievements?: Achievement[];
  importance?: number;
  audiences?: string[];
  visibility?: Visibility;
}

export interface Reference {
  name: string;
  relationship?: string;
  organization?: string;
  title?: string;
  contact?: Contact;
  strengths?: string[];
  lastContactDate?: PartialDate;
  notes?: string;
  visibility?: Visibility;
}

export interface Interest {
  name?: string;
  description?: string;
  current?: boolean;
}

export interface Language {
  language: string;
  bcp47?: string;
  proficiency?: string;
  speaking?: string;
  reading?: string;
  writing?: string;
  native?: boolean;
  dialect?: string;
  context?: string[];
  certifications?: {
    name?: string;
    score?: string;
    date?: PartialDate;
    issuer?: string;
  }[];
}

export interface Award {
  title?: string;
  awarder?: string;
  date?: PartialDate;
  description?: string;
  importance?: number;
  audiences?: string[];
}

export interface PersonName {
  renderAs: string;
  legalName?: string;
  legalNameVisibility?: Visibility;
  nativeScript?: string;
  given?: string;
  family?: string;
  familyFirst?: boolean;
  preferred?: string;
  pronouns?: string;
  otherNames?: {
    name: string;
    kind: string;
    visibility?: Visibility;
  }[];
}

export interface Clearance {
  name: string;
  type?: string;
  level?: string;
  issuedBy?: string;
  status?: "active" | "inactive" | "expired" | "revoked";
  dateRange?: DateRange;
  polygraph?: "none" | "ci" | "full-scope";
  visibility?: Visibility;
}

export interface Person {
  name: PersonName;
  headline?: string;
  summary?: string;
  photo?: string;
  photoVisibility?: Visibility;
  dateOfBirth?: PartialDate;
  dateOfBirthVisibility?: Visibility;
  nationality?: string[];
  nationalityVisibility?: Visibility;
  maritalStatus?: string;
  maritalStatusVisibility?: Visibility;
  gender?: string;
  genderVisibility?: Visibility;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  contacts?: Contact[];
  locations?: Location[];
  relocation?: {
    open?: string;
    preferred?: Location[];
  };
  workAuthorization?: {
    country?: string;
    status?: string;
  }[];
  clearances?: Clearance[];
}

export interface Meta {
  id?: string;
  version?: string;
  canonical?: boolean;
  lastModified?: string;
  language?: string;
  variant?: string;
  targetRole?: string;
  targetCompany?: string;
  translatedFrom?: string;
  parentFileId?: string;
  parentVersion?: string;
  lineageNotes?: string;
  source?: {
    kind?: string;
    importer?: string;
    confidence?: number;
  };
}

export interface OCFDocument {
  schemaVersion: string;
  meta?: Meta;
  person: Person;
  skills?: Skill[];
  experience?: ExperienceEntry[];
  projects?: NestedProject[];
  education?: Education[];
  certifications?: Certification[];
  governance?: Governance[];
  teaching?: Teaching[];
  speaking?: Speaking[];
  memberships?: Membership[];
  service?: Service[];
  patents?: Patent[];
  publications?: Publication[];
  awards?: Award[];
  languages?: Language[];
  references?: Reference[];
  interests?: Interest[];
}

export function createEmptyDocument(): OCFDocument {
  return {
    schemaVersion: "0.3",
    meta: {
      id: crypto.randomUUID(),
      canonical: true,
      language: "en-US",
      variant: "master",
    },
    person: {
      name: {
        renderAs: "",
      },
    },
  };
}

// Section metadata for the sidebar
export interface SectionDef {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "person", label: "Person", description: "Name, contact, location", icon: "👤" },
  { id: "skills", label: "Skills", description: "Tools, tech, domain skills", icon: "🛠" },
  { id: "experience", label: "Experience", description: "All work history", icon: "💼" },
  { id: "education", label: "Education", description: "Degrees, courses, training", icon: "🎓" },
  { id: "certifications", label: "Certifications", description: "Licenses & credentials", icon: "📜" },
  { id: "projects", label: "Projects", description: "Independent work", icon: "🔧" },
  { id: "publications", label: "Publications", description: "Papers, books, articles", icon: "📄" },
  { id: "patents", label: "Patents", description: "Independently held", icon: "💡" },
  { id: "speaking", label: "Speaking", description: "Talks, panels, podcasts", icon: "🎤" },
  { id: "teaching", label: "Teaching", description: "Courses & workshops", icon: "📚" },
  { id: "governance", label: "Governance", description: "Board & advisory roles", icon: "🏛" },
  { id: "memberships", label: "Memberships", description: "Professional orgs", icon: "🤝" },
  { id: "service", label: "Service", description: "Volunteer & civic", icon: "🌍" },
  { id: "awards", label: "Awards", description: "Honors & recognitions", icon: "🏆" },
  { id: "languages", label: "Languages", description: "Spoken, written, signed", icon: "🌐" },
  { id: "references", label: "References", description: "People who vouch for you", icon: "📇" },
  { id: "interests", label: "Interests", description: "Hobbies & pursuits", icon: "⭐" },
];
