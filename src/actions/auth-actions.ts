/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'; // 👈 Bu satır hayati önem taşır!

import { LoginSchema, LoginInput } from "@/schemas/auth";
import { AuthService } from "@/services/auth";
import { LoginDto } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Form State için tip tanımı
type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(data: LoginInput): Promise<ActionResponse> {
  // 1. Server-side Validasyon (Güvenlik için şart)
  const validated = LoginSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Veriler hatalı."
    };
  }

  try {
    // 2. Servisi Çağır (DB işlemleri burada)
    const payload: LoginDto = {
        apartmentNumber: validated.data.apartmentLabel,
        password: validated.data.password,
    };

    const response = await AuthService.login(payload);

    // Servis 200 dönmediyse hata fırlat (catch'e düşer)
    if (response.status !== 200 || !response.data) {
        throw new Error(response.statusText || "Kullanıcı adı veya şifre hatalı.");
    }

    const { token } = response.data.resultObject;    

    const cookieStore = await cookies(); // Next.js 15+ için await şart

       // 3. Token'ı Güvenli Cookie'ye Yaz
    // "httpOnly: true" -> JavaScript bu cookie'yi okuyamaz (XSS koruması)
    // "secure: true" -> Sadece HTTPS üzerinden gider
    // "sameSite: 'lax'" -> CSRF saldırılarını engeller

    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // CSRF koruması için önemli
      maxAge: 60 * 60 * 24 * 7, // 1 Hafta
      // Tüm uygulama genelinde geçerli olsun ki middleware her route'ta görebilsin
      path: "/",
    });

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Giriş başarısız.",
    };
  }

  return { success: true, message: "Giriş Başarılı " };
}

// Kayıt olma işlemi için server action (login ile benzer mantık)
import { RegisterDto } from "@/types";
import { z } from "zod";

const RegisterSchema = z.object({
  fullName: z.string().min(1, "İsim soyisim zorunludur."),
  apartmentNumber: z
    .number({
      required_error: "Daire numarası zorunludur.",
      invalid_type_error: "Daire numarası sayı olmalıdır.",
    })
    .int()
    .positive("Daire numarası pozitif olmalıdır."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  confirmPassword: z.string().min(6, "Şifre tekrar alanı zorunludur."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export async function registerAction(
  data: RegisterInput
): Promise<ActionResponse> {
  const validated = RegisterSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Veriler hatalı.",
    };
  }

  try {
    const payload: RegisterDto = {
      fullName: validated.data.fullName,
      apartmentNumber: validated.data.apartmentNumber,
      password: validated.data.password,
      confirmPassword: validated.data.confirmPassword,
    };

    const response = await AuthService.register(payload, true);

    if (response.status !== 200 || !response.data?.isSuccess) {
      throw new Error(response.data?.message || "Kayıt işlemi başarısız.");
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Kayıt sırasında bir hata oluştu.",
    };
  }

  return {
    success: true,
    message: "Kayıt başarılı, şimdi giriş yapabilirsiniz.",
  };
}

// export async function logoutAction() {
//   // 1. Cookie'yi sil (Expire et)

//   const response = await AuthService.logout();

//   if (response.status !== 200) {
//     throw new Error(response.statusText || "Çıkış yapılamadı.");
//   }

//   (await cookies()).delete("session_token");

//   // 2. Login sayfasına postala
//   redirect("/auth/login");
// }