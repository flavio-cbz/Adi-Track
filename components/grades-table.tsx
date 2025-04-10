"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Search, HelpCircle, Edit2, Filter, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGradesStore } from "@/lib/stores/grades-store"
import { calculateUEAverage, extractModuleCode } from "@/lib/grades-processor"
import { extractUECode } from "@/lib/utils"

interface GradesTableProps {
  detailed?: boolean
  validation?: boolean
}

export function GradesTable({ detailed = false, validation = false }: GradesTableProps) {
  const { grades, semester, updateGrade } = useGradesStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<any | null>(null)
  const [absenceType, setAbsenceType] = useState<"justified" | "unjustified" | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterUE, setFilterUE] = useState<string | null>(null)
  const [filterModule, setFilterModule] = useState<string | null>(null)

  // Filtrer les notes selon les critères
  const filteredGrades = grades.filter((grade) => {
    const matchesSearch =
      grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesUE = filterUE ? extractUECode(grade.code) === filterUE : true

    const moduleCode = grade.moduleCode || extractModuleCode(grade.code)
    const matchesModule = filterModule ? moduleCode === filterModule : true

    return matchesSearch && matchesUE && matchesModule
  })

  // Obtenir la liste des UE pour le filtre
  const ueList = Array.from(new Set(grades.map((grade) => extractUECode(grade.code))))

  // Obtenir la liste des modules pour le filtre
  const moduleList = Array.from(new Set(grades.map((grade) => grade.moduleCode || extractModuleCode(grade.code))))

  const handleAbsenceEdit = (grade: any) => {
    setSelectedGrade(grade)
    setAbsenceType(grade.absenceJustified ? "justified" : "unjustified")
    setIsDialogOpen(true)
  }

  const saveAbsenceChange = () => {
    if (selectedGrade && absenceType) {
      updateGrade(selectedGrade.id, {
        ...selectedGrade,
        absenceJustified: absenceType === "justified",
      })
      setIsDialogOpen(false)
    }
  }

  const exportToCSV = () => {
    // Préparer les données
    const headers = detailed
      ? ["Date", "Code", "Module", "Intitulé", "Note", "Coefficient", "Absence", "Justifiée"]
      : ["UE", "Intitulé", "Moyenne", "ECTS", "Statut"]

    let rows = []

    if (detailed) {
      rows = filteredGrades.map((grade) => [
        grade.date,
        grade.code,
        grade.moduleCode || extractModuleCode(grade.code),
        grade.title,
        grade.absence ? "ABS" : grade.grade.toFixed(2),
        grade.coefficient,
        grade.absence ? "Oui" : "Non",
        grade.absence ? (grade.absenceJustified ? "Oui" : "Non") : "",
      ])
    } else {
      // Grouper par UE pour l'affichage simplifié
      rows = semester.ues.map((ue) => {
        const average = calculateUEAverage(ue.courses)
        const isValidated = average >= 10

        return [
          ue.code,
          ue.name,
          average.toFixed(2),
          `${isValidated ? ue.ects : 0}/${ue.ects}`,
          isValidated ? "Validée" : "Non validée",
        ]
      })
    }

    // Convertir en CSV
    const csvContent = [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n")

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", detailed ? "notes_detaillees.csv" : "resultats_ue.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (validation) {
    // Simuler des moyennes officielles pour la comparaison
    const officialAverages = semester.ues.reduce(
      (acc, ue) => {
        const calculatedAverage = calculateUEAverage(ue.courses)
        // Simuler une légère différence pour certaines UE
        const variation = Math.random() * 0.4 - 0.2
        acc[ue.code] = calculatedAverage + variation
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Comparaison des moyennes</h3>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UE</TableHead>
              <TableHead className="text-right">Moyenne calculée</TableHead>
              <TableHead className="text-right">Moyenne bulletin</TableHead>
              <TableHead className="text-right">Écart</TableHead>
              <TableHead className="text-right">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semester.ues.map((ue) => {
              // Calcul de la moyenne
              const average = calculateUEAverage(ue.courses)
              // Moyenne du bulletin (simulée)
              const officialAverage = officialAverages[ue.code]
              const diff = average - officialAverage
              const isValid = Math.abs(diff) < 0.1

              return (
                <TableRow key={ue.code} className={Math.abs(diff) >= 0.5 ? "bg-amber-50" : ""}>
                  <TableCell className="font-medium">{ue.code}</TableCell>
                  <TableCell className="text-right">{average.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{officialAverage.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${Math.abs(diff) >= 0.5 ? "text-amber-700" : ""}`}>
                    {diff.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {isValid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" /> Validé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <AlertCircle className="mr-1 h-3 w-3" /> À vérifier
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (detailed) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une épreuve..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer par UE
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterUE(null)}>Toutes les UE</DropdownMenuItem>
                {ueList.map((ue) => (
                  <DropdownMenuItem key={ue} onClick={() => setFilterUE(ue)}>
                    {ue}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer par Module
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterModule(null)}>Tous les modules</DropdownMenuItem>
                {moduleList.map((module) => (
                  <DropdownMenuItem key={module} onClick={() => setFilterModule(module)}>
                    {module}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Intitulé</TableHead>
              <TableHead className="text-right">Note</TableHead>
              <TableHead className="text-right">Coefficient</TableHead>
              <TableHead>Absence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{grade.date}</TableCell>
                <TableCell className="font-mono text-xs">{grade.code}</TableCell>
                <TableCell className="font-medium">{grade.moduleCode || extractModuleCode(grade.code)}</TableCell>
                <TableCell>{grade.title}</TableCell>
                <TableCell className="text-right font-medium">
                  {grade.absence ? "ABS" : grade.grade.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium">{grade.coefficient}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cette note compte {grade.coefficient} fois dans la moyenne du module</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {grade.absence && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={
                              grade.absenceJustified
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {grade.absenceJustified ? "Justifiée" : "Non justifiée"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {grade.absenceJustified
                            ? "Cette absence est justifiée et sera neutralisée dans le calcul"
                            : "Cette absence n'est pas justifiée et compte comme un 0"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {grade.absence && (
                    <Button variant="ghost" size="icon" onClick={() => handleAbsenceEdit(grade)}>
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Modifier le statut d'absence</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le statut d'absence</DialogTitle>
              <DialogDescription>
                Précisez si l'absence est justifiée ou non. Une absence justifiée sera neutralisée dans le calcul.
              </DialogDescription>
            </DialogHeader>
            {selectedGrade && (
              <div className="space-y-4 py-2">
                <div>
                  <p className="font-medium">{selectedGrade.title}</p>
                  <p className="text-sm text-muted-foreground">Date: {selectedGrade.date}</p>
                </div>
                <RadioGroup value={absenceType || ""} onValueChange={(value) => setAbsenceType(value as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="justified" id="justified" />
                    <Label htmlFor="justified">Absence justifiée</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">L'absence sera neutralisée dans le calcul de la moyenne</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unjustified" id="unjustified" />
                    <Label htmlFor="unjustified">Absence non justifiée</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">L'absence sera comptée comme un 0 dans le calcul de la moyenne</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </RadioGroup>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={saveAbsenceChange}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Vue simplifiée par défaut
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Résultats par UE</h3>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UE</TableHead>
            <TableHead>Intitulé</TableHead>
            <TableHead className="text-right">Moyenne</TableHead>
            <TableHead className="text-right">ECTS</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semester.ues.map((ue) => {
            // Calcul de la moyenne
            const average = calculateUEAverage(ue.courses)
            const isValidated = average >= 10

            return (
              <TableRow key={ue.code}>
                <TableCell className="font-medium">{ue.code}</TableCell>
                <TableCell>{ue.name}</TableCell>
                <TableCell className="text-right font-medium">{average.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {isValidated ? ue.ects : 0}/{ue.ects}
                </TableCell>
                <TableCell>
                  {isValidated ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Validée</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Non validée
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
