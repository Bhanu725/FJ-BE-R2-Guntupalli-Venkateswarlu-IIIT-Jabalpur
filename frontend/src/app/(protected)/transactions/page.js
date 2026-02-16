"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import TransactionTable from "@/components/transactions/TransactionTable";
import ReceiptUpload from "@/components/transactions/ReceiptUpload";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [description, setDescription] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");

  // Currency for creating transaction
  const [currency, setCurrency] = useState("USD");

  // Currency for displaying transactions
  const [displayCurrency, setDisplayCurrency] = useState("USD");


  /* ============================
     FETCH TRANSACTIONS
  ============================ */

  const fetchTransactions = async () => {
    const data = await apiRequest(
      `/transactions?page=${page}&currency=${displayCurrency}`
    );
    setTransactions(data);
  };


  /* ============================
     FETCH CATEGORIES
  ============================ */

  const fetchCategories = async () => {
    const data = await apiRequest("/categories");
    setCategories(data);
  };


  /* ============================
     EFFECT
  ============================ */

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [page, displayCurrency]);


  /* ============================
     CREATE TRANSACTION
  ============================ */

  const handleCreate = async (e) => {
    e.preventDefault();

    await apiRequest("/transactions", "POST", {
      categoryId,
      amount,
      currency,
      transactionDate,
      description,
      receiptUrl
    });

    setAmount("");
    setDescription("");
    setReceiptUrl("");

    fetchTransactions();
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Transactions
      </h1>

      {/* ============================
         CREATE FORM
      ============================ */}

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 shadow rounded mb-6 space-y-4"
      >
        <div className="flex gap-4">

          <select
            className="border p-2"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <select
            className="border p-2"
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>

          <input
            type="date"
            className="border p-2"
            value={transactionDate}
            onChange={(e) =>
              setTransactionDate(e.target.value)
            }
          />
        </div>

        <input
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <ReceiptUpload setReceiptUrl={setReceiptUrl} />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Transaction
        </button>
      </form>


      {/* ============================
         DISPLAY CURRENCY SELECTOR
      ============================ */}

      <div className="mb-4">
        <label className="mr-2 font-medium">
          Display Currency:
        </label>

        <select
          value={displayCurrency}
          onChange={(e) =>
            setDisplayCurrency(e.target.value)
          }
          className="border p-2"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>


      {/* ============================
         TRANSACTION TABLE
      ============================ */}

      <TransactionTable
        transactions={transactions}
        refresh={fetchTransactions}
      />


      {/* ============================
         PAGINATION
      ============================ */}

      <div className="flex gap-4 mt-4">
        <button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Prev
        </button>

        <button
          onClick={() =>
            setPage((p) => p + 1)
          }
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}
