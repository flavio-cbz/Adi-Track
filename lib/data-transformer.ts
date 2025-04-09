import type { Grade, Course, UE, Semester, Evaluation } from "./grades-processor"
import { ueStructure } from "./mock-data"
import { useAssessmentTypeStore } from "./stores/assessment-type-store"
import { extractAssessmentTypeCode } from "./grades-processor"

// Modify the structureDataForCalculation function to include assessment type coefficients
export function structureDataForCalculation(grades: Grade[]): { semester: Semester } {
  // Get assessment type coefficients
  const assessmentTypeStore = useAssessmentTypeStore.getState()

  // Créer un semestre S1
  const semester: Semester = {
    code: "S1",
    name: "Semestre 1",
    ues: [],
  }

  // Créer les UE à partir de la structure prédéfinie
  for (const [ueCode, ueData] of Object.entries(ueStructure)) {
    const ue: UE = {
      code: ueCode,
      name: ueData.name,
      ects: ueData.ects,
      courses: [],
    }

    // Créer les cours pour cette UE
    for (const [courseCode, courseData] of Object.entries(ueData.courses)) {
      const course: Course = {
        code: courseCode,
        name: courseData.name,
        coefficient: courseData.coefficient,
        grades: [],
        evaluations: [],
      }

      // Ajouter les évaluations pour ce cours
      for (const [evalCode, evalData] of Object.entries(courseData.evaluations)) {
        const evaluation: Evaluation = {
          code: evalCode,
          name: evalCode,
          coefficient: "coefficient" in evalData ? evalData.coefficient : 1,
          percentage: "percentage" in evalData ? evalData.percentage : undefined,
        }
        course.evaluations.push(evaluation)
      }

      // Filtrer les notes pour ce cours
      const courseGrades = grades.filter((grade) => {
        const courseFromCode = grade.code.split("_")[2]
        return courseFromCode === courseCode
      })

      // Add assessment type coefficient information to each grade
      course.grades = courseGrades.map((grade) => {
        const assessmentTypeCode = extractAssessmentTypeCode(grade.code)
        const typeCoefficient = assessmentTypeStore.getCoefficient(assessmentTypeCode)

        return {
          ...grade,
          assessmentTypeCode,
          assessmentTypeCoefficient: typeCoefficient,
        }
      })

      ue.courses.push(course)
    }

    semester.ues.push(ue)
  }

  return { semester }
}
