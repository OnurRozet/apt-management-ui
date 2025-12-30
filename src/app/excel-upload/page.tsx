'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, FileText, Loader2 } from 'lucide-react'
import { IncomeService } from '@/services/income'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ExcelUploadProps {
  onUploadSuccess?: () => void
}

export default function ExcelUpload({ onUploadSuccess }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    successCount?: number
    errorCount?: number
    message?: string
    errors?: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (selectedFile: File): boolean => {
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadResult({
        success: false,
        message: 'Lütfen geçerli bir Excel dosyası seçin (.xlsx, .xls, .csv)'
      })
      return false
    }
    return true
  }

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
      setUploadResult(null)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadResult(null)

    try {
      const res = await IncomeService.uploadExcel(file)
      
      if (res.status === 200 && res.data.isSuccess) {
        setUploadResult({
          success: true,
          successCount: res.data.resultObject?.successCount || 0,
          errorCount: res.data.resultObject?.errorCount || 0,
          message: `${res.data.resultObject?.successCount || 0} gelir başarıyla yüklendi.`,
          errors: res.data.resultObject?.errors
        })
        
        // Başarılı olursa callback çağır
        if (onUploadSuccess) {
          setTimeout(() => {
            onUploadSuccess()
            handleReset()
          }, 2000)
        }
      } else {
        setUploadResult({
          success: false,
          message: res.data.message || 'Gelirler yüklenirken bir hata oluştu.'
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: string | any) {
      setUploadResult({
        success: false,
        message: error.response?.data?.message || 'Dosya yüklenirken bir hata oluştu.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = () => {
    handleReset()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Excel&apos;den Gelir Yükle</h1>
              <p className="text-muted-foreground mt-1">
                Excel dosyanızı seçin ve gelirleri toplu olarak yükleyin
              </p>
            </div>
          </div>
        </div>

        {/* Dosya Yükleme Kartı */}
        <Card>
          <CardHeader>
            <CardTitle>Dosya Seçimi</CardTitle>
            <CardDescription>
              Excel dosyanızı sürükleyip bırakın veya dosya seçmek için tıklayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & Drop Alanı */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleInputChange}
                className="hidden"
                id="excel-file-input"
                disabled={isUploading}
              />
              
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className={`p-4 rounded-full transition-colors ${
                  isDragging ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {file ? file.name : 'Dosya seçin veya sürükleyip bırakın'}
                  </p>
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                  {!file && (
                    <p className="text-sm text-muted-foreground">
                      Desteklenen formatlar: .xlsx, .xls, .csv
                    </p>
                  )}
                </div>
                {!file && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Dosya Seç
                  </Button>
                )}
              </div>
            </div>

            {/* Seçilen Dosya Bilgisi */}
            {file && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Yükleme Butonu */}
            <div className="flex justify-end gap-3">
              {file && !uploadResult?.success && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isUploading}
                >
                  Temizle
                </Button>
              )}
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Yükle
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sonuç Kartı */}
        {uploadResult && (
          <Card className={uploadResult.success ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  uploadResult.success 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {uploadResult.success ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className={`text-lg font-semibold ${
                      uploadResult.success
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      {uploadResult.message}
                    </p>
                  </div>

                  {/* İstatistikler */}
                  {uploadResult.success && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-muted-foreground">Başarılı</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {uploadResult.successCount || 0}
                        </p>
                      </div>
                      {uploadResult.errorCount && uploadResult.errorCount > 0 && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                          <p className="text-sm text-muted-foreground">Hatalı</p>
                          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                            {uploadResult.errorCount}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hata Listesi */}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/50 border max-h-64 overflow-y-auto">
                      <p className="text-sm font-medium mb-3">Hata Detayları:</p>
                      <div className="space-y-2">
                        {uploadResult.errors.slice(0, 10).map((error, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-muted-foreground">{error}</span>
                          </div>
                        ))}
                        {uploadResult.errors.length > 10 && (
                          <p className="text-xs text-muted-foreground pt-2">
                            ...ve {uploadResult.errors.length - 10} hata daha
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Başarılı yükleme sonrası buton */}
                  {uploadResult.success && (
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="w-full sm:w-auto"
                      >
                        Yeni Dosya Yükle
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bilgilendirme Kartı */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Yardım</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Excel dosyanızın doğru formatta olduğundan emin olun</p>
              <p>• Desteklenen formatlar: .xlsx, .xls, .csv</p>
              <p>• Dosya boyutu limiti: 10 MB</p>
              <p>• Yükleme işlemi tamamlandıktan sonra sonuçları kontrol edin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

