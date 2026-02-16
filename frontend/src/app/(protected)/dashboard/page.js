"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import DashboardCards from "@/components/dashboard/DashboardCards";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import CategoryBreakdownChart from "@/components/dashboard/CategoryBreakdownChart";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData =
          await apiRequest("/transactions/dashboard");

        const categoryData =
          await apiRequest("/transactions/category-breakdown");

        setSummary(dashboardData);
        setCategories(categoryData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <DashboardCards
        income={summary.total_income}
        expense={summary.total_expense}
        savings={summary.savings}
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <IncomeExpenseChart
            income={summary.total_income}
            expense={summary.total_expense}
          />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <CategoryBreakdownChart
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
