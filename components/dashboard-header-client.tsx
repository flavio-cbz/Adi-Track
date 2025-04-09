"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

interface NavigationProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams ? searchParams.get("tab") : null

  // Déterminer si un lien est actif
  const isActive = (tab: string | null) => {
    if (!tab && !activeTab) return true // Dashboard
    return tab === activeTab
  }

  return (
    <>
      <nav className="hidden md:flex md:gap-6">
        <Link
          href="/"
          className={`text-sm font-medium ${isActive(null) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          Tableau de bord
        </Link>
        <Link
          href="/?tab=grades"
          className={`text-sm font-medium ${isActive("grades") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          Notes
        </Link>
        <Link
          href="/?tab=import"
          className={`text-sm font-medium ${isActive("import") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          UE et ECTS
        </Link>
        <Link
          href="/?tab=verification"
          className={`text-sm font-medium ${isActive("verification") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          Absences
        </Link>
      </nav>

      <nav className="flex flex-col gap-4 text-lg font-medium">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive(null) ? "text-primary" : ""}>
          Tableau de bord
        </Link>
        <Link
          href="/?tab=grades"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive("grades") ? "text-primary" : ""}
        >
          Notes
        </Link>
        <Link
          href="/?tab=import"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive("import") ? "text-primary" : ""}
        >
          UE et ECTS
        </Link>
        <Link
          href="/?tab=verification"
          onClick={() => setIsMobileMenuOpen(false)}
          className={isActive("verification") ? "text-primary" : ""}
        >
          Absences
        </Link>
        <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
          Paramètres
        </Link>
      </nav>
    </>
  )
}
