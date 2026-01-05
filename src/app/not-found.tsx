import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sayfa Bulunamadı</CardTitle>
          <CardDescription className="mt-2">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-muted-foreground mb-2">404</p>
            <p className="text-sm text-muted-foreground">
              İstediğiniz sayfaya şu anda erişilemiyor.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              asChild
              variant="default"
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

