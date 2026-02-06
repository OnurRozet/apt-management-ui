import {
  Income,
  IncomeSearch,
  CreateOrEditResponse,
  DetailResponse,
  SearchResponse,
  ServiceResult,
  IncomeCategory,
  IncomeCategorySearch,
  IncomeSummaryDto,
} from "@/types";
import { Delete, Get, GetBlob, Post, PostFile, Put } from "./service";

export const IncomeService = {
  createOrEditIncome: async (
    incomeData: Income,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Post<ServiceResult<CreateOrEditResponse>>(
      "/income",
      incomeData,
      isAnonymous,
      clientToken,
    );
  },
  searchIncomes: async (
    searchParams: IncomeSearch,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Get<ServiceResult<SearchResponse<Income>>>(
      "/income/search",
      searchParams,
      isAnonymous,
      clientToken,
    );
  },
  getIncomeById: async (
    incomeId: number,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Get<ServiceResult<DetailResponse<Income>>>(
      `/income/${incomeId}`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
  updateIncome: async (
    incomeId: number,
    incomeData: Income,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Put<ServiceResult<CreateOrEditResponse>>(
      `/income/${incomeId}`,
      incomeData,
      isAnonymous,
      clientToken,
    );
  },
  deleteIncome: async (
    incomeId: number,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Delete<ServiceResult<boolean>>(
      `/income/${incomeId}`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
  uploadExcel: async (
    file: File,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return PostFile<
      ServiceResult<{
        successCount: number;
        errorCount: number;
        errors?: string[];
      }>
    >("/income/upload", file, isAnonymous, clientToken);
  },
  getSummaryIncomeReport: async (isAnonymous = false, clientToken?: string) => {
    return Get<ServiceResult<IncomeSummaryDto>>(
      `/income/get-summary-income`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
  exportPaymentMatrix: async (
    year: number,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return GetBlob(
      `/income/payment-matrix/${year}/export`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
};

export const IncomeCategoryService = {
  createOrEditIncomeCategory: async (
    incomeData: IncomeCategory,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Post<ServiceResult<CreateOrEditResponse>>(
      "/incomecategory",
      incomeData,
      isAnonymous,
      clientToken,
    );
  },
  searchIncomesCategory: async (
    searchParams: IncomeCategorySearch,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Get<ServiceResult<SearchResponse<IncomeCategory>>>(
      "/incomecategory/search",
      searchParams,
      isAnonymous,
      clientToken,
    );
  },
  getIncomeCategoryById: async (
    incomeId: number,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Get<ServiceResult<DetailResponse<IncomeCategory>>>(
      `/incomecategory/${incomeId}`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
  updateIncomeCategory: async (
    incomeId: number,
    incomeData: IncomeCategory,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Put<ServiceResult<CreateOrEditResponse>>(
      `/incomecategory/${incomeId}`,
      incomeData,
      isAnonymous,
      clientToken,
    );
  },
  deleteIncomeCategory: async (
    incomeId: number,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Delete<ServiceResult<boolean>>(
      `/incomecategory/${incomeId}`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
};
