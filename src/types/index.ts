export interface Transaction {
  date: string;
  amount: number;
  description: string;
}

export interface SearchRequest {
  apartmentId?: number;
  incomeId?: number;
  expenseId?: number;
  page: number;
  pageSize: number;
}

export interface ServiceResult<T> {
  resultObject: T;
  isSuccess: boolean;
  message?: string;
}

export interface DetailResponse<T> {
  detail: T;
}

export interface SearchResponse<T> {
  searchResult: T[];
  totalItemCount: number;
}

export interface CreateOrEditResponse {
  id: number;
}

export interface Apartment {
  id: number;
  label: string;
  ownerName: string;
  tenantName?: string;
  balance: number;
  isManager: boolean;
  openingBalance?: number;
}

export interface ApartmentSearch extends SearchRequest {
  label?: string;
  ownerName?: string;
  tenantName?: string;
  balance?: number;
  isManager?: boolean;
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  expenseCategoryId: number;
  expenseCategory?: string;
  expenseDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseSearch extends SearchRequest {
  title?: string;
  expenseCategoryId?: number;
  expenseCategory?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
}

export interface ExpenseCategorySearch extends SearchRequest {
  name?: string;
  description?: string;
}

export interface IncomeSummaryReportItem {
  apartmentLabel?: string;
  totalAmount: number;
  ownerName?: string;
  transactionCount: number;
}

export interface Income {
  id: number;
  title: string;
  description?: string;
  amount: number;
  incomeCategoryId: number;
  incomeCategory?: string;
  apartmentId?: number;
  apartmentNo?: string;
  incomeDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeSummaryDto {
  totalIncome: number;
  totalIncomeByCurrentMonth: number;
  totalItemCount: number;
  mostRegularPayer: IncomeSummaryReportItem[] | null;
  highestApartmentFeeRevenue: IncomeSummaryReportItem | null;
}

export interface IncomeSearch extends SearchRequest {
  title?: string;
  incomeCategoryId?: number;
  incomeCategory?: string;
  apartmentId?: number;
  apartmentNo?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

export interface IncomeCategory {
  id: number;
  name: string;
  description?: string;
}

export interface IncomeCategorySearch extends SearchRequest {
  name?: string;
  description?: string;
}

export interface BankTransaction {
  stagingId: number;
  date: string;
  transactionId: string;
  description: string;
  amount: number;
  transactionType: string;
  suggestedCategory: string;
  matchedApartmentId?: number;
  isProcessed: boolean;
}

export interface ExpenseSummaryReportItem {
  expenseCategoryName?: string;
  totalAmount: number;
}

export interface ExpenseSummaryDto {
  totalExpense: number;
  totalExpenseByCurrentMonth: number;
  totalItemCount: number;
  highestFeeCategory: ExpenseSummaryReportItem | null;
}

// Aidat Takibi Interface'leri
export interface DuesPayment {
  month: number; // 1-12 (Ocak-Aralık)
  amount: number;
  isPaid: boolean;
  paymentDate?: string;
  incomeId?: number;
}

export interface DuesTracking {
  apartmentId: number;
  apartmentLabel: string;
  ownerName: string;
  year: number;
  monthlyPayments: DuesPayment[]; // 12 ay için ödeme bilgileri
}

export interface PaymentMatrixDto {
  apartmentId: number;
  apartmentLabel?: string;
  ownerName?: string;
  isManager: boolean;
  totalPaid: number;
  totalYearlyDebt: number;
  totalDebtUntilNow: number;
  transferredDebt: number;
  currentBalance: number;
  amount: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface DashboardSummaryDto {
  totalIncome: number;
  expectedIncome: number;
  totalExpense: number;
  activeDebtorsCount: number;
}

export interface ExpenseDistributionDto {
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

export interface MonthlyTrendDto {
  monthName: string;
  totalIncome: number;
  totalExpense: number;
}

export interface ApartmentDebtsDto {
  id: number;
  apartmentId: number;
  amount: number;
  dueDate: string;
  isClosed: boolean;
  paidAmount?: number;
  description: string;
}

export interface ApartmentDebtsSearch extends SearchRequest {
  id: number;
  apartmentId: number;
  amount: number;
  dueDate: string;
  isClosed: boolean;
  paidAmount?: number;
  description: string;
}

export interface DuesSetting {
  id: number;
  amount: number;
  startDate: string;
  endDate: string;
  description?: string;
  isActive: boolean;
}

export interface DuesSettingSearch extends SearchRequest {
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface RegisterDto {
  FullName: string;
  ApartmentNumber: string;
  Password: string;
  PasswordConfirm: string;
}

export interface LoginDto {
  ApartmentNumber: string;
  Password: string;
}

export interface UserDto {
  id?: number;
  fullName: string;
  apartmentId?: number;
  apartmentNumber: string;
  isManager: boolean;
  email?: string;
}

export interface ManagementPeriodDto {
  id: number;
  apartmentId: number;
  startDate: string;
  endDate: string;
  isExemptFromDues: boolean;
}

export interface ManagementPeriodSearch extends SearchRequest {
  startDate?: string;
  endDate?: string;
  isExemptFromDues?: boolean;
  keyword?: string;
}
