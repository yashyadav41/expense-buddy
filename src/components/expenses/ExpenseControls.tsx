import { CATEGORIES } from "@/lib/expense-data";
import {
  DATE_FILTERS,
  SORT_OPTIONS,
  type CategoryFilter,
  type DateFilter,
  type ExpenseFilters,
  type SortOption,
} from "@/lib/expense-filters";

interface Props {
  filters: ExpenseFilters;
  onChange: (patch: Partial<ExpenseFilters>) => void;
}

const selectClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ExpenseControls({ filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative lg:col-span-2">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={filters.search}
          onChange={(ev) => onChange({ search: ev.target.value })}
          placeholder="Search by description or category…"
          aria-label="Search expenses"
          className={`${selectClass} pl-9`}
        />
      </div>

      <select
        value={filters.category}
        onChange={(ev) =>
          onChange({ category: ev.target.value as CategoryFilter })
        }
        aria-label="Filter by category"
        className={selectClass}
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.date}
        onChange={(ev) => onChange({ date: ev.target.value as DateFilter })}
        aria-label="Filter by date"
        className={selectClass}
      >
        {DATE_FILTERS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(ev) => onChange({ sort: ev.target.value as SortOption })}
        aria-label="Sort expenses"
        className={`${selectClass} sm:col-span-2 lg:col-span-4`}
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
