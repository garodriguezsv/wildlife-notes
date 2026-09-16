import type { Task, TaskPriority } from '../types/task'
import { getTasks, saveTasks } from './storage'

export function createTask(
    title: string,
    description: string,
    category: string,
    priority: TaskPriority,
): Task {
    const tasks = getTasks()

    const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        status: 'pending',
        priority,
        createdAt: new Date().toISOString(),
    }

    saveTasks([...tasks, newTask])

    return newTask
}

export function updateTask(updatedTask: Task): void {
    const tasks = getTasks()

    const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
    )

    saveTasks(updatedTasks)
}

export function deleteTask(taskId: string): void {
    const tasks = getTasks()

    const remainingTasks = tasks.filter((task) => task.id !== taskId)

    saveTasks(remainingTasks)
}

export function toggleTaskStatus(taskId: string): void {
    const tasks = getTasks()

    const updatedTasks: Task[] = tasks.map((task): Task =>
        task.id === taskId
            ? {
                ...task,
                status:
                    task.status === 'pending'
                        ? 'completed'
                        : 'pending',
            }
            : task,
    )

    saveTasks(updatedTasks)
}