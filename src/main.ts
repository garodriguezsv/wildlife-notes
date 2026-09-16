import './style.css'
import { getTasks } from './services/storage'
import {
  createTask,
  deleteTask,
  toggleTaskStatus,
  updateTask,
} from './services/taskService'
import { renderTasks } from './ui/taskView'
import type { TaskPriority } from './types/task'

const tasks = getTasks()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="app-eyebrow">Tareas fotograficas en campo</p>
        <h1>WildLife NoteSV</h1>
        <p class="app-subtitle">
          Registro de mis tareas de campo y observaciones de vida silvestre.
        </p>
      </div>

      <button
        id="new-task-button"
        class="primary-button"
        type="button"
      >
        + Nueva tarea
      </button>
    </header>

    <main class="app-main">
      <section class="tasks-section" aria-labelledby="tasks-title">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">Tu productividad</p>
            <h2 id="tasks-title">Mis tareas</h2>
          </div>

          <span id="task-count" class="task-count">
            ${tasks.length} tareas
          </span>
        </div>

        <div class="tasks-toolbar">
          <label class="search-field">
            <span class="sr-only">Buscar tareas</span>
            <input
              id="search-input"
              type="search"
              placeholder="Buscar tareas..."
            />
          </label>

          <label>
            <span class="sr-only">Filtrar por estado</span>
            <select id="status-filter">
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>
          </label>

          <label>
            <span class="sr-only">Filtrar por prioridad</span>
            <select id="priority-filter">
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </label>
        </div>

        <div
          id="feedback-message"
          class="feedback-message"
          role="status"
          aria-live="polite"
        ></div>
        <div id="tasks-list" class="tasks-list">
          <div class="empty-state">
            <h3>Aún no tienes tareas</h3>
            <p>
              Crea tu primera tarea para comenzar a organizar tu día.
            </p>
          </div>
        </div>
      </section>
        </main>

    <dialog id="task-dialog" class="task-dialog">
      <form id="task-form" class="task-form">
        <div class="form-heading">
          <div>
            <p class="section-eyebrow">Nueva tarea</p>
            <h2 id="task-dialog-title">Crear tarea</h2>
          </div>

          <button
            id="close-dialog-button"
            class="icon-button"
            type="button"
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <label for="title-input">
          Título
          <input
            id="title-input"
            name="title"
            type="text"
            placeholder="Ej. Preparar presentación"
            required
          />
        </label>

        <label for="description-input">
          Descripción
          <textarea
            id="description-input"
            name="description"
            rows="4"
            placeholder="Describe brevemente la tarea..."
          ></textarea>
        </label>

        <label for="task-category">Categoría</label>

        <input
          id="task-category"
          name="category"
          type="text"
          placeholder="Ej. Trabajo, Personal, Estudios"
          required
        />

        <label for="priority-input">
          Prioridad
          <select id="priority-input" name="priority">
            <option value="low">Baja</option>
            <option value="medium" selected>Media</option>
            <option value="high">Alta</option>
          </select>
        </label>

        <div class="form-actions">
          <button
            id="cancel-task-button"
            class="secondary-button"
            type="button"
          >
            Cancelar
          </button>

          <button
            class="primary-button"
            type="submit"
          >
            Guardar tarea
          </button>
        </div>
      </form>
    </dialog>
  </div>
