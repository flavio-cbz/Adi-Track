import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradesTable } from "@/components/grades-table"
import { UEProgress } from "@/components/ue-progress"
import { Suspense } from "react"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="p-4">Chargement de l'en-tête...</div>}>
        <DashboardHeader />
      </Suspense>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Modifier le profil</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">Jean Dupont</CardTitle>
                <CardDescription>jean.dupont@student.junia.com</CardDescription>
                <Badge className="mt-2">ADI1</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Informations personnelles</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Nom complet</dt>
                      <dd className="text-sm font-medium">Jean Dupont</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Email</dt>
                      <dd className="text-sm font-medium">jean.dupont@student.junia.com</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Année</dt>
                      <dd className="text-sm font-medium">ADI1</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Semestre actuel</dt>
                      <dd className="text-sm font-medium">S1</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Statistiques</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Moyenne générale</dt>
                      <dd className="text-sm font-medium">14.32</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">ECTS validés</dt>
                      <dd className="text-sm font-medium">24/30</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Absences</dt>
                      <dd className="text-sm font-medium">2 (1 justifiée)</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Résultats académiques</CardTitle>
              <CardDescription>Vue d'ensemble de vos performances académiques</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Chargement des résultats...</div>}>
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                    <TabsTrigger value="grades">Notes détaillées</TabsTrigger>
                    <TabsTrigger value="progress">Progression</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">Moyenne générale</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-3xl font-bold">14.32</div>
                          <p className="text-sm text-muted-foreground">Sur 20</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">ECTS validés</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-3xl font-bold">24/30</div>
                          <p className="text-sm text-muted-foreground">80% validés</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">UE validées</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-3xl font-bold">4/5</div>
                          <p className="text-sm text-muted-foreground">80% validées</p>
                        </CardContent>
                      </Card>
                    </div>

                    <UEProgress />
                  </TabsContent>

                  <TabsContent value="grades">
                    <GradesTable detailed={true} />
                  </TabsContent>

                  <TabsContent value="progress">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Progression par semestre</h3>
                      <div className="h-[300px] border rounded-md p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Graphique de progression (à implémenter)</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
