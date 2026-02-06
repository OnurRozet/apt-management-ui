"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      apartmentLabel: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);

    startTransition(async () => {
      const response = await loginAction(data);

      if (!response.success) {
        setServerError(response.message || "Giriş başarısız.");
        
        if (response.errors?.apartmentLabel) {
            form.setError("apartmentLabel", { message: response.errors.apartmentLabel[0] });
        }
        if (response.errors?.password) {
            form.setError("password", { message: response.errors.password[0] });
        }
      } else {
         await router.push("/");
      }
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="apartmentLabel">Daire No</Label>
            <Input
              id="apartmentLabel"
              placeholder="A Blok - Daire 1"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isPending}
              {...form.register("apartmentLabel")}
              className={form.formState.errors.apartmentLabel ? "border-red-500" : ""}
            />
            {form.formState.errors.apartmentLabel && (
              <p className="text-xs text-red-500">
                {form.formState.errors.apartmentLabel.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Parola</Label>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm text-muted-foreground hover:text-primary"
              >
                Şifremi unuttum
              </Link>
            </div>
            <Input
              id="password"
              placeholder="******"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              {...form.register("password")}
              className={form.formState.errors.password ? "border-red-500" : ""}
            />
             {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          {serverError && (
            <div className="p-3 bg-destructive/15 border border-destructive/20 rounded-md text-destructive text-sm text-center">
                {serverError}
            </div>
          )}

          <Button disabled={isPending}>
            {isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </div>
      </form>
    </div>
  )
}
