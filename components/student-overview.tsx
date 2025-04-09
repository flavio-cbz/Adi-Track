import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGradesStore } from "@/lib/stores/grades-store"
import { calculateSemesterAverage, calculateValidatedECTS, analyzeAbsences } from "@/lib/grades-processor"

export function StudentOverview() {
  // Utiliser le store pour accéder aux données
  const { grades, semester } = useGradesStore()

  // Calculer les statistiques de l'étudiant
  const averageGrade = calculateSemesterAverage(semester)
  const totalECTS = semester.ues.reduce((sum, ue) => sum + ue.ects, 0)
  const validatedECTS = calculateValidatedECTS(semester.ues)
  const absences = analyzeAbsences(grades)

  // Déterminer le statut du semestre
  const status = averageGrade >= 10 ? "Validé" : "Non validé"

  // Calculer le pourcentage d'ECTS validés
  const ectsProgress = (validatedECTS / totalECTS) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Profil étudiant</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Un semestre est validé si la moyenne générale est supérieure ou égale à 10/20
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Vue d'ensemble de votre progression</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Nom</p>
              <p className="text-sm">Étudiant ADIMAKER</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Année</p>
              <p className="text-sm">ADI1</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Semestre</p>
              <p className="text-sm">{semester.code}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Moyenne générale</p>
              <p className="text-sm font-semibold">{averageGrade.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Statut</p>
              {status === "Validé" ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Validé
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Non validé
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">ECTS validés</p>
              <p className="text-sm">
                {validatedECTS} / {totalECTS}
              </p>
            </div>
            <Progress value={ectsProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{ectsProgress.toFixed(0)}% des ECTS validés</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Absences</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2 text-center">
                <p className="text-xs text-muted-foreground">Justifiées</p>
                <p className="text-lg font-bold">{absences.justified}</p>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <p className="text-xs text-muted-foreground">Non justifiées</p>
                <p className="text-lg font-bold text-red-500">{absences.unjustified}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
