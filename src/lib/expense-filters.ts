import type { Category, Expense } from "@/lib/expense-data";

export type CategoryFilter = Category | "All";
export type DateFilter = "all" | "today" | "week" | "month";
export type SortOption = "newest" | "oldest" | "highest" | "lowest";

export const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function matchesDate(iso: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const d = new Date(iso + "T00:00:00");
  const today = startOfToday();
  if (filter === "today") return d.getTime() === today.getTime();
  if (filter === "week") {
    const start = new Date(today);
    // week starts Monday
    const day = (today.getDay() + 6) % 7;
    start.setDate(today.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return d >= start && d < end;
  }
  // month
  return (
    d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()
  );
}

export interface ExpenseFilters {
  search: string;
  category: CategoryFilter;
  date: DateFilter;
  sort: SortOption;
}

export function filterAndSortExpenses(
  expenses: Expense[],
  { search, category, date, sort }: ExpenseFilters,
): Expense[] {
  const q = search.trim().toLowerCase();

  const list = expenses.filter((e) => {
    if (category !== "All" && e.category !== category) return false;
    if (!matchesDate(e.date, date)) return false;
    if (
      q &&
      !e.description.toLowerCase().includes(q) &&
      !e.category.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  return [...list].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
      case "highest":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      case "newest":
      default:
        return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
    }
  });
}
