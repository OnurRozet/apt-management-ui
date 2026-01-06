import { SidebarData } from "@/components/master-layout/Sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Burada tekrar cookie kontrolü yapabilirsin veya sadece Sidebar'ı basarsın.
  // Middleware zaten koruduğu için buraya gelen adamın token'ı vardır.
  
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");
  
  // Kullanıcı bilgisini simüle ediyoruz (Decode edebilirsin)
  const user = { name: "Yönetici" }; 

  return (
    <div className="flex overflow-hidden">
        {/* Sidebar Sadece Burada Var! */}
        <SidebarData />
        
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-8">
            {children}
        </main>
    </div>
  );
}