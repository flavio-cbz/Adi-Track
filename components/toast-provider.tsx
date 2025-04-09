"use client"

import type React from "react"

import { ToastContainer } from "@/components/toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
