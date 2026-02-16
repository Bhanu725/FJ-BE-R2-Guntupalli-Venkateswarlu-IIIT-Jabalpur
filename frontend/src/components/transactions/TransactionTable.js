"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function TransactionTable({
  transactions,
  refresh
}) {
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setAmount(transaction.amount);
    setDescription(transaction.description || "");
    setType(transaction.type);
  };

  const handleUpdate = async () => {
    await apiRequest(
      `/transactions/${editingId}`,
      "PUT",
      { amount, description, type }
    );

    setEditingId(null);
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;

    await apiRequest(`/transactions/${id}`, "DELETE");
    refresh();
  };

  return (
    <table className="w-full border bg-white shadow rounded text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Date</th>
          <th className="p-2">Type</th>
          <th className="p-2">Amount</th>
          <th className="p-2">Category</th>
          <th className="p-2">Description</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className="border-t hover:bg-gray-50">
            {/* Date */}
            <td className="p-2">
              {new Date(t.transaction_date).toLocaleDateString()}
            </td>

            {/* Type */}
            <td className="p-2">
              {editingId === t.id ? (
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border p-1"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              ) : (
                <span
                  className={`font-medium ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income"
                    ? "🟢 Income"
                    : "🔴 Expense"}
                </span>
              )}
            </td>

            {/* Amount */}
            <td className="p-2 font-medium">
              {editingId === t.id ? (
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  className="border p-1 w-24"
                />
              ) : (
                <span
                  className={
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {Number(t.amount).toFixed(2)}
                </span>
              )}
            </td>

            {/* Category */}
            <td className="p-2">
              {t.category_name}
            </td>

            {/* Description */}
            <td className="p-2">
              {editingId === t.id ? (
                <input
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="border p-1 w-full"
                />
              ) : (
                t.description || "-"
              )}
            </td>

            {/* Actions */}
            <td className="p-2 space-x-2">
              {editingId === t.id ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
