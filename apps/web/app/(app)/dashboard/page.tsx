export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Quotes this month", value: "—" },
          { label: "Active shipments", value: "—" },
          { label: "Quote credits remaining", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
