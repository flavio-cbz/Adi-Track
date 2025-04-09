"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGrades } from "@/contexts/grades-context"

export function DetailsTab() {
  const { program, getProgramStructure, calculateUEAverage, isUEValidated, entries } = useGrades()
  const [activeTab, setActiveTab] = useState<string>(program === "ADI1" ? "Semestre 1" : "Semestre 3")

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {program === "ADI1" ? (
          <>
            <TabsTrigger value="Semestre 1">Semestre 1</TabsTrigger>
            <TabsTrigger value="Semestre 2">Semestre 2</TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="Semestre 3">Semestre 3</TabsTrigger>
            <TabsTrigger value="Semestre 4">Semestre 4</TabsTrigger>
            {Object.keys(getProgramStructure()).includes("Stage") && <TabsTrigger value="Stage">Stage</TabsTrigger>}
          </>
        )}
      </TabsList>

      {Object.entries(getProgramStructure()).map(([semesterName, semesterData]) => (
        <TabsContent key={semesterName} value={semesterName} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(semesterData).map(([ueName, ueData]: [string, any]) => {
              const ueAverage = calculateUEAverage(semesterName, ueName)
              const validated = isUEValidated(semesterName, ueName)

              return (
                <Card key={ueName}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{ueName}</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={validated ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"}>
                              {ueAverage.toFixed(2)}/20
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{validated ? "UE validée" : "UE non validée"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CardDescription>{ueData.credits} ECTS</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(ueData.courses).map(([courseName, courseData]: [string, any]) => {
                        // Filter entries for this course
                        const courseEntries = entries.filter(
                          (entry) =>
                            entry.semester === semesterName &&
                            entry.ue === ueName &&
                            (entry.courseName === courseName || entry.moduleCode === courseName),
                        )

                        // Calculate averages by evaluation type
                        const evaluationAverages: Record<string, number> = {
                          written: 0,
                          continuous: 0,
                          project: 0,
                        }

                        const evaluationCounts: Record<string, number> = {
                          written: 0,
                          continuous: 0,
                          project: 0,
                        }

                        courseEntries.forEach((entry) => {
                          if (entry.isAbsent && entry.absenceJustified) {
                            // Skip justified absences
                            return
                          }

                          const gradeValue = entry.isAbsent ? 0 : Number(entry.grade)
                          const weight = Number(entry.coefficient)

                          evaluationAverages[entry.evaluationType] += gradeValue * weight
                          evaluationCounts[entry.evaluationType] += weight
                        })

                        Object.keys(evaluationAverages).forEach((type) => {
                          if (evaluationCounts[type] > 0) {
                            evaluationAverages[type] /= evaluationCounts[type]
                          }
                        })

                        // Calculate course average
                        let courseAverage = 0
                        let totalWeightPercentage = 0

                        if (evaluationCounts.written > 0 && courseData.weights.written > 0) {
                          courseAverage += evaluationAverages.written * (courseData.weights.written / 100)
                          totalWeightPercentage += courseData.weights.written
                        }

                        if (evaluationCounts.continuous > 0 && courseData.weights.continuous > 0) {
                          courseAverage += evaluationAverages.continuous * (courseData.weights.continuous / 100)
                          totalWeightPercentage += courseData.weights.continuous
                        }

                        if (evaluationCounts.project > 0 && courseData.weights.project > 0) {
                          courseAverage += evaluationAverages.project * (courseData.weights.project / 100)
                          totalWeightPercentage += courseData.weights.project
                        }

                        // Normalize if not all evaluation types are present
                        if (totalWeightPercentage > 0) {
                          courseAverage = courseAverage * (100 / totalWeightPercentage)
                        }

                        return (
                          <div key={courseName} className="border rounded-md p-3">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">{courseName}</div>
                              <div className="text-sm">
                                Coef. {courseData.coefficient} | {courseAverage.toFixed(2)}/20
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm">
                              {courseData.weights.written > 0 && (
                                <div
                                  className={`p-2 rounded-md ${evaluationCounts.written > 0 ? "bg-muted" : "bg-muted/50"}`}
                                >
                                  <div className="text-xs text-muted-foreground">
                                    Écrit ({courseData.weights.written}%)
                                  </div>
                                  <div className="font-medium">
                                    {evaluationCounts.written > 0 ? evaluationAverages.written.toFixed(2) : "N/A"}
                                  </div>
                                </div>
                              )}

                              {courseData.weights.continuous > 0 && (
                                <div
                                  className={`p-2 rounded-md ${evaluationCounts.continuous > 0 ? "bg-muted" : "bg-muted/50"}`}
                                >
                                  <div className="text-xs text-muted-foreground">
                                    CC ({courseData.weights.continuous}%)
                                  </div>
                                  <div className="font-medium">
                                    {evaluationCounts.continuous > 0 ? evaluationAverages.continuous.toFixed(2) : "N/A"}
                                  </div>
                                </div>
                              )}

                              {courseData.weights.project > 0 && (
                                <div
                                  className={`p-2 rounded-md ${evaluationCounts.project > 0 ? "bg-muted" : "bg-muted/50"}`}
                                >
                                  <div className="text-xs text-muted-foreground">
                                    Projet ({courseData.weights.project}%)
                                  </div>
                                  <div className="font-medium">
                                    {evaluationCounts.project > 0 ? evaluationAverages.project.toFixed(2) : "N/A"}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
