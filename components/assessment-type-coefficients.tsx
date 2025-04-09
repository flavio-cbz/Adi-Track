"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface AssessmentTypeCoefficient {
  id: string
  type: string
  code: string
  coefficient: number
}

interface AssessmentTypeCoefficientsProps {
  coefficients: AssessmentTypeCoefficient[]
  onSave: (coefficients: AssessmentTypeCoefficient[]) => void
}

export function AssessmentTypeCoefficients({ coefficients, onSave }: AssessmentTypeCoefficientsProps) {
  const [editedCoefficients, setEditedCoefficients] = useState<AssessmentTypeCoefficient[]>(coefficients)
  const [newType, setNewType] = useState("")
  const [newCode, setNewCode] = useState("")
  const [newCoefficient, setNewCoefficient] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Handle coefficient change
  const handleCoefficientChange = (id: string, value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      setError("Le coefficient doit être un nombre positif")
      return
    }

    setEditedCoefficients(
      editedCoefficients.map((coef) => (coef.id === id ? { ...coef, coefficient: numValue } : coef)),
    )
    setError(null)
  }

  // Add new assessment type coefficient
  const addCoefficient = () => {
    if (!newType.trim()) {
      setError("Le type d'évaluation est requis")
      return
    }

    if (!newCode.trim()) {
      setError("Le code est requis")
      return
    }

    if (isNaN(newCoefficient) || newCoefficient <= 0) {
      setError("Le coefficient doit être un nombre positif")
      return
    }

    // Check if code already exists
    if (editedCoefficients.some((coef) => coef.code.toLowerCase() === newCode.toLowerCase())) {
      setError("Ce code existe déjà")
      return
    }

    const newId = Date.now().toString()
    setEditedCoefficients([
      ...editedCoefficients,
      {
        id: newId,
        type: newType,
        code: newCode,
        coefficient: newCoefficient,
      },
    ])

    // Reset form
    setNewType("")
    setNewCode("")
    setNewCoefficient(1)
    setError(null)
  }

  // Remove coefficient
  const removeCoefficient = (id: string) => {
    setEditedCoefficients(editedCoefficients.filter((coef) => coef.id !== id))
  }

  // Save all coefficients
  const saveCoefficients = () => {
    onSave(editedCoefficients)
    toast({
      title: "Coefficients enregistrés",
      description: "Les coefficients des types d'évaluation ont été mis à jour",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coefficients par type d'évaluation</CardTitle>
        <CardDescription>
          Définissez des coefficients pour chaque type d'évaluation qui seront appliqués universellement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Ces coefficients seront appliqués à toutes les évaluations du type correspondant, en plus des coefficients
            spécifiques à chaque épreuve.
          </AlertDescription>
        </Alert>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type d'évaluation</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedCoefficients.map((coef) => (
                <TableRow key={coef.id}>
                  <TableCell>{coef.type}</TableCell>
                  <TableCell className="font-mono text-xs">{coef.code}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={coef.coefficient}
                      onChange={(e) => handleCoefficientChange(coef.id, e.target.value)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => removeCoefficient(coef.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="new-type">Type d'évaluation</Label>
            <Input
              id="new-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Ex: Devoir Surveillé"
            />
          </div>
          <div>
            <Label htmlFor="new-code">Code</Label>
            <Input
              id="new-code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Ex: DS"
              className="font-mono"
            />
          </div>
          <div>
            <Label htmlFor="new-coefficient">Coefficient</Label>
            <Input
              id="new-coefficient"
              type="number"
              min="0.1"
              step="0.1"
              value={newCoefficient}
              onChange={(e) => setNewCoefficient(Number.parseFloat(e.target.value))}
            />
          </div>
          <Button onClick={addCoefficient} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveCoefficients}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les coefficients
        </Button>
      </CardFooter>
    </Card>
  )
}
