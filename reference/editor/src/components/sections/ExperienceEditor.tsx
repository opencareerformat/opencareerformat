"use client";

import React from "react";
import { useOCF } from "@/lib/ocf-context";
import {
  TextField,
  SelectField,
  DateRangeField,
  LocationField,
  StringArrayField,
  NumberField,
  ArrayManager,
  Collapsible,
} from "@/components/FormFields";
import { AchievementEditor } from "@/components/sections/AchievementEditor";
import type { ExperienceEntry, Position, Achievement, Location } from "@/lib/types";

const EXPERIENCE_ENTRY_KINDS = [
  { value: "employment", label: "Employment" },
  { value: "self-employment", label: "Self-Employment" },
  { value: "consulting", label: "Consulting" },
  { value: "gig", label: "Gig Work" },
  { value: "seasonal", label: "Seasonal" },
  { value: "military", label: "Military" },
  { value: "government", label: "Government" },
  { value: "homemaker", label: "Homemaker" },
  { value: "caregiver", label: "Caregiver" },
  { value: "career-break", label: "Career Break" },
  { value: "retirement", label: "Retirement" },
  { value: "other", label: "Other" },
];

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "consultant", label: "Consultant" },
  { value: "gig", label: "Gig" },
  { value: "secondment", label: "Secondment" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
  { value: "fellowship", label: "Fellowship" },
  { value: "residency", label: "Residency" },
  { value: "apprentice", label: "Apprentice" },
  { value: "other", label: "Other" },
];

const SENIORITY_LEVELS = [
  { value: "entry", label: "Entry" },
  { value: "ic", label: "Individual Contributor" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "vp", label: "VP" },
  { value: "c-suite", label: "C-Suite" },
  { value: "founder", label: "Founder" },
  { value: "advisor", label: "Advisor" },
  { value: "enlisted", label: "Enlisted" },
  { value: "nco", label: "NCO" },
  { value: "warrant", label: "Warrant Officer" },
  { value: "officer", label: "Officer" },
  { value: "senior-officer", label: "Senior Officer" },
  { value: "general-flag", label: "General / Flag" },
  { value: "faculty", label: "Faculty" },
  { value: "senior-faculty", label: "Senior Faculty" },
  { value: "other", label: "Other" },
];

export default function ExperienceEditor() {
  const { doc, updateField } = useOCF();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Experience</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your complete work history in one list. Each experience entry is a relationship, tenure, assignment, or period — a company, military service, self-employment, caregiving, or a career break. Positions (roles, promotions) nest inside.
      </p>

      <ArrayManager<ExperienceEntry>
        label="Experience Entries"
        items={doc.experience}
        onChange={(v) => updateField(["experience"], v)}
        createEmpty={() => ({ name: "", kind: "employment" })}
        renderItem={(ent, idx, upd) => (
          <ExperienceEntryEditor value={ent} onChange={upd} />
        )}
        itemLabel={(ent) => {
          const dates = ent.dateRange?.start?.year
            ? ` (${ent.dateRange.start.year}–${ent.dateRange?.end?.present ? "present" : ent.dateRange?.end?.year ?? ""})`
            : "";
          return (ent.name || "New experience entry") + dates;
        }}
      />
    </div>
  );
}

