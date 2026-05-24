import { openDB } from "idb";
import type { OCFDocument } from "./types";

const DB_NAME = "ocf-editor";
const STORE = "documents";
const KEY = "master";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

async function computeVersion(doc: OCFDocument): Promise<string> {
  // Hash the content (excluding meta.version itself to avoid circular updates)
  const copy = { ...doc, meta: { ...doc.meta, version: undefined, lastModified: undefined } };
  const text = JSON.stringify(copy, null, 0);
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 12);
}

export async function saveToDB(doc: OCFDocument): Promise<void> {
  // Stamp version and lastModified before saving
  const version = await computeVersion(doc);
  const stamped: OCFDocument = {
    ...doc,
    meta: {
      ...doc.meta,
      version,
      lastModified: new Date().toISOString().split("T")[0],
    },
  };
  const db = await getDB();
  await db.put(STORE, stamped, KEY);
}

export async function loadFromDB(): Promise<OCFDocument | null> {
  const db = await getDB();
  const val = await db.get(STORE, KEY);
  return val ?? null;
}

export async function exportToFile(doc: OCFDocument, filename?: string) {
  const version = await computeVersion(doc);
  const stamped: OCFDocument = {
    ...doc,
    meta: {
      ...doc.meta,
      version,
      lastModified: new Date().toISOString().split("T")[0],
    },
  };
  const json = JSON.stringify(stamped, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? "career.ocf.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File): Promise<OCFDocument> {
  const text = await file.text();
  const doc = JSON.parse(text) as OCFDocument;
  if (!doc.schemaVersion || !doc.person) {
    throw new Error("This doesn't look like a valid OCF file — missing schemaVersion or person.");
  }
  return doc;
}
