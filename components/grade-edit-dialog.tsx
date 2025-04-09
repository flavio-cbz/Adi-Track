"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useGrades, type GradeEntry } from "@/contexts/grades-context"

interface GradeEditDialogProps {
  isOpen: boolean
  onClose: () => void
  grade: GradeEntry | null
  onSave: (updatedGrade: GradeEntry) => void
}

export function GradeEditDialog({ isOpen, onClose, grade, onSave }: GradeEditDialogProps) {
  const { getProgramStructure } = useGrades()
  const [editedGrade, setEditedGrade] = useState<GradeEntry | null>(grade)
  const [error, setError] = useState<string>("")

  // Reset form when dialog opens with new grade
  useEffect(() => {
    if (grade && (!editedGrade || grade.id !== editedGrade.id)) {
      setEditedGrade(grade)
      setError("")
    }
  }, [grade, editedGrade])

  if (!editedGrade) return null

  // Check if evaluation type is available for the course
  const isEvaluationTypeAvailable = (type: "written" | "continuous" | "project") => {
    if (!editedGrade) return false

    const programStructure = getProgramStructure()
    const semesterData = programStructure[editedGrade.semester as keyof typeof programStructure]
    if (!semesterData) return false

    const ueData = semesterData[editedGrade.ue as keyof typeof semesterData]
    if (!ueData) return false

    const courseData = ueData.courses[editedGrade.courseName as keyof typeof ueData.courses]
    return courseData && courseData.weights[type] > 0
  }

  const handleSave = () => {
    // Validation
    if (
      !editedGrade.isAbsent &&
      (isNaN(Number(editedGrade.grade)) || Number(editedGrade.grade) < 0 || Number(editedGrade.grade) > 20)
    ) {
      setError("La note doit être un nombre entre 0 et 20.")
      return
    }

    // Check if evaluation type is available
    if (!isEvaluationTypeAvailable(editedGrade.evaluationType)) {
      setError(`Le type d'évaluation "${editedGrade.evaluationType}" n'est pas disponible pour ce cours.`)
      return
    }

    // Format grade value
    const formattedGrade = {
      ...editedGrade,
      grade: editedGrade.isAbsent ? "ABS" : Number(editedGrade.grade),
    }

    onSave(formattedGrade)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
          <DialogDescription>
            Modifiez les détails de cette note. Cliquez sur enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semester" className="text-right">
              Semestre
            </Label>
            <div className="col-span-3">
              <Input id="semester" value={editedGrade.semester} disabled />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ue" className="text-right">
              UE
            </Label>
            <div className="col-span-3">
              <Input id="ue" value={editedGrade.ue} disabled />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courseName" className="text-right">
              Cours
            </Label>
            <div className="col-span-3">
              <Input id="courseName" value={editedGrade.courseName} disabled />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evaluationType" className="text-right">
              Type
            </Label>
            <div className="col-span-3">
              <Select
                value={editedGrade.evaluationType}
                onValueChange={(value) =>
                  setEditedGrade({ ...editedGrade, evaluationType: value as "written" | "continuous" | "project" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type d'évaluation" />
                </SelectTrigger>
                <SelectContent>
                  {isEvaluationTypeAvailable("written") && <SelectItem value="written">Épreuve écrite</SelectItem>}
                  {isEvaluationTypeAvailable("continuous") && (
                    <SelectItem value="continuous">Contrôle continu</SelectItem>
                  )}
                  {isEvaluationTypeAvailable("project") && <SelectItem value="project">Projet</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAbsent" className="text-right">
              Absence
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="isAbsent"
                checked={editedGrade.isAbsent}
                onCheckedChange={(checked) => setEditedGrade({ ...editedGrade, isAbsent: checked })}
              />
            </div>
          </div>

          {!editedGrade.isAbsent && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Note
              </Label>
              <div className="col-span-3">
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="20"
                  step="0.01"
                  value={editedGrade.grade.toString()}
                  onChange={(e) => setEditedGrade({ ...editedGrade, grade: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coefficient" className="text-right">
              Coefficient
            </Label>
            <div className="col-span-3">
              <Input
                id="coefficient"
                type="number"
                min="0"
                step="0.1"
                value={editedGrade.coefficient}
                onChange={(e) => setEditedGrade({ ...editedGrade, coefficient: Number(e.target.value) })}
              />
            </div>
          </div>

          {editedGrade.isAbsent && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="absenceJustified" className="text-right">
                Justifiée
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="absenceJustified"
                  checked={editedGrade.absenceJustified || false}
                  onCheckedChange={(checked) => setEditedGrade({ ...editedGrade, absenceJustified: checked })}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
