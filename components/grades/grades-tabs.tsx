"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeInputForm } from "@/components/grades/grade-input-form"
import { ResultsTab } from "@/components/grades/results-tab"
import { DetailsTab } from "@/components/grades/details-tab"
import { ImportExportTab } from "@/components/grades/import-export-tab"
import { FormProvider } from "@/contexts/form-context"
import AboutPage from "@/components/about-page"

export function GradesTabs() {
    return (
        <>
            <style jsx>{`
                .tabs-trigger[data-state="active"] {
                    position: relative;
                }
                .tabs-trigger[data-state="active"]::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px; /* Ajustez l'épaisseur si nécessaire */
                    background-color: #ccc; /* Couleur de l'indicateur */
                }
            `}</style>
            <Tabs defaultValue="input" className="w-full">
                {/*
          Remplacez la classe qui fixe la hauteur (ici h-10) par !h-auto pour forcer l'ajustement.
          On retire également les classes d'alignement qui pourraient forcer une hauteur minimale.
        */}
                <TabsList className="grid !h-auto w-full gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2">
                    <TabsTrigger
                        value="input"
                        className="tabs-trigger text-xs sm:text-sm px-2 py-1 h-auto whitespace-normal text-center"
                    >
                        Saisie des Notes
                    </TabsTrigger>
                    <TabsTrigger
                        value="results"
                        className="tabs-trigger text-xs sm:text-sm px-2 py-1 h-auto whitespace-normal text-center"
                    >
                        Résultats
                    </TabsTrigger>
                    <TabsTrigger
                        value="details"
                        className="tabs-trigger text-xs sm:text-sm px-2 py-1 h-auto whitespace-normal text-center"
                    >
                        Détails par UE
                    </TabsTrigger>
                    <TabsTrigger
                        value="import-export"
                        className="tabs-trigger text-xs sm:text-sm px-2 py-1 h-auto whitespace-normal text-center"
                    >
                        Import/Export
                    </TabsTrigger>
                    <TabsTrigger
                        value="about"
                        className="tabs-trigger text-xs sm:text-sm px-2 py-1 h-auto whitespace-normal text-center"
                    >
                        About
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="mt-4">
                    <FormProvider>
                        <GradeInputForm />
                    </FormProvider>
                </TabsContent>

                <TabsContent value="results" className="mt-4">
                    <ResultsTab />
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                    <DetailsTab />
                </TabsContent>

                <TabsContent value="import-export" className="mt-4">
                    <ImportExportTab />
                </TabsContent>

                <TabsContent value="about" className="mt-4">
                    <AboutPage />
                </TabsContent>
            </Tabs>
        </>
    )
}
