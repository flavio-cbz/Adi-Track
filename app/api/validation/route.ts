import { type NextRequest, NextResponse } from "next/server"

// API pour valider les résultats calculés
export async function POST(req: NextRequest) {
  try {
    const { calculatedResults, officialResults } = await req.json()

    if (!calculatedResults || !officialResults) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Comparer les résultats calculés avec les résultats officiels
    const validationResults = Object.keys(calculatedResults).map((ueCode) => {
      const calculatedAverage = calculatedResults[ueCode]
      const officialAverage = officialResults[ueCode]
      const diff = calculatedAverage - officialAverage
      const isValid = Math.abs(diff) < 0.1

      return {
        ueCode,
        calculatedAverage,
        officialAverage,
        diff,
        isValid,
        status: isValid ? "Validé" : "À vérifier",
      }
    })

    return NextResponse.json({ validationResults })
  } catch (error) {
    console.error("Erreur lors de la validation des résultats:", error)
    return NextResponse.json({ error: "Erreur lors de la validation des résultats" }, { status: 500 })
  }
}
