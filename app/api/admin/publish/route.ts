import { type NextRequest, NextResponse } from "next/server"

// API pour publier les résultats validés
export async function POST(req: NextRequest) {
  try {
    const { results, adminId } = await req.json()

    if (!results || !adminId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Vérifier l'autorisation de l'administrateur
    // Dans une application réelle, on vérifierait les droits de l'administrateur

    // Simuler la publication des résultats
    const publishDate = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: "Résultats publiés avec succès",
      publishDate,
      publishedBy: adminId,
    })
  } catch (error) {
    console.error("Erreur lors de la publication des résultats:", error)
    return NextResponse.json({ error: "Erreur lors de la publication des résultats" }, { status: 500 })
  }
}
