import { CreateOrEditResponse, DetailResponse, SearchResponse, ServiceResult, ApartmentDebtsDto, ApartmentDebtsSearch } from "@/types";
import { Delete, Get, Post, } from "./service";

export const DebtService = {
    createOrEditDebt: async (debtData: ApartmentDebtsDto, isAnonymous = false, clientToken?: string) => {
        return Post<ServiceResult<CreateOrEditResponse>>("/apartmentdebt", debtData, isAnonymous, clientToken);
    },
    searchDebts: async (searchParams: ApartmentDebtsSearch, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<SearchResponse<ApartmentDebtsDto>>>("/apartmentdebt/search", searchParams, isAnonymous, clientToken);
    },
    getDebtById: async (debtId: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DetailResponse<ApartmentDebtsDto>>>(`/apartmentdebt/${debtId}`, undefined, isAnonymous, clientToken);
    },
    deleteDebt: async (debtId: number, isAnonymous = false, clientToken?: string) => {
        return Delete<ServiceResult<boolean>>(`/apartmentdebt/${debtId}`, undefined, isAnonymous, clientToken);
    },
}