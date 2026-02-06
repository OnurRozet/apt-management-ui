// import Link from "next/link"
// import { Button } from "../ui/button"
// import Image from "next/image"
// import { SidebarTrigger } from "../ui/sidebar"
// import { Separator } from "../ui/separator"

// const Navbar = () => {
//   return (
//     <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
//       <div className="flex items-center gap-2 px-4">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <Link href="/" className="flex items-center gap-2 font-medium text-lg text-foreground">
//            {/* Logo only on mobile maybe? or always if you want */}
//            {/* <Image src="/home.png" alt="Logo" width={24} height={24} /> */}
//            <span>Yönetim Paneli</span>
//         </Link>
//       </div>

//       <div className="ml-auto flex items-center gap-4">
//           {/* Top Menu Links - maybe hide on mobile? */}
//             <Link href="/flats" className="text-sm font-medium transition-colors hover:text-primary hidden md:block">
//             Daireler
//           </Link>
         
//           <Button variant="outline" size="sm" className="hidden md:flex">
//              Oturumu Kapat
//           </Button>
//       </div>
//     </header>
//   )
// }

// export default Navbar
