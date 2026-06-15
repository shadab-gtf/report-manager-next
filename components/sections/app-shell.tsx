"use client";

import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChartBarSquareIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  HomeIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { NotificationCenter } from "@/components/ui/notification-center";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar, clearSession } from "@/store/store";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", segment: "dashboard", icon: HomeIcon },
  {
    label: "Reports",
    href: "/reports",
    segment: "reports",
    icon: ClipboardDocumentListIcon,
  },
  { label: "Profile", href: "/profile", segment: "profile", icon: UserCircleIcon },
];

interface AppShellProps {
  children: React.ReactNode;
  activeSegment?: string;
}

export function AppShell({ children, activeSegment }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const session = useAppSelector((state) => state.auth.session);
  const [mobileOpen, setMobileOpen] = useState(false);
  const segment =
    activeSegment ?? navigationItems.find((item) => pathname.startsWith(item.href))?.segment ?? "dashboard";
  const name = session?.name ?? "Employee";

  const handleLogout = () => {
    window.localStorage.removeItem("report-manager-session");
    document.cookie = "rm_session=; path=/; max-age=0; samesite=lax";
    document.cookie = "rm_role=; path=/; max-age=0; samesite=lax";
    dispatch(clearSession());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OfflineBanner />
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar  transition-[width] duration-200 lg:block ${collapsed ? "w-20" : "w-72"
            }`}
        >
          <SidebarContent
            collapsed={collapsed}
            segment={segment}
            navigation={navigationItems}
            onToggle={() => dispatch(toggleSidebar())}
            onLogout={handleLogout}
            name={name}
          />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close sidebar overlay"
              className="absolute inset-0 bg-slate-950/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar shadow-xl">
              <SidebarContent
                collapsed={false}
                segment={segment}
                navigation={navigationItems}
                onToggle={() => setMobileOpen(false)}
                onLogout={handleLogout}
                name={name}
                mobileClose
              />
            </aside>
          </div>
        ) : null}

        <div
          className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-72"
            }`}
        >
          <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 shadow-sm backdrop-blur md:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  title="Open navigation"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground lg:hidden"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-primary-light lg:flex">
                  <DocumentChartBarIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Employee Workspace
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Productivity reporting and approval operations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <InstallPrompt />
                <Link
                  href="/reports/create"
                  className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Create Report
                </Link>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-6 md:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  collapsed,
  segment,
  navigation,
  onToggle,
  onLogout,
  name,
  mobileClose = false,
}: {
  collapsed: boolean;
  segment: string;
  navigation: typeof navigationItems;
  onToggle: () => void;
  onLogout: () => void;
  name: string;
  mobileClose?: boolean;
}) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Image
              src="/brand-logo.svg"
              alt="Report Manager"
              width={30}
              height={18}
              priority
              className="h-auto w-auto"
            />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                Report Manager
              </span>
              <span className="block truncate text-xs text-sidebar-muted">
                Employee OS
              </span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          title={mobileClose ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-muted hover:bg-white/10 hover:text-white"
        >
          {mobileClose ? (
            <XMarkIcon className="h-5 w-5" />
          ) : collapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {!collapsed ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="text-sm font-semibold  text-foreground">Hey {name} 👋</span>
        </div>
      ) : null}
      <nav aria-label="Primary navigation" className="mt-3 grid gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.segment === segment;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex min-h-11 items-center gap-3 rounded-xl bg-primary px-3 text-sm font-semibold text-white shadow-sm"
                  : "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-gray-200 hover:text-foreground"
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">

        <button
          type="button"
          onClick={onLogout}
          className={`flex w-full min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium text-danger transition-colors hover:bg-danger/10  ${collapsed ? "justify-center" : ""
            }`}
          title={collapsed ? "Logout" : undefined}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </div>
  );
}
