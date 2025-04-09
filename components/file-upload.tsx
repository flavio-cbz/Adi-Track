"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, AlertCircle, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { parseCSV, parsePDF } from "@/lib/file-parser"
import { processGradesData } from "@/lib/grades-processor"
import { useGradesStore } from "@/lib/stores/grades-store"
import { useAssessmentTypeStore } from "@/lib/stores/assessment-type-store"

interface FileUploadProps {
  label?: string
  onSuccess?: (data: any) => void
  mode?: "grades" | "bulletin"
}

export function FileUpload({ label = "Importer un fichier", onSuccess, mode = "grades" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileError, setFileError] = useState<string | null>(null)
  const { toast } = useToast()
  const { addGrades } = useGradesStore()
  const { getCoefficient } = useAssessmentTypeStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()

      if (fileExtension !== "pdf" && fileExtension !== "csv") {
        setFileError("Format de fichier non supporté. Veuillez importer un fichier PDF ou CSV.")
        setFile(null)
        return
      }

      setFile(selectedFile)
    }
  }

  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress > 95) {
        clearInterval(interval)
        progress = 95
      }
      setUploadProgress(Math.min(progress, 95))
    }, 200)

    return () => clearInterval(interval)
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simuler la progression
    const stopProgress = simulateProgress()

    try {
      let parsedData: any[] = []

      // Traiter le fichier selon son type
      if (file.type === "text/csv") {
        const text = await file.text()
        parsedData = await parseCSV(text)
      } else if (file.type === "application/pdf") {
        parsedData = await parsePDF(file)
      }

      // Traiter les données selon le mode
      if (mode === "grades") {
        const processedGrades = processGradesData(parsedData)

        // Add assessment type coefficient information to the processed grades
        const gradesWithTypeCoefficients = processedGrades.map((grade) => {
          const assessmentTypeCode = extractAssessmentTypeCode(grade.code)
          return {
            ...grade,
            assessmentTypeCode,
            assessmentTypeCoefficient: getCoefficient(assessmentTypeCode),
          }
        })

        addGrades(gradesWithTypeCoefficients)

        toast({
          title: "Succès",
          description: `${processedGrades.length} notes importées avec succès`,
        })

        if (onSuccess) {
          onSuccess(gradesWithTypeCoefficients)
        }
      } else if (mode === "bulletin") {
        // Traitement spécifique pour le bulletin officiel
        toast({
          title: "Succès",
          description: "Bulletin officiel importé avec succès",
        })

        if (onSuccess) {
          onSuccess(parsedData)
        }
      }

      // Compléter la progression
      setUploadProgress(100)

      // Réinitialiser après un court délai
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setFile(null)
      }, 1000)
    } catch (error) {
      console.error("Erreur lors de l'importation:", error)
      stopProgress()

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'importation",
        variant: "destructive",
      })

      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFileError(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase()

      if (fileExtension !== "pdf" && fileExtension !== "csv") {
        setFileError("Format de fichier non supporté. Veuillez importer un fichier PDF ou CSV.")
        return
      }

      setFile(droppedFile)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          <FileUp className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">Glissez-déposez votre fichier ici ou cliquez pour parcourir</p>
          <p className="text-xs text-muted-foreground">Formats acceptés: PDF, CSV (exportés depuis Aurion)</p>
          <Input id="file-upload" type="file" accept=".pdf,.csv" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {fileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      {file && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm flex-1">Fichier sélectionné: {file.name}</p>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Importation..." : "Importer"}
              {!isUploading && <Upload className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">{uploadProgress.toFixed(0)}%</p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border p-4 bg-muted/40">
        <h3 className="font-medium mb-2">Comment importer vos notes ?</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Connectez-vous à Aurion</li>
          <li>Allez dans "Scolarité" &gt; "Notes"</li>
          <li>Exportez le relevé au format CSV ou PDF</li>
          <li>Importez le fichier ci-dessus</li>
        </ol>
      </div>
    </div>
  )
}

function extractAssessmentTypeCode(code: string): string {
  // Implement your logic to extract the assessment type code from the grade code
  // This is just a placeholder, replace it with your actual implementation
  return code.substring(0, 3) // Example: Extract the first 3 characters
}
