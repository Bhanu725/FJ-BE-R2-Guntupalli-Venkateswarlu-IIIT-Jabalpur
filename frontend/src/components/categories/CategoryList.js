"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function CategoryList({ categories, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    await apiRequest(`/categories/${id}`, "DELETE");
    refresh();
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setBudgetLimit(category.budget_limit || "");
  };

  const handleUpdate = async () => {
    await apiRequest(`/categories/${editingId}`, "PUT", {
      name,
      budgetLimit: budgetLimit || null
    });

    setEditingId(null);
    refresh();
  };

  if (!categories.length) {
    return (
      <div className="bg-white p-4 shadow rounded text-gray-500">
        No categories created yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-4 shadow rounded flex justify-between items-center hover:bg-gray-50"
        >
          {editingId === category.id ? (
            <div className="flex gap-2 items-center w-full">
              <input
                className="border p-2 rounded w-40"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
              />

              <input
                className="border p-2 rounded w-32"
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="Budget"
              />

              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="font-semibold text-lg">
                  {category.name}
                </p>

                <p className="text-sm text-gray-500">
                  Budget:{" "}
                  {category.budget_limit
                    ? `$${Number(category.budget_limit).toFixed(2)}`
                    : "N/A"}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => startEdit(category)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
