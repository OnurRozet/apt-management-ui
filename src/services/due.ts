import { PaymentMatrixDto, ServiceResult } from "@/types";
import { Get } from "./service";


export const DueService = {
    getYearlyPaymentDue: async (year: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<PaymentMatrixDto[]>>(`/income/payment-matrix/${year}`, undefined, isAnonymous, clientToken);
    }
}