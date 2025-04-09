"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { ADI1_STRUCTURE, ADI2_STRUCTURE, type ProgramStructure } from "@/lib/program-structures"

export interface GradeEntry {
  id: string
  semester: string
  ue: string
  courseName: string
  grade: string | number
  coefficient: number
  isAbsent: boolean
  evaluationType: "written" | "continuous" | "project"
  moduleCode?: string
  absenceJustified?: boolean
}

interface GradesContextType {
  entries: GradeEntry[]
  program: "ADI1" | "ADI2"
  setProgram: (program: "ADI1" | "ADI2") => void
  addEntry: (entry: Omit<GradeEntry, "id">) => void
  removeEntry: (id: string) => void
  updateEntry: (id: string, entry: Partial<GradeEntry>) => void
  resetEntries: () => void
  importEntries: (importedEntries: GradeEntry[]) => void
  getProgramStructure: () => ProgramStructure
  calculateUEAverage: (semesterName: string, ueName: string) => number
  calculateSemesterAverage: (semesterName: string) => number
  calculateYearlyAverage: () => number
  isUEValidated: (semesterName: string, ueName: string) => boolean
  isSemesterValidated: (semesterName: string) => boolean
  isYearValidated: () => boolean
  getValidatedECTS: (semesterName: string) => number
  getTotalECTS: (semesterName: string) => number
  getValidatedYearECTS: () => number
  getTotalYearECTS: () => number
}

const GradesContext = createContext<GradesContextType | undefined>(undefined)

