import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useExpenses, type NewExpense, type Expense } from "@/hooks/use-expenses";
import { Dashboard } from "@/components/expenses/Dashboard";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { CategorySummary } from "@/components/expenses/CategorySummary";
import { BudgetCard } from "@/components/expenses/BudgetCard";
import { useBudget } from "@/hooks/use-budget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ledger — Expense Tracker" },
      {
        name: "description",
        content:
          "A clean, modern expense tracker. Track spending, manage categories, and visualize where your money goes.",
      },
      { property: "og:title", content: "Ledger — Expense Tracker" },
      {
        property: "og:description",
        content:
          "Track spending, manage categories, and visualize where your money goes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "dashboard" | "expenses" | "summary";

function Index() {
  const {
    expenses,
    hydrated,
    addExpense,
    updateExpense,
    deleteExpense,
    resetSampleData,
  } = useExpenses();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [editing, setEditing] = useState<{ id: string; data: NewExpense } | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(data: NewExpense) {
    if (editing) {
      updateExpense(editing.id, data);
      setEditing(null);
    } else {
      addExpense(data);
    }
    setShowForm(false);
  }

  function handleEdit(e: Expense) {
    setEditing({ id: e.id, data: { amount: e.amount, category: e.category, date: e.date, description: e.description } });
    setShowForm(true);
    setTab("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: string) {
    deleteExpense(id);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "expenses", label: "Expenses" },
    { id: "summary", label: "Summary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 3 3 5-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-none text-foreground">
                Ledger
              </h1>
              <p className="text-xs text-muted-foreground">Expense Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetSampleData}
              className="hidden rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:block"
              title="Reset to sample data"
            >
              Reset Data
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setShowForm((s) => !s);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Tab nav */}
        <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-xl border border-border bg-card p-1.5 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Inline form (Add / Edit) */}
        {showForm && (
          <div className="mb-6">
            <ExpenseForm
              onSubmit={handleSubmit}
              initial={editing?.data ?? null}
              editingId={editing?.id ?? null}
              onCancelEdit={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        )}

        {tab === "dashboard" && (
          <div className="space-y-6">
            <BudgetCard
              expenses={expenses}
              budget={budget}
              onSetBudget={setBudget}
            />
            <Dashboard expenses={expenses} />
          </div>
        )}

        {tab === "expenses" && (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {tab === "summary" && (
          <div className="space-y-6">
            <CategorySummary expenses={expenses} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryStat
                label="Transactions"
                value={String(expenses.length)}
              />
              <SummaryStat
                label="Avg per Entry"
                value={
                  expenses.length
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(
                        expenses.reduce((s, e) => s + e.amount, 0) /
                          expenses.length,
                      )
                    : "—"
                }
              />
              <SummaryStat
                label="Largest Single"
                value={
                  expenses.length
                    ? new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(Math.max(...expenses.map((e) => e.amount)))
                    : "—"
                }
              />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          Ledger · A clean expense tracker demo · Data saved locally in your browser
        </p>
      </footer>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-display text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
