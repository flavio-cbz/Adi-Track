import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserSettings } from "@/components/settings/user-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { DisplaySettings } from "@/components/settings/display-settings"
import { ExportSettings } from "@/components/settings/export-settings"
import { AssessmentSettings } from "@/components/settings/assessment-settings"
import { Suspense } from "react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="p-4">Chargement de l'en-tête...</div>}>
        <DashboardHeader />
      </Suspense>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Annuler</Button>
            <Button>Enregistrer</Button>
          </div>
        </div>

        <Suspense fallback={<div>Chargement des paramètres...</div>}>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Affichage</TabsTrigger>
              <TabsTrigger value="assessment">Évaluations</TabsTrigger>
              <TabsTrigger value="export">Exportation</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Gérez vos informations personnelles et vos préférences de compte.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notifications</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous souhaitez recevoir des notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences d'affichage</CardTitle>
                  <CardDescription>Personnalisez l'apparence et le comportement de l'application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DisplaySettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'évaluation</CardTitle>
                  <CardDescription>Configurez les coefficients des types d'évaluation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssessmentSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options d'exportation</CardTitle>
                  <CardDescription>Configurez les options d'exportation de vos données.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExportSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Suspense>
      </main>
    </div>
  )
}
