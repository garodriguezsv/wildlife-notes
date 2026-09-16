export type TaskStatus = 'pending' | 'completed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
    id: string
    title: string
    description: string
    category: string
    status: TaskStatus
    priority: TaskPriority
    createdAt: string
}