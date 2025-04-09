"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, Save, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { useGradesStore } from "@/lib/stores/grades-store"
import { generateId } from "@/lib/utils"
import { useAssessmentTypeStore } from "@/lib/stores/assessment-type-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Schéma de validation pour une note
const gradeSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères",
  }),
  code: z.string().min(2, {
    message: "Le code doit contenir au moins 2 caractères",
  }),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Format de date invalide (JJ/MM/AAAA)",
  }),
  grade: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "La note doit être un nombre",
    })
    .refine((val) => Number(val) >= 0 && Number(val) <= 20, {
      message: "La note doit être comprise entre 0 et 20",
    }),
  coefficient: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Le coefficient doit être un nombre",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Le coefficient doit être positif",
    }),
  assessmentType: z.string().min(1, {
    message: "Le type d'évaluation est requis",
  }),
  absence: z.boolean().default(false),
  absenceJustified: z.boolean().default(false),
})

// Schéma de validation pour le formulaire complet
const formSchema = z.object({
  grades: z.array(gradeSchema).min(1, {
    message: "Vous devez ajouter au moins une note",
  }),
})

export function ManualGradeInput() {
  const { addGrades } = useGradesStore()
  const { toast } = useToast()
  const [showHelp, setShowHelp] = useState(false)
  const { coefficients } = useAssessmentTypeStore()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grades: [
        {
          title: "",
          code: "",
          date: "",
          grade: "",
          coefficient: "1",
          assessmentType: "",
          absence: false,
          absenceJustified: false,
        },
      ],
    },
  })

  // Utiliser useFieldArray pour gérer le tableau de notes
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grades",
  })

  // Ajouter une nouvelle note
  const addGrade = () => {
    append({
      title: "",
      code: "",
      date: "",
      grade: "",
      coefficient: "1",
      assessmentType: "",
      absence: false,
      absenceJustified: false,
    })
  }

  const getCoefficient = (assessmentTypeCode: string) => {
    const assessmentType = coefficients.find((coef) => coef.code === assessmentTypeCode)
    return assessmentType ? assessmentType.coefficient : 1
  }

  // Soumettre le formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Transformer les données pour les adapter au format attendu par le store
    const formattedGrades = values.grades.map((grade) => {
      // Get the assessment type code to append to the grade code
      const assessmentTypeCode = grade.assessmentType

      // Ensure the code follows the format pattern and includes the assessment type
      let codeWithType = grade.code
      if (!codeWithType.includes("_")) {
        // If code doesn't have underscores, create a basic format
        codeWithType = `0000_A0_COURSE_${assessmentTypeCode}`
      } else if (!codeWithType.endsWith(assessmentTypeCode)) {
        // If code doesn't end with the assessment type, append it
        const codeParts = codeWithType.split("_")
        if (codeParts.length >= 4) {
          codeParts[3] = assessmentTypeCode
          codeWithType = codeParts.join("_")
        } else {
          codeWithType = `${codeWithType}_${assessmentTypeCode}`
        }
      }

      return {
        id: generateId(),
        title: grade.title,
        code: codeWithType,
        date: grade.date,
        grade: Number.parseFloat(grade.grade),
        coefficient: Number.parseFloat(grade.coefficient),
        absence: grade.absence,
        absenceJustified: grade.absenceJustified,
        assessmentTypeCode: assessmentTypeCode,
        assessmentTypeCoefficient: getCoefficient(assessmentTypeCode),
      }
    })

    // Ajouter les notes au store
    addGrades(formattedGrades)

    // Réinitialiser le formulaire
    form.reset({
      grades: [
        {
          title: "",
          code: "",
          date: "",
          grade: "",
          coefficient: "1",
          assessmentType: "",
          absence: false,
          absenceJustified: false,
        },
      ],
    })

    // Afficher une notification
    toast({
      title: "Notes ajoutées",
      description: `${formattedGrades.length} note(s) ajoutée(s) avec succès`,
    })
  }

  // Gérer le changement d'état d'absence
  const handleAbsenceChange = (index: number, value: boolean) => {
    // Si l'absence est cochée, vider le champ de note
    if (value) {
      form.setValue(`grades.${index}.grade`, "0")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saisie manuelle des notes</CardTitle>
              <CardDescription>
                Ajoutez manuellement vos notes si vous ne pouvez pas les importer depuis Aurion.
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowHelp(!showHelp)}>
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Aide</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Afficher/masquer les instructions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {showHelp && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <h4 className="font-medium mb-2">Comment saisir vos notes manuellement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Remplissez tous les champs pour chaque note</li>
                  <li>
                    Le <strong>titre</strong> est l'intitulé de l'épreuve (ex: "DS Mathématiques 1")
                  </li>
                  <li>
                    Le <strong>code</strong> doit suivre le format AAAA_XX_YYYY_ZZ (ex: "2425_A1_MATHS1_01")
                  </li>
                  <li>
                    La <strong>date</strong> doit être au format JJ/MM/AAAA
                  </li>
                  <li>
                    La <strong>note</strong> doit être comprise entre 0 et 20
                  </li>
                  <li>Pour une absence, cochez la case correspondante</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Note {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`grades.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intitulé de l'épreuve</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: DS Mathématiques 1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`grades.${index}.code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code de l'épreuve</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: 2425_A1_MATHS1_01" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`grades.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="JJ/MM/AAAA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`grades.${index}.assessmentType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'évaluation</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                              <SelectContent>
                                {coefficients.map((coef) => (
                                  <SelectItem key={coef.id} value={coef.code}>
                                    {coef.type} (Coef. {coef.coefficient})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`grades.${index}.grade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: 15.5" disabled={form.watch(`grades.${index}.absence`)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`grades.${index}.absence`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Absence</FormLabel>
                            <FormDescription>Cochez si vous étiez absent à cette épreuve</FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(value) => {
                                field.onChange(value)
                                handleAbsenceChange(index, value)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch(`grades.${index}.absence`) && (
                      <FormField
                        control={form.control}
                        name={`grades.${index}.absenceJustified`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Absence justifiée</FormLabel>
                              <FormDescription>Cochez si votre absence était justifiée</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addGrade} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une note
              </Button>

              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les notes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
