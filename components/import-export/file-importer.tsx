"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Info, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { parseCSV, parseJSON, validateImportedData } from "@/lib/file-parsers"

interface FileImporterProps {
  onImport: (importedEntries: any[]) => void
}

export function FileImporter({ onImport }: FileImporterProps) {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const { toast } = useToast()

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setImportError(null)
    }
  }

  // Read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error("Échec de la lecture du fichier"))
        }
      }
      reader.onerror = () => reject(new Error("Échec de la lecture du fichier"))
      reader.readAsText(file)
    })
  }

  // Import data from file
  const importData = async () => {
    if (!importFile) {
      setImportError("Veuillez sélectionner un fichier à importer")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          const newProgress = prev + Math.random() * 20
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 200)

      // Read file content
      const fileContent = await readFileContent(importFile)

      // Parse file based on type
      let importedEntries: any[] = []

      if (importFile.name.endsWith(".csv")) {
        importedEntries = parseCSV(fileContent)
      } else if (importFile.name.endsWith(".json")) {
        importedEntries = parseJSON(fileContent)
      } else {
        throw new Error("Format de fichier non supporté. Veuillez utiliser un fichier CSV ou JSON.")
      }

      // Validate imported data
      validateImportedData(importedEntries)

      // Complete progress
      clearInterval(progressInterval)
      setImportProgress(100)

      // Import data
      onImport(importedEntries)

      toast({
        title: "Importation réussie",
        description: `${importedEntries.length} notes ont été importées avec succès`,
      })

      // Reset state
      setTimeout(() => {
        setImportFile(null)
        setImportProgress(0)
        setIsImporting(false)
      }, 1000)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'importation")
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="import-file">Sélectionner un fichier</Label>
        <Input id="import-file" type="file" accept=".csv,.json" onChange={handleFileChange} disabled={isImporting} />
        <p className="text-sm text-muted-foreground">Formats acceptés: CSV, JSON</p>
      </div>

      {importFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fichier sélectionné:</span>
            <span className="text-sm">{importFile.name}</span>
          </div>

          {isImporting && (
            <div className="space-y-1">
              <Progress value={importProgress} className="h-2" />
              <div className="text-xs text-right text-muted-foreground">{Math.round(importProgress)}%</div>
            </div>
          )}
        </div>
      )}

      {importError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur d'importation</AlertTitle>
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Format d'importation</AlertTitle>
        <AlertDescription>
          <p>Le fichier CSV doit contenir les colonnes suivantes:</p>
          <p className="text-xs font-mono mt-1">semester,ue,courseName,grade,coefficient,isAbsent,evaluationType</p>
        </AlertDescription>
      </Alert>

      <Button onClick={importData} disabled={!importFile || isImporting} className="w-full">
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Importation en cours..." : "Importer les notes"}
      </Button>
    </div>
  )
}
