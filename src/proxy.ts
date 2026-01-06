import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Korumak istemediğimiz rotaları (Login, Register, Resimler vs) buraya yazıyoruz.
// Bu sayfalar "Public"tir, herkes girebilir.
// NOT: Buradaki path'ler `app` router'daki klasör yapısı ile bire bir aynı olmalı.
// Örn: `src/app/auth/login/page.tsx` -> `/auth/login`
const publicRoutes = ['/auth/login', '/auth/register'];

export function proxy(request: NextRequest) {
  
  // Kullanıcının gitmek istediği yol
  const { pathname } = request.nextUrl;
  
  // 2. Cookie kontrolü: Adamın cebinde "Bilet" (Token) var mı?
  const hasToken = request.cookies.has('session_token');

  // LOGIC 1: Kullanıcı "Giriş Yapmışsa" ve hala Login/Register sayfasına girmeye çalışıyorsa...
  // Ona "Hop kardeşim sen zaten içeridesin" deyip Dashboard'a atıyoruz.
  if (hasToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/reports', request.url));
  }

  // LOGIC 2: Kullanıcı "Giriş Yapmamışsa" (Token yoksa)
  // VE gitmek istediği yer Public bir sayfa DEĞİLSE (Örn: /dashboard, /settings)
  // Onu yakalayıp Login sayfasına postuyoruz.
  if (!hasToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Her şey yolundaysa geçişe izin ver
  return NextResponse.next();
}

// 3. Matcher: Middleware hangi sayfalarda çalışsın?
// _next (sistem dosyaları), static (resimler), favicon vs. hariç her yerde çalışsın.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}