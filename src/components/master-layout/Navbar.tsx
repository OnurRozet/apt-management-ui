import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"


const Navbar = () => {
  return (
    <nav className="border-b bg-white dark:bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 mx-20">
        {/* Logo Alanı */}
        <Link href="/" className=" flex flex-row items-center gap-2 font-medium text-2xl text-slate-800 dark:text-white">
          <Image src="/home.png" alt="Logo" width={40} height={40} />
          Taneri Apartmanı Site Yönetimi
        </Link>

        {/* Menü Linkleri */}
        <div className="flex items-center gap-4">
          <Link href="/flats" className="text-sm font-medium transition-colors hover:text-primary">
            Daireler
          </Link>
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Aidat Takibi
          </Link>
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Yönetim
          </Link>
          
          {/* Giriş Yap Butonu - Shadcn Kullanarak */}
          <Button variant="default" size="sm">
            Giriş Yap
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
