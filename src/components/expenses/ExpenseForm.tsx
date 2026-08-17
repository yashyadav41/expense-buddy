import { useEffect, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/expense-data";
import type { NewExpense } from "@/hooks/use-expenses";

interface Props {
  onSubmit: (data: NewExpense) => void;
  initial?: NewExpense | null;
  editingId?: string | null;
  onCancelEdit?: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({
  onSubmit,
  initial,
  editingId,
  onCancelEdit,
}: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setAmount(String(initial.amount));
      setCategory(initial.category);
      setDate(initial.date);
      setDescription(initial.description);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    if (!date) {
      setError("Please pick a date.");
      return;
    }
    setError(null);
    onSubmit({
      amount: value,
      category,
      date,
      description: description.trim(),
    });
    setAmount("");
    setDescription("");
    setCategory("Food");
    setDate(todayISO());
  }

  const isEditing = Boolean(editingId);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {isEditing ? "Edit Expense" : "Add Expense"}
        </h3>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label
            htmlFor="amount"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ₹
            </span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-7 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="date"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Category
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Lunch with team at Olive Bistro"
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
      )}

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 sm:w-auto sm:px-6"
      >
        {isEditing ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
