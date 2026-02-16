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
      budgetLimit
    });

    setEditingId(null);
    refresh();
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-4 shadow rounded flex justify-between items-center"
        >
          {editingId === category.id ? (
            <div className="flex gap-2">
              <input
                className="border p-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border p-1"
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
              />
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-2"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-gray-500">
                  Budget: {category.budget_limit || "N/A"}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => startEdit(category)}
                  className="bg-blue-500 text-white px-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-red-500 text-white px-2"
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
