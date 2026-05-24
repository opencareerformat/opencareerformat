"use client";

import React from "react";
import { useOCF } from "@/lib/ocf-context";
import {
  TextField,
  SelectField,
  DateRangeField,
  PartialDateField,
  VisibilityField,
  LocationField,
  NumberField,
  StringArrayField,
  ArrayManager,
  CheckboxField,
} from "@/components/FormFields";
import { AchievementEditor } from "@/components/sections/AchievementEditor";
import type {
  Publication, Governance, Teaching, Speaking, Membership,
  Service, Award, Language, Reference, Interest, Patent,
  NestedProject, Achievement,
} from "@/lib/types";

// --- Projects ---
export function ProjectsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Projects</h2>
      <p className="text-sm text-gray-500 mb-6">Independent projects not tied to any experience entry — freelance, personal, open-source.</p>
      <ArrayManager<NestedProject>
        label="Projects"
        items={doc.projects}
        onChange={(v) => updateField(["projects"], v)}
        createEmpty={() => ({ name: "" })}
        renderItem={(p, _, upd) => <ProjectItemEditor value={p} onChange={upd} />}
        itemLabel={(p) => p.name || "New project"}
      />
    </div>
  );
}

function ProjectItemEditor({ value, onChange }: { value: NestedProject; onChange: (v: NestedProject) => void }) {
  const up = (f: string, v: unknown) => onChange({ ...value, [f]: v || undefined });
  return (
    <div>
      <TextField label="Name" value={value.name} onChange={(v) => onChange({ ...value, name: v })} />
      <TextField label="Role" value={value.role ?? ""} onChange={(v) => up("role", v)} />
      <TextField label="Client" value={value.client ?? ""} onChange={(v) => up("client", v)} />
      <TextField label="Category" value={value.category ?? ""} onChange={(v) => up("category", v)} placeholder="e.g. open-source, consulting" />
      <TextField label="Scale" value={value.scale ?? ""} onChange={(v) => up("scale", v)} placeholder="e.g. $4.2M budget, 18-month build" />
      <DateRangeField value={value.dateRange} onChange={(v) => up("dateRange", v)} />
      <TextField label="Description" value={value.description ?? ""} onChange={(v) => up("description", v)} multiline />
      <ArrayManager<Achievement>
        label="Achievements"
        items={value.achievements}
        onChange={(v) => up("achievements", v)}
        createEmpty={() => ({ statement: "" })}
        renderItem={(a, _, upd) => <AchievementEditor value={a} onChange={upd} />}
        itemLabel={(a) => a.statement?.slice(0, 60) || "New achievement"}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Importance" value={value.importance} onChange={(v) => up("importance", v)} min={1} />
        <VisibilityField value={value.visibility} onChange={(v) => up("visibility", v)} defaultValue="shared" />
      </div>
    </div>
  );
}

// --- Publications ---
export function PublicationsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Publications</h2>
      <p className="text-sm text-gray-500 mb-6">Papers, books, articles, screenplays, blog posts, RFCs.</p>
      <ArrayManager<Publication>
        label="Publications"
        items={doc.publications}
        onChange={(v) => updateField(["publications"], v)}
        createEmpty={() => ({ title: "" })}
        renderItem={(p, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...p, [f]: v || undefined });
          return (
            <div>
              <TextField label="Title" value={p.title} onChange={(v) => upd({ ...p, title: v })} />
              <SelectField label="Kind" value={p.kind ?? ""} onChange={(v) => up("kind", v)} options={[
                { value: "book", label: "Book" }, { value: "journal-article", label: "Journal Article" },
                { value: "conference-paper", label: "Conference Paper" }, { value: "thesis", label: "Thesis" },
                { value: "blog-post", label: "Blog Post" }, { value: "whitepaper", label: "Whitepaper" },
                { value: "screenplay", label: "Screenplay" }, { value: "other", label: "Other" },
              ]} />
              <TextField label="Venue" value={p.venue ?? ""} onChange={(v) => up("venue", v)} />
              <TextField label="Publisher" value={p.publisher ?? ""} onChange={(v) => up("publisher", v)} />
              <PartialDateField label="Date" value={p.date} onChange={(v) => up("date", v)} />
              <StringArrayField label="Authors" value={p.authors} onChange={(v) => up("authors", v)} placeholder="Author name" />
              <TextField label="URL" value={p.url ?? ""} onChange={(v) => up("url", v)} />
              <NumberField label="Importance" value={p.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(p) => p.title || "New publication"}
      />
    </div>
  );
}

