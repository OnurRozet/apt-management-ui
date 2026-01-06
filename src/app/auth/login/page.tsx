import { LoginForm } from "@/components/login/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
            <p className="text-xl font-bold">Taneri Site Yönetimi</p>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
