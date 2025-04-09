"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2 } from "lucide-react"
import { GradeEditDialog } from "@/components/grade-edit-dialog"
import { useGrades, type GradeEntry } from "@/contexts/grades-context"

export function GradeEntriesList() {
  const { entries, removeEntry, updateEntry } = useGrades()
  const [editingGrade, setEditingGrade] = useState<GradeEntry | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Edit an entry
  const editEntry = (entry: GradeEntry) => {
    setEditingGrade(entry)
    setIsEditDialogOpen(true)
  }

  // Save edited entry
  const saveEditedEntry = (updatedEntry: GradeEntry) => {
    updateEntry(updatedEntry.id, updatedEntry)
    setIsEditDialogOpen(false)
    setEditingGrade(null)
  }

  if (entries.length === 0) {
    return null
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notes saisies</CardTitle>
          <CardDescription>Liste des notes enregistrées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semestre</TableHead>
                  <TableHead>UE</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Coefficient</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.semester}</TableCell>
                    <TableCell>{entry.ue}</TableCell>
                    <TableCell>{entry.moduleCode || entry.courseName}</TableCell>
                    <TableCell>
                      {entry.evaluationType === "written" && "Écrit"}
                      {entry.evaluationType === "continuous" && "CC"}
                      {entry.evaluationType === "project" && "Projet"}
                    </TableCell>
                    <TableCell className={entry.isAbsent ? "text-red-500 font-medium" : ""}>
                      {entry.isAbsent ? "ABS" : entry.grade}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium">{entry.coefficient}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cette note compte {entry.coefficient} fois dans la moyenne du module</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => editEntry(entry)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <GradeEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        grade={editingGrade}
        onSave={saveEditedEntry}
      />
    </>
  )
}
