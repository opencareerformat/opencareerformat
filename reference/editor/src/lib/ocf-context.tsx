"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { OCFDocument, createEmptyDocument } from "./types";
import { loadFromDB, saveToDB } from "./persistence";

type Action =
  | { type: "SET_DOCUMENT"; doc: OCFDocument }
  | { type: "UPDATE_PATH"; path: string[]; value: unknown }
  | { type: "RESET" };

function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
  if (path.length === 0) return obj;
  const result = { ...obj };
  if (path.length === 1) {
    if (value === undefined || value === null || value === "") {
      delete result[path[0]];
    } else {
      result[path[0]] = value;
    }
    return result;
  }
  const [head, ...rest] = path;
  const child = (result[head] ?? {}) as Record<string, unknown>;
  result[head] = setNestedValue(child, rest, value);
  return result;
}

function reducer(state: OCFDocument, action: Action): OCFDocument {
  switch (action.type) {
    case "SET_DOCUMENT":
      return action.doc;
    case "UPDATE_PATH":
      return setNestedValue(
        state as unknown as Record<string, unknown>,
        action.path,
        action.value
      ) as unknown as OCFDocument;
    case "RESET":
      return createEmptyDocument();
    default:
      return state;
  }
}

interface OCFContextValue {
  doc: OCFDocument;
  dispatch: React.Dispatch<Action>;
  updateField: (path: string[], value: unknown) => void;
  setDocument: (doc: OCFDocument) => void;
  resetDocument: () => void;
  isDirty: boolean;
}

const OCFContext = createContext<OCFContextValue | null>(null);

export function OCFProvider({ children }: { children: React.ReactNode }) {
  const [doc, dispatch] = useReducer(reducer, createEmptyDocument());
  const [isDirty, setIsDirty] = React.useState(false);
  const initialized = useRef(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    loadFromDB().then((saved) => {
      if (saved) {
        dispatch({ type: "SET_DOCUMENT", doc: saved });
      }
      initialized.current = true;
    });
  }, []);

  // Auto-save to IndexedDB on changes (debounced)
  useEffect(() => {
    if (!initialized.current) return;
    setIsDirty(true);
    const timer = setTimeout(() => {
      saveToDB(doc).then(() => setIsDirty(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [doc]);

  const updateField = useCallback((path: string[], value: unknown) => {
    dispatch({ type: "UPDATE_PATH", path, value });
  }, []);

  const setDocument = useCallback((d: OCFDocument) => {
    dispatch({ type: "SET_DOCUMENT", doc: d });
  }, []);

  const resetDocument = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <OCFContext.Provider value={{ doc, dispatch, updateField, setDocument, resetDocument, isDirty }}>
      {children}
    </OCFContext.Provider>
  );
}

export function useOCF() {
  const ctx = useContext(OCFContext);
  if (!ctx) throw new Error("useOCF must be used within OCFProvider");
  return ctx;
}
