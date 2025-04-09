"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, AlertCircle, CheckCircle, Clock, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useGradesStore } from "@/lib/stores/grades-store"
import { Label } from "@/components/ui/label"

// Schéma de validation pour le formulaire
const formSchema = z.object({
  gradeId: z.string({
    required_error: "Veuillez sélectionner une épreuve",
  }),
  currentGrade: z.string(),
  requestedGrade: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "La note demandée doit être un nombre",
    })
    .refine((val) => Number(val) >= 0 && Number(val) <= 20, {
      message: "La note doit être comprise entre 0 et 20",
    }),
  assessmentType: z.string().min(1, {
    message: "Veuillez sélectionner un type d'évaluation",
  }),
  coefficient: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Le coefficient doit être un nombre",
    })
    .refine((val) => Number(val) > 0, {
      message: "Le coefficient doit être supérieur à 0",
    }),
  courseCode: z.string().min(1, {
    message: "Veuillez sélectionner un cours",
  }),
  reason: z
    .string()
    .min(10, {
      message: "La raison doit contenir au moins 10 caractères",
    })
    .max(500, {
      message: "La raison ne peut pas dépasser 500 caractères",
    }),
  documents: z.any().optional(),
})

type ModificationRequest = {
  id: string
  gradeId: string
  gradeName: string
  currentGrade: string
  requestedGrade: string
  assessmentType: string
  coefficient: string
  courseCode: string
  originalCourseCode: string
  reason: string
  status: "pending" | "approved" | "rejected"
  date: string
  documents: File[]
  comments?: string
}

