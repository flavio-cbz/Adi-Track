"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GradeEntriesList } from "@/components/grades/grade-entries-list"
import { GradeCoefficientExplainer } from "@/components/grade-coefficient-explainer"
import { useGrades } from "@/contexts/grades-context"
import { useForm } from "@/contexts/form-context"

export function GradeInputForm() {
  const { program, setProgram, resetEntries } = useGrades()
  const {
    semester,
    setSemester,
    ue,
    setUe,
    courseName,
    setCourseName,
    grade,
    setGrade,
    evaluationType,
    setEvaluationType,
    isAbsent,
    setIsAbsent,
    coefficient,
    setCoefficient,
    error,
    getAvailableSemesters,
    getAvailableUEs,
    getAvailableCourses,
    isEvaluationTypeAvailable,
    submitForm,
  } = useForm()

  // Handle program change
  const handleProgramChange = (value: "ADI1" | "ADI2") => {
    setProgram(value)
    setSemester("")
    setUe("")
    setCourseName("")
  }

  return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Saisie des Notes</CardTitle>
            <CardDescription>Entrez les informations pour chaque évaluation</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
              {/* Program selection */}
              <div className="mb-6">
                <Label htmlFor="program">Programme</Label>
                <Select value={program} onValueChange={(value: "ADI1" | "ADI2") => handleProgramChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADI1">ADI1 (Semestre 1 et 2)</SelectItem>
                    <SelectItem value="ADI2">ADI2 (Semestre 3 et 4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semestre</Label>
                  <Select
                      value={semester}
                      onValueChange={(value) => {
                        setSemester(value)
                        setUe("")
                        setCourseName("")
                      }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSemesters().map((sem) => (
                          <SelectItem key={sem} value={sem}>
                            {sem}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ue">Unité d'Enseignement</Label>
                  <Select
                      value={ue}
                      onValueChange={(value) => {
                        setUe(value)
                        setCourseName("")
                      }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une UE" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableUEs().map((ueName) => (
                          <SelectItem key={ueName} value={ueName}>
                            {ueName}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="courseName">Cours (Module)</Label>
                <Select value={courseName} onValueChange={setCourseName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCourses().map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="evaluationType">Type d'évaluation</Label>
                <Select
                    value={evaluationType}
                    onValueChange={(value) => setEvaluationType(value as "written" | "continuous" | "project")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type d'évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseName && (
                        <>
                          {isEvaluationTypeAvailable("written") && <SelectItem value="written">Épreuve écrite</SelectItem>}
                          {isEvaluationTypeAvailable("continuous") && (
                              <SelectItem value="continuous">Contrôle continu</SelectItem>
                          )}
                          {isEvaluationTypeAvailable("project") && <SelectItem value="project">Projet</SelectItem>}
                        </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="coefficient">Coefficient de la note</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                          id="coefficient"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={coefficient}
                          onChange={(e) => setCoefficient(e.target.value)}
                          placeholder="Ex: 1"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Le coefficient détermine le poids de cette note dans la moyenne du module. Une note avec un
                        coefficient de 2 compte comme si elle était entrée deux fois.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="isAbsent" className="flex-grow">
                  Absence
                </Label>
                <Switch id="isAbsent" checked={isAbsent} onCheckedChange={setIsAbsent} />
              </div>

              {!isAbsent && (
                  <div>
                    <Label htmlFor="grade">Note (sur 20)</Label>
                    <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Ex: 15.5"
                    />
                  </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetEntries}>
              Réinitialiser tout
            </Button>
            <Button onClick={submitForm}>Ajouter</Button>
          </CardFooter>
        </Card>

        <GradeCoefficientExplainer className="mt-6" />

        <GradeEntriesList />
      </>
  )
}
