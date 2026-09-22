// Console shell: dark navy navigation chrome around a light content area.
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Loader2, Menu, ShieldCheck, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from "./nav-items";
import { useVerificationBootstrap } from "@/hooks/use-verifai";

function NavEntry({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-nav-accent/15 font-medium text-nav-foreground shadow-[inset_2px_0_0_0_hsl(var(--nav-accent))]"
            : "text-nav-muted hover:bg-white/5 hover:text-nav-foreground",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavEntry key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="border-t border-nav-border px-3 py-4">
        <NavEntry item={SETTINGS_ITEM} onNavigate={onNavigate} />
        <p className="mt-3 px-3 text-[10px] leading-relaxed text-nav-muted">
          Prototype build. Synthetic demonstration data only. No live government integration.
        </p>
      </div>
    </div>
  );
}

function TopBar({ verifying }: { verifying: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-nav-border bg-nav text-nav-foreground">
      <div className="flex h-14 items-center gap-3 px-3 md:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-nav-muted transition-colors hover:bg-white/5 hover:text-nav-foreground md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-nav-border bg-nav p-0 text-nav-foreground">
            <SheetHeader className="border-b border-nav-border px-4 py-4 text-left">
              <SheetTitle className="text-sm font-semibold tracking-[0.18em] text-nav-foreground">VERIFAI</SheetTitle>
            </SheetHeader>
            <SideNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-nav-accent/15 text-nav-accent">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-[0.18em]">VERIFAI</span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-nav-muted sm:block">
              Bid Compliance Verification
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {verifying ? (
            <span className="hidden items-center gap-2 text-xs text-nav-muted sm:flex">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Verifying pending bids…
            </span>
          ) : null}
          <span className="label-mono rounded border border-nav-accent/40 bg-nav-accent/10 px-2 py-1 text-nav-accent">
            DEMO MODE
          </span>
          <span className="hidden items-center gap-2 rounded border border-nav-border px-2 py-1 text-xs text-nav-muted md:flex">
            <UserRound className="h-3.5 w-3.5" aria-hidden />
            Procurement Officer
          </span>
        </div>
      </div>
    </header>
  );
}

export function AppShell() {
  const bootstrap = useVerificationBootstrap();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <TopBar verifying={bootstrap === "running"} />
      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-nav-border bg-nav md:block">
          <div className="sticky top-14">
            <SideNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
