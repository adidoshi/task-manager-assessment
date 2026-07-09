<script setup lang="ts">
import { computed } from "vue";
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { SortField, Task } from "../../BLL/taskManager/types";

const props = defineProps<{ manager: TaskManager }>();
const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

const rows = computed<Task[]>(() => props.manager.sortedTasks());

const sortIcon = (field: SortField): string => {
  if (props.manager.sort.field !== field) return "fa-sort";
  return props.manager.sort.direction === "asc" ? "fa-sort-up" : "fa-sort-down";
};

const priorityBadge = (p: Task["priority"]): string => {
  switch (p) {
    case "high":
      return "bg-priority-high text-priority-highFg";
    case "medium":
      return "bg-priority-med text-priority-medFg";
    case "low":
      return "bg-priority-low text-priority-lowFg";
  }
};

const statusBadge = (s: Task["status"]): { cls: string; label: string } => {
  switch (s) {
    case "todo":
      return { cls: "bg-status-todoBg text-status-todoFg", label: "To do" };
    case "in_progress":
      return {
        cls: "bg-status-progBg text-status-progFg",
        label: "In Progress",
      };
    case "done":
      return { cls: "bg-status-doneBg text-status-doneFg", label: "Done" };
  }
};
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-card"
    data-testid="list-view"
  >
    <div class="overflow-x-auto">
      <table class="w-full min-w-275">
        <thead class="bg-canvas/70 border-b border-border-subtle">
          <tr class="text-left">
            <th
              class="px-5 py-4 text-col-heading uppercase text-ink-500 w-[36%]"
            >
              Task
            </th>
            <th class="px-4 py-4 text-col-heading uppercase text-ink-500">
              Status
            </th>
            <th class="px-4 py-4 text-col-heading uppercase text-ink-500">
              <button
                type="button"
                class="inline-flex items-center gap-2 hover:text-ink-900"
                @click="manager.toggleSort('priority')"
                data-testid="sort-priority"
              >
                Priority
                <i
                  class="fa-solid text-[10px]"
                  :class="sortIcon('priority')"
                ></i>
              </button>
            </th>
            <th class="px-4 py-4 text-col-heading uppercase text-ink-500">
              <button
                type="button"
                class="inline-flex items-center gap-2 hover:text-ink-900"
                @click="manager.toggleSort('due_date')"
                data-testid="sort-due-date"
              >
                Due date
                <i
                  class="fa-solid text-[10px]"
                  :class="sortIcon('due_date')"
                ></i>
              </button>
            </th>
            <th class="px-4 py-4 text-col-heading uppercase text-ink-500">
              Assignee
            </th>
            <th class="px-4 py-4 text-col-heading uppercase text-ink-500">
              Tags
            </th>
            <th class="px-4 py-4 w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="7" class="py-16 text-center text-ink-400 text-body-xs">
              <div class="flex flex-col items-center gap-2">
                <div
                  class="w-12 h-12 rounded-full bg-canvas border border-dashed border-border flex items-center justify-center text-ink-300"
                >
                  <i class="fa-solid fa-inbox"></i>
                </div>
                No tasks match your filters.
              </div>
            </td>
          </tr>
          <tr
            v-for="task in rows"
            :key="task.id"
            class="border-b border-border-subtle last:border-0 hover:bg-canvas/50 transition-colors"
            :data-testid="`list-row-${task.id}`"
          >
            <td class="px-5 py-4">
              <button
                type="button"
                class="text-left w-full"
                @click="emit('edit', task.id)"
              >
                <div class="text-card-title text-ink-900 truncate">
                  {{ task.title }}
                </div>
                <div class="text-body-xs text-ink-400 clamp-1 mt-0.5">
                  {{ task.description }}
                </div>
              </button>
            </td>
            <td class="px-4 py-4">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-badge"
                :class="statusBadge(task.status).cls"
                >{{ statusBadge(task.status).label }}</span
              >
            </td>
            <td class="px-4 py-4">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-md text-badge"
                :class="priorityBadge(task.priority)"
                >{{
                  task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                }}</span
              >
            </td>
            <td class="px-4 py-4">
              <div
                class="flex items-center gap-2 text-meta"
                :class="
                  manager.isOverdue(task)
                    ? 'text-overdue font-semibold'
                    : 'text-ink-500'
                "
              >
                <i
                  v-if="manager.isOverdue(task)"
                  class="fa-solid fa-triangle-exclamation text-[11px]"
                ></i>
                <i v-else class="fa-solid fa-calendar text-[11px]"></i>
                {{ manager.formatDueDate(task.dueDate) }}
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2">
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                  :style="{
                    backgroundColor: manager.colorFor(task.assignee.name),
                  }"
                  >{{ manager.initials(task.assignee.name) }}</span
                >
                <span class="text-body-xs text-ink-700 truncate max-w-35">{{
                  task.assignee.name
                }}</span>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in task.tags.slice(0, 2)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-0.5 rounded-md bg-canvas text-ink-500 text-badge"
                  >#{{ tag }}</span
                >
                <span
                  v-if="task.tags.length > 2"
                  class="inline-flex items-center px-2 py-0.5 rounded-md bg-canvas text-ink-400 text-badge"
                  >+{{ task.tags.length - 2 }}</span
                >
              </div>
            </td>
            <td class="px-4 py-4 text-right">
              <div class="inline-flex items-center gap-1">
                <button
                  type="button"
                  class="w-7 h-7 rounded-md text-ink-400 hover:bg-canvas hover:text-ink-700 cursor-pointer"
                  @click="emit('edit', task.id)"
                  :data-testid="`list-edit-${task.id}`"
                  aria-label="Edit"
                >
                  <i class="fa-solid fa-pen-to-square text-[12px]"></i>
                </button>
                <button
                  type="button"
                  class="w-7 h-7 rounded-md text-ink-400 hover:bg-priority-high/60 hover:text-priority-highFg cursor-pointer"
                  @click="emit('delete', task.id)"
                  :data-testid="`list-delete-${task.id}`"
                  aria-label="Delete"
                >
                  <i class="fa-solid fa-trash-can text-[12px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
