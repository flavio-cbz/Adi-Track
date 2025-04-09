import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">ADI-Track</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
