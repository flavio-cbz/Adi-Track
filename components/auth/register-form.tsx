"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Schéma de validation pour le formulaire d'inscription
const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Le prénom doit contenir au moins 2 caractères",
    }),
    lastName: z.string().min(2, {
      message: "Le nom doit contenir au moins 2 caractères",
    }),
    email: z
      .string()
      .email({
        message: "Veuillez entrer une adresse email valide",
      })
      .refine((email) => email.endsWith("@student.junia.com"), {
        message: "L'email doit être au format prenom.nom@student.junia.com",
      }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .regex(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une majuscule",
      })
      .regex(/[a-z]/, {
        message: "Le mot de passe doit contenir au moins une minuscule",
      })
      .regex(/[0-9]/, {
        message: "Le mot de passe doit contenir au moins un chiffre",
      }),
    confirmPassword: z.string(),
    year: z.string({
      required_error: "Veuillez sélectionner votre année d'études",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      year: "",
    },
  })

  // Mettre à jour l'email automatiquement en fonction du prénom et du nom
  const updateEmail = () => {
    const firstName = form.getValues("firstName").toLowerCase()
    const lastName = form.getValues("lastName").toLowerCase()

    if (firstName && lastName) {
      // Remplacer les caractères accentués et les espaces
      const normalizedFirstName = firstName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")

      const normalizedLastName = lastName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")

      const email = `${normalizedFirstName}.${normalizedLastName}@student.junia.com`
      form.setValue("email", email)
    }
  }

  // Soumettre le formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      // Simuler une requête d'inscription
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Vérifier si l'email est au format attendu
      if (!values.email.endsWith("@student.junia.com")) {
        throw new Error("L'email doit être au format prenom.nom@student.junia.com")
      }

      // Simuler une inscription réussie
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })

      // Rediriger vers la page de connexion (dans une application réelle)
      // router.push("/login");
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inscription à ADI-Track</CardTitle>
        <CardDescription>Créez votre compte avec votre adresse email étudiant JUNIA</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Prénom" disabled={isLoading} onBlur={() => updateEmail()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom" disabled={isLoading} onBlur={() => updateEmail()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="prenom.nom@student.junia.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Votre adresse email JUNIA sera générée automatiquement</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année d'études</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre année" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADI1">ADI1</SelectItem>
                      <SelectItem value="ADI2">ADI2</SelectItem>
                      <SelectItem value="ADI3">ADI3</SelectItem>
                      <SelectItem value="ADI4">ADI4</SelectItem>
                      <SelectItem value="ADI5">ADI5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Masquer" : "Afficher"} le mot de passe</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Au moins 8 caractères, une majuscule, une minuscule et un chiffre</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showConfirmPassword ? "Masquer" : "Afficher"} le mot de passe</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Pour des raisons de sécurité, utilisez uniquement votre adresse email JUNIA au format
                prenom.nom@student.junia.com
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
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
                  Inscription en cours...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  S'inscrire
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <a href="#" className="underline hover:text-primary">
            Se connecter
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
