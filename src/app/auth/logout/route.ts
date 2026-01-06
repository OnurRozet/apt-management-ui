import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bu bir API Route Handler'dır (GET isteğini karşılar)
export async function GET() {
  // 1. Cookie'yi sil
  (await cookies()).delete("session_token");

  // 2. Kullanıcıyı Login'e fırlat
  redirect("/auth/login");
}