"use client"

import { GradesProvider } from "@/contexts/grades-context"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { GradesTabs } from "@/components/grades/grades-tabs"

export default function Home() {
  return (
    <GradesProvider>
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-6 text-center">ADI-Track</h1>
        <GradesTabs />
      </DashboardLayout>
    </GradesProvider>
  )
}
