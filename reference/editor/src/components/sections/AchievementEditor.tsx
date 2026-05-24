"use client";

import React from "react";
import {
  TextField,
  SelectField,
  VisibilityField,
  StringArrayField,
  NumberField,
} from "@/components/FormFields";
import type { Achievement } from "@/lib/types";

export function AchievementEditor({
  value,
  onChange,
}: {
  value: Achievement;
  onChange: (v: Achievement) => void;
}) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField
        label="Statement"
        value={value.statement}
        onChange={(v) => onChange({ ...value, statement: v })}
        multiline
        placeholder="The bullet as it should appear on a resume"
      />
      <TextField
        label="Short Statement"
        value={value.shortStatement ?? ""}
        onChange={(v) => up("shortStatement", v)}
        placeholder="Tighter version for limited space"
      />
      <SelectField
        label="Kind"
        value={value.kind ?? ""}
        onChange={(v) => up("kind", v)}
        options={[
          { value: "accomplishment", label: "Accomplishment" },
          { value: "responsibility", label: "Responsibility" },
          { value: "project", label: "Project" },
          { value: "recognition", label: "Recognition" },
          { value: "other", label: "Other" },
        ]}
      />
      <TextField
        label="Full Story"
        value={value.longform ?? ""}
        onChange={(v) => up("longform", v)}
        multiline
        hint="Context, stakes, what you learned — for interview prep, not the resume"
      />
      <StringArrayField
        label="Skills"
        value={value.skills}
        onChange={(v) => up("skills", v)}
        placeholder="Skills demonstrated"
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Importance"
          value={value.importance}
          onChange={(v) => up("importance", v)}
          min={1}
        />
        <div>
          <VisibilityField
            label="Visibility"
            value={value.visibility}
            onChange={(v) => up("visibility", v)}
            defaultValue="shared"
          />
        </div>
      </div>
      <StringArrayField
        label="Audiences"
        value={value.audiences}
        onChange={(v) => up("audiences", v)}
        placeholder="e.g. federal, startup"
      />
    </div>
  );
}