export function GradesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<GradeEntry[]>([])
  const [program, setProgram] = useState<"ADI1" | "ADI2">("ADI1")

  // Get the structure of the currently selected program
  const getProgramStructure = (): ProgramStructure => {
    return program === "ADI1" ? ADI1_STRUCTURE : ADI2_STRUCTURE
  }

  // Calculate the average for a specific UE
  const calculateUEAverage = (semesterName: string, ueName: string) => {
    const ueEntries = entries.filter((entry) => entry.semester === semesterName && entry.ue === ueName)
    if (ueEntries.length === 0) return 0

    let totalWeight = 0
    let weightedSum = 0

    // Group entries by module
    const moduleEntries: Record<string, GradeEntry[]> = {}

    ueEntries.forEach((entry) => {
      const moduleCode = entry.moduleCode || entry.courseName
      if (!moduleEntries[moduleCode]) {
        moduleEntries[moduleCode] = []
      }
      moduleEntries[moduleCode].push(entry)
    })

    // Calculate average for each module
    Object.entries(moduleEntries).forEach(([moduleCode, moduleGrades]) => {
      let moduleWeight = 0
      let moduleSum = 0

      moduleGrades.forEach((entry) => {
        if (entry.isAbsent) {
          if (!entry.absenceJustified) {
            // Count unjustified absence as 0 but apply coefficient
            moduleWeight += Number(entry.coefficient)
          }
          // Skip justified absences
        } else {
          const gradeValue = Number(entry.grade)
          const gradeCoefficient = Number(entry.coefficient)
          moduleSum += gradeValue * gradeCoefficient
          moduleWeight += gradeCoefficient
        }
      })

      if (moduleWeight > 0) {
        const moduleAverage = moduleSum / moduleWeight

        // Find the course this module belongs to
        const programStructure = getProgramStructure()
        const semesterData = programStructure[semesterName as keyof typeof programStructure]
        if (!semesterData) return

        const ueData = semesterData[ueName as keyof typeof semesterData]
        if (!ueData) return

        // Find the course coefficient
        let courseCoefficient = 1
        Object.entries(ueData.courses).forEach(([courseCode, courseData]: [string, any]) => {
          if (moduleCode === courseCode) {
            courseCoefficient = courseData.coefficient
          }
        })

        weightedSum += moduleAverage * courseCoefficient
        totalWeight += courseCoefficient
      }
    })

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  // Calculate the general average for a semester
  const calculateSemesterAverage = (semesterName: string) => {
    // Find the right program for this semester
    const programStructure = semesterName.includes("1") || semesterName.includes("2") ? ADI1_STRUCTURE : ADI2_STRUCTURE
    const semesterData = programStructure[semesterName as keyof typeof programStructure]
    if (!semesterData) return 0

    const ueNames = Object.keys(semesterData)
    let totalCredits = 0
    let weightedSum = 0

    ueNames.forEach((ueName) => {
      const ueAverage = calculateUEAverage(semesterName, ueName)
      const ueData = semesterData[ueName as keyof typeof semesterData]
      if (ueData) {
        weightedSum += ueAverage * ueData.credits
        totalCredits += ueData.credits
      }
    })

    return totalCredits > 0 ? weightedSum / totalCredits : 0
  }

  // Calculate the yearly average
  const calculateYearlyAverage = () => {
    const programStructure = getProgramStructure()
    const semesters = Object.keys(programStructure)
    let totalCredits = 0
    let weightedSum = 0

    semesters.forEach((semesterName) => {
      const semesterData = programStructure[semesterName as keyof typeof programStructure]
      if (!semesterData) return

      const semesterAverage = calculateSemesterAverage(semesterName)
      const semesterCredits = Object.values(semesterData).reduce((sum, ue: any) => sum + ue.credits, 0)

      weightedSum += semesterAverage * semesterCredits
      totalCredits += semesterCredits
    })

    return totalCredits > 0 ? weightedSum / totalCredits : 0
  }

  // Check if a UE is validated (average >= 10)
  const isUEValidated = (semesterName: string, ueName: string) => {
    return calculateUEAverage(semesterName, ueName) >= 10
  }

  // Check if a semester is validated (all UEs validated)
  const isSemesterValidated = (semesterName: string) => {
    // Find the right program for this semester
    const programStructure = semesterName.includes("1") || semesterName.includes("2") ? ADI1_STRUCTURE : ADI2_STRUCTURE
    const semesterData = programStructure[semesterName as keyof typeof programStructure]
    if (!semesterData) return false

    const ueNames = Object.keys(semesterData)
    return ueNames.every((ueName) => isUEValidated(semesterName, ueName))
  }

  // Check if the year is validated (all semesters validated)
  const isYearValidated = () => {
    const programStructure = getProgramStructure()
    const semesters = Object.keys(programStructure)
    return semesters.every((semesterName) => isSemesterValidated(semesterName))
  }

  // Get the number of validated ECTS for a semester
  const getValidatedECTS = (semesterName: string) => {
    // Find the right program for this semester
    const programStructure = semesterName.includes("1") || semesterName.includes("2") ? ADI1_STRUCTURE : ADI2_STRUCTURE
    const semesterData = programStructure[semesterName as keyof typeof programStructure]
    if (!semesterData) return 0

    const ueNames = Object.keys(semesterData)
    return ueNames.reduce((sum, ueName) => {
      const ueData = semesterData[ueName as keyof typeof semesterData]
      return sum + (isUEValidated(semesterName, ueName) ? (ueData as any).credits : 0)
    }, 0)
  }

  // Get the total number of ECTS for a semester
  const getTotalECTS = (semesterName: string) => {
    // Find the right program for this semester
    const programStructure = semesterName.includes("1") || semesterName.includes("2") ? ADI1_STRUCTURE : ADI2_STRUCTURE
    const semesterData = programStructure[semesterName as keyof typeof programStructure]
    if (!semesterData) return 0

    return Object.values(semesterData).reduce((sum, ue: any) => sum + ue.credits, 0)
  }

  // Get the total number of ECTS for the year
  const getTotalYearECTS = () => {
    const programStructure = getProgramStructure()
    const semesters = Object.keys(programStructure)
    return semesters.reduce((sum, semesterName) => sum + getTotalECTS(semesterName), 0)
  }

  // Get the number of validated ECTS for the year
  const getValidatedYearECTS = () => {
    const programStructure = getProgramStructure()
    const semesters = Object.keys(programStructure)
    return semesters.reduce((sum, semesterName) => sum + getValidatedECTS(semesterName), 0)
  }

  // Add a new entry
  const addEntry = (entry: Omit<GradeEntry, "id">) => {
    const newEntry: GradeEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setEntries([...entries, newEntry])
  }

  // Remove an entry
  const removeEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  // Update an entry
  const updateEntry = (id: string, updatedEntry: Partial<GradeEntry>) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry)))
  }

  // Reset all entries
  const resetEntries = () => {
    setEntries([])
  }

  // Import entries
  const importEntries = (importedEntries: GradeEntry[]) => {
    // Merge with existing entries avoiding duplicates by ID
    const existingIds = new Set(entries.map((entry) => entry.id))
    const newEntries = importedEntries.filter((entry) => !existingIds.has(entry.id))
    setEntries([...entries, ...newEntries])
  }

  return (
    <GradesContext.Provider
      value={{
        entries,
        program,
        setProgram,
        addEntry,
        removeEntry,
        updateEntry,
        resetEntries,
        importEntries,
        getProgramStructure,
        calculateUEAverage,
        calculateSemesterAverage,
        calculateYearlyAverage,
        isUEValidated,
        isSemesterValidated,
        isYearValidated,
        getValidatedECTS,
        getTotalECTS,
        getValidatedYearECTS,
        getTotalYearECTS,
      }}
    >
      {children}
    </GradesContext.Provider>
  )
}

export function useGrades() {
  const context = useContext(GradesContext)
  if (context === undefined) {
    throw new Error("useGrades must be used within a GradesProvider")
  }
  return context
}
