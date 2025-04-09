import { type NextRequest, NextResponse } from "next/server"
import { processGradesData } from "@/lib/grades-processor"

// API pour traiter les notes importées
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Format de données invalide" }, { status: 400 })
    }

    // Traiter les données
    const processedGrades = processGradesData(data)

    return NextResponse.json({ grades: processedGrades })
  } catch (error) {
    console.error("Erreur lors du traitement des notes:", error)
    return NextResponse.json({ error: "Erreur lors du traitement des notes" }, { status: 500 })
  }
}

// API pour récupérer les notes
export async function GET() {
  try {
    // Dans une application réelle, on récupérerait les notes depuis une base de données
    // Pour l'exemple, on renvoie des données fictives
    return NextResponse.json({
      message: "Cette API renverrait les notes depuis une base de données",
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des notes" }, { status: 500 })
  }
}
