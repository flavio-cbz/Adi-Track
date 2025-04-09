"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onDismiss: () => void
}

function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const variantClasses = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } rounded-lg border shadow-lg ${variantClasses[variant]}`}
    >
      <div className="flex p-4">
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-muted/20"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
      </div>
    </div>
  )
}
