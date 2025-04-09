import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useGradesStore } from "@/lib/stores/grades-store"
import { calculateUEAverage, isUEValidated } from "@/lib/grades-processor"

export function UEProgress() {
  // Utiliser le store pour accéder aux données
  const { semester } = useGradesStore()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Progression par UE</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Une UE est validée si sa moyenne est supérieure ou égale à 10/20</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>État de validation des unités d'enseignement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {semester.ues.map((ue) => {
            const average = calculateUEAverage(ue.courses)
            const validated = isUEValidated(ue)

            return (
              <div key={ue.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${validated ? "bg-green-500" : "bg-red-500"}`} />
                    <p className="text-sm font-medium">{ue.name}</p>
                  </div>
                  <p className="text-sm font-semibold">{average.toFixed(2)}</p>
                </div>
                <Progress
                  value={average * 5} // Multiplié par 5 pour avoir une échelle 0-100 à partir de 0-20
                  className={`h-2 ${validated ? "bg-muted" : "bg-muted/50"}`}
                  indicatorClassName={validated ? "bg-green-500" : "bg-red-500"}
                />
                <div className="flex items-center justify-between text-xs">
                  <p className={validated ? "text-green-600" : "text-red-600"}>
                    {validated ? "Validée" : "Non validée"}
                  </p>
                  <p className="text-muted-foreground">{ue.ects} ECTS</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Modules: {ue.courses.map((course) => course.code).join(", ")}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
