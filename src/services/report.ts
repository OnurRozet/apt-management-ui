import { Income, IncomeSearch, CreateOrEditResponse, DetailResponse, SearchResponse, ServiceResult, IncomeCategory, IncomeCategorySearch, IncomeSummaryDto, DashboardSummaryDto, ExpenseDistributionDto, MonthlyTrendDto } from "@/types";
import { Delete, Get, Post, PostFile, Put } from "./service";

export const ReportService = {
    getSummaryCards: async ( isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DashboardSummaryDto>>(`/report/summary-cards`, undefined, isAnonymous, clientToken);
    },
     getExpenseDistribution: async ( isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<ExpenseDistributionDto>>(`/report/expense-distribution`, undefined, isAnonymous, clientToken);
    },
     getMonthlyTrends: async ( isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<MonthlyTrendDto>>(`/report/monthly-trend`, undefined, isAnonymous, clientToken);
    },
}