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

// Schéma de validation pour le formulaire
const formSchema = z.object({
  emailNotifications: z.boolean().default(true),
  gradeUpdates: z.boolean().default(true),
  requestUpdates: z.boolean().default(true),
  systemAnnouncements: z.boolean().default(true),
  absenceAlerts: z.boolean().default(true),
  weeklyRecap: z.boolean().default(false),
  browserNotifications: z.boolean().default(true),
})

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      gradeUpdates: true,
      requestUpdates: true,
      systemAnnouncements: true,
      absenceAlerts: true,
      weeklyRecap: false,
      browserNotifications: true,
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
        description: "Vos préférences de notifications ont été mises à jour avec succès",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications par email</h3>

          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Activer les notifications par email</FormLabel>
                  <FormDescription>
                    Recevoir des notifications par email à l'adresse{" "}
                    {form.getValues("emailNotifications") ? "jean.dupont@student.junia.com" : ""}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Types de notifications</h3>

          <FormField
            control={form.control}
            name="gradeUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Mises à jour des notes</FormLabel>
                  <FormDescription>Être notifié lorsque de nouvelles notes sont disponibles</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !form.getValues("emailNotifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requestUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Statut des demandes</FormLabel>
                  <FormDescription>Être notifié lorsque le statut d'une demande de modification change</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !form.getValues("emailNotifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="systemAnnouncements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Annonces système</FormLabel>
                  <FormDescription>Recevoir des annonces importantes concernant l'application</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !form.getValues("emailNotifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="absenceAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Alertes d'absences</FormLabel>
                  <FormDescription>Être notifié lorsqu'une absence est enregistrée</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !form.getValues("emailNotifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weeklyRecap"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Récapitulatif hebdomadaire</FormLabel>
                  <FormDescription>Recevoir un récapitulatif hebdomadaire de vos résultats</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || !form.getValues("emailNotifications")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications du navigateur</h3>

          <FormField
            control={form.control}
            name="browserNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Activer les notifications du navigateur</FormLabel>
                  <FormDescription>
                    Recevoir des notifications dans votre navigateur lorsque vous êtes sur le site
                  </FormDescription>
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
  )
}
