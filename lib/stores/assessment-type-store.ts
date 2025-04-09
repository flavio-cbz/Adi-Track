import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AssessmentTypeCoefficient {
  id: string
  type: string
  code: string
  coefficient: number
}

interface AssessmentTypeState {
  coefficients: AssessmentTypeCoefficient[]
  setCoefficients: (coefficients: AssessmentTypeCoefficient[]) => void
  getCoefficient: (code: string) => number
  addCoefficient: (type: string, code: string, coefficient: number) => void
  updateCoefficient: (id: string, coefficient: number) => void
  removeCoefficient: (id: string) => void
}

// Default assessment type coefficients
const defaultCoefficients: AssessmentTypeCoefficient[] = [
  { id: "1", type: "Devoir Surveillé", code: "DS", coefficient: 2.0 },
  { id: "2", type: "Contrôle Continu", code: "CC", coefficient: 1.0 },
  { id: "3", type: "Projet", code: "PROJET", coefficient: 1.5 },
  { id: "4", type: "Travaux Pratiques", code: "TP", coefficient: 1.0 },
  { id: "5", type: "Oral", code: "ORAL", coefficient: 1.5 },
]

export const useAssessmentTypeStore = create<AssessmentTypeState>()(
  persist(
    (set, get) => ({
      coefficients: defaultCoefficients,

      setCoefficients: (coefficients) => set({ coefficients }),

      getCoefficient: (code) => {
        const { coefficients } = get()
        const match = coefficients.find((c) => c.code === code)
        return match ? match.coefficient : 1.0 // Default to 1.0 if not found
      },

      addCoefficient: (type, code, coefficient) => {
        const { coefficients } = get()
        const newCoefficient = {
          id: Date.now().toString(),
          type,
          code,
          coefficient,
        }
        set({ coefficients: [...coefficients, newCoefficient] })
      },

      updateCoefficient: (id, coefficient) => {
        const { coefficients } = get()
        set({
          coefficients: coefficients.map((c) => (c.id === id ? { ...c, coefficient } : c)),
        })
      },

      removeCoefficient: (id) => {
        const { coefficients } = get()
        set({
          coefficients: coefficients.filter((c) => c.id !== id),
        })
      },
    }),
    {
      name: "assessment-type-coefficients",
    },
  ),
)
