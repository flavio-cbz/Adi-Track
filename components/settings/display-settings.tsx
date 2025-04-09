"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"

// Schéma de validation pour le formulaire
const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.enum(["small", "medium", "large"]),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  gradeFormat: z.enum(["decimal", "fraction"]),
  compactMode: z.boolean().default(false),
  highContrastMode: z.boolean().default(false),
  animationsEnabled: z.boolean().default(true),
})

export function DisplaySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setTheme } = useTheme()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "system",
      fontSize: "medium",
      dateFormat: "DD/MM/YYYY",
      gradeFormat: "decimal",
      compactMode: false,
      highContrastMode: false,
      animationsEnabled: true,
    },
  })

  // Soumettre le formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      // Appliquer le thème
      setTheme(values.theme)

      // Simuler une requête de mise à jour
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences d'affichage ont été mises à jour avec succès",
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
          <h3 className="text-lg font-medium">Thème</h3>

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Mode d'affichage</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="font-normal">
                        Clair
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="font-normal">
                        Sombre
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="font-normal">
                        Système (utiliser les préférences du système)
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Taille du texte</h3>

          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taille de la police</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une taille" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Ajustez la taille du texte pour une meilleure lisibilité.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Format d'affichage</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format de date</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                      <SelectItem value="YYYY-MM-DD">AAAA-MM-JJ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format des notes</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="decimal">Décimal (ex: 15.5)</SelectItem>
                      <SelectItem value="fraction">Fraction (ex: 15,5/20)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Options d'accessibilité</h3>

          <FormField
            control={form.control}
            name="compactMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Mode compact</FormLabel>
                  <FormDescription>Réduire l'espacement pour afficher plus de contenu à l'écran</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highContrastMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Mode contraste élevé</FormLabel>
                  <FormDescription>Augmenter le contraste pour une meilleure lisibilité</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="animationsEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Animations</FormLabel>
                  <FormDescription>Activer les animations et les transitions</FormDescription>
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
