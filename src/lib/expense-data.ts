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
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Sample rows defined as day-offsets so they stay relative to "today". */
const SAMPLE_SEED: {
  id: string;
  amount: number;
  category: Category;
  daysAgo: number;
  description: string;
}[] = [
  { id: "s1", amount: 420, category: "Food", daysAgo: 0, description: "Grocery run at Fresh Market" },
  { id: "s2", amount: 35, category: "Food", daysAgo: 0, description: "Lunch with team" },
  { id: "s3", amount: 1800, category: "Travel", daysAgo: 1, description: "Flight tickets to Bangalore" },
  { id: "s4", amount: 250, category: "Travel", daysAgo: 2, description: "Cab to airport" },
  { id: "s5", amount: 1299, category: "Shopping", daysAgo: 3, description: "Wireless headphones" },
  { id: "s6", amount: 899, category: "Shopping", daysAgo: 4, description: "Winter jacket" },
  { id: "s7", amount: 1450, category: "Bills", daysAgo: 5, description: "Electricity bill" },
  { id: "s8", amount: 699, category: "Bills", daysAgo: 6, description: "Internet & mobile recharge" },
  { id: "s9", amount: 320, category: "Entertainment", daysAgo: 6, description: "Movie night with friends" },
  { id: "s10", amount: 540, category: "Food", daysAgo: 7, description: "Dinner at Olive Bistro" },
  { id: "s11", amount: 2100, category: "Bills", daysAgo: 8, description: "Monthly rent share" },
  { id: "s12", amount: 120, category: "Other", daysAgo: 9, description: "Stationery supplies" },
  { id: "s13", amount: 780, category: "Entertainment", daysAgo: 11, description: "Concert tickets" },
  { id: "s14", amount: 460, category: "Travel", daysAgo: 13, description: "Weekend cab trips" },
  { id: "s15", amount: 320, category: "Shopping", daysAgo: 15, description: "Books from local store" },
  { id: "s16", amount: 950, category: "Food", daysAgo: 18, description: "Birthday dinner" },
];

function buildSampleExpenses(): Expense[] {
  const now = Date.now();
  return SAMPLE_SEED.map((s, i) => ({
    id: s.id,
    amount: s.amount,
    category: s.category,
    date: dateOffset(s.daysAgo),
    description: s.description,
    createdAt: now - (i + 1) * 1000,
  }));
}

const SAMPLE_EXPENSES: Expense[] = buildSampleExpenses();

const isSampleId = (id: string) => /^s\d+$/.test(id);

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return SAMPLE_EXPENSES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = buildSampleExpenses();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Expense[];
    if (!Array.isArray(parsed)) return buildSampleExpenses();

    // Untouched demo data was generated on an earlier day, so its dates drift
    // out of "today"/"this week". Refresh sample rows relative to today while
    // leaving any user-created expenses exactly as they are.
    const fresh = buildSampleExpenses();
    const byId = new Map(fresh.map((e) => [e.id, e]));
    const refreshed = parsed.map((e) => {
      const s = byId.get(e.id);
      if (!s || !isSampleId(e.id)) return e;
      const untouched =
        e.amount === s.amount &&
        e.category === s.category &&
        e.description === s.description;
      return untouched ? { ...e, date: s.date } : e;
    });
    if (JSON.stringify(refreshed) !== JSON.stringify(parsed)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
    }
    return refreshed;
  } catch {
    return buildSampleExpenses();
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
