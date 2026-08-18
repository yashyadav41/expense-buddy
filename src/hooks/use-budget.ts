import { useCallback, useEffect, useState } from "react";

const BUDGET_KEY = "expense-tracker-budget-v1";
const DEFAULT_BUDGET = 20000;

export function useBudget() {
  const [budget, setBudgetState] = useState<number>(DEFAULT_BUDGET);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BUDGET_KEY);
      const n = raw === null ? NaN : Number(raw);
      if (Number.isFinite(n) && n >= 0) setBudgetState(n);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setBudget = useCallback((value: number) => {
    const safe = Number.isFinite(value) && value >= 0 ? value : 0;
    setBudgetState(safe);
    try {
      window.localStorage.setItem(BUDGET_KEY, String(safe));
    } catch {
      // ignore
    }
  }, []);

  return { budget, setBudget, budgetHydrated: hydrated };
}
