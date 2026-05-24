"use client";

import React from "react";
import { useOCF } from "@/lib/ocf-context";
import {
  TextField,
  SelectField,
  VisibilityField,
  LocationField,
  StringArrayField,
  ArrayManager,
  Collapsible,
} from "@/components/FormFields";
import type { Clearance, Location } from "@/lib/types";

export default function PersonEditor() {
  const { doc, updateField } = useOCF();
  const person = doc.person;

  const up = (field: string, value: unknown) => updateField(["person", field], value);
  const upName = (field: string, value: unknown) =>
    updateField(["person", "name", field], value);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Person</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your name, contact information, and personal details. Only &quot;name&quot; is required — everything else is optional.
      </p>

      {/* Name */}
      <Collapsible title="Name" defaultOpen>
        <TextField
          label="Display Name"
          value={person.name.renderAs}
          onChange={(v) => upName("renderAs", v)}
          placeholder="How your name should appear on a resume"
          hint="Professional name, stage name, shortened form — whatever you go by"
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Given Name"
            value={person.name.given ?? ""}
            onChange={(v) => upName("given", v)}
          />
          <TextField
            label="Family Name"
            value={person.name.family ?? ""}
            onChange={(v) => upName("family", v)}
          />
        </div>
        <TextField
          label="Preferred / Nickname"
          value={person.name.preferred ?? ""}
          onChange={(v) => upName("preferred", v)}
          placeholder="e.g. TJ, Carmen, Sasha"
        />
        <TextField
          label="Pronouns"
          value={person.name.pronouns ?? ""}
          onChange={(v) => upName("pronouns", v)}
          placeholder="e.g. she/her, he/him, they/them"
        />
        <TextField
          label="Legal Name"
          value={person.name.legalName ?? ""}
          onChange={(v) => upName("legalName", v)}
          hint="Only if different from display name. Needed for background checks."
        />
        <VisibilityField
          label="Legal Name Visibility"
          value={person.name.legalNameVisibility}
          onChange={(v) => upName("legalNameVisibility", v)}
          defaultValue="private"
        />
        <TextField
          label="Native Script"
          value={person.name.nativeScript ?? ""}
          onChange={(v) => upName("nativeScript", v)}
          hint="Name in original script if the file is romanized"
        />
      </Collapsible>

      {/* Contact */}
      <Collapsible title="Contact" defaultOpen>
        <TextField
          label="Email"
          value={person.email ?? ""}
          onChange={(v) => up("email", v)}
          placeholder="you@example.com"
        />
        <TextField
          label="Phone"
          value={person.phone ?? ""}
          onChange={(v) => up("phone", v)}
          placeholder="+1-555-867-5309"
        />
        <TextField
          label="LinkedIn"
          value={person.linkedin ?? ""}
          onChange={(v) => up("linkedin", v)}
          placeholder="https://linkedin.com/in/yourname"
        />
        <TextField
          label="GitHub"
          value={person.github ?? ""}
          onChange={(v) => up("github", v)}
          placeholder="https://github.com/yourname"
        />
        <TextField
          label="Website"
          value={person.website ?? ""}
          onChange={(v) => up("website", v)}
          placeholder="https://yoursite.com"
        />
      </Collapsible>

      {/* Headline & Summary */}
      <Collapsible title="Headline & Summary">
        <TextField
          label="Headline"
          value={person.headline ?? ""}
          onChange={(v) => up("headline", v)}
          placeholder="One-line positioning statement"
          hint="Not a job title — a statement about what you do"
        />
        <TextField
          label="Summary"
          value={person.summary ?? ""}
          onChange={(v) => up("summary", v)}
          multiline
          placeholder="Professional profile / about paragraph"
        />
      </Collapsible>

      {/* Location */}
      <Collapsible title="Location & Relocation">
        <ArrayManager<Location>
          label="Current Locations"
          items={person.locations}
          onChange={(v) => up("locations", v)}
          createEmpty={() => ({})}
          renderItem={(loc, _, upd) => (
            <LocationField value={loc} onChange={(v) => upd(v ?? {})} />
          )}
          itemLabel={(loc) =>
            [loc.city, loc.region, loc.country].filter(Boolean).join(", ") || "New location"
          }
        />
        <TextField
          label="Relocation"
          value={person.relocation?.open ?? ""}
          onChange={(v) =>
            up("relocation", v ? { ...person.relocation, open: v } : undefined)
          }
          multiline
          placeholder="e.g. Yes, with relocation support to NYC or Boston"
          hint="Leave blank if not open to relocation"
        />
      </Collapsible>

      {/* Regional / Sensitive Fields */}
      <Collapsible title="Regional & Sensitive Fields">
        <p className="text-xs text-gray-500 mb-4">
          These fields are required on resumes in some countries and prohibited in others. Store them if they apply to you — derivation tools handle regional rules.
        </p>
        <TextField
          label="Photo URL"
          value={person.photo ?? ""}
          onChange={(v) => up("photo", v)}
        />
        <VisibilityField
          value={person.photoVisibility}
          onChange={(v) => up("photoVisibility", v)}
          defaultValue="private"
        />
        <TextField
          label="Gender"
          value={person.gender ?? ""}
          onChange={(v) => up("gender", v)}
        />
        <VisibilityField
          value={person.genderVisibility}
          onChange={(v) => up("genderVisibility", v)}
          defaultValue="private"
        />
        <TextField
          label="Marital Status"
          value={person.maritalStatus ?? ""}
          onChange={(v) => up("maritalStatus", v)}
        />
        <VisibilityField
          value={person.maritalStatusVisibility}
          onChange={(v) => up("maritalStatusVisibility", v)}
          defaultValue="private"
        />
        <StringArrayField
          label="Nationality"
          value={person.nationality}
          onChange={(v) => up("nationality", v)}
          placeholder="e.g. US, Italian"
        />
        <VisibilityField
          value={person.nationalityVisibility}
          onChange={(v) => up("nationalityVisibility", v)}
          defaultValue="private"
        />
      </Collapsible>

      {/* Clearances */}
      <Collapsible title="Clearances">
        <p className="text-xs text-gray-500 mb-3">
          Security clearances, TWIC, facility clearances — things granted through investigation, not earned through study.
        </p>
        <ArrayManager<Clearance>
          label="Clearances"
          items={person.clearances}
          onChange={(v) => up("clearances", v)}
          createEmpty={() => ({ name: "" })}
          renderItem={(cl, _, upd) => <ClearanceEditor value={cl} onChange={upd} />}
          itemLabel={(cl) => cl.name || "New clearance"}
        />
      </Collapsible>
    </div>
  );
}