`
const tasksList =
  document.querySelector<HTMLElement>('#tasks-list')

const taskCount =
  document.querySelector<HTMLElement>('#task-count')

const feedbackMessage =
  document.querySelector<HTMLElement>(
    '#feedback-message',
  )

function showFeedback(message: string): void {
  if (!feedbackMessage) {
    return
  }

  feedbackMessage.textContent = message
  feedbackMessage.classList.add('is-visible')
}

const searchInput =
  document.querySelector<HTMLInputElement>('#search-input')

const statusFilter =
  document.querySelector<HTMLSelectElement>('#status-filter')

const priorityFilter =
  document.querySelector<HTMLSelectElement>('#priority-filter')

let editingTaskId: string | null = null

function refreshTasks(): void {
  const currentTasks = getTasks()

  const searchTerm =
    searchInput?.value.trim().toLowerCase() ?? ''

  const selectedStatus =
    statusFilter?.value ?? 'all'

  const selectedPriority =
    priorityFilter?.value ?? 'all'

  const filteredTasks = currentTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm)

    const matchesStatus =
      selectedStatus === 'all' ||
      task.status === selectedStatus

    const matchesPriority =
      selectedPriority === 'all' ||
      task.priority === selectedPriority

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    )
  })

  if (tasksList) {
    renderTasks(tasksList, filteredTasks)
  }

  if (taskCount) {
    taskCount.textContent =
      `${filteredTasks.length} tareas`
  }
}

refreshTasks()

const newTaskButton =
  document.querySelector<HTMLButtonElement>('#new-task-button')

const taskDialog =
  document.querySelector<HTMLDialogElement>('#task-dialog')

const closeDialogButton =
  document.querySelector<HTMLButtonElement>('#close-dialog-button')

const cancelTaskButton =
  document.querySelector<HTMLButtonElement>('#cancel-task-button')

newTaskButton?.addEventListener('click', () => {
  taskDialog?.showModal()
})

closeDialogButton?.addEventListener('click', () => {
  taskDialog?.close()
})

cancelTaskButton?.addEventListener('click', () => {
  taskDialog?.close()
})

const taskForm =
  document.querySelector<HTMLFormElement>('#task-form')

taskForm?.addEventListener('submit', (event) => {
  event.preventDefault()

  const titleInput =
    document.querySelector<HTMLInputElement>('#title-input')

  const descriptionInput =
    document.querySelector<HTMLTextAreaElement>('#description-input')

  const priorityInput =
    document.querySelector<HTMLSelectElement>('#priority-input')

  const taskCount =
    document.querySelector<HTMLElement>('#task-count')

  if (!titleInput || !descriptionInput || !priorityInput) {
    return
  }

  const title = titleInput.value.trim()
  const description = descriptionInput.value.trim()
  const priority = priorityInput.value as TaskPriority

  const categoryInput =
    document.querySelector<HTMLInputElement>(
      '#task-category',
    )

  const category = categoryInput?.value.trim() ?? ''

  if (!title) {
    return
  }

  if (editingTaskId) {
    const taskToEdit = getTasks().find(
      (task) => task.id === editingTaskId,
    )

    if (taskToEdit) {
      updateTask({
        ...taskToEdit,
        title,
        description,
        category,
        priority,
      })

      showFeedback('Tarea actualizada correctamente')
    }

    editingTaskId = null
  } else {
    createTask(title, description, category, priority)

    showFeedback('Tarea creada correctamente')
  }

  const updatedTasks = getTasks()

  if (tasksList) {
    renderTasks(tasksList, updatedTasks)
  }

  if (taskCount) {
    taskCount.textContent =
      `${updatedTasks.length} tareas`
  }

  taskForm.reset()
  taskDialog?.close()

  const taskDialogTitle =
    document.querySelector<HTMLElement>(
      '#task-dialog-title',
    )

  if (taskDialogTitle) {
    taskDialogTitle.textContent = 'Crear tarea'
  }
})

tasksList?.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof HTMLButtonElement)) {
    return
  }

  if (!target.classList.contains('toggle-task-button')) {
    return
  }

  const taskId = target.dataset.taskId

  if (!taskId) {
    return
  }

  toggleTaskStatus(taskId)

  const updatedTasks = getTasks()

  renderTasks(tasksList, updatedTasks)
})

tasksList?.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof HTMLButtonElement)) {
    return
  }

  if (!target.classList.contains('edit-task-button')) {
    return
  }

  const taskId = target.dataset.taskId

  if (!taskId) {
    return
  }

  const taskToEdit = getTasks().find(
    (task) => task.id === taskId,
  )

  if (!taskToEdit) {
    return
  }

  const titleInput =
    document.querySelector<HTMLInputElement>('#title-input')

  const descriptionInput =
    document.querySelector<HTMLTextAreaElement>(
      '#description-input',
    )

  const categoryInput =
    document.querySelector<HTMLInputElement>(
      '#task-category',
    )

  const priorityInput =
    document.querySelector<HTMLSelectElement>(
      '#priority-input',
    )

  const taskDialogTitle =
    document.querySelector<HTMLElement>(
      '#task-dialog-title',
    )

  if (
    !titleInput ||
    !descriptionInput ||
    !categoryInput ||
    !priorityInput
  ) {
    return
  }

  editingTaskId = taskToEdit.id

  titleInput.value = taskToEdit.title
  descriptionInput.value = taskToEdit.description
  categoryInput.value = taskToEdit.category
  priorityInput.value = taskToEdit.priority

  if (taskDialogTitle) {
    taskDialogTitle.textContent = 'Editar tarea'
  }

  taskDialog?.showModal()
})

tasksList?.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof HTMLButtonElement)) {
    return
  }

  if (!target.classList.contains('delete-task-button')) {
    return
  }

  const taskId = target.dataset.taskId

  if (!taskId) {
    return
  }

  const confirmed = window.confirm(
    '¿Estás seguro de que deseas eliminar esta tarea?',
  )

  if (!confirmed) {
    return
  }

  deleteTask(taskId)

  const updatedTasks = getTasks()

  renderTasks(tasksList, updatedTasks)

  if (taskCount) {
    taskCount.textContent =
      `${updatedTasks.length} tareas`
  }
})

searchInput?.addEventListener('input', refreshTasks)

statusFilter?.addEventListener('change', refreshTasks)

priorityFilter?.addEventListener('change', refreshTasks)