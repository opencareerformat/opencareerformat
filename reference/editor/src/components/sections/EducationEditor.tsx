"use client";

import React from "react";
import { useOCF } from "@/lib/ocf-context";
import {
  TextField,
  SelectField,
  DateRangeField,
  NumberField,
  StringArrayField,
  ArrayManager,
  LocationField,
} from "@/components/FormFields";
import { AchievementEditor } from "@/components/sections/AchievementEditor";
import type { Education, Achievement } from "@/lib/types";

const EDU_KINDS = [
  { value: "degree", label: "Degree" },
  { value: "executive-education", label: "Executive Education" },
  { value: "certificate-program", label: "Certificate Program" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "mooc", label: "MOOC" },
  { value: "professional-development", label: "Professional Development" },
  { value: "military-training", label: "Military Training" },
  { value: "vocational", label: "Vocational" },
  { value: "apprenticeship", label: "Apprenticeship" },
  { value: "self-directed", label: "Self-Directed" },
  { value: "other", label: "Other" },
];

export default function EducationEditor() {
  const { doc, updateField } = useOCF();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Education</h2>
      <p className="text-sm text-gray-500 mb-6">
        All forms of learning — degrees, bootcamps, MOOCs, military training, vocational programs. Not just college.
      </p>

      <ArrayManager<Education>
        label="Education"
        items={doc.education}
        onChange={(v) => updateField(["education"], v)}
        createEmpty={() => ({ institution: "" })}
        renderItem={(edu, _, upd) => <EduEditor value={edu} onChange={upd} />}
        itemLabel={(e) => {
          const parts = [e.degree, e.field, e.institution].filter(Boolean);
          return parts.join(" — ") || "New education";
        }}
      />
    </div>
  );
}

function EduEditor({ value, onChange }: { value: Education; onChange: (v: Education) => void }) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField label="Institution" value={value.institution} onChange={(v) => onChange({ ...value, institution: v })} placeholder="School, program, platform" />
      <SelectField label="Kind" value={value.kind ?? ""} onChange={(v) => up("kind", v)} options={EDU_KINDS} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Degree" value={value.degree ?? ""} onChange={(v) => up("degree", v)} placeholder="e.g. BS, MBA, PhD" />
        <TextField label="Field / Major" value={value.field ?? ""} onChange={(v) => up("field", v)} placeholder="e.g. Computer Science" />
      </div>
      <TextField label="Minor" value={value.minor ?? ""} onChange={(v) => up("minor", v)} />
      <DateRangeField value={value.dateRange} onChange={(v) => up("dateRange", v)} />
      <LocationField label="Location" value={value.location} onChange={(v) => up("location", v)} />
      <SelectField
        label="Status"
        value={value.status ?? ""}
        onChange={(v) => up("status", v)}
        options={[
          { value: "completed", label: "Completed" },
          { value: "in-progress", label: "In Progress" },
          { value: "incomplete", label: "Incomplete" },
          { value: "audited", label: "Audited" },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="GPA" value={value.gpa} onChange={(v) => up("gpa", v)} step={0.01} />
        <NumberField label="GPA Scale" value={value.gpaScale} onChange={(v) => up("gpaScale", v)} placeholder="e.g. 4.0" />
      </div>
      <TextField label="Thesis" value={value.thesis ?? ""} onChange={(v) => up("thesis", v)} />
      <StringArrayField label="Honors" value={value.honors} onChange={(v) => up("honors", v)} placeholder="e.g. cum laude, Dean's List" />
      <StringArrayField label="Notable Courses" value={value.notableCourses} onChange={(v) => up("notableCourses", v)} placeholder="Relevant coursework" />

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
        <StringArrayField label="Audiences" value={value.audiences} onChange={(v) => up("audiences", v)} />
      </div>
    </div>
  );
}
