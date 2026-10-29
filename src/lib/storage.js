export const STORAGE_KEY = "todoapp.todos.v1"

const PRIORITIES = new Set(["low", "medium", "high"])

export function createTodo(title, priority = "medium") {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    priority,
    createdAt: now,
    updatedAt: now,
  }
}

export function isValidTodo(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string"
  )
}

export function normalizeTodo(value) {
  return {
    id: value.id,
    title: value.title.trim(),
    completed: Boolean(value.completed),
    priority: PRIORITIES.has(value.priority) ? value.priority : "medium",
    createdAt: Number.isFinite(value.createdAt) ? value.createdAt : Date.now(),
    updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : Date.now(),
  }
}

export function loadTodos() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { todos: [], error: null }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return { todos: [], error: "Saved tasks were unreadable, so a fresh list was started." }
    }

    const todos = parsed.filter(isValidTodo).map(normalizeTodo)
    return { todos, error: null }
  } catch {
    return { todos: [], error: "Could not read saved tasks from this browser." }
  }
}

export function saveTodos(todos) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    return { ok: true, error: null }
  } catch {
    return {
      ok: false,
      error: "Tasks could not be saved. This browser may be private or out of storage space.",
    }
  }
}
