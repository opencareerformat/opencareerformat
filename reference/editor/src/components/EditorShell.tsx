"use client";

import React, { useState, useRef } from "react";
import { useOCF } from "@/lib/ocf-context";
import { exportToFile, importFromFile } from "@/lib/persistence";
import { SECTIONS } from "@/lib/types";
import PersonEditor from "./sections/PersonEditor";
import ExperienceEditor from "./sections/ExperienceEditor";
import SkillsEditor from "./sections/SkillsEditor";
import EducationEditor from "./sections/EducationEditor";
import CertificationsEditor from "./sections/CertificationsEditor";
import {
  ProjectsEditor,
  PublicationsEditor,
  GovernanceEditor,
  TeachingEditor,
  SpeakingEditor,
  MembershipsEditor,
  ServiceEditor,
  AwardsEditor,
  PatentsEditor,
  LanguagesEditor,
  ReferencesEditor,
  InterestsEditor,
} from "./sections/SimpleEditors";

const EDITORS: Record<string, React.ComponentType> = {
  person: PersonEditor,
  skills: SkillsEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  certifications: CertificationsEditor,
  projects: ProjectsEditor,
  publications: PublicationsEditor,
  governance: GovernanceEditor,
  teaching: TeachingEditor,
  speaking: SpeakingEditor,
  memberships: MembershipsEditor,
  service: ServiceEditor,
  awards: AwardsEditor,
  patents: PatentsEditor,
  languages: LanguagesEditor,
  references: ReferencesEditor,
  interests: InterestsEditor,
};

export default function EditorShell() {
  const [activeSection, setActiveSection] = useState("person");
  const { doc, setDocument, isDirty } = useOCF();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ActiveEditor = EDITORS[activeSection];

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromFile(file);
      setDocument(imported);
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Count items in each section for badges
  const counts: Record<string, number> = {
    skills: doc.skills?.length ?? 0,
    experience: doc.experience?.length ?? 0,
    education: doc.education?.length ?? 0,
    certifications: doc.certifications?.length ?? 0,
    projects: doc.projects?.length ?? 0,
    publications: doc.publications?.length ?? 0,
    governance: doc.governance?.length ?? 0,
    teaching: doc.teaching?.length ?? 0,
    speaking: doc.speaking?.length ?? 0,
    memberships: doc.memberships?.length ?? 0,
    service: doc.service?.length ?? 0,
    awards: doc.awards?.length ?? 0,
    patents: doc.patents?.length ?? 0,
    languages: doc.languages?.length ?? 0,
    references: doc.references?.length ?? 0,
    interests: doc.interests?.length ?? 0,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-base font-bold text-gray-900">OCF Editor</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {doc.person.name.renderAs || "Untitled"}{" "}
            {isDirty ? (
              <span className="text-amber-500">saving...</span>
            ) : (
              <span className="text-green-600">saved</span>
            )}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 text-sm transition-colors ${
                activeSection === s.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              <span className="flex-1">{s.label}</span>
              {counts[s.id] > 0 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                  {counts[s.id]}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom toolbar */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-200"
            >
              Open File
            </button>
            <button
              onClick={() => exportToFile(doc)}
              className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-200"
            >
              Export JSON
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {ActiveEditor && <ActiveEditor />}
        </div>
      </main>
    </div>
  );
}
