import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Ship } from "lucide-react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Ship className="h-5 w-5 text-blue-600" />
          <span className="ml-2 font-bold text-gray-900">FreightIQ</span>
        </div>
        <div className="px-4 py-4">
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
        </div>
        <nav className="px-4 py-2">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/quotes", label: "Quotes" },
            { href: "/shipments", label: "Shipments" },
            { href: "/customers", label: "Customers" },
            { href: "/settings", label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 px-8">
          <div />
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}
