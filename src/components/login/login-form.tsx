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
import Image from "next/image"
import SapiensSvg from "../../../public/sapiens.svg"
import { GalleryVerticalEnd } from "lucide-react"

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
    <div className={cn("flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16", className)} {...props}>
      {/* Sol Taraf - Login Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center md:items-start">
        {/* Logo/Başlık - Desktop'ta göster */}
        <div className="mb-6 hidden md:flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">Taneri Site Yönetimi</p>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-2xl md:text-3xl text-slate-900 dark:text-white">
              Site Yönetimine Hoşgeldiniz
            </CardTitle>
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
                      className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Şifrenizi mi unuttunuz?
                    </Link>
                  </div>
                  <Input 
                      id="password" 
                      type="password" 
                      placeholder="Parolanızı girin"
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
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm text-center">
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

      {/* Sağ Taraf - İllüstrasyon */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center">
        <div className="relative w-full max-w-lg">
          <Image 
            src={SapiensSvg} 
            alt="Site Yönetimi İllüstrasyonu" 
            width={500} 
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
