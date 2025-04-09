"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileImporter } from "@/components/import-export/file-importer"
import { FileExporter } from "@/components/import-export/file-exporter"
import { AurionIntegration } from "@/components/import-export/aurion-integration"

interface GradeEntry {
  id: string
  semester: string
  ue: string
  courseName: string
  grade: string | number
  coefficient: number
  isAbsent: boolean
  evaluationType: "written" | "continuous" | "project"
}

interface ImportExportPanelProps {
  entries: GradeEntry[]
  onImport: (importedEntries: GradeEntry[]) => void
}

export function ImportExportPanel({ entries, onImport }: ImportExportPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importer / Exporter les notes</CardTitle>
        <CardDescription>
          Importez des notes depuis un fichier CSV ou JSON, ou exportez vos notes actuelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import">Importer</TabsTrigger>
            <TabsTrigger value="export">Exporter</TabsTrigger>
            <TabsTrigger value="aurion">Aurion</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            <FileImporter onImport={onImport} />
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <FileExporter entries={entries} />
          </TabsContent>

          <TabsContent value="aurion" className="space-y-4 mt-4">
            <AurionIntegration />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Vous pouvez modifier les données exportées dans un tableur avant de les réimporter.
        </p>
      </CardFooter>
    </Card>
  )
}
