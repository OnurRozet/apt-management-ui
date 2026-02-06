import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bu bir API Route Handler'dır (GET isteğini karşılar)
export async function GET() {
  const cookieStore = await cookies();

  // 1. Cookie'leri sil
  cookieStore.delete("session_token");
  cookieStore.delete("apartment_number");

  // 2. Kullanıcıyı Login'e fırlat
  redirect("/auth/login");
}