export function GradeModificationForm() {
  const { grades, semester } = useGradesStore()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [requests, setRequests] = useState<ModificationRequest[]>([])
  const [viewRequestId, setViewRequestId] = useState<string | null>(null)
  const { toast } = useToast()

  // Types d'évaluation disponibles
  const assessmentTypes = [
    { value: "DS", label: "DS - Devoir Surveillé" },
    { value: "CC", label: "CC - Contrôle Continu" },
    { value: "TP", label: "TP - Travaux Pratiques" },
    { value: "PROJET", label: "Projet" },
    { value: "ORAL", label: "Oral" },
    { value: "EXAM", label: "Examen Final" },
  ]

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeId: "",
      currentGrade: "",
      requestedGrade: "",
      assessmentType: "",
      coefficient: "",
      courseCode: "",
      reason: "",
    },
  })

  // Obtenir la liste des cours disponibles
  const availableCourses = semester.ues.flatMap((ue) =>
    ue.courses.map((course) => ({
      value: course.code,
      label: `${course.code} - ${course.name}`,
      ueCode: ue.code,
    })),
  )

  // Gérer le changement de l'épreuve sélectionnée
  const handleGradeChange = (gradeId: string) => {
    const selectedGrade = grades.find((g) => g.id === gradeId)
    if (selectedGrade) {
      form.setValue("currentGrade", selectedGrade.absence ? "ABS" : selectedGrade.grade.toString())

      // Extraire le type d'évaluation du code
      const codeParts = selectedGrade.code.split("_")
      if (codeParts.length >= 4) {
        const evalType = codeParts[3].replace(/\d+$/, "")
        form.setValue("assessmentType", evalType)
      }

      // Extraire le code du cours
      const courseCode = selectedGrade.code.split("_")[2]
      form.setValue("courseCode", courseCode)

      // Définir le coefficient
      form.setValue("coefficient", selectedGrade.coefficient.toString())
    }
  }

  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      // Vérifier la taille des fichiers (max 5MB chacun)
      const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setFileError(`${oversizedFiles.length} fichier(s) trop volumineux. Taille maximale: 5MB par fichier`)
        return
      }

      // Vérifier les types de fichiers
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type))
      if (invalidFiles.length > 0) {
        setFileError(
          `${invalidFiles.length} fichier(s) de format non supporté. Formats acceptés: PDF, JPEG, PNG, DOC, DOCX`,
        )
        return
      }

      setSelectedFiles([...selectedFiles, ...files])
    }
  }

  // Supprimer un fichier sélectionné
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Soumettre le formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedGrade = grades.find((g) => g.id === values.gradeId)
    if (!selectedGrade) return

    // Créer une nouvelle demande de modification
    const newRequest: ModificationRequest = {
      id: crypto.randomUUID(),
      gradeId: values.gradeId,
      gradeName: selectedGrade.title,
      currentGrade: values.currentGrade,
      requestedGrade: values.requestedGrade,
      assessmentType: values.assessmentType,
      coefficient: values.coefficient,
      courseCode: values.courseCode,
      originalCourseCode: selectedGrade.code.split("_")[2],
      reason: values.reason,
      status: "pending",
      date: new Date().toISOString(),
      documents: selectedFiles,
    }

    // Ajouter la demande à la liste
    setRequests([newRequest, ...requests])

    // Réinitialiser le formulaire
    form.reset()
    setSelectedFiles([])

    // Afficher une notification
    toast({
      title: "Demande envoyée",
      description: "Votre demande de modification a été envoyée avec succès",
    })
  }

  // Obtenir les détails d'une demande
  const getRequestDetails = (requestId: string) => {
    return requests.find((req) => req.id === requestId)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="new-request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-request">Nouvelle demande</TabsTrigger>
          <TabsTrigger value="history">Historique ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new-request" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demande de modification de note</CardTitle>
                  <CardDescription>
                    Utilisez ce formulaire pour demander une modification de note ou de détails d'une épreuve.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gradeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Épreuve concernée</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            handleGradeChange(value)
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une épreuve" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade.id} value={grade.id}>
                                {grade.title} ({grade.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Sélectionnez l'épreuve pour laquelle vous souhaitez demander une modification.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentGrade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note actuelle</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requestedGrade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note demandée</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: 15.5" />
                          </FormControl>
                          <FormDescription>Entrez une valeur entre 0 et 20</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="assessmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'évaluation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {assessmentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coefficient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coefficient</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: 1.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="courseCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cours associé</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un cours" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCourses.map((course) => (
                                <SelectItem key={course.value} value={course.value}>
                                  {course.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motif de la demande</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Expliquez pourquoi vous demandez cette modification..."
                            className="min-h-[120px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Fournissez une explication claire et détaillée de votre demande.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="document-upload">Documents justificatifs</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <Input
                          id="document-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          multiple
                        />
                        <label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Cliquez pour ajouter des documents</p>
                          <p className="text-xs text-muted-foreground">
                            Formats acceptés: PDF, JPEG, PNG, DOC, DOCX (max 5MB par fichier)
                          </p>
                        </label>
                      </div>
                    </div>
                    {fileError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Documents sélectionnés:</p>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      form.reset()
                      setSelectedFiles([])
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Soumettre la demande</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des demandes</CardTitle>
              <CardDescription>Suivez l'état de vos demandes de modification de notes.</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune demande de modification n'a été effectuée.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{request.gradeName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Demande du {new Date(request.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {request.status === "approved" ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" /> Approuvée
                            </>
                          ) : request.status === "rejected" ? (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" /> Refusée
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" /> En attente
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Note actuelle</p>
                          <p className="font-medium">{request.currentGrade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Note demandée</p>
                          <p className="font-medium">{request.requestedGrade}</p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewRequestId(request.id)}
                          className="w-full"
                        >
                          Voir les détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialogue de détails de la demande */}
          <Dialog open={viewRequestId !== null} onOpenChange={(open) => !open && setViewRequestId(null)}>
            <DialogContent className="max-w-3xl">
              {viewRequestId && (
                <>
                  <DialogHeader>
                    <DialogTitle>Détails de la demande</DialogTitle>
                    <DialogDescription>Informations complètes sur votre demande de modification</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {(() => {
                      const request = getRequestDetails(viewRequestId)
                      if (!request) return null

                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">{request.gradeName}</h3>
                            <Badge
                              className={
                                request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {request.status === "approved"
                                ? "Approuvée"
                                : request.status === "rejected"
                                  ? "Refusée"
                                  : "En attente"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Date de la demande</p>
                                <p className="text-sm">{new Date(request.date).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Note actuelle</p>
                                <p className="text-sm">{request.currentGrade}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Note demandée</p>
                                <p className="text-sm">{request.requestedGrade}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Type d'évaluation</p>
                                <p className="text-sm">{request.assessmentType}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Coefficient</p>
                                <p className="text-sm">{request.coefficient}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Cours</p>
                                <p className="text-sm">
                                  {request.courseCode}
                                  {request.courseCode !== request.originalCourseCode && (
                                    <span className="text-xs text-muted-foreground ml-2">
                                      (Initialement: {request.originalCourseCode})
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Motif de la demande</p>
                            <p className="text-sm mt-1 p-3 bg-muted rounded-md">{request.reason}</p>
                          </div>

                          {request.documents.length > 0 && (
                            <div>
                              <p className="text-sm font-medium">Documents justificatifs</p>
                              <div className="mt-1 space-y-2">
                                {request.documents.map((doc, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">{doc.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {request.comments && (
                            <div>
                              <p className="text-sm font-medium">Commentaires de l'évaluateur</p>
                              <p className="text-sm mt-1 p-3 bg-muted rounded-md">{request.comments}</p>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setViewRequestId(null)}>
                      Fermer
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
