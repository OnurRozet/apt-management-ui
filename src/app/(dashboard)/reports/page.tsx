import ReportClient from "@/components/report/ReportClient";
import ReportsEmptyState from "@/components/report/ReportEmptyState";
import { ReportService } from "@/services/report";
import { notFound } from 'next/navigation';

async function GetSummaryCards() {
    try {
        const res = await ReportService.getSummaryCards();

        if (res.status === 200 && res.data.isSuccess) {
            return res.data.resultObject;
        }
        return undefined;
    } catch (error) {
        console.error('Özet kartlar yüklenemedi:', error);
        return undefined;
    }
}

async function GetExpenseDistribution() {
    try {
        const res = await ReportService.getExpenseDistribution();

        if (res.status === 200 && res.data.isSuccess) {
            return Array.isArray(res.data.resultObject) ? res.data.resultObject : [res.data.resultObject];
        }
        return undefined;
    } catch (error) {
        console.error('Giderler yüklenemedi:', error);
        return undefined;
    }
}

async function GetMonthlyTrends() {
    try {
        const res = await ReportService.getMonthlyTrends();

        if (res.status === 200 && res.data.isSuccess) {
            return Array.isArray(res.data.resultObject) ? res.data.resultObject : [res.data.resultObject];
        }
        return undefined;
    } catch (error) {
        console.error('Aylık gelir gider verileri yüklenemedi:', error);
        return undefined;
    }
}


const ReportPage = async () => {

    const [summaryCards, expenseDistribution, monthlyTrends] = await Promise.all([
        GetSummaryCards(),
        GetExpenseDistribution(),
        GetMonthlyTrends()
    ]);

    const isDataEmpty = 
        !summaryCards || 
        !expenseDistribution || expenseDistribution.length === 0 || 
        !monthlyTrends || monthlyTrends.length === 0;

   if (isDataEmpty) {
        return (
            <div className="container mx-auto p-6">
                 <ReportsEmptyState />
            </div>
        );
    }


  return (
    <div>
      <ReportClient
        summaryCards={summaryCards}
        expenseDistribution={expenseDistribution}
        monthlyTrends={monthlyTrends}
      />
    </div>
  );
}

export default ReportPage
