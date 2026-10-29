import { useCallback, useEffect, useMemo, useState } from "react"
import { createTodo, loadTodos, saveTodos, STORAGE_KEY } from "../lib/storage"

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
}

export function useTodos() {
  const [{ todos, storageError }, setState] = useState(() => {
    const loaded = loadTodos()
    return { todos: loaded.todos, storageError: loaded.error }
  })
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [undo, setUndo] = useState(null)

  useEffect(() => {
    const result = saveTodos(todos)
    setState((current) =>
      current.storageError === result.error
        ? current
        : { ...current, storageError: result.error },
    )
  }, [todos])

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== STORAGE_KEY) return
      const loaded = loadTodos()
      setState({ todos: loaded.todos, storageError: loaded.error })
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    if (!undo) return undefined
    const timeout = window.setTimeout(() => setUndo(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [undo])

  const updateTodos = useCallback((updater) => {
    setState((current) => {
      const nextTodos = updater(current.todos)
      return { ...current, todos: nextTodos }
    })
  }, [])

  const addTodo = useCallback((title, priority) => {
    const todo = createTodo(title, priority)
    if (!todo.title) return false
    updateTodos((current) => [todo, ...current])
    return true
  }, [updateTodos])

  const toggleTodo = useCallback((id) => {
    updateTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo,
      ),
    )
  }, [updateTodos])

  const updateTodo = useCallback((id, changes) => {
    updateTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, ...changes, updatedAt: Date.now() } : todo,
      ),
    )
  }, [updateTodos])

  const removeTodo = useCallback((id) => {
    setState((current) => {
      const removed = current.todos.find((todo) => todo.id === id)
      if (!removed) return current
      setUndo(removed)
      return {
        ...current,
        todos: current.todos.filter((todo) => todo.id !== id),
      }
    })
  }, [])

  const restoreTodo = useCallback(() => {
    setUndo((removed) => {
      if (!removed) return null
      updateTodos((current) => {
        if (current.some((todo) => todo.id === removed.id)) return current
        return [removed, ...current]
      })
      return null
    })
  }, [updateTodos])

  const clearCompleted = useCallback(() => {
    updateTodos((current) => current.filter((todo) => !todo.completed))
  }, [updateTodos])

  const toggleAll = useCallback(() => {
    updateTodos((current) => {
      const shouldComplete = current.some((todo) => !todo.completed)
      return current.map((todo) => ({
        ...todo,
        completed: shouldComplete,
        updatedAt: Date.now(),
      }))
    })
  }, [updateTodos])

  const visibleTodos = useMemo(() => {
    const matchesFilter = FILTERS[filter] ?? FILTERS.all
    const needle = query.trim().toLowerCase()
    return todos.filter((todo) => {
      if (!matchesFilter(todo)) return false
      if (!needle) return true
      return todo.title.toLowerCase().includes(needle)
    })
  }, [todos, filter, query])

  const stats = useMemo(() => {
    const remaining = todos.filter((todo) => !todo.completed).length
    return {
      total: todos.length,
      remaining,
      completed: todos.length - remaining,
    }
  }, [todos])

  return {
    todos,
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
  }
}
