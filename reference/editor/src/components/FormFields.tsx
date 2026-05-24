"use client";

import React from "react";
import type { PartialDate, DateRange, Location, Visibility } from "@/lib/types";

// --- Text Input ---
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}) {
  const id = React.useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// --- Number Input ---
export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  min,
  max,
  step,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = React.useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// --- Select ---
export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  allowEmpty,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  allowEmpty?: boolean;
}) {
  const id = React.useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {(allowEmpty !== false) && <option value="">—</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// --- Checkbox ---
export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  const id = React.useId();
  return (
    <div className="mb-3 flex items-start gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 rounded border-gray-300"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

// --- Visibility Picker ---
export function VisibilityField({
  label,
  value,
  onChange,
  defaultValue,
}: {
  label?: string;
  value: Visibility | undefined;
  onChange: (v: Visibility) => void;
  defaultValue?: Visibility;
}) {
  const current = value ?? defaultValue ?? "shared";
  const colors: Record<Visibility, string> = {
    public: "bg-green-100 text-green-800 border-green-300",
    shared: "bg-amber-100 text-amber-800 border-amber-300",
    private: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="flex gap-1">
        {(["public", "shared", "private"] as Visibility[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
              current === v ? colors[v] : "bg-gray-50 text-gray-400 border-gray-200"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Partial Date Editor ---
export function PartialDateField({
  label,
  value,
  onChange,
  allowPresent,
}: {
  label: string;
  value: PartialDate | undefined;
  onChange: (v: PartialDate | undefined) => void;
  allowPresent?: boolean;
}) {
  const isPresent = value?.present === true;

  if (isPresent && allowPresent) {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-700 font-medium">Present</span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-gray-500 underline"
          >
            Set date instead
          </button>
        </div>
      </div>
    );
  }

  const year = (!isPresent && value?.year) || "";
  const month = (!isPresent && value?.month) || "";
  const day = (!isPresent && value?.day) || "";

  const update = (field: string, val: string) => {
    const num = val === "" ? undefined : parseInt(val, 10);
    const next: PartialDate = {
      ...(value && !value.present ? value : {}),
      [field]: num,
    };
    if (!next.year && !next.month && !next.day) {
      onChange(undefined);
    } else {
      onChange(next);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={year}
          onChange={(e) => update("year", e.target.value)}
          placeholder="Year"
          min={1900}
          max={2100}
          className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <input
          type="number"
          value={month}
          onChange={(e) => update("month", e.target.value)}
          placeholder="Mo"
          min={1}
          max={12}
          className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <input
          type="number"
          value={day}
          onChange={(e) => update("day", e.target.value)}
          placeholder="Day"
          min={1}
          max={31}
          className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        {allowPresent && (
          <button
            type="button"
            onClick={() => onChange({ present: true })}
            className="text-xs text-blue-600 underline ml-1"
          >
            Present
          </button>
        )}
      </div>
    </div>
  );
}

// --- Date Range Editor ---
export function DateRangeField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: DateRange | undefined;
  onChange: (v: DateRange | undefined) => void;
}) {
  const dr = value ?? { start: {} as PartialDate };

  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div className="flex gap-4 flex-wrap">
        <PartialDateField
          label="Start"
          value={dr.start}
          onChange={(s) => {
            if (!s) {
              onChange(undefined);
            } else {
              onChange({ ...dr, start: s });
            }
          }}
        />
        <PartialDateField
          label="End"
          value={dr.end}
          onChange={(e) => onChange({ ...dr, end: e ?? undefined })}
          allowPresent
        />
      </div>
      <CheckboxField
        label="Hide dates"
        checked={dr.dateIsPrivate ?? false}
        onChange={(v) => onChange({ ...dr, dateIsPrivate: v || undefined })}
        hint="Dates stay in master but are suppressed in derived resumes"
      />
    </div>
  );
}

// --- Location Editor ---
export function LocationField({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: Location | undefined;
  onChange: (v: Location | undefined) => void;
}) {
  const loc = value ?? {};
  const update = (field: string, val: string | boolean) => {
    const next = { ...loc, [field]: val || undefined };
    if (!next.city && !next.region && !next.country && !next.remote) {
      onChange(undefined);
    } else {
      onChange(next as Location);
    }
  };
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={loc.city ?? ""}
          onChange={(e) => update("city", e.target.value)}
          placeholder="City"
          className="flex-1 min-w-[120px] rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <input
          type="text"
          value={loc.region ?? ""}
          onChange={(e) => update("region", e.target.value)}
          placeholder="State/Province"
          className="flex-1 min-w-[120px] rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <input
          type="text"
          value={loc.country ?? ""}
          onChange={(e) => update("country", e.target.value)}
          placeholder="Country"
          className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="mt-1">
        <CheckboxField
          label="Remote"
          checked={loc.remote ?? false}
          onChange={(v) => update("remote", v)}
        />
      </div>
    </div>
  );
}

// --- String Array Editor (tags, skills, etc.) ---
export function StringArrayField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string[] | undefined;
  onChange: (v: string[] | undefined) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [draft, setDraft] = React.useState("");
  const items = value ?? [];

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setDraft("");
    }
  };

  const remove = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-blue-400 hover:text-blue-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// --- Collapsible Section ---
export function Collapsible({
  title,
  subtitle,
  defaultOpen,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  return (
    <div className="border border-gray-200 rounded-lg mb-3 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <span className="font-medium text-sm">{title}</span>
          {subtitle && <span className="text-xs text-gray-500 ml-2">{subtitle}</span>}
        </div>
        <div className="flex items-center gap-2">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          <span className="text-gray-400 text-sm">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 pt-3">{children}</div>}
    </div>
  );
}

// --- Array Item Manager ---
export function ArrayManager<T>({
  label,
  items,
  onChange,
  createEmpty,
  renderItem,
  itemLabel,
}: {
  label: string;
  items: T[] | undefined;
  onChange: (items: T[] | undefined) => void;
  createEmpty: () => T;
  renderItem: (item: T, index: number, update: (v: T) => void) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
}) {
  const list = items ?? [];

  const add = () => onChange([...list, createEmpty()]);

  const update = (idx: number, val: T) => {
    const next = [...list];
    next[idx] = val;
    onChange(next);
  };

  const remove = (idx: number) => {
    const next = list.filter((_, i) => i !== idx);
    onChange(next.length ? next : undefined);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...list];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= list.length - 1) return;
    const next = [...list];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <button
          type="button"
          onClick={add}
          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100"
        >
          + Add
        </button>
      </div>
      {list.map((item, idx) => (
        <Collapsible
          key={idx}
          title={itemLabel(item, idx)}
          defaultOpen={list.length === 1}
          actions={
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveUp(idx)}
                className="text-xs px-1.5 py-0.5 text-gray-400 hover:text-gray-700"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(idx)}
                className="text-xs px-1.5 py-0.5 text-gray-400 hover:text-gray-700"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-xs px-1.5 py-0.5 text-red-400 hover:text-red-700"
                title="Remove"
              >
                Remove
              </button>
            </div>
          }
        >
          {renderItem(item, idx, (v) => update(idx, v))}
        </Collapsible>
      ))}
      {list.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          None yet. Click &quot;+ Add&quot; to get started.
        </p>
      )}
    </div>
  );
}
