"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeInputForm } from "@/components/grades/grade-input-form"
import { ResultsTab } from "@/components/grades/results-tab"
import { DetailsTab } from "@/components/grades/details-tab"
import { ImportExportTab } from "@/components/grades/import-export-tab"
import { FormProvider } from "@/contexts/form-context"

export function GradesTabs() {
  return (
    <Tabs defaultValue="input" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="input">Saisie des Notes</TabsTrigger>
        <TabsTrigger value="results">Résultats</TabsTrigger>
        <TabsTrigger value="details">Détails par UE</TabsTrigger>
        <TabsTrigger value="import-export">Import/Export</TabsTrigger>
      </TabsList>

      <TabsContent value="input" className="mt-6">
        <FormProvider>
          <GradeInputForm />
        </FormProvider>
      </TabsContent>

      <TabsContent value="results" className="mt-6">
        <ResultsTab />
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <DetailsTab />
      </TabsContent>

      <TabsContent value="import-export" className="mt-6">
        <ImportExportTab />
      </TabsContent>
    </Tabs>
  )
}
