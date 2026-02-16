"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import CategoryList from "@/components/categories/CategoryList";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [budgetLimit, setBudgetLimit] = useState("");

  const fetchCategories = async () => {
    const data = await apiRequest("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    await apiRequest("/categories", "POST", {
      name,
      type,
      budgetLimit
    });

    setName("");
    setBudgetLimit("");
    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Categories
      </h1>

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 shadow rounded mb-6 flex gap-4"
      >
        <input
          className="border p-2"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          className="border p-2"
          placeholder="Budget Limit"
          value={budgetLimit}
          onChange={(e) => setBudgetLimit(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4"
        >
          Add
        </button>
      </form>

      {/* List */}
      <CategoryList
        categories={categories}
        refresh={fetchCategories}
      />
    </div>
  );
}
