"use client"

import type React from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto py-8 px-4">{children}</div>
}