// --- Governance ---
export function GovernanceEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Governance</h2>
      <p className="text-sm text-gray-500 mb-6">Board seats, advisory roles, trustee positions.</p>
      <ArrayManager<Governance>
        label="Board Roles"
        items={doc.governance}
        onChange={(v) => updateField(["governance"], v)}
        createEmpty={() => ({ organization: "", role: "board-director" })}
        renderItem={(g, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...g, [f]: v || undefined });
          return (
            <div>
              <TextField label="Organization" value={g.organization} onChange={(v) => upd({ ...g, organization: v })} />
              <SelectField label="Role" value={g.role} onChange={(v) => upd({ ...g, role: v })} options={[
                { value: "board-director", label: "Board Director" },
                { value: "advisory-board-member", label: "Advisory Board" },
                { value: "board-observer", label: "Board Observer" },
                { value: "trustee", label: "Trustee" },
                { value: "governor", label: "Governor" },
                { value: "other", label: "Other" },
              ]} allowEmpty={false} />
              <TextField label="Title" value={g.roleTitle ?? ""} onChange={(v) => up("roleTitle", v)} hint="If different from role" />
              <DateRangeField value={g.dateRange} onChange={(v) => up("dateRange", v)} />
              <TextField label="Context" value={g.context ?? ""} onChange={(v) => up("context", v)} multiline />
              <StringArrayField label="Committees" value={g.committees} onChange={(v) => up("committees", v)} />
              <CheckboxField label="Compensated" checked={g.compensated ?? false} onChange={(v) => up("compensated", v)} />
              <NumberField label="Importance" value={g.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(g) => `${g.organization || "New"} — ${g.role}`}
      />
    </div>
  );
}

// --- Teaching ---
export function TeachingEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Teaching</h2>
      <p className="text-sm text-gray-500 mb-6">Courses, workshops, mentoring — anywhere you were the instructor.</p>
      <ArrayManager<Teaching>
        label="Teaching"
        items={doc.teaching}
        onChange={(v) => updateField(["teaching"], v)}
        createEmpty={() => ({ subject: "" })}
        renderItem={(t, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...t, [f]: v || undefined });
          return (
            <div>
              <TextField label="Subject" value={t.subject} onChange={(v) => upd({ ...t, subject: v })} />
              <TextField label="Institution" value={t.institution ?? ""} onChange={(v) => up("institution", v)} />
              <SelectField label="Role" value={t.role ?? ""} onChange={(v) => up("role", v)} options={[
                { value: "professor", label: "Professor" }, { value: "adjunct", label: "Adjunct" },
                { value: "lecturer", label: "Lecturer" }, { value: "guest-lecturer", label: "Guest Lecturer" },
                { value: "instructor", label: "Instructor" }, { value: "facilitator", label: "Facilitator" },
                { value: "mentor", label: "Mentor" }, { value: "other", label: "Other" },
              ]} />
              <DateRangeField value={t.dateRange} onChange={(v) => up("dateRange", v)} />
              <TextField label="Audience" value={t.audience ?? ""} onChange={(v) => up("audience", v)} placeholder="e.g. undergrad, MBA" />
              <NumberField label="Importance" value={t.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(t) => t.subject || "New teaching"}
      />
    </div>
  );
}

// --- Speaking ---
export function SpeakingEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Speaking</h2>
      <p className="text-sm text-gray-500 mb-6">Talks, panels, keynotes, podcasts, webinars.</p>
      <ArrayManager<Speaking>
        label="Speaking"
        items={doc.speaking}
        onChange={(v) => updateField(["speaking"], v)}
        createEmpty={() => ({ title: "" })}
        renderItem={(s, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...s, [f]: v || undefined });
          return (
            <div>
              <TextField label="Title" value={s.title} onChange={(v) => upd({ ...s, title: v })} />
              <TextField label="Event" value={s.event ?? ""} onChange={(v) => up("event", v)} />
              <SelectField label="Kind" value={s.kind ?? ""} onChange={(v) => up("kind", v)} options={[
                { value: "keynote", label: "Keynote" }, { value: "talk", label: "Talk" },
                { value: "panel", label: "Panel" }, { value: "podcast", label: "Podcast" },
                { value: "webinar", label: "Webinar" }, { value: "fireside", label: "Fireside" },
                { value: "other", label: "Other" },
              ]} />
              <PartialDateField label="Date" value={s.date} onChange={(v) => up("date", v)} />
              <LocationField label="Location" value={s.location} onChange={(v) => up("location", v)} />
              <TextField label="Abstract" value={s.abstract ?? ""} onChange={(v) => up("abstract", v)} multiline />
              <NumberField label="Importance" value={s.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(s) => s.title || "New speaking"}
      />
    </div>
  );
}

