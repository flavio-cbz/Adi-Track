import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Grade, Semester } from "./grades-processor"
import { calculateUEAverage, calculateSemesterAverage, isUEValidated } from "./grades-processor"

interface ExportOptions {
  format: "A4" | "Letter" | "Legal"
  includeDetails: boolean
  includeCharts: boolean
  includeComparisons: boolean
  includeAbsences: boolean
}

export async function exportToPDF(
  grades: Grade[],
  semester: Semester,
  options: ExportOptions,
  studentName = "Étudiant ADIMAKER",
): Promise<Blob> {
  // Créer un nouveau document PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: options.format,
  })

  // Ajouter un en-tête
  doc.setFontSize(20)
  doc.text("ADI-Track - Relevé de notes", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.text(`Étudiant: ${studentName}`, 105, 25, { align: "center" })
  doc.text(`Semestre: ${semester.code} - ${semester.name}`, 105, 30, { align: "center" })
  doc.text(`Date d'exportation: ${new Date().toLocaleDateString()}`, 105, 35, { align: "center" })

  // Ajouter un résumé
  doc.setFontSize(16)
  doc.text("Résumé", 14, 45)

  const semesterAverage = calculateSemesterAverage(semester)
  const totalECTS = semester.ues.reduce((sum, ue) => sum + ue.ects, 0)
  const validatedECTS = semester.ues.reduce((sum, ue) => sum + (isUEValidated(ue) ? ue.ects : 0), 0)

  autoTable(doc, {
    startY: 50,
    head: [["Moyenne générale", "ECTS validés", "Statut"]],
    body: [
      [
        `${semesterAverage.toFixed(2)}/20`,
        `${validatedECTS}/${totalECTS}`,
        semesterAverage >= 10 ? "Validé" : "Non validé",
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  })

  // Ajouter les moyennes par UE
  doc.setFontSize(16)
  doc.text("Moyennes par UE", 14, 80)

  const ueTableData = semester.ues.map((ue) => {
    const average = calculateUEAverage(ue.courses)
    return [
      ue.code,
      ue.name,
      `${average.toFixed(2)}/20`,
      `${isUEValidated(ue) ? ue.ects : 0}/${ue.ects}`,
      isUEValidated(ue) ? "Validée" : "Non validée",
    ]
  })

  autoTable(doc, {
    startY: 85,
    head: [["Code", "Intitulé", "Moyenne", "ECTS", "Statut"]],
    body: ueTableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  })

  // Ajouter les détails des notes si demandé
  if (options.includeDetails) {
    doc.setFontSize(16)
    doc.text("Détail des notes", 14, 140)

    const gradesTableData = grades.map((grade) => [
      grade.date,
      grade.code,
      grade.title,
      grade.absence ? "ABS" : `${grade.grade.toFixed(2)}/20`,
      grade.coefficient.toString(),
      grade.absence ? (grade.absenceJustified ? "Justifiée" : "Non justifiée") : "-",
    ])

    autoTable(doc, {
      startY: 145,
      head: [["Date", "Code", "Intitulé", "Note", "Coefficient", "Absence"]],
      body: gradesTableData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
      },
    })
  }

  // Ajouter les absences si demandé
  if (options.includeAbsences) {
    const absences = grades.filter((grade) => grade.absence)

    if (absences.length > 0) {
      // Ajouter une nouvelle page si nécessaire
      if (doc.internal.getCurrentPageInfo().pageNumber === 1 && doc.internal.getNumberOfPages() === 1) {
        doc.addPage()
      }

      doc.setFontSize(16)
      doc.text("Récapitulatif des absences", 14, 20)

      const absencesTableData = absences.map((absence) => [
        absence.date,
        absence.code,
        absence.title,
        absence.absenceJustified ? "Justifiée" : "Non justifiée",
      ])

      autoTable(doc, {
        startY: 25,
        head: [["Date", "Code", "Intitulé", "Statut"]],
        body: absencesTableData,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { left: 14, right: 14 },
      })
    }
  }

  // Ajouter un pied de page
  const totalPages = doc.internal.getNumberOfPages()

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    const textColor = 150
    doc.setTextColor(textColor)
    doc.text(
      `Page ${i} sur ${totalPages} - Document généré par ADI-Track le ${new Date().toLocaleDateString()}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  // Retourner le document sous forme de Blob
  return doc.output("blob")
}

export async function exportToCSV(grades: Grade[], semester: Semester): Promise<Blob> {
  // Préparer les en-têtes
  const headers = ["Date", "Code", "Intitulé", "Note", "Coefficient", "Absence", "Justifiée"]

  // Préparer les données
  const rows = grades.map((grade) => [
    grade.date,
    grade.code,
    grade.title,
    grade.absence ? "ABS" : grade.grade.toFixed(2),
    grade.coefficient.toString(),
    grade.absence ? "Oui" : "Non",
    grade.absence ? (grade.absenceJustified ? "Oui" : "Non") : "",
  ])

  // Convertir en CSV
  const csvContent = [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n")

  // Retourner le document sous forme de Blob
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
}
