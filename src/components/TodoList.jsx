import TodoItem from "./TodoItem"

export default function TodoList({ todos, query, filter, onToggle, onUpdate, onRemove }) {
  if (todos.length === 0) {
    const message =
      query.trim()
        ? "No tasks match that search."
        : filter === "completed"
          ? "Nothing marked done yet."
          : filter === "active"
            ? "No open tasks. Nice work."
            : "Your list is empty. Add the first task above."

    return (
      <div className="rounded-2xl border border-dashed border-rule px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold text-ink">Nothing here</p>
        <p className="mt-2 text-sm text-muted">{message}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-rule/80">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