// --- Memberships ---
export function MembershipsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Memberships</h2>
      <p className="text-sm text-gray-500 mb-6">Professional organizations, unions, standards bodies.</p>
      <ArrayManager<Membership>
        label="Memberships"
        items={doc.memberships}
        onChange={(v) => updateField(["memberships"], v)}
        createEmpty={() => ({ organization: "" })}
        renderItem={(m, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...m, [f]: v || undefined });
          return (
            <div>
              <TextField label="Organization" value={m.organization} onChange={(v) => upd({ ...m, organization: v })} />
              <TextField label="Role" value={m.role ?? ""} onChange={(v) => up("role", v)} placeholder="e.g. member, fellow, chair" />
              <DateRangeField value={m.dateRange} onChange={(v) => up("dateRange", v)} />
              <NumberField label="Importance" value={m.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(m) => m.organization || "New membership"}
      />
    </div>
  );
}

// --- Service ---
export function ServiceEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Service</h2>
      <p className="text-sm text-gray-500 mb-6">Volunteer, community, and civic engagement.</p>
      <ArrayManager<Service>
        label="Service"
        items={doc.service}
        onChange={(v) => updateField(["service"], v)}
        createEmpty={() => ({ organization: "" })}
        renderItem={(s, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...s, [f]: v || undefined });
          return (
            <div>
              <TextField label="Organization" value={s.organization} onChange={(v) => upd({ ...s, organization: v })} />
              <TextField label="Role" value={s.role ?? ""} onChange={(v) => up("role", v)} />
              <SelectField label="Kind" value={s.kind ?? ""} onChange={(v) => up("kind", v)} options={[
                { value: "volunteer", label: "Volunteer" }, { value: "public-service", label: "Public Service" },
                { value: "civic", label: "Civic" }, { value: "nonprofit-leadership", label: "Nonprofit Leadership" },
                { value: "elected-office", label: "Elected Office" }, { value: "religious", label: "Religious" },
                { value: "other", label: "Other" },
              ]} />
              <DateRangeField value={s.dateRange} onChange={(v) => up("dateRange", v)} />
              <TextField label="Description" value={s.description ?? ""} onChange={(v) => up("description", v)} multiline />
              <NumberField label="Importance" value={s.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(s) => s.organization || "New service"}
      />
    </div>
  );
}

// --- Awards ---
export function AwardsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Awards</h2>
      <p className="text-sm text-gray-500 mb-6">Major honors, prizes, and recognitions.</p>
      <ArrayManager<Award>
        label="Awards"
        items={doc.awards}
        onChange={(v) => updateField(["awards"], v)}
        createEmpty={() => ({})}
        renderItem={(a, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...a, [f]: v || undefined });
          return (
            <div>
              <TextField label="Title" value={a.title ?? ""} onChange={(v) => up("title", v)} />
              <TextField label="Awarder" value={a.awarder ?? ""} onChange={(v) => up("awarder", v)} />
              <PartialDateField label="Date" value={a.date} onChange={(v) => up("date", v)} />
              <TextField label="Description" value={a.description ?? ""} onChange={(v) => up("description", v)} multiline />
              <NumberField label="Importance" value={a.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(a) => a.title || "New award"}
      />
    </div>
  );
}

// --- Patents ---
export function PatentsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Patents</h2>
      <p className="text-sm text-gray-500 mb-6">Independently held patents.</p>
      <ArrayManager<Patent>
        label="Patents"
        items={doc.patents}
        onChange={(v) => updateField(["patents"], v)}
        createEmpty={() => ({})}
        renderItem={(p, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...p, [f]: v || undefined });
          return (
            <div>
              <TextField label="Title" value={p.title ?? ""} onChange={(v) => up("title", v)} />
              <TextField label="Patent Number" value={p.number ?? ""} onChange={(v) => up("number", v)} />
              <SelectField label="Status" value={p.status ?? ""} onChange={(v) => up("status", v)} options={[
                { value: "filed", label: "Filed" }, { value: "pending", label: "Pending" },
                { value: "granted", label: "Granted" }, { value: "expired", label: "Expired" },
              ]} />
              <PartialDateField label="Date" value={p.date} onChange={(v) => up("date", v)} />
              <StringArrayField label="Inventors" value={p.inventors} onChange={(v) => up("inventors", v)} />
              <TextField label="URL" value={p.url ?? ""} onChange={(v) => up("url", v)} />
              <NumberField label="Importance" value={p.importance} onChange={(v) => up("importance", v)} min={1} />
            </div>
          );
        }}
        itemLabel={(p) => p.title || "New patent"}
      />
    </div>
  );
}

