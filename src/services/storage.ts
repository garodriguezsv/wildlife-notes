import type { Task } from '../types/task'

const TASKS_STORAGE_KEY = 'focus-tasks'

export function getTasks(): Task[] {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    if (!storedTasks) {
        return []
    }

    return JSON.parse(storedTasks) as Task[]
}

export function saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}