function ExperienceEntryEditor({ value, onChange }: { value: ExperienceEntry; onChange: (v: ExperienceEntry) => void }) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField
        label="Organization Name"
        value={value.name}
        onChange={(v) => onChange({ ...value, name: v })}
        placeholder="Company, agency, branch, or label"
      />
      <SelectField label="Kind" value={value.kind ?? ""} onChange={(v) => up("kind", v)} options={EXPERIENCE_ENTRY_KINDS} />
      <DateRangeField label="Date Range" value={value.dateRange} onChange={(v) => up("dateRange", v)} />

      <div className="grid grid-cols-2 gap-3">
        <TextField label="Industry" value={value.industry ?? ""} onChange={(v) => up("industry", v)} />
        <TextField label="URL" value={value.url ?? ""} onChange={(v) => up("url", v)} placeholder="https://..." />
      </div>

      {(value.kind === "military" || value.kind === "government") && (
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Branch" value={value.branch ?? ""} onChange={(v) => up("branch", v)} placeholder="e.g. Army, Navy, DHS" />
          <TextField label="Service Type" value={value.serviceType ?? ""} onChange={(v) => up("serviceType", v)} placeholder="e.g. active-duty, reserve" />
        </div>
      )}

      <TextField
        label="Description"
        value={value.description ?? ""}
        onChange={(v) => up("description", v)}
        multiline
        hint="Optional for traditional employment. Important for career breaks, caregiving, homemaker entries."
      />

      <Collapsible title="Company Context (at the time)">
        <TextField
          label="Stage"
          value={value.contextAtTime?.stage ?? ""}
          onChange={(v) =>
            up("contextAtTime", { ...value.contextAtTime, stage: v || undefined })
          }
          placeholder="e.g. seed, series-a, public, fortune-500"
        />
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Size at Join"
            value={value.contextAtTime?.sizeAtJoin}
            onChange={(v) => up("contextAtTime", { ...value.contextAtTime, sizeAtJoin: v })}
            placeholder="Headcount"
          />
          <NumberField
            label="Size at Exit"
            value={value.contextAtTime?.sizeAtExit}
            onChange={(v) => up("contextAtTime", { ...value.contextAtTime, sizeAtExit: v })}
          />
        </div>
      </Collapsible>

      {/* Positions */}
      <ArrayManager<Position>
        label="Positions"
        items={value.positions}
        onChange={(v) => up("positions", v)}
        createEmpty={() => ({ title: "", dateRange: { start: {} } })}
        renderItem={(pos, _, upd) => <PositionEditor value={pos} onChange={upd} />}
        itemLabel={(pos) => {
          const dates = pos.dateRange?.start?.year
            ? ` (${pos.dateRange.start.year}–${pos.dateRange?.end?.present ? "present" : pos.dateRange?.end?.year ?? ""})`
            : "";
          return (pos.title || "New position") + dates;
        }}
      />

      {/* Spanning achievements */}
      <ArrayManager<Achievement>
        label="Spanning Achievements"
        items={value.spanning}
        onChange={(v) => up("spanning", v)}
        createEmpty={() => ({ statement: "" })}
        renderItem={(a, _, upd) => <AchievementEditor value={a} onChange={upd} />}
        itemLabel={(a) => a.statement?.slice(0, 60) || "New achievement"}
      />

      {/* Exit Context */}
      <Collapsible title="Exit Context">
        <SelectField
          label="Reason"
          value={value.exitContext?.reason ?? ""}
          onChange={(v) => up("exitContext", { ...value.exitContext, reason: v || undefined })}
          options={[
            { value: "recruited-away", label: "Recruited away" },
            { value: "new-opportunity", label: "New opportunity" },
            { value: "layoff", label: "Layoff" },
            { value: "reduction", label: "Reduction in force" },
            { value: "company-closure", label: "Company closure" },
            { value: "end-of-contract", label: "End of contract" },
            { value: "relocated", label: "Relocated" },
            { value: "personal", label: "Personal" },
            { value: "retired", label: "Retired" },
            { value: "terminated", label: "Terminated" },
            { value: "mutual", label: "Mutual" },
            { value: "other", label: "Other" },
          ]}
        />
        <TextField
          label="Interview Statement"
          value={value.exitContext?.statement ?? ""}
          onChange={(v) => up("exitContext", { ...value.exitContext, statement: v || undefined })}
          hint="How you'd explain it in an interview"
        />
        <TextField
          label="Private Notes"
          value={value.exitContext?.longform ?? ""}
          onChange={(v) => up("exitContext", { ...value.exitContext, longform: v || undefined })}
          multiline
          hint="The full story — never appears in curated/exported files without review"
        />
      </Collapsible>

      {/* Notes & importance */}
      <TextField
        label="Notes"
        value={value.notes ?? ""}
        onChange={(v) => up("notes", v)}
        multiline
        hint="Private notes not captured elsewhere"
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Importance" value={value.importance} onChange={(v) => up("importance", v)} min={1} hint="Higher = more important" />
        <StringArrayField label="Audiences" value={value.audiences} onChange={(v) => up("audiences", v)} placeholder="e.g. federal" />
      </div>
    </div>
  );
}

function PositionEditor({ value, onChange }: { value: Position; onChange: (v: Position) => void }) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField label="Title" value={value.title} onChange={(v) => onChange({ ...value, title: v })} placeholder="Job title, rank, or billet" />
      <DateRangeField value={value.dateRange} onChange={(v) => onChange({ ...value, dateRange: v ?? { start: {} } })} />

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Employment Type" value={value.employmentType ?? ""} onChange={(v) => up("employmentType", v)} options={EMPLOYMENT_TYPES} />
        <SelectField label="Seniority" value={value.seniority ?? ""} onChange={(v) => up("seniority", v)} options={SENIORITY_LEVELS} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Work Arrangement"
          value={value.workArrangement ?? ""}
          onChange={(v) => up("workArrangement", v)}
          options={[
            { value: "onsite", label: "Onsite" },
            { value: "hybrid", label: "Hybrid" },
            { value: "remote", label: "Remote" },
          ]}
        />
        <TextField label="Grade" value={value.grade ?? ""} onChange={(v) => up("grade", v)} placeholder="e.g. GS-13, E-7" />
      </div>

      <TextField label="Placed At" value={value.placedAt ?? ""} onChange={(v) => up("placedAt", v)} hint="If you worked somewhere different from the parent experience entry (temp placement, secondment)" />
      <TextField label="Summary" value={value.summary ?? ""} onChange={(v) => up("summary", v)} multiline />

      <ArrayManager<Location>
        label="Locations"
        items={value.locations}
        onChange={(v) => up("locations", v)}
        createEmpty={() => ({})}
        renderItem={(loc, _, upd) => <LocationField value={loc} onChange={(v) => upd(v ?? {})} />}
        itemLabel={(loc) => [loc.city, loc.region, loc.country].filter(Boolean).join(", ") || "New location"}
      />

      <StringArrayField label="Tech Stack" value={value.techStack} onChange={(v) => up("techStack", v)} placeholder="e.g. React, AWS, PostgreSQL" />

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
        <NumberField label="Hours/Week" value={value.hoursPerWeek} onChange={(v) => up("hoursPerWeek", v)} hint="Required for federal resumes" />
      </div>
      <StringArrayField label="Audiences" value={value.audiences} onChange={(v) => up("audiences", v)} placeholder="e.g. engineering-leadership" />
    </div>
  );
}
