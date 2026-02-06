import { AppSidebar } from "@/components/master-layout/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthService } from "@/services/auth";
import { UserDto } from "@/types";

async function getUser(
  token: string | undefined,
  apartmentNumber: string | undefined,
): Promise<UserDto | null> {
  if (!token || !apartmentNumber) return null;

  try {
    const response = await AuthService.getMe(apartmentNumber, false, token);
    if (response.status === 200 && response.data?.isSuccess) {
      return response.data.resultObject;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const token = cookieStore.get("session_token")?.value;
  const apartmentNumber = cookieStore.get("apartment_number")?.value;

  // Server-side'da kullanıcı bilgilerini al
  const user = await getUser(token, apartmentNumber);

  return (
    <AuthProvider initialUser={user}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="bg-slate-50 dark:bg-slate-950/50 overflow-hidden flex flex-col">
          {/* Minimal Header with Sidebar Toggle */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
