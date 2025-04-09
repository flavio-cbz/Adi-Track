"use client"
import { AssessmentTypeCoefficients } from "@/components/assessment-type-coefficients"
import { useAssessmentTypeStore } from "@/lib/stores/assessment-type-store"

export function AssessmentSettings() {
  const { coefficients, setCoefficients } = useAssessmentTypeStore()

  const handleSaveCoefficients = (updatedCoefficients: any[]) => {
    setCoefficients(updatedCoefficients)
  }

  return (
    <div className="space-y-6">
      <AssessmentTypeCoefficients coefficients={coefficients} onSave={handleSaveCoefficients} />
    </div>
  )
}