function ClearanceEditor({
  value,
  onChange,
}: {
  value: Clearance;
  onChange: (v: Clearance) => void;
}) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val });
  return (
    <div>
      <TextField label="Name" value={value.name} onChange={(v) => up("name", v)} placeholder="e.g. Top Secret / SCI" />
      <SelectField
        label="Type"
        value={value.type ?? ""}
        onChange={(v) => up("type", v)}
        options={[
          { value: "security-clearance", label: "Security Clearance" },
          { value: "government-credential", label: "Government Credential" },
          { value: "access-credential", label: "Access Credential" },
          { value: "other", label: "Other" },
        ]}
      />
      <TextField label="Level" value={value.level ?? ""} onChange={(v) => up("level", v)} placeholder="e.g. Secret, Top Secret" />
      <TextField label="Issued By" value={value.issuedBy ?? ""} onChange={(v) => up("issuedBy", v)} placeholder="e.g. DoD, TSA" />
      <SelectField
        label="Status"
        value={value.status ?? ""}
        onChange={(v) => up("status", v)}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "expired", label: "Expired" },
          { value: "revoked", label: "Revoked" },
        ]}
      />
      <SelectField
        label="Polygraph"
        value={value.polygraph ?? ""}
        onChange={(v) => up("polygraph", v)}
        options={[
          { value: "none", label: "None" },
          { value: "ci", label: "Counter-Intelligence (CI)" },
          { value: "full-scope", label: "Full Scope / Lifestyle" },
        ]}
      />
      <VisibilityField value={value.visibility} onChange={(v) => up("visibility", v)} defaultValue="private" />
    </div>
  );
}
