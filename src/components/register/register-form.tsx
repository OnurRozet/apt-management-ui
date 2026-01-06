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
import { registerAction, RegisterInput } from "@/actions/auth-actions"
import { registerSchema } from "@/schemas/auth"
import { useForm } from "react-hook-form" // ✅ Gerçek import
import { zodResolver } from "@hookform/resolvers/zod" // ✅ Gerçek import



export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      apartmentNumber: 0,
      password: "",
      confirmPassword: "",
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
      form.reset();
    });
  };

  const errors = form.formState.errors;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Kayıt Ol</CardTitle>
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
                  type="number"
                  placeholder="Daire numaranızı girin"
                  disabled={isPending}
                  {...form.register("apartmentNumber", {
                    valueAsNumber: true,
                  })}
                  className={errors.apartmentNumber ? "border-red-500" : ""}
                />
                {errors.apartmentNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.apartmentNumber.message}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Şifre</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirmPassword">Şifre Tekrar</FieldLabel>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={isPending}
                  {...form.register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                  {serverError}
                </div>
              )}

              {serverSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-600 text-sm text-center">
                  {serverSuccess}
                </div>
              )}

              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                </Button>
                <FieldDescription className="text-center">
                  Hesabınız var mı? <Link href="/auth/login">Giriş Yap</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
