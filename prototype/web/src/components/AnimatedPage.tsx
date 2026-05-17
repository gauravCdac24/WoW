import type { ReactNode } from "react";

export function AnimatedPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`page-enter ${className}`.trim()}>{children}</div>;
}
