import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction pour formater une date au format français
export function formatDate(dateString: string): string {
  const parts = dateString.split("/")
  if (parts.length !== 3) return dateString

  const day = parts[0]
  const month = parts[1]
  const year = parts[2]

  return `${day}/${month}/${year}`
}

// Fonction pour extraire le code UE d'un code d'épreuve
export function extractUECode(gradeCode: string): string {
  const parts = gradeCode.split("_")
  if (parts.length < 3) return ""

  // Extraire les 5 premiers caractères du code de cours (ex: MATHS, INFO, etc.)
  return parts[2].substring(0, 5)
}

// Fonction pour extraire le code du cours d'un code d'épreuve
export function extractCourseCode(gradeCode: string): string {
  const parts = gradeCode.split("_")
  if (parts.length < 3) return ""

  return parts[2]
}

// Fonction pour extraire le type d'évaluation d'un code d'épreuve
export function extractEvaluationType(gradeCode: string): string {
  const parts = gradeCode.split("_")
  if (parts.length < 4) return ""

  // Enlever les chiffres à la fin pour obtenir le type (DS, CC, PROJET, etc.)
  return parts[3].replace(/\d+$/, "")
}

// Fonction pour générer un identifiant unique
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Fonction pour arrondir un nombre à 2 décimales
export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100
}
