// Update the file parser to handle assessment type coefficients
import { useAssessmentTypeStore } from "./stores/assessment-type-store"
import { extractAssessmentTypeCode } from "./grades-processor"

// Modify the parseCSV function to include assessment type coefficients
export async function parseCSV(csvText: string): Promise<any[]> {
  // Get assessment type coefficients
  const assessmentTypeStore = useAssessmentTypeStore.getState()

  // Diviser le texte en lignes
  const lines = csvText.split("\n").filter((line) => line.trim() !== "")

  // Déterminer le séparateur (point-virgule ou virgule)
  const separator = lines[0].includes(";") ? ";" : ","

  // Extraire les en-têtes
  const headers = lines[0].split(separator).map((header) => header.trim())

  // Analyser les lignes de données
  const data = lines.slice(1).map((line) => {
    const values = line.split(separator).map((value) => value.trim())
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      // Traiter les valeurs numériques
      const value = values[index]
      if (!isNaN(Number(value)) && value !== "") {
        row[header] = Number(value)
      } else {
        row[header] = value
      }
    })

    // Add assessment type code and coefficient if code is present
    if (row.Code) {
      const assessmentTypeCode = extractAssessmentTypeCode(row.Code)
      row.AssessmentTypeCode = assessmentTypeCode
      row.AssessmentTypeCoefficient = assessmentTypeStore.getCoefficient(assessmentTypeCode)
    }

    return row
  })

  return data
}

// Modify the extractGradesFromCSV function to include assessment type coefficients
export function extractGradesFromCSV(csvData: any[]): any[] {
  // Get assessment type coefficients
  const assessmentTypeStore = useAssessmentTypeStore.getState()

  // Transformer les données brutes en format utilisable
  return csvData.map((row) => {
    // Extraire la date, le code, le titre, la note et le coefficient
    const date = row.Date || row["Début.Événement"] || ""
    const code = row.Code || ""
    const title = row.Épreuve || row.Epreuve || ""
    const gradeStr = row.Note || ""

    // Traiter la note (peut être un nombre ou "ABS")
    let grade = 0
    let absence = false
    let absenceJustified = false

    if (gradeStr === "ABS") {
      absence = true
      // Par défaut, on considère l'absence comme non justifiée
      absenceJustified = false
    } else if (!isNaN(Number(gradeStr))) {
      grade = Number(gradeStr)
    }

    // Extraire le coefficient
    const coefficient = row.Coefficient || 1

    // Extract assessment type code and get its coefficient
    const assessmentTypeCode = extractAssessmentTypeCode(code)
    const assessmentTypeCoefficient = assessmentTypeStore.getCoefficient(assessmentTypeCode)

    return {
      id: `${date}_${code}`,
      date,
      code,
      title,
      grade,
      coefficient,
      absence,
      absenceJustified,
      assessmentTypeCode,
      assessmentTypeCoefficient,
    }
  })
}

// Fonction pour analyser un fichier PDF (simulation)
export async function parsePDF(file: File): Promise<any[]> {
  // Dans une application réelle, cette fonction utiliserait une bibliothèque
  // comme pdf.js pour extraire le texte du PDF, puis analyserait ce texte

  // Pour l'exemple, on simule un délai et on renvoie des données fictives
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulation de données extraites du PDF
  return [
    {
      Date: "23/09/2024",
      Code: "2425_A1_MATHS1_01",
      Épreuve: "DS Mathématiques 1 n°1 (S1)",
      Note: 9.5,
      Coefficient: 1,
    },
    {
      Date: "04/10/2024",
      Code: "2425_A1_MATHS1_CC",
      Épreuve: "CC Mathématiques 1 (S1)",
      Note: 18.13,
      Coefficient: 1,
    },
    {
      Date: "04/10/2024",
      Code: "2425_A1_MATHS1_PROJET",
      Épreuve: "Projet Mathématiques 1 (S1)",
      Note: 14.0,
      Coefficient: 1,
    },
    {
      Date: "07/10/2024",
      Code: "2425_A1_INFO1_CARDUINO_01",
      Épreuve: "DS Informatique n°1 (S1)",
      Note: 15.0,
      Coefficient: 1,
    },
    {
      Date: "18/10/2024",
      Code: "2425_A1_SCI1_ELECNUM_CC_01",
      Épreuve: "TP Élec Num (S1)",
      Note: 17.5,
      Coefficient: 4,
    },
  ]
}
