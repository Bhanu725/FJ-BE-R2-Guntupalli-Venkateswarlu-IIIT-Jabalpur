"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function IncomeExpenseChart({ income, expense }) {
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Finance Overview",
        data: [income, expense],
        backgroundColor: ["#16a34a", "#dc2626"]
      }
    ]
  };

  return <Bar data={data} />;
}
