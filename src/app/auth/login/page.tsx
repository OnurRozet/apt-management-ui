import { LoginForm } from "@/components/login/login-form"
import Link from "next/link"
import Image from "next/image"
import SapiensSvg from "../../../../public/sapiens.svg"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Image src={SapiensSvg} alt="Login Background" width={1000} height={1000} />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Hesabınıza Giriş Yapın
            </h1>
            <p className="text-sm text-muted-foreground">
              Yönetim paneline erişmek için bilgilerinizi girin.
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Devam ederek <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Kullanım Koşulları</Link> ve <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Gizlilik Politikası</Link>&apos;nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  )
}
