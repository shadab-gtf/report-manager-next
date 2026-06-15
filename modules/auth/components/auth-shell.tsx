import {
  ArrowTrendingUpIcon,
  BoltIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const proofPoints = [
  { label: "Offline-first drafts", icon: BoltIcon },
  { label: "Role-aware approvals", icon: ShieldCheckIcon },
  { label: "Manager hierarchy", icon: BuildingOffice2Icon },
  { label: "Productivity analytics", icon: ArrowTrendingUpIcon },
];

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-slate-200/70 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden lg:flex min-h-[560px] flex-col justify-between overflow-hidden bg-sidebar p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.34),transparent_26rem)]" />
          <div className="relative">
            <Link href="/login" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center ">
                <Image
                  src="/brand-logo.svg"
                  alt="Report Manager"
                  width={32}
                  height={20}
                  priority
                  className="h-auto w-auto"
                />
              </span>
              <span>
                <span className="block text-sm text-foreground font-semibold">Report Manager</span>
                <span className="block text-xs text-slate-800">
                  Enterprise Productivity OS
                </span>
              </span>
            </Link>
            <div className="mt-16 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-800">
                Workforce reporting platform
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-foreground tracking-normal md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-700">
                {description}
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {proofPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <Icon className="h-5 w-5 text-slate-700" />
                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm font-semibold text-foreground">Demo access</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use any employee ID or email, choose Employee or Manager, and use
              an 8+ character password. Signup OTP is{" "}
              <span className="font-semibold text-slate-700">123456</span>.
            </p>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center bg-white p-5 md:p-8">
          <div className="w-full max-w-xl">
            <Link href="/login" className="mb-8 inline-flex items-center gap-3 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center">
                <Image
                  src="/brand-logo.svg"
                  alt="Report Manager"
                  width={24}
                  height={16}
                  priority
                  className="h-auto w-auto"
                />
              </span>
              <span className="text-lg font-medium text-foreground">
                Report Manager
              </span>
            </Link>
            {children}
          </div>
        </section>
      </div>

    </main>
  );
}
