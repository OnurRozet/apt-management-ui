import { CreateOrEditResponse, DetailResponse, SearchResponse, ServiceResult, ManagementPeriodDto, ManagementPeriodSearch } from "@/types";
import { Delete, Get, Post} from "./service";

export const ManagementPeriodService = {
    createOrEditPeriod: async (data: ManagementPeriodDto, isAnonymous = false, clientToken?: string) => {
        return Post<ServiceResult<CreateOrEditResponse>>("/managementperiod", data, isAnonymous, clientToken);
    },
    searchPeriods: async (searchParams: ManagementPeriodSearch, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<SearchResponse<ManagementPeriodDto>>>("/managementperiod/search", searchParams, isAnonymous, clientToken);
    },
    getPeriodById: async (periodId: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DetailResponse<ManagementPeriodDto>>>(`/managementperiod/${periodId}`, undefined, isAnonymous, clientToken);
    },
    deletePeriod: async (periodId: number, isAnonymous = false, clientToken?: string) => {
        return Delete<ServiceResult<boolean>>(`/managementperiod/${periodId}`, undefined, isAnonymous, clientToken);
    },
}