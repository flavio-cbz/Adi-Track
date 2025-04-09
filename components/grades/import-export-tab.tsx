"use client"

import { ImportExportPanel } from "@/components/import-export-panel"
import { useGrades } from "@/contexts/grades-context"

export function ImportExportTab() {
  const { entries, importEntries } = useGrades()

  return <ImportExportPanel entries={entries} onImport={importEntries} />
}
