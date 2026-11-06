import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationCount, type NotificationRole } from "@/hooks/useNotificationCount";

interface NotificationBellProps {
  role: NotificationRole;
  userId?: string;
  compact?: boolean;
}

const NotificationBell = ({ role, userId, compact = false }: NotificationBellProps) => {
  const { count, items, isLoading } = useNotificationCount(role, userId);
  const label = count > 0 ? `${count} notification${count === 1 ? "" : "s"}` : "No new notifications";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`relative inline-flex shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${compact ? "h-8 w-8 sm:h-9 sm:w-9" : "h-10 w-10"}`}
          title={label}
          aria-label={label}
        >
          <Bell className={compact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-5 w-5"} aria-hidden="true" />
          {count > 0 && (
            <span className="pointer-events-none absolute -right-1 -top-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground shadow-sm">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {count > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{count}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking live activity…</div>
        ) : items.length > 0 ? (
          <div className="space-y-1 p-1">
            {items.map((item) => <div key={item} className="flex items-start gap-2 rounded-md px-2 py-2 text-sm text-foreground"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></div>)}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> You’re all caught up.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
