import { PaymentMatrixDto, ServiceResult, DuesSetting, DuesSettingSearch, CreateOrEditResponse, DetailResponse, SearchResponse } from "@/types";
import { Get, Post, Put, Delete } from "./service";


export const DueService = {
    getYearlyPaymentDue: async (year: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<PaymentMatrixDto[]>>(`/income/payment-matrix/${year}`, undefined, isAnonymous, clientToken);
    }
}

export const DuesSettingService = {
    createOrEditDuesSetting: async (duesSettingData: DuesSetting, isAnonymous = false, clientToken?: string) => {
        return Post<ServiceResult<CreateOrEditResponse>>("/duessetting", duesSettingData, isAnonymous, clientToken);
    },
    searchDuesSettings: async (searchParams: DuesSettingSearch, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<SearchResponse<DuesSetting>>>("/duessetting/search", searchParams, isAnonymous, clientToken);
    },
    getDuesSettingById: async (duesSettingId: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DetailResponse<DuesSetting>>>(`/duessetting/${duesSettingId}`, undefined, isAnonymous, clientToken);
    },
    updateDuesSetting: async (duesSettingId: number, duesSettingData: DuesSetting, isAnonymous = false, clientToken?: string) => {
        return Put<ServiceResult<CreateOrEditResponse>>(`/duessetting/${duesSettingId}`, duesSettingData, isAnonymous, clientToken);
    },
    deleteDuesSetting: async (duesSettingId: number, isAnonymous = false, clientToken?: string) => {
        return Delete<ServiceResult<boolean>>(`/duessetting/${duesSettingId}`, undefined, isAnonymous, clientToken);
    }
}