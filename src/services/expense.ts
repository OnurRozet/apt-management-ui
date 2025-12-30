import { Expense, ExpenseSearch, CreateOrEditResponse, DetailResponse, SearchResponse, ServiceResult, ExpenseCategory, ExpenseCategorySearch, ExpenseSummaryDto } from "@/types";
import { Delete, Get, Post, PostFile, Put } from "./service";

export const ExpenseService = {
    createOrEditExpense: async (expenseData: Expense, isAnonymous = false, clientToken?: string) => {
        return Post<ServiceResult<CreateOrEditResponse>>("/expense", expenseData, isAnonymous, clientToken);
    },
    searchExpenses: async (searchParams: ExpenseSearch, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<SearchResponse<Expense>>>("/expense/search", searchParams, isAnonymous, clientToken);
    },
    getExpenseById: async (expenseId: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DetailResponse<Expense>>>(`/expense/${expenseId}`, undefined, isAnonymous, clientToken);
    },
    updateExpense: async (expenseId: number, expenseData: Expense, isAnonymous = false, clientToken?: string) => {
        return Put<ServiceResult<CreateOrEditResponse>>(`/expense/${expenseId}`, expenseData, isAnonymous, clientToken);
    },
    deleteExpense: async (expenseId: number, isAnonymous = false, clientToken?: string) => {
        return Delete<ServiceResult<boolean>>(`/expense/${expenseId}`, undefined, isAnonymous, clientToken);
    },
    uploadExcel: async (file: File, isAnonymous = false, clientToken?: string) => {
        return PostFile<ServiceResult<{ successCount: number; errorCount: number; errors?: string[] }>>("/expense/upload", file, isAnonymous, clientToken);
    },
    getSummaryExpenseReport: async (isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<ExpenseSummaryDto>>(`/expense/get-summary-expense`, undefined, isAnonymous, clientToken);
    },
}

export const ExpenseCategoryService = {
    createOrEditExpenseCategory: async (expenseData: ExpenseCategory, isAnonymous = false, clientToken?: string) => {
        return Post<ServiceResult<CreateOrEditResponse>>("/expensecategory", expenseData, isAnonymous, clientToken);
    },
    searchExpensesCategory: async (searchParams: ExpenseCategorySearch, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<SearchResponse<ExpenseCategory>>>("/expensecategory/search", searchParams, isAnonymous, clientToken);
    },
    getExpenseCategoryById: async (expenseId: number, isAnonymous = false, clientToken?: string) => {
        return Get<ServiceResult<DetailResponse<ExpenseCategory>>>(`/expensecategory/${expenseId}`, undefined, isAnonymous, clientToken);
    },
    updateExpenseCategory: async (expenseId: number, expenseData: ExpenseCategory, isAnonymous = false, clientToken?: string) => {
        return Put<ServiceResult<CreateOrEditResponse>>(`/expensecategory/${expenseId}`, expenseData, isAnonymous, clientToken);
    },
    deleteExpenseCategory: async (expenseId: number, isAnonymous = false, clientToken?: string) => {
        return Delete<ServiceResult<boolean>>(`/expensecategory/${expenseId}`, undefined, isAnonymous, clientToken);
    }
}

