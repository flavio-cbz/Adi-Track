// Types pour les données de notes
export interface Grade {
  id: string
  date: string
  code: string
  title: string
  grade: number
  coefficient: number
  absence: boolean
  absenceJustified: boolean
  moduleCode?: string // Added to track which module the grade belongs to
}

export interface Evaluation {
  code: string
  name: string
  coefficient: number
  percentage?: number
}

export interface Course {
  code: string
  name: string
  grades: Grade[]
  coefficient: number
  evaluations: Evaluation[]
}

export interface UE {
  code: string
  name: string
  courses: Course[]
  ects: number
}

export interface Semester {
  code: string
  name: string
  ues: UE[]
}

// Fonction pour traiter les données brutes importées
export function processGradesData(rawData: any[]): Grade[] {
  return rawData.map((item, index) => {
    // Extraire les informations de base
    const date = item.Date || item["Début.Événement"] || ""
    const code = item.Code || ""
    const title = item.Épreuve || item.Epreuve || ""
    const coefficient = Number.parseFloat(item.Coefficient) || 1
    const moduleCode = extractModuleCode(code)

    // Traiter la note (peut être un nombre ou "ABS")
    let grade = 0
    let absence = false
    let absenceJustified = false

    if (item.Note === "ABS" || item.Note === "") {
      absence = true
      // Par défaut, on considère l'absence comme non justifiée
      absenceJustified = false
    } else if (!isNaN(Number.parseFloat(item.Note))) {
      grade = Number.parseFloat(item.Note)
    }

    return {
      id: `${index}-${date}-${code}`,
      date,
      code,
      title,
      grade,
      coefficient,
      absence,
      absenceJustified,
      moduleCode,
    }
  })
}

// Extract module code from grade code (e.g., "MATHS1" from "2425_A1_MATHS1_01")
export function extractModuleCode(code: string): string {
  const parts = code.split("_")
  if (parts.length >= 3) {
    return parts[2]
  }
  return ""
}

