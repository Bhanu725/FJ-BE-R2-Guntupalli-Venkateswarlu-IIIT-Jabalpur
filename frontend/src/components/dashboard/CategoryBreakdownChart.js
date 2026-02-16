"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryBreakdownChart({ categories }) {

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => Number(c.total)),
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#dc2626",
          "#f59e0b",
          "#7c3aed"
        ]
      }
    ]
  };

  return <Pie data={data} />;
}
