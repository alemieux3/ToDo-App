import { useEffect, useRef, useState } from "react"

const PRIORITY_STYLES = {
  high: "bg-high/10 text-high",
  medium: "bg-medium/10 text-medium",
  low: "bg-low/10 text-low",
}

export default function TodoItem({ todo, onToggle, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function startEdit() {
    setDraft(todo.title)
    setEditing(true)
  }

  function cancelEdit() {
    setDraft(todo.title)
    setEditing(false)
  }

  function commitEdit() {
    const nextTitle = draft.trim()
    if (!nextTitle) {
      onRemove(todo.id)
      return
    }
    if (nextTitle !== todo.title) {
      onUpdate(todo.id, { title: nextTitle })
    }
    setEditing(false)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      commitEdit()
    }
    if (event.key === "Escape") {
      event.preventDefault()
      cancelEdit()
    }
  }

  return (
    <li className="group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition hover:border-rule hover:bg-cream/60">
      <label className="relative mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="peer absolute inset-0 z-10 cursor-pointer appearance-none rounded-full"
          aria-label={`Mark “${todo.title}” ${todo.completed ? "open" : "done"}`}
        />
        <span className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-full border-2 border-moss/40 bg-paper peer-checked:border-moss peer-checked:bg-moss peer-focus-visible:ring-4 peer-focus-visible:ring-leaf/20">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              className="checkbox-tick fill-none stroke-cream stroke-[2.2] transition"
              d="M3.5 8.4 6.4 11.2 12.5 4.8"
            />
          </svg>
        </span>
      </label>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            maxLength={180}
            aria-label="Edit task"
            className="w-full rounded-lg border border-leaf bg-paper px-2 py-1 text-[15px] outline-none ring-4 ring-leaf/15"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className={`block w-full truncate text-left text-[15px] ${
              todo.completed ? "text-muted line-through" : "text-ink"
            }`}
          >
            {todo.title}
          </button>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[todo.priority]}`}
          >
            {todo.priority}
          </span>
          <span className="text-xs text-muted">
            {new Date(todo.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <select
          value={todo.priority}
          onChange={(event) => onUpdate(todo.id, { priority: event.target.value })}
          aria-label={`Priority for ${todo.title}`}
          className="h-8 rounded-lg border border-rule bg-paper px-1 text-xs outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button
          type="button"
          onClick={() => onRemove(todo.id)}
          className="h-8 rounded-lg px-2 text-sm text-muted hover:bg-high/10 hover:text-high"
        >
          Delete
        </button>
      </div>
    </li>
  )
}
