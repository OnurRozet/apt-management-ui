'use client'
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
import { registerAction } from "@/actions/auth-actions"
import { registerSchema, RegisterInput } from "@/schemas/auth"
import { useForm } from "react-hook-form" // ✅ Gerçek import
import { zodResolver } from "@hookform/resolvers/zod" // ✅ Gerçek import
import Image from "next/image"
import SapiensSvg from "../../../public/sapiens.svg"
import { GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation"



export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const router = useRouter();
  
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      apartmentNumber: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = (values: RegisterInput) => {
    setServerError(null);
    setServerSuccess(null);

    startTransition(async () => {

      const result = await registerAction(values);

      if (!result.success) {
        setServerError(result.message || "Kayıt işlemi başarısız.");
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              form.setError(field as any, { message: messages[0] });
            }
          });
        }
        return;
      }

      setServerSuccess(result.message || "Kayıt başarılı.");
      await router.push("/auth/login");
      form.reset();
    });
  };

  const errors = form.formState.errors;

  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16", className)} {...props}>
      {/* Sol Taraf - Register Form */}
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
              Kayıt Ol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fullName">İsim-Soyisim</FieldLabel>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="İsim ve soyisiminizi birlikte girin"
                    disabled={isPending}
                    {...form.register("fullName")}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="apartmentNumber">Daire No</FieldLabel>
                  <Input
                    id="apartmentNumber"
                    type="text"
                    placeholder="Daire numaranızı girin"
                    disabled={isPending}
                    {...form.register("apartmentNumber")}
                    className={errors.apartmentNumber ? "border-red-500" : ""}
                  />
                  {errors.apartmentNumber && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.apartmentNumber.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Şifre</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="En az 6 karakter"
                    disabled={isPending}
                    {...form.register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Şifre Tekrar</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    disabled={isPending}
                    {...form.register("passwordConfirm")}
                    className={errors.passwordConfirm ? "border-red-500" : ""}
                  />
                  {errors.passwordConfirm && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.passwordConfirm.message}
                    </p>
                  )}
                </Field>

                {serverError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm text-center">
                    {serverError}
                  </div>
                )}

                {serverSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-600 dark:text-emerald-400 text-sm text-center">
                    {serverSuccess}
                  </div>
                )}

                <Field>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                  </Button>
                  <FieldDescription className="text-center">
                    Hesabınız var mı? <Link href="/auth/login" className="text-primary hover:underline">Giriş Yap</Link>
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
