"use client"

import { AlertCircle } from "lucide-react"

export function AurionIntegration() {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">AURION</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-4">Fonctionnalité en cours de développement</h3>
      <p className="text-sm text-muted-foreground text-center mt-2">
        L'intégration directe avec Aurion sera bientôt disponible. Cette fonctionnalité vous permettra d'importer
        automatiquement vos notes depuis Aurion sans passer par l'exportation manuelle.
      </p>
      <div className="flex items-center gap-2 mt-4 bg-amber-50 text-amber-800 p-3 rounded-md">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">Disponible dans la prochaine mise à jour</p>
      </div>
    </div>
  )
}
