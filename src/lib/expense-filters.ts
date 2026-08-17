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

/** Local (not UTC) yyyy-mm-dd string for a Date. */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Inclusive [start, end] yyyy-mm-dd range for the given filter. */
export function dateRangeFor(
  filter: DateFilter,
  now: Date = new Date(),
): { start: string; end: string } | null {
  if (filter === "all") return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === "today") {
    const iso = toLocalISODate(today);
    return { start: iso, end: iso };
  }

  if (filter === "week") {
    // Calendar week: Monday through Sunday
    const offset = (today.getDay() + 6) % 7; // Mon=0 … Sun=6
    const monday = new Date(today);
    monday.setDate(today.getDate() - offset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: toLocalISODate(monday), end: toLocalISODate(sunday) };
  }

  // month: first through last day of the current month
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { start: toLocalISODate(first), end: toLocalISODate(last) };
}

function matchesDate(iso: string, filter: DateFilter): boolean {
  const range = dateRangeFor(filter);
  if (!range) return true;
  return iso >= range.start && iso <= range.end;
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