// Fonction pour calculer la moyenne d'un cours avec coefficients par module
export function calculateCourseAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0

  // Group grades by module
  const moduleGrades: Record<string, Grade[]> = {}

  grades.forEach((grade) => {
    const moduleCode = grade.moduleCode || extractModuleCode(grade.code)
    if (!moduleGrades[moduleCode]) {
      moduleGrades[moduleCode] = []
    }
    moduleGrades[moduleCode].push(grade)
  })

  let totalWeight = 0
  let weightedSum = 0

  // Calculate average for each module
  Object.entries(moduleGrades).forEach(([moduleCode, moduleGradesList]) => {
    let moduleWeight = 0
    let moduleSum = 0

    moduleGradesList.forEach((grade) => {
      // Si absence non justifiée, la note est 0
      // Si absence justifiée, on ne compte pas cette note
      if (grade.absence) {
        if (!grade.absenceJustified) {
          // For unjustified absence, count as 0 but apply coefficient
          moduleSum += 0 * grade.coefficient
          moduleWeight += grade.coefficient
        }
        // If justified, don't include in calculation
      } else {
        // Apply coefficient directly to the grade (as if entered multiple times)
        moduleSum += grade.grade * grade.coefficient
        moduleWeight += grade.coefficient
      }
    })

    // Add module's weighted average to course total
    if (moduleWeight > 0) {
      const moduleAverage = moduleSum / moduleWeight
      // Use the sum of coefficients as the module's weight in the course
      weightedSum += moduleAverage * moduleWeight
      totalWeight += moduleWeight
    }
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Fonction pour calculer la moyenne d'une UE
export function calculateUEAverage(courses: Course[]): number {
  if (courses.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0

  for (const course of courses) {
    const courseAverage = calculateCourseAverage(course.grades)
    weightedSum += courseAverage * course.coefficient
    totalWeight += course.coefficient
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Fonction pour calculer la moyenne d'un semestre
export function calculateSemesterAverage(semester: Semester): number {
  if (semester.ues.length === 0) return 0

  let totalECTS = 0
  let weightedSum = 0

  for (const ue of semester.ues) {
    const ueAverage = calculateUEAverage(ue.courses)
    weightedSum += ueAverage * ue.ects
    totalECTS += ue.ects
  }

  return totalECTS > 0 ? weightedSum / totalECTS : 0
}

// Fonction pour vérifier si une UE est validée
export function isUEValidated(ue: UE): boolean {
  const average = calculateUEAverage(ue.courses)
  return average >= 10
}

// Fonction pour calculer le nombre d'ECTS validés
export function calculateValidatedECTS(ues: UE[]): number {
  return ues.reduce((total, ue) => {
    return total + (isUEValidated(ue) ? ue.ects : 0)
  }, 0)
}

// Fonction pour analyser les absences
export function analyzeAbsences(grades: Grade[]): { justified: number; unjustified: number } {
  return grades.reduce(
    (acc, grade) => {
      if (grade.absence) {
        if (grade.absenceJustified) {
          acc.justified += 1
        } else {
          acc.unjustified += 1
        }
      }
      return acc
    },
    { justified: 0, unjustified: 0 },
  )
}

// Fonction pour calculer des statistiques sur les notes
export function calculateStatistics(grades: Grade[]): {
  average: number
  median: number
  min: number
  max: number
  stdDev: number
} {
  if (grades.length === 0) {
    return { average: 0, median: 0, min: 0, max: 0, stdDev: 0 }
  }

  // Filtrer les absences justifiées
  const filteredGrades = grades.filter((grade) => !grade.absence || !grade.absenceJustified)

  // Convertir les absences non justifiées en 0
  const values = filteredGrades.map((grade) => (grade.absence ? 0 : grade.grade))

  // Trier les valeurs pour calculer la médiane
  const sortedValues = [...values].sort((a, b) => a - b)

  // Calculer la moyenne
  const sum = values.reduce((acc, val) => acc + val, 0)
  const average = sum / values.length

  // Calculer la médiane
  const median =
    values.length % 2 === 0
      ? (sortedValues[values.length / 2 - 1] + sortedValues[values.length / 2]) / 2
      : sortedValues[Math.floor(values.length / 2)]

  // Calculer min et max
  const min = Math.min(...values)
  const max = Math.max(...values)

  // Calculer l'écart-type
  const squaredDiffs = values.map((val) => Math.pow(val - average, 2))
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length
  const stdDev = Math.sqrt(variance)

  return { average, median, min, max, stdDev }
}

// Fonction pour extraire les informations d'un code d'épreuve
export function parseGradeCode(code: string): {
  year: string
  level: string
  course: string
  evaluationType: string
  number?: string
} {
  // Format attendu: 2425_A1_MATHS1_01 ou 2425_A1_MATHS1_CC
  const parts = code.split("_")

  if (parts.length < 4) {
    throw new Error(`Format de code invalide: ${code}`)
  }

  const year = parts[0]
  const level = parts[1]
  const course = parts[2]

  // Extraire le type d'évaluation et éventuellement le numéro
  const evalPart = parts[3]
  let evaluationType = evalPart
  let number = undefined

  // Si le dernier caractère est un chiffre, c'est probablement un numéro
  if (/\d+$/.test(evalPart)) {
    // Trouver où commence le numéro
    const match = evalPart.match(/(\D+)(\d+)/)
    if (match) {
      evaluationType = match[1]
      number = match[2]
    }
  }

  return { year, level, course, evaluationType, number }
}

// Function to extract assessment type code from grade code
export function extractAssessmentTypeCode(code: string): string {
  // Format expected: 2425_A1_MATHS1_01 or 2425_A1_MATHS1_CC
  const parts = code.split("_")

  if (parts.length < 4) {
    return ""
  }

  // Get the last part and remove any numbers
  const lastPart = parts[3]
  return lastPart.replace(/\d+$/, "")
}

// Add a function to apply assessment type coefficients
import { useAssessmentTypeStore } from "./stores/assessment-type-store"

// Modified function to calculate course average with assessment type coefficients
export function calculateCourseAverageWithTypeCoefficients(grades: Grade[]): number {
  if (grades.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0
  const assessmentTypeStore = useAssessmentTypeStore.getState()

  for (const grade of grades) {
    // Skip if absence is justified
    if (grade.absence && grade.absenceJustified) {
      continue
    }

    // Get the assessment type coefficient
    const assessmentTypeCode = extractAssessmentTypeCode(grade.code)
    const typeCoefficient = assessmentTypeStore.getCoefficient(assessmentTypeCode)

    // Calculate the combined coefficient
    const combinedCoefficient = grade.coefficient * typeCoefficient

    // If absence is not justified, the grade is 0
    const gradeValue = grade.absence ? 0 : grade.grade

    weightedSum += gradeValue * combinedCoefficient
    totalWeight += combinedCoefficient
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Calculate weighted average for a specific module
export function calculateModuleAverage(grades: Grade[], moduleCode: string): number {
  // Filter grades for this module
  const moduleGrades = grades.filter((grade) => (grade.moduleCode || extractModuleCode(grade.code)) === moduleCode)

  if (moduleGrades.length === 0) return 0

  let totalWeight = 0
  let weightedSum = 0

  moduleGrades.forEach((grade) => {
    if (grade.absence) {
      if (!grade.absenceJustified) {
        // For unjustified absence, count as 0 but apply coefficient
        weightedSum += 0 * grade.coefficient
        totalWeight += grade.coefficient
      }
      // If justified, don't include in calculation
    } else {
      // Apply coefficient directly to the grade
      weightedSum += grade.grade * grade.coefficient
      totalWeight += grade.coefficient
    }
  })

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Calculate effective coefficient (how many times a grade is counted)
export function calculateEffectiveCoefficient(grade: Grade): number {
  return grade.coefficient
}
