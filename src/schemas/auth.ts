// src/schemas/auth.ts
import { z } from "zod";

export const LoginSchema = z.object({
  apartmentLabel: z.string().min(1, "Geçerli bir daire numarası girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

// TypeScript tipini de buradan türet, interface yazmakla uğraşma
export type LoginInput = z.infer<typeof LoginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(1, "İsim soyisim zorunludur."),
  apartmentNumber: z
    .number()
    .min(1, "Daire numarası zorunludur.")
    .transform((val) => Number(val))
    .pipe(z.number().int().positive("Daire numarası pozitif olmalıdır.")),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  confirmPassword: z.string().min(6, "Şifre tekrar alanı zorunludur."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;