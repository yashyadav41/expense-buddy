export type Category =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Other";

export const CATEGORIES: Category[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

export const CATEGORY_META: Record<
  Category,
  { color: string; icon: string }
> = {
  Food: { color: "oklch(0.7 0.18 70)", icon: "🍽️" },
  Travel: { color: "oklch(0.6 0.16 250)", icon: "✈️" },
  Shopping: { color: "oklch(0.65 0.2 25)", icon: "🛍️" },
  Bills: { color: "oklch(0.62 0.17 145)", icon: "🧾" },
  Entertainment: { color: "oklch(0.6 0.15 300)", icon: "🎬" },
  Other: { color: "oklch(0.55 0.02 160)", icon: "📦" },
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO date (yyyy-mm-dd)
  description: string;
  createdAt: number;
}

const STORAGE_KEY = "expense-tracker-data-v1";

/** Build a yyyy-mm-dd string for an offset from today. */
function dateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const SAMPLE_EXPENSES: Expense[] = [
  { id: "s1", amount: 420, category: "Food", date: dateOffset(0), description: "Grocery run at Fresh Market", createdAt: Date.now() - 1000 },
  { id: "s2", amount: 35, category: "Food", date: dateOffset(0), description: "Lunch with team", createdAt: Date.now() - 2000 },
  { id: "s3", amount: 1800, category: "Travel", date: dateOffset(1), description: "Flight tickets to Bangalore", createdAt: Date.now() - 3000 },
  { id: "s4", amount: 250, category: "Travel", date: dateOffset(2), description: "Cab to airport", createdAt: Date.now() - 4000 },
  { id: "s5", amount: 1299, category: "Shopping", date: dateOffset(3), description: "Wireless headphones", createdAt: Date.now() - 5000 },
  { id: "s6", amount: 899, category: "Shopping", date: dateOffset(4), description: "Winter jacket", createdAt: Date.now() - 6000 },
  { id: "s7", amount: 1450, category: "Bills", date: dateOffset(5), description: "Electricity bill", createdAt: Date.now() - 7000 },
  { id: "s8", amount: 699, category: "Bills", date: dateOffset(6), description: "Internet & mobile recharge", createdAt: Date.now() - 8000 },
  { id: "s9", amount: 320, category: "Entertainment", date: dateOffset(6), description: "Movie night with friends", createdAt: Date.now() - 9000 },
  { id: "s10", amount: 540, category: "Food", date: dateOffset(7), description: "Dinner at Olive Bistro", createdAt: Date.now() - 10000 },
  { id: "s11", amount: 2100, category: "Bills", date: dateOffset(8), description: "Monthly rent share", createdAt: Date.now() - 11000 },
  { id: "s12", amount: 120, category: "Other", date: dateOffset(9), description: "Stationery supplies", createdAt: Date.now() - 12000 },
  { id: "s13", amount: 780, category: "Entertainment", date: dateOffset(11), description: "Concert tickets", createdAt: Date.now() - 13000 },
  { id: "s14", amount: 460, category: "Travel", date: dateOffset(13), description: "Weekend cab trips", createdAt: Date.now() - 14000 },
  { id: "s15", amount: 320, category: "Shopping", date: dateOffset(15), description: "Books from local store", createdAt: Date.now() - 15000 },
  { id: "s16", amount: 950, category: "Food", date: dateOffset(18), description: "Birthday dinner", createdAt: Date.now() - 16000 },
];

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return SAMPLE_EXPENSES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EXPENSES));
      return SAMPLE_EXPENSES;
    }
    const parsed = JSON.parse(raw) as Expense[];
    return Array.isArray(parsed) ? parsed : SAMPLE_EXPENSES;
  } catch {
    return SAMPLE_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // ignore quota errors
  }
}

export function uid(): string {
  return `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
