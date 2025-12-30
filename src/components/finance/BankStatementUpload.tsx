/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2, Save, ArrowLeft } from 'lucide-react'
import { BankService } from '@/services/bank'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { BankTransaction } from '@/types'

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
    debugger
    try {
      const res = await BankService.uploadExcel(file)
      // Backend ServiceResult formatında dönüyor
      if (res.status === 200 ) {
        if (Array.isArray(res.data)) {
          setTransactions(res.data)
          setStep('preview') // Tablo moduna geç
        } else {
          setErrorMsg('Beklenmeyen veri formatı.')
        }
      } else {
        setErrorMsg(res.statusText || 'Dosya okunurken hata oluştu.')
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Dosya okunurken hata oluştu.')
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
      const res = await BankService.processExcel(transactions)
      if (res.data.isSuccess) {
        // Başarılı
        if (onProcessSuccess) onProcessSuccess()
        // Resetle
        setFile(null)
        setTransactions([])
        setStep('upload')
      } else {
        setErrorMsg(res.data.message || 'Kayıt sırasında hata oluştu.')
      }
    } catch (err: any) {
      setErrorMsg( `${err.response?.data?.message || ''} İşlem sırasında sunucu hatası.`)
    } finally {
      setIsProcessing(false)
    }
  }

  // --- RENDER: UPLOAD EKRANI ---
  if (step === 'upload') {
    return (
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Banka Ekstresi Yükle</CardTitle>
            <CardDescription>Ziraat Bankası Excel dosyasını yükleyin, sistem otomatik analiz etsin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {/* Drag Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all",
                isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
              
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-700">
                {file ? file.name : "Excel dosyasını sürükleyin veya tıklayın"}
              </p>
              <p className="text-sm text-slate-500 mt-1">.xlsx formatı desteklenir</p>
            </div>

            {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    <AlertCircle className="h-4 w-4" /> {errorMsg}
                </div>
            )}

            <div className="flex justify-end">
                <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full sm:w-auto">
                    {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                    Analiz Et ve Önizle
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- RENDER: ÖNİZLEME (PREVIEW) EKRANI ---
  return (
    <div className="container mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-green-600" /> 
            {transactions.length} İşlem Analiz Edildi
        </h2>
        <Button variant="outline" size="sm" onClick={() => setStep('upload')} disabled={isProcessing}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Vazgeç
        </Button>
      </div>

      <Card>
        <div className="max-h-150 overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Açıklama</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Kategori / Daire</TableHead>
                        <TableHead>Durum</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-slate-50">
                            <TableCell className="text-xs whitespace-nowrap">
                                {new Date(item.date).toLocaleDateString('tr-TR')}
                            </TableCell>
                            <TableCell className="max-w-75 text-xs text-slate-600 truncate" title={item.description}>
                                {item.description}
                            </TableCell>
                            <TableCell>
                                <Badge variant={item.transactionType === 'Gelir' ? 'default' : 'destructive'} className={item.transactionType === 'Gelir' ? 'bg-green-600' : 'bg-red-600'}>
                                    {item.transactionType}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}
                            </TableCell>
                            <TableCell>
                                {item.transactionType === 'Gider' ? (
                                    // Gider ise Kategori Göster/Düzenle
                                    <Input 
                                        value={item.suggestedCategory || ''} 
                                        onChange={(e) => handleUpdateTransaction(idx, 'suggestedCategory', e.target.value)}
                                        className="h-8 text-xs w-37.5"
                                    />
                                ) : (
                                    // Gelir ise Daire No Göster/Düzenle
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-slate-500">Daire:</span>
                                        <Input 
                                            type="number"
                                            value={item.matchedApartmentId || ''} 
                                            onChange={(e) => handleUpdateTransaction(idx, 'matchedApartmentId', parseInt(e.target.value))}
                                            className="h-8 text-xs w-17.5"
                                            placeholder="?"
                                        />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {item.transactionType === 'Gelir' && !item.matchedApartmentId ? (
                                    <Badge variant="outline" className="text-orange-500 border-orange-500 text-[10px]">Daire?</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-green-600 border-green-600 text-[10px]">Hazır</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
             <div className="flex-1 text-sm text-slate-500 flex items-center">
                * Lütfen kategorileri ve daire numaralarını kontrol ediniz.
             </div>
             <Button onClick={handleProcess} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Tümünü Onayla ve Kaydet
             </Button>
        </div>
      </Card>
    </div>
  )
}