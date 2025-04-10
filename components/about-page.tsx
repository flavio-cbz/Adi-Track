import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">

            <main className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">À propos</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Comment les coefficients sont appliqués</CardTitle>
                        <CardDescription>Explication du calcul des moyennes avec coefficients</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                Les coefficients sont appliqués à plusieurs niveaux : note individuelle, module, cours et UE. Chaque
                                niveau contribue au calcul de la moyenne générale.
                            </AlertDescription>
                        </Alert>

                        <div className="text-sm space-y-2">
                            <p>
                                <strong>Niveau 1 - Notes individuelles :</strong> Chaque note est pondérée par son coefficient.
                            </p>
                            <p>
                                <strong>Niveau 2 - Modules :</strong> Les notes sont d'abord regroupées par module (ex: MATHS1). La
                                moyenne du module est calculée en tenant compte des coefficients des notes.
                            </p>
                            <p>
                                <strong>Niveau 3 - Cours :</strong> Les moyennes des modules sont pondérées par les coefficients des
                                cours pour obtenir la moyenne du cours.
                            </p>
                            <p>
                                <strong>Niveau 4 - UE :</strong> Les moyennes des cours sont pondérées par les coefficients des UE pour
                                obtenir la moyenne de l'UE.
                            </p>
                            <p>
                                <strong>Niveau 5 - Semestre :</strong> Les moyennes des UE sont pondérées par les ECTS pour obtenir la
                                moyenne du semestre.
                            </p>
                        </div>

                        <div className="border rounded-md p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">Exemple complet de calcul</h3>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Niveau</TableHead>
                                            <TableHead>Élément</TableHead>
                                            <TableHead>Valeur</TableHead>
                                            <TableHead>Coefficient</TableHead>
                                            <TableHead>Calcul</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Niveau 1 - Notes individuelles */}
                                        <TableRow>
                                            <TableCell rowSpan={3} className="align-top font-medium">
                                                Notes (Module MATHS1)
                                            </TableCell>
                                            <TableCell>DS Maths</TableCell>
                                            <TableCell>15/20</TableCell>
                                            <TableCell>2</TableCell>
                                            <TableCell rowSpan={3} className="align-middle">
                                                (15×2 + 12×1 + 18×3) ÷ (2+1+3) = 16/20
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>CC Maths</TableCell>
                                            <TableCell>12/20</TableCell>
                                            <TableCell>1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Projet Maths</TableCell>
                                            <TableCell>18/20</TableCell>
                                            <TableCell>3</TableCell>
                                        </TableRow>

                                        {/* Niveau 2 - Modules */}
                                        <TableRow>
                                            <TableCell rowSpan={2} className="align-top font-medium">
                                                Modules (Cours Mathématiques)
                                            </TableCell>
                                            <TableCell>MATHS1</TableCell>
                                            <TableCell>16/20</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell rowSpan={2} className="align-middle">
                                                (16×4 + 14×6) ÷ (4+6) = 14.8/20
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>MATHS2</TableCell>
                                            <TableCell>14/20</TableCell>
                                            <TableCell>6</TableCell>
                                        </TableRow>

                                        {/* Niveau 3 - Cours */}
                                        <TableRow>
                                            <TableCell rowSpan={3} className="align-top font-medium">
                                                Cours (UE Mathématiques)
                                            </TableCell>
                                            <TableCell>Mathématiques</TableCell>
                                            <TableCell>14.8/20</TableCell>
                                            <TableCell>5</TableCell>
                                            <TableCell rowSpan={3} className="align-middle">
                                                (14.8×5 + 13×3 + 16×2) ÷ (5+3+2) = 14.4/20
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Statistiques</TableCell>
                                            <TableCell>13/20</TableCell>
                                            <TableCell>3</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Algèbre</TableCell>
                                            <TableCell>16/20</TableCell>
                                            <TableCell>2</TableCell>
                                        </TableRow>

                                        {/* Niveau 4 - UE */}
                                        <TableRow>
                                            <TableCell rowSpan={3} className="align-top font-medium">
                                                UE (Semestre 1)
                                            </TableCell>
                                            <TableCell>Mathématiques</TableCell>
                                            <TableCell>14.4/20</TableCell>
                                            <TableCell>6 ECTS</TableCell>
                                            <TableCell rowSpan={3} className="align-middle">
                                                (14.4×6 + 15.2×6 + 12.5×6) ÷ (6+6+6) = 14.03/20
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Informatique</TableCell>
                                            <TableCell>15.2/20</TableCell>
                                            <TableCell>6 ECTS</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Sciences</TableCell>
                                            <TableCell>12.5/20</TableCell>
                                            <TableCell>6 ECTS</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <p className="mt-4 text-sm text-muted-foreground">
                                Dans cet exemple, la moyenne du semestre est de 14.03/20, calculée en tenant compte des coefficients à
                                chaque niveau de la hiérarchie.
                            </p>

                            <div className="mt-4 p-3 border rounded-md bg-blue-50 text-blue-800">
                                <p className="text-sm font-medium">Points importants :</p>
                                <ul className="text-sm list-disc list-inside mt-1">
                                    <li>Une UE est validée si sa moyenne est ≥ 10/20</li>
                                    <li>Les ECTS d'une UE sont acquis uniquement si l'UE est validée</li>
                                    <li>Le semestre est validé si toutes les UE sont validées</li>
                                    <li>Les absences justifiées sont neutralisées dans le calcul</li>
                                    <li>Les absences non justifiées comptent comme des 0</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Types d'évaluation et coefficients</CardTitle>
                        <CardDescription>Comment les différents types d'évaluation sont pris en compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm space-y-2">
                            <p>
                                ADI-Track applique des coefficients spécifiques selon le type d'évaluation. Ces coefficients sont
                                configurables dans les paramètres de l'application.
                            </p>

                            <h3 className="text-base font-medium mt-4">Types d'évaluation standard</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <strong>DS (Devoir Surveillé)</strong> : Coefficient par défaut de 2.0
                                </li>
                                <li>
                                    <strong>CC (Contrôle Continu)</strong> : Coefficient par défaut de 1.0
                                </li>
                                <li>
                                    <strong>PROJET</strong> : Coefficient par défaut de 1.5
                                </li>
                                <li>
                                    <strong>TP (Travaux Pratiques)</strong> : Coefficient par défaut de 1.0
                                </li>
                                <li>
                                    <strong>ORAL</strong> : Coefficient par défaut de 1.5
                                </li>
                            </ul>

                            <h3 className="text-base font-medium mt-4">Gestion des absences</h3>
                            <p>Les absences sont traitées différemment selon qu'elles sont justifiées ou non :</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <strong>Absence justifiée</strong> : L'évaluation est neutralisée et n'est pas prise en compte dans le
                                    calcul de la moyenne.
                                </li>
                                <li>
                                    <strong>Absence non justifiée</strong> : L'évaluation est comptée comme un 0 et est prise en compte
                                    dans le calcul de la moyenne avec son coefficient.
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>À propos d'ADI-Track</CardTitle>
                        <CardDescription>Informations sur l'application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm space-y-2">
                            <p>
                                ADI-Track est une application conçue pour les étudiants du programme ADI (Architecture des Données et
                                Ingénierie) de JUNIA. Elle permet de suivre, calculer et vérifier les moyennes selon les règles
                                spécifiques du programme.
                            </p>

                            <h3 className="text-base font-medium mt-4">Fonctionnalités principales</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Importation des notes depuis Aurion (CSV ou PDF)</li>
                                <li>Saisie manuelle des notes</li>
                                <li>Calcul automatique des moyennes par module, UE et semestre</li>
                                <li>Vérification des notes et détection des anomalies</li>
                                <li>Exportation des résultats en PDF ou CSV</li>
                                <li>Suivi de la progression des ECTS</li>
                                <li>Gestion des absences justifiées et non justifiées</li>
                            </ul>

                            <h3 className="text-base font-medium mt-4">Confidentialité</h3>
                            <p>
                                ADI-Track respecte votre vie privée. Toutes vos données sont stockées localement sur votre appareil et
                                ne sont jamais partagées avec des serveurs externes sans votre consentement explicite.
                            </p>

                            <p className="mt-4 text-xs text-muted-foreground">
                                Version 1.0.0 - © 2025 ADI-Track - Tous droits réservés
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
