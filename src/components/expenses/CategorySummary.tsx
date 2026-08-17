import { useMemo } from "react";
import { CATEGORIES, CATEGORY_META, type Expense } from "@/lib/expense-data";

function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  expenses: Expense[];
}

export function CategorySummary({ expenses }: Props) {
  const { byCategory, total } = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of CATEGORIES) map.set(c, 0);
    for (const e of expenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    const list = CATEGORIES.map((c) => ({
      category: c,
      amount: map.get(c) ?? 0,
    })).sort((a, b) => b.amount - a.amount);
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    return { byCategory: list, total };
  }, [expenses]);

  const max = Math.max(1, ...byCategory.map((c) => c.amount));

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
          Spending by Category
        </h3>
        <p className="py-8 text-center text-sm text-muted-foreground">
          No spending data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Spending by Category
        </h3>
        <span className="text-sm font-medium text-muted-foreground">
          Total {formatINR(total)}
        </span>
      </div>

      {/* Stacked bar overview */}
      <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full">
        {byCategory
          .filter((c) => c.amount > 0)
          .map((c) => {
            const meta = CATEGORY_META[c.category];
            const pct = (c.amount / total) * 100;
            return (
              <div
                key={c.category}
                title={`${c.category}: ${formatINR(c.amount)} (${pct.toFixed(1)}%)`}
                style={{
                  width: `${pct}%`,
                  backgroundColor: meta.color,
                }}
              />
            );
          })}
      </div>

      {/* Per-category bars */}
      <div className="space-y-4">
        {byCategory.map((c) => {
          const meta = CATEGORY_META[c.category];
          const pct = total > 0 ? (c.amount / total) * 100 : 0;
          const widthPct = (c.amount / max) * 100;
          return (
            <div key={c.category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span aria-hidden>{meta.icon}</span>
                  {c.category}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatINR(c.amount)}{" "}
                  <span className="text-xs">({pct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
