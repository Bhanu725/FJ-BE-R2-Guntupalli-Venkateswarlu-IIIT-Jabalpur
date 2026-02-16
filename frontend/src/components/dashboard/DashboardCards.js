export default function DashboardCards({ income, expense, savings }) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="font-semibold">Income</h3>
        <p className="text-xl font-bold text-green-600">
          {income}
        </p>
      </div>

      <div className="bg-red-100 p-4 rounded shadow">
        <h3 className="font-semibold">Expense</h3>
        <p className="text-xl font-bold text-red-600">
          {expense}
        </p>
      </div>

      <div className="bg-blue-100 p-4 rounded shadow">
        <h3 className="font-semibold">Savings</h3>
        <p className="text-xl font-bold text-blue-600">
          {savings}
        </p>
      </div>
    </div>
  );
}
