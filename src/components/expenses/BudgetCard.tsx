import { useMemo, useState } from "react";
import type { Expense } from "@/lib/expense-data";

function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  expenses: Expense[];
  budget: number;
  onSetBudget: (value: number) => void;
}

export function BudgetCard({ expenses, budget, onSetBudget }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(budget));

  const spent = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return expenses
      .filter((e) => e.date.startsWith(prefix))
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  const remaining = budget - spent;
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const status =
    budget <= 0
      ? { label: "No Budget Set", tone: "text-muted-foreground", bar: "bg-muted-foreground" }
      : pct > 100
        ? { label: "Over Budget", tone: "text-destructive", bar: "bg-destructive" }
        : pct >= 75
          ? { label: "Near Budget Limit", tone: "text-amber-600", bar: "bg-amber-500" }
          : { label: "On Track", tone: "text-primary", bar: "bg-primary" };

  const monthName = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  function save() {
    const n = Number(draft);
    onSetBudget(Number.isFinite(n) && n >= 0 ? n : 0);
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Monthly Budget
          </h3>
          <p className="text-xs text-muted-foreground">{monthName}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border border-border px-3 py-1 text-xs font-semibold ${status.tone}`}
          >
            {status.label}
          </span>
          {!editing && (
            <button
              onClick={() => {
                setDraft(String(budget));
                setEditing(true);
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {budget > 0 ? "Edit Budget" : "Set Budget"}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={0}
            step={100}
            value={draft}
            onChange={(ev) => setDraft(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") save();
              if (ev.key === "Escape") setEditing(false);
            }}
            placeholder="Monthly budget amount"
            aria-label="Monthly budget amount"
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            onClick={save}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Budget" value={budget > 0 ? formatINR(budget) : "—"} />
        <Stat label="Spent" value={formatINR(spent)} />
        <Stat
          label="Remaining"
          value={budget > 0 ? formatINR(remaining) : "—"}
          tone={remaining < 0 ? "text-destructive" : "text-foreground"}
        />
        <Stat
          label="Used"
          value={budget > 0 ? `${Math.round(pct)}%` : "—"}
          tone={status.tone}
        />
      </div>

      <div className="mt-4">
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, Math.round(pct))}
          aria-label="Budget used"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        {pct > 100 && budget > 0 && (
          <p className="mt-2 text-xs font-medium text-destructive">
            Over budget by {formatINR(Math.abs(remaining))}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 font-display text-xl font-bold tabular-nums ${tone}`}>
        {value}
      </p>
    </div>
  );
}
