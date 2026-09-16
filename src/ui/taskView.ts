import type { Task } from '../types/task'

export function renderTasks(
  container: HTMLElement,
  tasks: Task[],
): void {
  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Aún no tienes tareas</h3>
        <p>
          Crea tu primera tarea para comenzar a organizar tu día.
        </p>
      </div>
    `

    return
  }

  container.innerHTML = tasks
    .map(
      (task) => `
        <article class="task-card">
          <div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>

            <p class="task-category">
              Categoría: ${task.category || 'Sin categoría'}
            </p>

            <span class="task-status">
              ${task.status === 'completed'
          ? 'Completada'
          : 'Pendiente'
        }
            </span>
          </div>

          <div>
            <span class="task-priority">
              ${task.priority}
            </span>

            <button
              class="secondary-button toggle-task-button"
              type="button"
              data-task-id="${task.id}"
            >
              ${task.status === 'completed'
          ? 'Marcar pendiente'
          : 'Completar'
        }
            </button>
            <button
            class="danger-button delete-task-button"
            type="button"
            data-task-id="${task.id}"
          >
            Eliminar
          </button>

          <button
            class="secondary-button edit-task-button"
            type="button"
            data-task-id="${task.id}"
          >
            Editar
          </button>
          </div>
        </article>
      `,
    )
    .join('')
}