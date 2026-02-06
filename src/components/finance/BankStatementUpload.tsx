/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Save, ArrowLeft, X } from 'lucide-react'
import { BankService } from '@/services/bank'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { BankTransaction } from '@/types'
import { toast } from 'sonner'

interface BankStatementUploadProps {
  onProcessSuccess?: () => void
}

export default function BankStatementUpload({ onProcessSuccess }: BankStatementUploadProps) {
  // State Yönetimi
  const [step, setStep] = useState<'upload' | 'preview'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
  }, [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }, [])

  // --- DOSYA SEÇİMİ ---
  const handleFileSelect = (selectedFile: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    if (!validExtensions.includes(ext)) {
      setErrorMsg('Lütfen geçerli bir Excel dosyası seçin.')
      return
    }
    setFile(selectedFile)
    setErrorMsg(null)
  }

  // --- ADIM 1: YÜKLE VE ÖNİZLE ---
  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setErrorMsg(null)
    try {
      const res = await BankService.uploadExcel(file)
      // Backend ServiceResult formatında dönüyor
      if (res.status === 200 ) {
        if (Array.isArray(res.data)) {
          setTransactions(res.data)
          setStep('preview') // Tablo moduna geç
          toast.success(`${res.data.length} işlem başarıyla analiz edildi`)
        } else {
          setErrorMsg('Beklenmeyen veri formatı.')
          toast.error('Beklenmeyen veri formatı.')
        }
      } else {
        setErrorMsg(res.statusText || 'Dosya okunurken hata oluştu.')
        toast.error('Dosya okunurken hata oluştu.')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Dosya okunurken hata oluştu.'
      setErrorMsg(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  // --- ADIM 2: VERİ DÜZENLEME (TABLO İÇİ) ---
  const handleUpdateTransaction = (index: number, field: keyof BankTransaction, value: any) => {
    const updated = [...transactions]
    updated[index] = { ...updated[index], [field]: value }
    setTransactions(updated)
  }

  // --- ADIM 3: KAYDET VE İŞLE ---
  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      debugger
      const res = await BankService.processExcel(transactions)
      if (res.data.isSuccess) {
        // Başarılı
        toast.success(`${transactions.length} işlem başarıyla kaydedildi`)
        if (onProcessSuccess) onProcessSuccess()
        // Resetle
        setFile(null)
        setTransactions([])
        setStep('upload')
      } else {
        const errorMessage = res.data.message || 'Kayıt sırasında hata oluştu.'
        setErrorMsg(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err: any) {
      const errorMessage = `${err.response?.data?.message || ''} İşlem sırasında sunucu hatası.`
      setErrorMsg(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  // --- RENDER: UPLOAD EKRANI ---
  if (step === 'upload') {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card className="w-full shadow-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Banka Ekstresi Yükle</CardTitle>
            <CardDescription className="text-base max-w-sm mx-auto">
              Ziraat Bankası Excel (.xlsx) dosyasını buraya sürükleyin veya seçin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {/* Drag Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative flex flex-col items-center justify-center p-12 text-center rounded-xl transition-all cursor-pointer bg-muted/30 hover:bg-muted/60",
                isDragging && "bg-primary/5 ring-2 ring-primary ring-offset-2"
              )}
            >
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                   <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-3 rounded-full">
                      <FileSpreadsheet className="h-8 w-8" />
                   </div>
                   <p className="font-medium text-lg">{file.name}</p>
                   <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                   <Button variant="ghost" size="sm" className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      <X className="mr-2 h-4 w-4" /> Kaldır
                   </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <FileSpreadsheet className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-lg font-medium">Dosyayı buraya bırakın</p>
                  <p className="text-sm">veya seçmek için tıklayın</p>
                </div>
              )}
            </div>

            {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4" /> {errorMsg}
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
               <Button onClick={handleUpload} disabled={!file || isUploading} size="lg" className="w-full sm:w-auto min-w-[200px]">
                    {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                    Analiz Et ve Önizle
               </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // --- RENDER: ÖNİZLEME (PREVIEW) EKRANI ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-none bg-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                Kontrol ve Onay
            </h2>
            <p className="text-muted-foreground">
              Tespit edilen {transactions.length} işlemi gözden geçirin ve kategorileri doğrulayın.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => setStep('upload')} disabled={isProcessing}>
                <ArrowLeft className="mr-2 h-4 w-4" /> İptal
             </Button>
             <Button onClick={handleProcess} disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Kaydet ({transactions.length})
             </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-lg border-muted">
        <div className="overflow-x-auto max-h-[600px]">
            <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                        <TableHead className="w-[100px]">Tarih</TableHead>
                        <TableHead className="min-w-[200px]">Açıklama</TableHead>
                        <TableHead className="w-[100px]">Tür</TableHead>
                        <TableHead className="text-right w-[120px]">Tutar</TableHead>
                        <TableHead className="w-[200px]">Kategori / Daire</TableHead>
                        <TableHead className="w-[100px]">Durum</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium whitespace-nowrap text-xs">
                                {new Date(item.date).toLocaleDateString('tr-TR')}
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground" title={item.description}>
                                {item.description}
                            </TableCell>
                            <TableCell>
                                <Badge variant={item.transactionType === 'Gelir' ? 'default' : 'secondary'} className={cn("text-[10px] px-2 py-0.5", item.transactionType === 'Gelir' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200')}>
                                    {item.transactionType}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-semibold">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}
                            </TableCell>
                            <TableCell>
                                {item.transactionType === 'Gider' ? (
                                    <Input 
                                        value={item.suggestedCategory || ''} 
                                        onChange={(e) => handleUpdateTransaction(idx, 'suggestedCategory', e.target.value)}
                                        className="h-8 text-xs bg-white dark:bg-slate-950"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">Daire:</span>
                                        <Input 
                                            type="number"
                                            value={item.matchedApartmentId || ''} 
                                            onChange={(e) => handleUpdateTransaction(idx, 'matchedApartmentId', parseInt(e.target.value))}
                                            className="h-8 text-xs w-20 bg-white dark:bg-slate-950 text-center"
                                            placeholder="?"
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {item.transactionType === 'Gelir' && !item.matchedApartmentId ? (
                                    <div className="flex items-center text-orange-500 text-xs font-medium">
                                       <AlertCircle className="w-3 h-3 mr-1" />
                                       Seçilmeli
                                    </div>
                                ) : (
                                   <div className="flex items-center text-emerald-600 text-xs font-medium">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Hazır
                                   </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <CardFooter className="bg-muted/20 border-t p-4 flex justify-between items-center text-xs text-muted-foreground">
             <div>Toplu işlem yaparken lütfen dikkatli olun.</div>
             <div>Taneri Site Yönetimi v1.0</div>
        </CardFooter>
      </Card>
    </div>
  )
}