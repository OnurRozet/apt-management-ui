// import { BankTransaction, ServiceResult } from "@/types";
// import { Post, PostFile } from "./service";

// export const BankService = {
//     uploadExcel: async (file: File, isAnonymous = false, clientToken?: string) => {
//         return PostFile<ServiceResult<{ successCount: number; errorCount: number; errors?: string[] }>>("/bank/upload", file, isAnonymous, clientToken);
//     },
//     processExcel: async (data: BankTransaction, isAnonymous = false, clientToken?: string) => {
//         return Post<ServiceResult<{ successCount: number; errorCount: number; errors?: string[] }>>("/bank/process", data, isAnonymous, clientToken);
//     }
// }

import { BankTransaction, ServiceResult } from "@/types";
import { Post, PostFile } from "./service";

export const BankService = {
    // 1. Adım: Dosyayı yükle ve listeyi (Önizleme) al
    uploadExcel: async (file: File) => {
        // Backend'de BankTransactionDto listesi dönüyor
        return PostFile<BankTransaction[]>("/bank/upload", file);
    },

    // 2. Adım: Onaylanan listeyi kaydet
    processExcel: async (data: BankTransaction[]) => {
        return Post<ServiceResult<{ success: boolean }>>("/bank/process", data);
    }
}