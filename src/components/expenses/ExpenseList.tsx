import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_META, type Category, type Expense } from "@/lib/expense-data";

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
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

type Filter = Category | "All";

export function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list =
      filter === "All"
        ? expenses
        : expenses.filter((e) => e.category === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [expenses, filter]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            All Expenses
          </h3>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as Filter[]).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No expenses found. Try a different filter or add a new one.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((e) => {
                  const meta = CATEGORY_META[e.category];
                  return (
                    <tr key={e.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base"
                            style={{ backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)` }}
                          >
                            {meta.icon}
                          </span>
                          <span className="font-medium text-foreground">
                            {e.description || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
                            color: meta.color,
                          }}
                        >
                          {e.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {formatDate(e.date)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                        {formatINR(e.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onEdit(e)}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
                          >
                            Edit
                          </button>
                          {confirmId === e.id ? (
                            <>
                              <button
                                onClick={() => {
                                  onDelete(e.id);
                                  setConfirmId(null);
                                }}
                                className="rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmId(e.id)}
                              className="rounded-md px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border sm:hidden">
            {filtered.map((e) => {
              const meta = CATEGORY_META[e.category];
              return (
                <div key={e.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
                      style={{ backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)` }}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-medium text-foreground">
                          {e.description || "—"}
                        </p>
                        <span className="shrink-0 font-semibold tabular-nums text-foreground">
                          {formatINR(e.amount)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
                            color: meta.color,
                          }}
                        >
                          {e.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(e.date)}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onEdit(e)}
                          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-primary"
                        >
                          Edit
                        </button>
                        {confirmId === e.id ? (
                          <>
                            <button
                              onClick={() => {
                                onDelete(e.id);
                                setConfirmId(null);
                              }}
                              className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium text-muted-foreground"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmId(e.id)}
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-destructive"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
