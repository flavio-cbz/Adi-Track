import { create } from "zustand"
import type { Grade } from "@/lib/grades-processor"
import { structureDataForCalculation } from "@/lib/data-transformer"
import { mockGradesData } from "@/lib/mock-data"

// Fonction pour créer le store
const createGradesStore = () => {
  // Initialiser avec les données de test
  const initialGrades = mockGradesData
  const { semester: initialSemester } = structureDataForCalculation(initialGrades)

  return {
    grades: initialGrades,
    semester: initialSemester,

    addGrades: (newGrades: Grade[]) =>
      create<any>((set) => ({
        grades: initialGrades,
        semester: initialSemester,
        addGrades: (newGrades: Grade[]) =>
          set((state: any) => {
            // Fusionner les nouvelles notes avec les existantes
            const mergedGrades = [...state.grades]

            // Ajouter ou mettre à jour les notes
            newGrades.forEach((newGrade) => {
              const existingIndex = mergedGrades.findIndex((g) => g.id === newGrade.id)
              if (existingIndex >= 0) {
                mergedGrades[existingIndex] = newGrade
              } else {
                mergedGrades.push(newGrade)
              }
            })

            // Recalculer la structure du semestre
            const { semester } = structureDataForCalculation(mergedGrades)

            return { grades: mergedGrades, semester }
          }),

        updateGrade: (id: string, updatedGrade: Grade) =>
          set((state: any) => {
            // Mettre à jour une note spécifique
            const updatedGrades = state.grades.map((grade: Grade) => (grade.id === id ? updatedGrade : grade))

            // Recalculer la structure du semestre
            const { semester } = structureDataForCalculation(updatedGrades)

            return { grades: updatedGrades, semester }
          }),

        resetGrades: () =>
          set(() => {
            // Réinitialiser avec les données de test
            const { semester } = structureDataForCalculation(initialGrades)
            return { grades: initialGrades, semester }
          }),
      })).getState().addGrades,

    updateGrade: (id: string, updatedGrade: Grade) =>
      create<any>((set) => ({
        grades: initialGrades,
        semester: initialSemester,
        addGrades: (newGrades: Grade[]) => {},

        updateGrade: (id: string, updatedGrade: Grade) =>
          set((state: any) => {
            // Mettre à jour une note spécifique
            const updatedGrades = state.grades.map((grade: Grade) => (grade.id === id ? updatedGrade : grade))

            // Recalculer la structure du semestre
            const { semester } = structureDataForCalculation(updatedGrades)

            return { grades: updatedGrades, semester }
          }),

        resetGrades: () =>
          set(() => {
            // Réinitialiser avec les données de test
            const { semester } = structureDataForCalculation(initialGrades)
            return { grades: initialGrades, semester }
          }),
      })).getState().updateGrade,

    resetGrades: () =>
      create<any>((set) => ({
        grades: initialGrades,
        semester: initialSemester,
        addGrades: (newGrades: Grade[]) => {},

        updateGrade: (id: string, updatedGrade: Grade) => {},

        resetGrades: () =>
          set(() => {
            // Réinitialiser avec les données de test
            const { semester } = structureDataForCalculation(initialGrades)
            return { grades: initialGrades, semester }
          }),
      })).getState().resetGrades,
  }
}

// Création du store avec vérification côté client
let useGradesStore: any

// Vérifier si window est défini (côté client uniquement)
if (typeof window !== "undefined") {
  useGradesStore = create(createGradesStore())
} else {
  // Version factice pour le rendu côté serveur
  useGradesStore = () => createGradesStore()
}

export { useGradesStore }
