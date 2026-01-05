'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata loglama (isteğe bağlı - production'da bir log servisine gönderebilirsiniz)
    console.error('Uygulama hatası:', error)
  }, [error])

  // Sunucu bağlantı hatası kontrolü
  const isConnectionError = 
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes('timeout') ||
    error.name === 'TypeError'

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bir Hata Oluştu</CardTitle>
          <CardDescription className="mt-2">
            {isConnectionError ? (
              <>
                Sunucuya bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun ve tekrar deneyin.
              </>
            ) : (
              <>
                Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message || 'Bilinmeyen hata'}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={reset}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tekrar Dene
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

