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

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setAmount(transaction.amount);
    setDescription(transaction.description || "");
  };

  const handleUpdate = async () => {
    await apiRequest(
      `/transactions/${editingId}`,
      "PUT",
      { amount, description }
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
    <table className="w-full border bg-white shadow rounded">
      <thead>
        <tr className="bg-gray-100">
          <th>Date</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className="border-t">
            <td className="p-2">{t.transaction_date}</td>

            <td className="p-2">
              {editingId === t.id ? (
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-1"
                />
              ) : (
                t.amount
              )}
            </td>

            <td className="p-2">{t.category_name}</td>


            <td className="p-2">
              {editingId === t.id ? (
                <input
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="border p-1"
                />
              ) : (
                t.description
              )}
            </td>

            <td className="p-2 space-x-2">
              {editingId === t.id ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-2"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  className="bg-blue-500 text-white px-2"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-500 text-white px-2"
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
