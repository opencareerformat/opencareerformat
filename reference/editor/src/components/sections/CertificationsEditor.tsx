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
} from "@/components/FormFields";
import type { Certification } from "@/lib/types";

const CERT_TYPES = [
  { value: "certification", label: "Certification" },
  { value: "license", label: "License" },
  { value: "permit", label: "Permit" },
  { value: "endorsement", label: "Endorsement" },
  { value: "card", label: "Card" },
  { value: "bar-admission", label: "Bar Admission" },
  { value: "board-certification", label: "Board Certification" },
  { value: "registration", label: "Registration" },
  { value: "other", label: "Other" },
];

export default function CertificationsEditor() {
  const { doc, updateField } = useOCF();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Certifications</h2>
      <p className="text-sm text-gray-500 mb-6">
        Professional certifications, licenses, and credentials — anything you studied for, tested for, or earned.
      </p>

      <ArrayManager<Certification>
        label="Certifications"
        items={doc.certifications}
        onChange={(v) => updateField(["certifications"], v)}
        createEmpty={() => ({ name: "" })}
        renderItem={(cert, _, upd) => <CertEditor value={cert} onChange={upd} />}
        itemLabel={(c) => {
          const parts = [c.name, c.issuer].filter(Boolean);
          return parts.join(" — ") || "New certification";
        }}
      />
    </div>
  );
}

function CertEditor({ value, onChange }: { value: Certification; onChange: (v: Certification) => void }) {
  const up = (field: string, val: unknown) => onChange({ ...value, [field]: val || undefined });

  return (
    <div>
      <TextField label="Name" value={value.name} onChange={(v) => onChange({ ...value, name: v })} placeholder="e.g. CISSP, CDL Class A, PMP" />
      <SelectField label="Type" value={value.type ?? ""} onChange={(v) => up("type", v)} options={CERT_TYPES} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Issuer" value={value.issuer ?? ""} onChange={(v) => up("issuer", v)} placeholder="e.g. (ISC)², PMI" />
        <TextField label="Jurisdiction" value={value.jurisdiction ?? ""} onChange={(v) => up("jurisdiction", v)} placeholder="e.g. Nevada, Federal" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Family" value={value.family ?? ""} onChange={(v) => up("family", v)} hint="Groups related certs (e.g. AWS Solutions Architect)" />
        <TextField label="Level" value={value.level ?? ""} onChange={(v) => up("level", v)} placeholder="e.g. associate, professional" />
      </div>
      <DateRangeField label="Date Range" value={value.dateRange} onChange={(v) => up("dateRange", v)} />
      <SelectField
        label="Status"
        value={value.status ?? ""}
        onChange={(v) => up("status", v)}
        options={[
          { value: "active", label: "Active" },
          { value: "expired", label: "Expired" },
          { value: "lapsed", label: "Lapsed" },
          { value: "in-progress", label: "In Progress" },
          { value: "revoked", label: "Revoked" },
        ]}
      />
      <TextField label="URL" value={value.url ?? ""} onChange={(v) => up("url", v)} placeholder="Verification URL" />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Importance" value={value.importance} onChange={(v) => up("importance", v)} min={1} />
        <StringArrayField label="Audiences" value={value.audiences} onChange={(v) => up("audiences", v)} />
      </div>
    </div>
  );
}
