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
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px]">
        <section className="relative hidden lg:flex flex-col overflow-hidden bg-[#FEFEFE] p-8 md:p-12 lg:p-16">
          <div className="relative z-10 flex flex-col h-full">
            <Link href="/login" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center">
                <Image
                  src="/brand-logo.svg"
                  alt="Report Manager"
                  width={32}
                  height={20}
                  priority
                  className="h-auto w-auto"
                />
              </span>
              <span className="flex flex-col justify-center">
                <span className="block text-base text-foreground font-bold leading-tight">Report Manager</span>
                <span className="block text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  BY GTF TECHNOLOGIES
                </span>
              </span>
            </Link>
          </div>

          <div className="absolute right-0 z-0 h-[60%] min-h-[400px] -left-[248px] bottom-[60px]">
            <Image
              src="/side.png"
              alt="Dashboard Illustration"
              fill
              className="object-contain object-bottom scale-[1.15] origin-bottom-left"
              priority
            />
          </div>
        </section>
        <section className="flex flex-col items-center justify-center bg-[#F8FAFC] p-6 sm:p-8 md:p-12 border-l border-slate-100">
          <div className="w-full max-w-md">
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
