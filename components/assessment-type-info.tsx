"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAssessmentTypeStore } from "@/lib/stores/assessment-type-store"

export function AssessmentTypeInfo() {
  const { coefficients } = useAssessmentTypeStore()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Coefficients par type d'évaluation</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Ces coefficients sont appliqués à toutes les évaluations du type correspondant, en plus des
                  coefficients spécifiques à chaque épreuve.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Coefficients appliqués selon le type d'évaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Coefficient</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coefficients.map((coef) => (
              <TableRow key={coef.id}>
                <TableCell>{coef.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {coef.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{coef.coefficient}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
