"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { ModuleGradesSummary } from "@/components/module-grades-summary"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGrades } from "@/contexts/grades-context"

export function ResultsTab() {
  const {
    program,
    getProgramStructure,
    calculateSemesterAverage,
    calculateYearlyAverage,
    isUEValidated,
    isSemesterValidated,
    isYearValidated,
    getValidatedECTS,
    getTotalECTS,
    getValidatedYearECTS,
    getTotalYearECTS,
    calculateUEAverage,
  } = useGrades()

  // Calculate averages
  const yearlyAverage = calculateYearlyAverage()

  // Semesters for ADI1
  const semester1Average = program === "ADI1" ? calculateSemesterAverage("Semestre 1") : 0
  const semester2Average = program === "ADI1" ? calculateSemesterAverage("Semestre 2") : 0

  // Semesters for ADI2
  const semester3Average = program === "ADI2" ? calculateSemesterAverage("Semestre 3") : 0
  const semester4Average = program === "ADI2" ? calculateSemesterAverage("Semestre 4") : 0

  return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Moyenne Annuelle</CardTitle>
              <CardDescription>Moyenne générale {program}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{yearlyAverage.toFixed(2)}/20</div>
                <div className="flex items-center justify-center">
                  {isYearValidated() ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2" />
                        <span className="font-medium">Validé</span>
                      </div>
                  ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="mr-2" />
                        <span className="font-medium">Non validé</span>
                      </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  ECTS validés: {getValidatedYearECTS()}/{getTotalYearECTS()}
                </div>
              </div>
            </CardContent>
          </Card>

          {program === "ADI1" ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Semestre 1</CardTitle>
                    <CardDescription>Moyenne du premier semestre</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{semester1Average.toFixed(2)}/20</div>
                      <div className="flex items-center justify-center">
                        {isSemesterValidated("Semestre 1") ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-2" />
                              <span className="font-medium">Validé</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="mr-2" />
                              <span className="font-medium">Non validé</span>
                            </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        ECTS validés: {getValidatedECTS("Semestre 1")}/{getTotalECTS("Semestre 1")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Semestre 2</CardTitle>
                    <CardDescription>Moyenne du second semestre</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{semester2Average.toFixed(2)}/20</div>
                      <div className="flex items-center justify-center">
                        {isSemesterValidated("Semestre 2") ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-2" />
                              <span className="font-medium">Validé</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="mr-2" />
                              <span className="font-medium">Non validé</span>
                            </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        ECTS validés: {getValidatedECTS("Semestre 2")}/{getTotalECTS("Semestre 2")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
          ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Semestre 3</CardTitle>
                    <CardDescription>Moyenne du premier semestre ADI2</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{semester3Average.toFixed(2)}/20</div>
                      <div className="flex items-center justify-center">
                        {isSemesterValidated("Semestre 3") ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-2" />
                              <span className="font-medium">Validé</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="mr-2" />
                              <span className="font-medium">Non validé</span>
                            </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        ECTS validés: {getValidatedECTS("Semestre 3")}/{getTotalECTS("Semestre 3")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Semestre 4</CardTitle>
                    <CardDescription>Moyenne du second semestre ADI2</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{semester4Average.toFixed(2)}/20</div>
                      <div className="flex items-center justify-center">
                        {isSemesterValidated("Semestre 4") ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="mr-2" />
                              <span className="font-medium">Validé</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="mr-2" />
                              <span className="font-medium">Non validé</span>
                            </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        ECTS validés: {getValidatedECTS("Semestre 4")}/{getTotalECTS("Semestre 4")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
          )}
        </div>

        <div className="mt-6">
          <ModuleGradesSummary />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Résumé par UE</CardTitle>
            <CardDescription>Moyennes et statut de validation par Unité d'Enseignement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semestre</TableHead>
                    <TableHead>UE</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>ECTS</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(getProgramStructure()).map(([semesterName, semesterData]) =>
                      Object.entries(semesterData).map(([ueName, ueData]: [string, any]) => {
                        const average = calculateUEAverage(semesterName, ueName)
                        const validated = isUEValidated(semesterName, ueName)

                        return (
                            <TableRow key={`${semesterName}-${ueName}`}>
                              <TableCell>{semesterName}</TableCell>
                              <TableCell>{ueName}</TableCell>
                              <TableCell>{average.toFixed(2)}</TableCell>
                              <TableCell>{ueData.credits}</TableCell>
                              <TableCell>
                                {validated ? (
                                    <Badge className="bg-green-100 text-green-800">Validée</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      Non validée
                                    </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                        )
                      }),
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </>
  )
}
