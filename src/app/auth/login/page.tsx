import { LoginForm } from "@/components/login/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Logo/Başlık - Mobilde üstte, desktop'ta gizli (form içinde gösterilecek) */}
        <div className="mb-6 flex justify-center md:hidden">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <p className="text-xl font-bold">Taneri Site Yönetimi</p>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
