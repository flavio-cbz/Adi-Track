// Parse CSV content
export function parseCSV(content: string): any[] {
  const lines = content.split(/\r?\n/)
  if (lines.length < 2) {
    throw new Error("Le fichier CSV est vide ou mal formaté")
  }

  const headers = parseCSVLine(lines[0])
  const requiredHeaders = ["semester", "ue", "courseName", "grade", "coefficient", "isAbsent", "evaluationType"]

  // Check if all required headers are present
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`En-tête manquant dans le fichier CSV: ${header}`)
    }
  }

  // Parse data rows
  const entries: any[] = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue // Skip empty lines

    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) {
      throw new Error(`Ligne ${i + 1} mal formatée: nombre de colonnes incorrect`)
    }

    // Create entry object
    const entry: any = {}
    headers.forEach((header, index) => {
      entry[header] = values[index]
    })

    // Format values
    entry.id = entry.id || Date.now().toString() + Math.random().toString(36).substring(2, 9)
    entry.grade = entry.isAbsent === "true" ? "ABS" : Number(entry.grade)
    entry.coefficient = Number(entry.coefficient)
    entry.isAbsent = entry.isAbsent === "true"

    entries.push(entry)
  }

  return entries
}

// Helper function to parse CSV line considering quoted values
export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  // Add the last field
  result.push(current)

  return result
}

// Parse JSON content
export function parseJSON(content: string): any[] {
  try {
    const parsed = JSON.parse(content)

    if (!Array.isArray(parsed)) {
      throw new Error("Le fichier JSON doit contenir un tableau d'entrées")
    }

    // Validate and format each entry
    return parsed.map((entry, index) => {
      if (!entry.semester || !entry.ue || !entry.courseName || !entry.evaluationType) {
        throw new Error(`Entrée ${index + 1} mal formatée: champs obligatoires manquants`)
      }

      return {
        id: entry.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        semester: entry.semester,
        ue: entry.ue,
        courseName: entry.courseName,
        grade: entry.isAbsent ? "ABS" : Number(entry.grade),
        coefficient: Number(entry.coefficient),
        isAbsent: Boolean(entry.isAbsent),
        evaluationType: entry.evaluationType,
      }
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Le fichier JSON est mal formaté")
    }
    throw error
  }
}

// Validate imported data
export function validateImportedData(entries: any[]) {
  if (entries.length === 0) {
    throw new Error("Aucune donnée valide n'a été trouvée dans le fichier")
  }

  entries.forEach((entry, index) => {
    // Check required fields
    if (!entry.semester || !entry.ue || !entry.courseName || !entry.evaluationType) {
      throw new Error(`Entrée ${index + 1} mal formatée: champs obligatoires manquants`)
    }

    // Check grade value
    if (!entry.isAbsent && (isNaN(Number(entry.grade)) || Number(entry.grade) < 0 || Number(entry.grade) > 20)) {
      throw new Error(`Entrée ${index + 1}: La note doit être un nombre entre 0 et 20`)
    }

    // Check evaluation type
    if (!["written", "continuous", "project"].includes(entry.evaluationType)) {
      throw new Error(`Entrée ${index + 1}: Type d'évaluation invalide`)
    }
  })
}
