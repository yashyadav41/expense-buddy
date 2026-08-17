import { useCallback, useEffect, useState } from "react";
import {
  type Expense,
  type Category,
  loadExpenses,
  saveExpenses,
  uid,
} from "@/lib/expense-data";

export type NewExpense = Omit<Expense, "id" | "createdAt">;

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveExpenses(expenses);
  }, [expenses, hydrated]);

  const addExpense = useCallback((data: NewExpense) => {
    setExpenses((prev) => [
      { ...data, id: uid(), createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const updateExpense = useCallback((id: string, data: NewExpense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetSampleData = useCallback(() => {
    window.localStorage.removeItem("expense-tracker-data-v1");
    setExpenses(loadExpenses());
  }, []);

  return {
    expenses,
    hydrated,
    addExpense,
    updateExpense,
    deleteExpense,
    resetSampleData,
  };
}

export type { Expense, Category };
