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
  UsersIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  PencilSquareIcon,
  DocumentTextIcon,
  PhoneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar, clearSession } from "@/store/store";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", segment: "dashboard", icon: Squares2X2Icon },
  { label: "Create Daily Report", href: "/reports/create", segment: "reports/create", icon: PencilSquareIcon },
  { label: "My Reports", href: "/reports", segment: "reports", icon: DocumentTextIcon },
  { label: "Profile", href: "/profile", segment: "profile", icon: UserCircleIcon },
];

const managerNavigationItems = [
  { label: "Dashboard", href: "/dashboard/manager", segment: "dashboard/manager", icon: HomeIcon },
  { label: "My Team", href: "/manager/team", segment: "manager/team", icon: UsersIcon },
  { label: "Team Reports", href: "/manager/reports", segment: "manager/reports", icon: ClipboardDocumentListIcon },
  { label: "Missing Reports", href: "/manager/missing-reports", segment: "manager/missing-reports", icon: ExclamationCircleIcon },
  { label: "Analytics", href: "/manager/analytics", segment: "manager/analytics", icon: ChartBarSquareIcon },
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

  const isManager = session?.role === "manager";
  const navigation = isManager ? managerNavigationItems : navigationItems;

  const segment =
    activeSegment ?? navigation.find((item) => pathname.startsWith(item.href))?.segment ?? "dashboard";
  const name = session?.name ?? (isManager ? "Manager" : "Employee");
  const email = session?.email ?? (isManager ? "manager@gtftechnologies.com" : "employee@gtftechnologies.com");

  const handleLogout = () => {
    window.localStorage.removeItem("report-manager-session");
    const secure = window.location.protocol === 'https:' ? 'secure;' : '';
    document.cookie = `rm_session=; path=/; max-age=0; samesite=strict; ${secure}`;
    document.cookie = `rm_role=; path=/; max-age=0; samesite=strict; ${secure}`;
    dispatch(clearSession());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <OfflineBanner />
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out lg:block ${collapsed ? "w-20" : "w-72"
            }`}
        >
          <SidebarContent
            collapsed={collapsed}
            segment={segment}
            navigation={navigation}
            onToggle={() => dispatch(toggleSidebar())}
            onLogout={handleLogout}
            name={name}
            email={email}
            isManager={isManager}
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
                navigation={navigation}
                onToggle={() => setMobileOpen(false)}
                onLogout={handleLogout}
                name={name}
                email={email}
                isManager={isManager}
                mobileClose
              />
            </aside>
          </div>
        ) : null}

        <div
          className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out ${collapsed ? "lg:pl-20" : "lg:pl-72"
            }`}
        >
          <header className="sticky top-0 z-30 border-b border-border bg-white px-4 py-3 md:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  title="Open navigation"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-background text-muted-foreground lg:hidden"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <div className="hidden h-10 w-10 items-center justify-center rounded bg-primary-light lg:flex">
                  <DocumentChartBarIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-foreground">
                    {isManager ? "Manager Workspace" : "Employee Workspace"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <InstallPrompt />
                {!isManager ? (
                  <Link
                    href="/reports/create"
                    className="inline-flex cursor-pointer items-center gap-3 rounded-lg bg-primary p-1.5 pr-4 text-sm font-bold text-white transition-colors hover:bg-primary-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/20">
                      <PlusIcon aria-hidden="true" className="h-5 w-5 stroke-2 text-white" />
                    </div>
                    Create Report
                  </Link>
                ) : null}
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
  email,
  isManager,
  mobileClose = false,
}: {
  collapsed: boolean;
  segment: string;
  navigation: typeof navigationItems;
  onToggle: () => void;
  onLogout: () => void;
  name: string;
  email: string;
  isManager: boolean;
  mobileClose?: boolean;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col py-4">
      <div className={`flex items-center px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link href={isManager ? "/dashboard/manager" : "/dashboard"} className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/brand-logo.svg"
              alt="Report Manager"
              width={24}
              height={16}
              priority
              className="h-auto w-auto"
            />
          </span>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 overflow-hidden whitespace-nowrap"
              >
                <span className="block truncate text-lg font-medium text-sidebar-foreground">
                  Report Manager
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          type="button"
          title={mobileClose ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
          className="inline-flex absolute right-[-10px] h-7 w-7 bg-primary-light border border-primary rounded-full  cursor-pointer items-center justify-center  text-primary hover:bg-primary-light hover:text-primary"
        >
          {mobileClose ? (
            <XMarkIcon className="h-5 w-5" />
          ) : collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav aria-label="Primary navigation" className="mt-6 grid gap-1 pr-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = item.segment === segment || (segment.startsWith(item.segment) && item.segment !== "dashboard" && item.segment !== "reports");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex min-h-10 items-center gap-4 rounded-e-full bg-primary-light pl-6 pr-4 text-sm font-medium text-primary"
                  : "flex min-h-10 items-center gap-4 rounded-e-full pl-6 pr-4 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted"
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto relative pr-4 pl-4 pb-4">
        <AnimatePresence>
          {showUserMenu && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-[calc(100%+8px)] left-4 right-4 rounded-xl border border-border bg-white shadow-lg overflow-hidden z-50"
            >
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4 shrink-0" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => collapsed ? onLogout() : setShowUserMenu(!showUserMenu)}
          className={`flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-white p-2 transition-all hover:bg-muted shadow-sm hover:shadow-md ${
            collapsed ? "justify-center" : "justify-between"
          }`}
          title={collapsed ? "Logout" : "User Menu"}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-bold text-white">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start min-w-0 text-left">
                <span className="block truncate text-sm font-bold text-[#334155] max-w-[120px]">
                  {name}
                </span>
                <span className="block truncate text-xs font-medium text-muted-foreground max-w-[120px]">
                  {email}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDownIcon className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
          )}
        </button>
      </div>
    </div>
  );
}
