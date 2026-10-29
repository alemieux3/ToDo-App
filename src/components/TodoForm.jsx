import { useState } from "react"

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("medium")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    const added = onAdd(title, priority)
    if (!added) {
      setError("Write a task first.")
      return
    }
    setTitle("")
    setPriority("medium")
    setError("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="todo-title" className="sr-only">
        New task
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="todo-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (error) setError("")
          }}
          maxLength={180}
          placeholder="What needs doing?"
          autoComplete="off"
          className="h-12 flex-1 rounded-2xl border border-rule bg-paper px-4 text-[15px] text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] outline-none placeholder:text-muted/80 focus:border-leaf focus:ring-4 focus:ring-leaf/15"
        />
        <div className="flex gap-2">
          <label htmlFor="todo-priority" className="sr-only">
            Priority
          </label>
          <select
            id="todo-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="h-12 rounded-2xl border border-rule bg-paper px-3 text-sm text-ink outline-none focus:border-leaf focus:ring-4 focus:ring-leaf/15"
          >
            {PRIORITIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-12 rounded-2xl bg-moss px-5 text-sm font-semibold text-cream shadow-[0_8px_18px_rgb(0_0_0_/_0.35)] transition hover:bg-leaf"
          >
            Add
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      ) : null}
    </form>
  )
}
