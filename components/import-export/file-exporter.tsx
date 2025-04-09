"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Download, FileJson, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileExporterProps {
  entries: any[]
}

export function FileExporter({ entries }: FileExporterProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")
  const { toast } = useToast()

  // Export data to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["id", "semester", "ue", "courseName", "grade", "coefficient", "isAbsent", "evaluationType"]
    const rows = entries.map((entry) => [
      entry.id,
      entry.semester,
      entry.ue,
      entry.courseName,
      entry.grade,
      entry.coefficient,
      entry.isAbsent,
      entry.evaluationType,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape commas and quotes in cell values
            const cellStr = String(cell)
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download file
    downloadFile(csvContent, "notes_exportees.csv", "text/csv")

    toast({
      title: "Exportation réussie",
      description: `${entries.length} notes ont été exportées au format CSV`,
    })
  }

  // Export data to JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(entries, null, 2)
    downloadFile(jsonContent, "notes_exportees.json", "application/json")

    toast({
      title: "Exportation réussie",
      description: `${entries.length} notes ont été exportées au format JSON`,
    })
  }

  // Helper function to download a file
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Format d'exportation</Label>
        <div className="flex space-x-2">
          <Button
            variant={exportFormat === "csv" ? "default" : "outline"}
            onClick={() => setExportFormat("csv")}
            className="flex-1"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant={exportFormat === "json" ? "default" : "outline"}
            onClick={() => setExportFormat("json")}
            className="flex-1"
          >
            <FileJson className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aucune note à exporter</AlertTitle>
          <AlertDescription>Ajoutez des notes avant d'utiliser la fonction d'exportation.</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {entries.length} notes sont prêtes à être exportées.
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={exportFormat === "csv" ? exportToCSV : exportToJSON}
        disabled={entries.length === 0}
        className="w-full"
      >
        <Download className="mr-2 h-4 w-4" />
        Exporter ({entries.length} notes)
      </Button>
    </div>
  )
}
