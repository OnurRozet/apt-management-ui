"use client" // 👈 Client Component olduğu için bunu başa koymak şart!

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form" // ✅ Gerçek import
import { zodResolver } from "@hookform/resolvers/zod" // ✅ Gerçek import
import { LoginInput, LoginSchema } from "@/schemas/auth"
import { loginAction } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // Hook Form kurulumu
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      apartmentLabel: "", // Schema'daki isimlendirmeye dikkat et
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {

      const response = await loginAction(data);

      if (!response.success) {
        setServerError(response.message || "Giriş başarısız.");
        
        // Field hatalarını forma yansıt
        // Not: Backend'den dönen hataların key'leri Schema ile aynı olmalı
        if (response.errors?.apartmentLabel) {
            form.setError("apartmentLabel", { message: response.errors.apartmentLabel[0] });
        }
        if (response.errors?.password) {
            form.setError("password", { message: response.errors.password[0] });
        }
      }
      // Başarılıysa action içinde redirect olur.
      await router.push("/reports");
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Site Yönetimine Hoşgeldiniz</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Form submit handler bağlandı */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              
              {/* Daire No Alanı */}
              <Field>
                <FieldLabel htmlFor="apartmentLabel">Daire No</FieldLabel>
                <Input
                  id="apartmentLabel"
                  type="text"
                  placeholder="Daire numaranızı girin"
                  disabled={isPending}
                  // ✅ React Hook Form Bağlantısı
                  {...form.register("apartmentLabel")}
                  // Hata varsa border kırmızı olsun (Tailwind class eklenebilir)
                  className={form.formState.errors.apartmentLabel ? "border-red-500" : ""}
                />
                {/* Hata Mesajı Gösterimi */}
                {form.formState.errors.apartmentLabel && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.apartmentLabel.message}
                  </p>
                )}
              </Field>

              {/* Parola Alanı */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Parola</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Şifrenizi mi unuttunuz?
                  </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    disabled={isPending}
                    {...form.register("password")}
                    className={form.formState.errors.password ? "border-red-500" : ""}
                />
                 {/* Hata Mesajı Gösterimi */}
                 {form.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              {/* Global Server Hatası */}
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                    {serverError}
                </div>
              )}

              {/* Submit Button */}
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
                <FieldDescription className="text-center">
                  Hesabınız yok mu? <Link href="/auth/register" className="text-primary hover:underline">Kayıt Ol</Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
