import { useMemo } from "react";
import { AppShell } from "../components/AppShell";
import { useAuth } from "../auth-context";

type ActivityItem = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
};

export function ActivityPage() {
  const { user } = useAuth();

  const items = useMemo<ActivityItem[]>(() => {
    if (!user) return [];
    if (user.role === "finder") {
      return [
        {
          id: "1",
          icon: "🔥",
          title: "New jobs in your zone",
          body: "3 open gigs match your skills near NCR-G02.",
          time: "2m ago",
          unread: true,
        },
        {
          id: "2",
          icon: "✅",
          title: "Swipe accepted",
          body: "Your last accept is visible under My jobs.",
          time: "1h ago",
        },
        {
          id: "3",
          icon: "📍",
          title: "Zone tip",
          body: "Jobs in Gurugram hubs tend to pay 10–15% more on weekends.",
          time: "Yesterday",
        },
      ];
    }
    if (user.role === "lister") {
      return [
        {
          id: "1",
          icon: "📣",
          title: "Job published",
          body: "Workers in your micro-zone can now see your latest post.",
          time: "Just now",
          unread: true,
        },
        {
          id: "2",
          icon: "👷",
          title: "Worker interest",
          body: "2 workers viewed your job in the last hour (prototype mock).",
          time: "45m ago",
        },
      ];
    }
    return [
      {
        id: "1",
        icon: "📊",
        title: "Pilot KPIs updated",
        body: "Accept rate improved 4% vs last week in NCR zones.",
        time: "5m ago",
        unread: true,
      },
      {
        id: "2",
        icon: "🗺️",
        title: "Zone coverage",
        body: "All 10 micro-zones are active for the NCR pilot.",
        time: "Today",
      },
    ];
  }, [user]);

  return (
    <AppShell title="Activity" subtitle="Updates and alerts (prototype)">
        <div className="activity-list">
          {items.map((a, i) => (
            <article
              key={a.id}
              className={`activity-item stagger-item ${a.unread ? "unread" : ""}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="activity-icon" aria-hidden>
                {a.icon}
              </span>
              <div className="activity-body">
                <div className="activity-title">{a.title}</div>
                <p className="muted small">{a.body}</p>
                <time className="activity-time">{a.time}</time>
              </div>
              {a.unread && <span className="activity-dot" aria-label="Unread" />}
            </article>
          ))}
        </div>
        <p className="muted small center" style={{ marginTop: 20 }}>
          Push notifications and SMS are not wired in this prototype.
        </p>
    </AppShell>
  );
}