// --- Languages ---
export function LanguagesEditor() {
  const { doc, updateField } = useOCF();
  const profLevels = [
    { value: "elementary", label: "Elementary" },
    { value: "limited-working", label: "Limited Working" },
    { value: "professional-working", label: "Professional Working" },
    { value: "full-professional", label: "Full Professional" },
    { value: "native-or-bilingual", label: "Native / Bilingual" },
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Languages</h2>
      <p className="text-sm text-gray-500 mb-6">Human languages — spoken, written, signed.</p>
      <ArrayManager<Language>
        label="Languages"
        items={doc.languages}
        onChange={(v) => updateField(["languages"], v)}
        createEmpty={() => ({ language: "" })}
        renderItem={(l, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...l, [f]: v || undefined });
          return (
            <div>
              <TextField label="Language" value={l.language} onChange={(v) => upd({ ...l, language: v })} placeholder="e.g. English, Spanish" />
              <SelectField label="Proficiency" value={l.proficiency ?? ""} onChange={(v) => up("proficiency", v)} options={profLevels} />
              <CheckboxField label="Native language" checked={l.native ?? false} onChange={(v) => up("native", v)} />
              <TextField label="Dialect" value={l.dialect ?? ""} onChange={(v) => up("dialect", v)} placeholder="e.g. Castilian, Cantonese" />
              <StringArrayField label="Context" value={l.context} onChange={(v) => up("context", v)} placeholder="e.g. business negotiation" />
            </div>
          );
        }}
        itemLabel={(l) => l.language || "New language"}
      />
    </div>
  );
}

// --- References ---
export function ReferencesEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">References</h2>
      <p className="text-sm text-gray-500 mb-6">People who can speak to your work. Private by default.</p>
      <ArrayManager<Reference>
        label="References"
        items={doc.references}
        onChange={(v) => updateField(["references"], v)}
        createEmpty={() => ({ name: "" })}
        renderItem={(r, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...r, [f]: v || undefined });
          return (
            <div>
              <TextField label="Name" value={r.name} onChange={(v) => upd({ ...r, name: v })} />
              <TextField label="Relationship" value={r.relationship ?? ""} onChange={(v) => up("relationship", v)} placeholder="e.g. former manager at Acme" />
              <TextField label="Organization" value={r.organization ?? ""} onChange={(v) => up("organization", v)} />
              <TextField label="Title" value={r.title ?? ""} onChange={(v) => up("title", v)} />
              <StringArrayField label="Strengths" value={r.strengths} onChange={(v) => up("strengths", v)} placeholder="What they can speak to" />
              <TextField label="Notes" value={r.notes ?? ""} onChange={(v) => up("notes", v)} multiline hint="Private notes" />
              <VisibilityField value={r.visibility} onChange={(v) => up("visibility", v)} defaultValue="private" />
            </div>
          );
        }}
        itemLabel={(r) => r.name || "New reference"}
      />
    </div>
  );
}

// --- Interests ---
export function InterestsEditor() {
  const { doc, updateField } = useOCF();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Interests</h2>
      <p className="text-sm text-gray-500 mb-6">Hobbies, activities, pursuits outside work.</p>
      <ArrayManager<Interest>
        label="Interests"
        items={doc.interests}
        onChange={(v) => updateField(["interests"], v)}
        createEmpty={() => ({})}
        renderItem={(i, _, upd) => {
          const up = (f: string, v: unknown) => upd({ ...i, [f]: v || undefined });
          return (
            <div>
              <TextField label="Name" value={i.name ?? ""} onChange={(v) => up("name", v)} placeholder="e.g. marathon running, woodworking" />
              <TextField label="Description" value={i.description ?? ""} onChange={(v) => up("description", v)} placeholder="Optional context" />
              <CheckboxField label="Currently active" checked={i.current ?? false} onChange={(v) => up("current", v)} />
            </div>
          );
        }}
        itemLabel={(i) => i.name || "New interest"}
      />
    </div>
  );
}
