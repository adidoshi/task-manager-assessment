<script setup lang="ts">
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { KanbanColumnDef, TaskStatus } from "../../BLL/taskManager/types";
import KanbanColumn from "./KanbanColumn.vue";

defineProps<{ manager: TaskManager }>();
const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "add", status: TaskStatus): void;
}>();

const columns: KanbanColumnDef[] = [
  { status: "todo", title: "To do", accent: "#F59E0B" },
  { status: "in-progress", title: "In Progress", accent: "#2563EB" },
  { status: "done", title: "Done", accent: "#EC4899" },
];
</script>

<template>
  <div
    class="flex gap-4 overflow-x-auto pb-4 pt-2 items-start"
    data-testid="kanban-board"
  >
    <KanbanColumn
      v-for="col in columns"
      :key="col.status"
      :manager="manager"
      :status="col.status"
      :title="col.title"
      :accent-color="col.accent"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
      @add="emit('add', $event)"
    />

    <!-- <button
      type="button"
      class="mt-0 w-11 h-11 shrink-0 rounded-2xl bg-white border border-border-subtle text-ink-400 hover:text-brand-600 hover:border-brand-500 transition-colors shadow-card"
      aria-label="Add column"
      data-testid="add-column-btn"
    >
      <i class="fa-solid fa-plus"></i>
    </button> -->
  </div>
</template>
