import Link from "next/link";
import {
  Zap,
  DollarSign,
  MapPin,
  Ship,
  Plane,
  Train,
  Truck,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FreightIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-20 pt-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <Zap className="h-3.5 w-3.5" />
            14-day free trial · No credit card required
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Quote any freight in{" "}
            <span className="text-blue-600">30 seconds</span>.{" "}
            Track it for the next 30 days.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            FreightIQ generates fully-landed sea, air, rail, and road freight quotes for EU
            sourcing teams — with live shipment tracking and customs duty calculation built in.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Start free trial
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              See a sample quote →
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Trusted by EU sourcing teams importing from China, Vietnam, Turkey &amp; India
          </p>
        </div>
      </section>

      {/* Freight mode badges */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          {[
            { icon: Ship, label: "Sea FCL" },
            { icon: Ship, label: "Sea LCL" },
            { icon: Plane, label: "Air" },
            { icon: Train, label: "Rail (China–EU)" },
            { icon: Truck, label: "Road (EU + UK)" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-blue-600" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Quote in seconds, not hours.
              </h3>
              <p className="text-gray-600">
                Drop in a product and quantity. We classify the HS code, estimate the cubic
                meters, calculate EU duties, and pull live freight rates — all in one screen.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Every cost, every time.
              </h3>
              <p className="text-gray-600">
                Origin handling, ocean freight, destination charges, customs duty, VAT,
                insurance. No more spreadsheet surprises after the container lands.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Watch your cargo move.
              </h3>
              <p className="text-gray-600">
                Vessel and flight tracking is built in. Your customer asks where their order
                is — you send them a live map, not an email chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">Start free. Scale as you grow.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                name: "Trial",
                price: "Free",
                period: "14 days",
                quotes: "50 quotes",
                features: ["All freight modes", "Full landed cost", "PDF export"],
                cta: "Start free",
                highlight: false,
              },
              {
                name: "Starter",
                price: "€49",
                period: "/month",
                quotes: "100 quotes/mo",
                features: [
                  "All freight modes",
                  "Full landed cost",
                  "PDF export",
                  "Customer management",
                  "Shipment tracking",
                ],
                cta: "Get started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "€199",
                period: "/month",
                quotes: "500 quotes/mo",
                features: [
                  "Everything in Starter",
                  "Team members",
                  "API access",
                  "Outbound webhooks",
                  "Audit logs",
                ],
                cta: "Get started",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Contact",
                period: "",
                quotes: "Unlimited",
                features: [
                  "Everything in Pro",
                  "Custom integrations",
                  "SLA",
                  "Dedicated support",
                  "SSO",
                ],
                cta: "Contact us",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-6">
                  <p
                    className={`mb-1 text-sm font-medium ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-sm ${plan.highlight ? "text-blue-200" : "text-gray-600"}`}
                  >
                    {plan.quotes}
                  </p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-blue-200" : "text-green-500"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Overage: €0.50 per extra quote beyond plan limit.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">FreightIQ</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="mailto:hello@freightiq.app" className="hover:text-gray-900">
              Contact
            </Link>
            <Link href="/security" className="hover:text-gray-900">
              Security
            </Link>
          </div>
          <p className="text-sm text-gray-400">© 2024 FreightIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
