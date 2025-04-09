"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGradesStore } from "@/lib/stores/grades-store"

interface Grade {
  id: string
  title: string
  code: string
  date: string
  grade: number
  coefficient: number
  absence: boolean
  absenceJustified: boolean
}

export function DataVerification() {
  const { grades, updateGrade } = useGradesStore()
  const [verifiedGrades, setVerifiedGrades] = useState<Record<string, boolean>>({})
  const [flaggedGrades, setFlaggedGrades] = useState<Record<string, boolean>>({})
  const [editingGrade, setEditingGrade] = useState<string | null>(null)
  const [newGradeValue, setNewGradeValue] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<any | null>(null)
  const { toast } = useToast()

  // Calculer le pourcentage de vérification
  const totalGrades = grades.length
  const verifiedCount = Object.values(verifiedGrades).filter(Boolean).length
  const verificationPercentage = totalGrades > 0 ? Math.round((verifiedCount / totalGrades) * 100) : 0

  // Gérer la vérification d'une note
  const handleVerify = (gradeId: string) => {
    setVerifiedGrades((prev) => ({
      ...prev,
      [gradeId]: true,
    }))

    // Si la note était flaggée, la déflaguer
    if (flaggedGrades[gradeId]) {
      setFlaggedGrades((prev) => {
        const newFlags = { ...prev }
        delete newFlags[gradeId]
        return newFlags
      })
    }
  }

  // Gérer le signalement d'une note incorrecte
  const handleFlag = (gradeId: string) => {
    setFlaggedGrades((prev) => ({
      ...prev,
      [gradeId]: true,
    }))

    // Si la note était vérifiée, la dévérifier
    if (verifiedGrades[gradeId]) {
      setVerifiedGrades((prev) => {
        const newVerified = { ...prev }
        delete newVerified[gradeId]
        return newVerified
      })
    }
  }

  // Ouvrir le dialogue de modification
  const openEditDialog = (grade: any) => {
    setSelectedGrade(grade)
    setNewGradeValue(grade.absence ? "" : grade.grade.toString())
    setIsDialogOpen(true)
  }

  // Sauvegarder la modification
  const saveGradeEdit = () => {
    if (!selectedGrade) return

    // Valider la nouvelle valeur
    const numValue = Number.parseFloat(newGradeValue)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) {
      toast({
        title: "Erreur",
        description: "La note doit être un nombre entre 0 et 20",
        variant: "destructive",
      })
      return
    }

    // Mettre à jour la note
    updateGrade(selectedGrade.id, {
      ...selectedGrade,
      grade: numValue,
      absence: false,
    })

    // Marquer comme vérifiée
    setVerifiedGrades((prev) => ({
      ...prev,
      [selectedGrade.id]: true,
    }))

    // Supprimer le flag si présent
    if (flaggedGrades[selectedGrade.id]) {
      setFlaggedGrades((prev) => {
        const newFlags = { ...prev }
        delete newFlags[selectedGrade.id]
        return newFlags
      })
    }

    setIsDialogOpen(false)
    setSelectedGrade(null)

    toast({
      title: "Note modifiée",
      description: "La note a été mise à jour avec succès",
    })
  }

  // Vérifier toutes les notes
  const verifyAllGrades = () => {
    const allVerified: Record<string, boolean> = {}
    grades.forEach((grade: Grade) => {
      allVerified[grade.id] = true
    })
    setVerifiedGrades(allVerified)
    setFlaggedGrades({})

    toast({
      title: "Vérification terminée",
      description: "Toutes les notes ont été marquées comme vérifiées",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vérification des données</CardTitle>
          <CardDescription>
            Vérifiez l'exactitude de vos notes importées depuis Aurion avant de continuer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Progression de la vérification</p>
              <p className="text-sm">
                {verifiedCount} / {totalGrades} notes vérifiées
              </p>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${verificationPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Épreuve</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                  <TableHead className="text-right">Coefficient</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow
                    key={grade.id}
                    className={flaggedGrades[grade.id] ? "bg-red-50" : verifiedGrades[grade.id] ? "bg-green-50" : ""}
                  >
                    <TableCell>{grade.date}</TableCell>
                    <TableCell>{grade.title}</TableCell>
                    <TableCell className="text-right font-medium">
                      {grade.absence ? "ABS" : grade.grade.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{grade.coefficient}</TableCell>
                    <TableCell>
                      {flaggedGrades[grade.id] ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          <AlertCircle className="mr-1 h-3 w-3" /> À vérifier
                        </Badge>
                      ) : verifiedGrades[grade.id] ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" /> Vérifiée
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerify(grade.id)}
                          disabled={verifiedGrades[grade.id]}
                          title="Marquer comme vérifiée"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="sr-only">Vérifier</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFlag(grade.id)}
                          disabled={flaggedGrades[grade.id]}
                          title="Signaler une erreur"
                        >
                          <X className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Signaler</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(grade)}
                          title="Modifier la note"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={verifyAllGrades}>
            Tout vérifier
          </Button>
          <Button
            disabled={verificationPercentage < 100}
            onClick={() => {
              toast({
                title: "Vérification terminée",
                description: "Toutes les notes ont été vérifiées avec succès",
              })
            }}
          >
            Confirmer la vérification
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la note</DialogTitle>
            <DialogDescription>Corrigez la note pour l'épreuve {selectedGrade?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="grade-value" className="text-sm font-medium">
                Nouvelle note
              </label>
              <Input
                id="grade-value"
                value={newGradeValue}
                onChange={(e) => setNewGradeValue(e.target.value)}
                placeholder="Entrez une note entre 0 et 20"
              />
              <p className="text-xs text-muted-foreground">
                Utilisez un point (.) comme séparateur décimal si nécessaire.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveGradeEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
