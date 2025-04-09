"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileText, Table } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Schéma de validation pour le formulaire
const formSchema = z.object({
  pdfFormat: z.enum(["A4", "Letter", "Legal"]),
  includeDetails: z.boolean().default(true),
  includeCharts: z.boolean().default(true),
  includeComparisons: z.boolean().default(true),
  includeAbsences: z.boolean().default(true),
  exportFormat: z.enum(["pdf", "csv", "excel"]),
})

export function ExportSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfFormat: "A4",
      includeDetails: true,
      includeCharts: true,
      includeComparisons: true,
      includeAbsences: true,
      exportFormat: "pdf",
    },
  })

  // Soumettre le formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      // Simuler une requête de mise à jour
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences d'exportation ont été mises à jour avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos préférences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Exporter les données
  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simuler une exportation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const format = form.getValues("exportFormat")

      toast({
        title: "Exportation réussie",
        description: `Vos données ont été exportées au format ${format.toUpperCase()} avec succès`,
      })
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error)
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation de vos données",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Format d'exportation</h3>

            <FormField
              control={form.control}
              name="exportFormat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Format de fichier</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <Label htmlFor="pdf" className="font-normal flex items-center gap-2">
                          <FileText className="h-4 w-4" /> PDF
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="csv" id="csv" />
                        <Label htmlFor="csv" className="font-normal flex items-center gap-2">
                          <Table className="h-4 w-4" /> CSV
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="excel" id="excel" />
                        <Label htmlFor="excel" className="font-normal flex items-center gap-2">
                          <Table className="h-4 w-4" /> Excel
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Choisissez le format de fichier pour l'exportation de vos données.</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options PDF</h3>

            <FormField
              control={form.control}
              name="pdfFormat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Format de page</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="A4" />
                        </FormControl>
                        <FormLabel className="font-normal">A4 (210 × 297 mm)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Letter" />
                        </FormControl>
                        <FormLabel className="font-normal">Letter (8.5 × 11 pouces)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Legal" />
                        </FormControl>
                        <FormLabel className="font-normal">Legal (8.5 × 14 pouces)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contenu à inclure</h3>

            <FormField
              control={form.control}
              name="includeDetails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Détails des notes</FormLabel>
                    <FormDescription>Inclure les détails de chaque note (date, coefficient, etc.)</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeCharts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Graphiques</FormLabel>
                    <FormDescription>Inclure les graphiques et visualisations</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeComparisons"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Comparaisons</FormLabel>
                    <FormDescription>Inclure les comparaisons avec les moyennes officielles</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeAbsences"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Absences</FormLabel>
                    <FormDescription>Inclure les informations sur les absences</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
            </Button>
          </div>
        </form>
      </Form>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Exporter les résultats</CardTitle>
            <CardDescription>Exportez vos résultats académiques dans le format de votre choix</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              L'exportation inclura toutes vos notes, moyennes et statistiques selon les préférences définies ci-dessus.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exportation en cours...
                </span>
              ) : (
                <span className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter maintenant
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des exportations</CardTitle>
            <CardDescription>Vos exportations récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">resultats_s1_2024.pdf</span>
                </div>
                <span className="text-xs text-muted-foreground">15/01/2025</span>
              </div>
              <div className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">notes_detaillees.csv</span>
                </div>
                <span className="text-xs text-muted-foreground">10/01/2025</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir tout l'historique
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
