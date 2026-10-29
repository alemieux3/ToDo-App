const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Open" },
  { value: "completed", label: "Done" },
]

export default function TodoToolbar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  stats,
  onToggleAll,
  onClearCompleted,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-rule bg-cream/70 p-1">
          {FILTERS.map((option) => {
            const selected = filter === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                aria-pressed={selected}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "bg-moss text-cream shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted">
          {stats.remaining} open · {stats.completed} done
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="todo-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="todo-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search"
          className="h-10 flex-1 rounded-xl border border-rule bg-paper px-3 text-sm outline-none placeholder:text-muted/80 focus:border-leaf focus:ring-4 focus:ring-leaf/15"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleAll}
            disabled={stats.total === 0}
            className="h-10 rounded-xl border border-rule px-3 text-sm font-medium text-ink disabled:opacity-40"
          >
            {stats.remaining === 0 && stats.total > 0 ? "Reopen all" : "Complete all"}
          </button>
          <button
            type="button"
            onClick={onClearCompleted}
            disabled={stats.completed === 0}
            className="h-10 rounded-xl border border-rule px-3 text-sm font-medium text-ink disabled:opacity-40"
          >
            Clear done
          </button>
        </div>
      </div>
    </div>
  )
}
