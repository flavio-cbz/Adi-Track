import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useGradesStore } from "@/lib/stores/grades-store"
import { calculateUEAverage, calculateStatistics } from "@/lib/grades-processor"
import { useAssessmentTypeStore } from "@/lib/stores/assessment-type-store"

export function SemesterSummary() {
  // Utiliser le store pour accéder aux données
  const { grades, semester } = useGradesStore()
  const { coefficients } = useAssessmentTypeStore()

  // Préparer les données pour le graphique
  const chartData = semester.ues.map((ue) => {
    const average = calculateUEAverage(ue.courses)

    // Calculer les statistiques pour cette UE
    const allGrades = ue.courses.flatMap((course) => course.grades)
    const stats = calculateStatistics(allGrades)

    return {
      name: ue.code,
      average,
      min: stats.min,
      max: stats.max,
    }
  })

  // Calculer les statistiques globales
  const statisticsData = calculateStatistics(grades)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Résumé du semestre</CardTitle>
        <CardDescription>Moyennes et statistiques par UE</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Graphique</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 20]} />
                  <RechartsTooltip
                    formatter={(value) => [`${value}`, "Moyenne"]}
                    labelFormatter={(label) => `UE: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="average" name="Moyenne" fill="hsl(var(--primary))" />
                  <Bar dataKey="min" name="Min" fill="#d1d5db" />
                  <Bar dataKey="max" name="Max" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="stats">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Moyenne générale</p>
                  <p className="text-xl font-bold">{statisticsData.average.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Médiane</p>
                  <p className="text-xl font-bold">{statisticsData.median.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="text-lg font-bold">{statisticsData.min.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-lg font-bold">{statisticsData.max.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Écart-type</p>
                  <p className="text-lg font-bold">{statisticsData.stdDev.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Coefficients par type d'évaluation</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {coefficients.map((coef) => (
              <div key={coef.id} className="rounded-lg border p-2 text-center">
                <p className="text-xs text-muted-foreground">{coef.type}</p>
                <p className="text-sm font-medium">{coef.code}</p>
                <p className="text-xs">Coefficient: {coef.coefficient}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
