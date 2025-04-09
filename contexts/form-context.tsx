"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useGrades } from "@/contexts/grades-context"

interface FormContextType {
  semester: string
  setSemester: (semester: string) => void
  ue: string
  setUe: (ue: string) => void
  courseName: string
  setCourseName: (courseName: string) => void
  grade: string
  setGrade: (grade: string) => void
  evaluationType: "written" | "continuous" | "project"
  setEvaluationType: (evaluationType: "written" | "continuous" | "project") => void
  isAbsent: boolean
  setIsAbsent: (isAbsent: boolean) => void
  coefficient: string
  setCoefficient: (coefficient: string) => void
  error: string
  setError: (error: string) => void
  getAvailableSemesters: () => string[]
  getAvailableUEs: () => string[]
  getAvailableCourses: () => string[]
  isEvaluationTypeAvailable: (type: "written" | "continuous" | "project") => boolean
  resetForm: () => void
  submitForm: () => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { getProgramStructure, addEntry } = useGrades()
  const [semester, setSemester] = useState<string>("")
  const [ue, setUe] = useState<string>("")
  const [courseName, setCourseName] = useState<string>("")
  const [grade, setGrade] = useState<string>("")
  const [evaluationType, setEvaluationType] = useState<"written" | "continuous" | "project">("written")
  const [isAbsent, setIsAbsent] = useState<boolean>(false)
  const [coefficient, setCoefficient] = useState<string>("1")
  const [error, setError] = useState<string>("")

  // Get available semesters for the selected program
  const getAvailableSemesters = () => {
    return Object.keys(getProgramStructure())
  }

  // Get available UEs for the selected semester
  const getAvailableUEs = () => {
    if (!semester) return []
    const programStructure = getProgramStructure()
    return Object.keys(programStructure[semester as keyof typeof programStructure] || {})
  }

  // Get available courses for the selected UE
  const getAvailableCourses = () => {
    if (!semester || !ue) return []
    const programStructure = getProgramStructure()
    const semesterData = programStructure[semester as keyof typeof programStructure]
    if (!semesterData) return []

    const ueData = semesterData[ue as keyof typeof semesterData]
    if (!ueData) return []

    return Object.keys(ueData.courses)
  }

  // Check if the evaluation type is available for the selected course
  const isEvaluationTypeAvailable = (type: "written" | "continuous" | "project") => {
    if (!semester || !ue || !courseName) return false

    const programStructure = getProgramStructure()
    const semesterData = programStructure[semester as keyof typeof programStructure]
    if (!semesterData) return false

    const ueData = semesterData[ue as keyof typeof semesterData]
    if (!ueData) return false

    const courseData = ueData.courses[courseName as keyof typeof ueData.courses]
    return courseData && courseData.weights[type] > 0
  }

  // Reset the form
  const resetForm = () => {
    setGrade("")
    setCoefficient("1")
    setIsAbsent(false)
    setError("")
  }

  // Submit the form
  const submitForm = () => {
    // Validation
    if (!semester) {
      setError("Veuillez sélectionner un semestre.")
      return
    }

    if (!ue) {
      setError("Veuillez sélectionner une UE.")
      return
    }

    if (!courseName) {
      setError("Veuillez sélectionner un cours.")
      return
    }

    if (!evaluationType) {
      setError("Veuillez sélectionner un type d'évaluation.")
      return
    }

    if (!isAbsent && (isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 20)) {
      setError("La note doit être un nombre entre 0 et 20.")
      return
    }

    if (isNaN(Number(coefficient)) || Number(coefficient) <= 0) {
      setError("Le coefficient doit être un nombre positif.")
      return
    }

    // Check if the evaluation type is available for this course
    if (!isEvaluationTypeAvailable(evaluationType)) {
      setError(`Le type d'évaluation "${evaluationType}" n'est pas disponible pour ce cours.`)
      return
    }

    // Clear previous errors
    setError("")

    // Create a new entry
    addEntry({
      semester,
      ue,
      courseName,
      grade: isAbsent ? "ABS" : Number(grade),
      coefficient: Number(coefficient),
      isAbsent,
      evaluationType,
      moduleCode: courseName, // Use course name as module code
    })

    // Reset the form
    resetForm()
  }

  return (
    <FormContext.Provider
      value={{
        semester,
        setSemester,
        ue,
        setUe,
        courseName,
        setCourseName,
        grade,
        setGrade,
        evaluationType,
        setEvaluationType,
        isAbsent,
        setIsAbsent,
        coefficient,
        setCoefficient,
        error,
        setError,
        getAvailableSemesters,
        getAvailableUEs,
        getAvailableCourses,
        isEvaluationTypeAvailable,
        resetForm,
        submitForm,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
