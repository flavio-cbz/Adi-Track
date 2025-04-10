import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function extractUECode(code: string): string {
  const parts = code.split("_")
  if (parts.length >= 3) {
    return parts[2].substring(0, 2) // Extracts the UE code (e.g., "MA" from MATHS1)
  }
  return ""
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
