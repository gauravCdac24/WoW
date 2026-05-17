import type { ReactNode } from "react";
import { useAuth } from "../auth-context";
import { AnimatedPage } from "./AnimatedPage";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="shell">
      <header className="shell-header">
        <div>
          <div className="brand">KaamChor</div>
          <h1 className="shell-title">{title}</h1>
          {subtitle && <p className="shell-subtitle">{subtitle}</p>}
        </div>
        <div className="shell-actions">
          {action}
          <button className="ghost" onClick={logout} title={`${user.name} · sign out`}>
            Sign out
          </button>
        </div>
      </header>
      <main className="shell-main">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <BottomNav role={user.role} />
    </div>
  );
}
