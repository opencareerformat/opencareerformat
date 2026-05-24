"use client";

import { OCFProvider } from "@/lib/ocf-context";
import EditorShell from "@/components/EditorShell";

export default function Home() {
  return (
    <OCFProvider>
      <EditorShell />
    </OCFProvider>
  );
}
