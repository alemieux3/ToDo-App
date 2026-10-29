import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import TodoToolbar from "./components/TodoToolbar"
import { useTodos } from "./hooks/useTodos"

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export default function App() {
  const {
    visibleTodos,
    filter,
    setFilter,
    query,
    setQuery,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    restoreTodo,
    clearCompleted,
    toggleAll,
    stats,
    undo,
    storageError,
  } = useTodos()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col px-4 py-10 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-moss">
          {todayLabel()}
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
          Tasks
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          Kept in this browser with local storage, so a refresh does not wipe the list.
        </p>
      </header>

      <main className="rounded-[28px] border border-rule bg-paper/90 p-5 shadow-[0_24px_60px_rgb(0_0_0_/_0.45)] backdrop-blur-sm sm:p-7">
        {storageError ? (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-high/20 bg-high/10 px-4 py-3 text-sm text-high"
          >
            {storageError}
          </div>
        ) : null}

        <TodoForm onAdd={addTodo} />

        <div className="mt-6 border-t border-rule pt-5">
          <TodoToolbar
            filter={filter}
            onFilterChange={setFilter}
            query={query}
            onQueryChange={setQuery}
            stats={stats}
            onToggleAll={toggleAll}
            onClearCompleted={clearCompleted}
          />
        </div>

        <div className="mt-4">
          <TodoList
            todos={visibleTodos}
            query={query}
            filter={filter}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onRemove={removeTodo}
          />
        </div>
      </main>

      {undo ? (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-cream shadow-lg"
        >
          <span>Removed “{undo.title}”.</span>
          <button
            type="button"
            onClick={restoreTodo}
            className="rounded-lg bg-cream/15 px-3 py-1 font-semibold hover:bg-cream/25"
          >
            Undo
          </button>
        </div>
      ) : null}
    </div>
  )
}
