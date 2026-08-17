import { useMemo } from "react";
import type { Expense } from "@/lib/expense-data";
import { CATEGORY_META } from "@/lib/expense-data";

function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  expenses: Expense[];
}

export function Dashboard({ expenses }: Props) {
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const month = expenses
      .filter((e) => e.date.startsWith(monthPrefix))
      .reduce((s, e) => s + e.amount, 0);
    const todayTotal = expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + e.amount, 0);

    const recent = [...expenses]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    return { total, month, todayTotal, recent };
  }, [expenses]);

  const cards = [
    {
      label: "Total Expenses",
      value: formatINR(stats.total),
      hint: `${expenses.length} transactions`,
      accent: "text-foreground",
    },
    {
      label: "This Month",
      value: formatINR(stats.month),
      hint: new Date().toLocaleDateString("en-IN", { month: "long" }),
      accent: "text-primary",
    },
    {
      label: "Today",
      value: formatINR(stats.todayTotal),
      hint: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      accent: "text-accent-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
              {c.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Recent Expenses
          </h3>
          <span className="text-sm text-muted-foreground">Last 5</span>
        </div>
        {stats.recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No expenses yet. Add your first one!
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recent.map((e) => {
              const meta = CATEGORY_META[e.category];
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-4 py-3"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
                    style={{ backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)` }}
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {e.description || e.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.category} · {formatDate(e.date)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-foreground">
                    {formatINR(e.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
