"use client";

import React from "react";
import { useOCF } from "@/lib/ocf-context";
import {
  TextField,
  SelectField,
  DateRangeField,
  StringArrayField,
  NumberField,
  ArrayManager,
} from "@/components/FormFields";
import type { Skill } from "@/lib/types";

const CATEGORIES = [
  { value: "tool", label: "Tool" },
  { value: "platform", label: "Platform" },
  { value: "language", label: "Language" },
  { value: "framework", label: "Framework" },
  { value: "methodology", label: "Methodology" },
  { value: "regulatory", label: "Regulatory" },
  { value: "domain", label: "Domain" },
  { value: "soft-skill", label: "Soft Skill" },
  { value: "equipment", label: "Equipment" },
  { value: "vehicle", label: "Vehicle" },
  { value: "trade", label: "Trade" },
  { value: "other", label: "Other" },
];

export default function SkillsEditor() {
  const { doc, updateField } = useOCF();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Skills</h2>
      <p className="text-sm text-gray-500 mb-6">
        Every tool, technology, framework, domain term, and skill you can legitimately claim. This is the machine-parseable layer for ATS keyword matching.
      </p>

      <ArrayManager<Skill>
        label="Skills"
        items={doc.skills}
        onChange={(v) => updateField(["skills"], v)}
        createEmpty={() => ({ name: "" })}
        renderItem={(skill, _, upd) => <SkillEditor value={skill} onChange={upd} />}
        itemLabel={(s) => {
          const cat = s.category ? ` [${s.category}]` : "";
          return (s.name || "New skill") + cat;
        }}
      />
    </div>
  );
}

function SkillEditor({ value, onChange }: { value: Skill; onChange: (v: Skill) => void }) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField label="Name" value={value.name} onChange={(v) => onChange({ ...value, name: v })} placeholder="e.g. Python, Salesforce, HIPAA" />
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Category" value={value.category ?? ""} onChange={(v) => up("category", v)} options={CATEGORIES} />
        <SelectField
          label="Proficiency"
          value={value.proficiency ?? ""}
          onChange={(v) => up("proficiency", v)}
          options={[
            { value: "learning", label: "Learning" },
            { value: "working", label: "Working" },
            { value: "proficient", label: "Proficient" },
            { value: "expert", label: "Expert" },
          ]}
        />
      </div>
      <DateRangeField label="Date Range" value={value.dateRange} onChange={(v) => up("dateRange", v)} />
      <StringArrayField label="Aliases" value={value.aliases} onChange={(v) => up("aliases", v)} placeholder="e.g. K8s for Kubernetes" hint="Alternate names ATS systems might search for" />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Importance" value={value.importance} onChange={(v) => up("importance", v)} min={1} />
        <StringArrayField label="Audiences" value={value.audiences} onChange={(v) => up("audiences", v)} placeholder="e.g. federal" />
      </div>
    </div>
  );
}
