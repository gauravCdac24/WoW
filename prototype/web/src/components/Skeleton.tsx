import type { CSSProperties } from "react";

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={`skeleton ${className}`.trim()} style={style} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton style={{ height: 20, width: "40%" }} />
      <Skeleton style={{ height: 14, width: "70%", marginTop: 10 }} />
      <Skeleton style={{ height: 14, width: "55%", marginTop: 6 }} />
    </div>
  );
}
