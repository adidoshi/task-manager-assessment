<script setup lang="ts">
import { ref, computed } from "vue";
import { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { Task, TaskStatus } from "../../BLL/taskManager/types";

import AppShell from "../../components/taskManager/AppShell.vue";
import ViewToggle from "../../components/taskManager/ViewToggle.vue";
import KanbanBoard from "../../components/taskManager/KanbanBoard.vue";
import ListView from "../../components/taskManager/ListView.vue";
import TaskModal from "../../components/taskManager/TaskModal.vue";
import FilterBar from "../../components/taskManager/FilterBar.vue";
import ConfirmDialog from "../../components/taskManager/ConfirmDialog.vue";

// Single instance — passed as a prop to every child.
const manager = new TaskManager();

const modalOpen = ref<boolean>(false);
const editingTask = ref<Task | null>(null);
const defaultStatus = ref<TaskStatus>("todo");

const confirmOpen = ref<boolean>(false);
const pendingDelete = ref<Task | null>(null);

const openCreate = (status: TaskStatus = "todo"): void => {
  editingTask.value = null;
  defaultStatus.value = status;
  modalOpen.value = true;
};
const openEdit = (id: string): void => {
  const t = manager.findTask(id);
  if (!t) return;
  editingTask.value = t;
  defaultStatus.value = t.status;
  modalOpen.value = true;
};
const askDelete = (id: string): void => {
  const t = manager.findTask(id);
  if (!t) return;
  pendingDelete.value = t;
  confirmOpen.value = true;
};
const confirmDelete = (): void => {
  if (pendingDelete.value) manager.deleteTask(pendingDelete.value.id);
  confirmOpen.value = false;
  pendingDelete.value = null;
};
const cancelDelete = (): void => {
  confirmOpen.value = false;
  pendingDelete.value = null;
};

const filteredCount = computed<number>(() =>
  manager.view === "kanban"
    ? (["todo", "in-progress", "done"] as TaskStatus[]).reduce(
        (n, s) => n + manager.tasksByStatus(s).length,
        0,
      )
    : manager.sortedTasks().length,
);
</script>

<template>
  <AppShell>
    <div
      class="px-4 sm:px-6 lg:px-8 py-5 sm:py-7"
      data-testid="task-manager-page"
    >
      <!-- Page header -->
      <div
        class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6"
      >
        <div>
          <h1 class="text-page-title text-ink-900">Tasks</h1>
          <p class="mt-1 text-body-xs text-ink-500">
            Short description will be placed here
          </p>
        </div>
        <div
          class="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:justify-start"
        >
          <div class="hidden lg:flex items-center -space-x-2">
            <span
              v-for="a in manager.assignees.slice(0, 4)"
              :key="a.id"
              class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white ring-2 ring-white"
              :style="{ backgroundColor: manager.colorFor(a.name) }"
              :title="a.name"
              >{{ manager.initials(a.name) }}</span
            >
            <span
              class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-ink-700 bg-canvas ring-2 ring-white border border-border-subtle"
            >
              +{{ Math.max(0, manager.assignees.length - 4) }}
            </span>
          </div>
          <button
            type="button"
            class="px-4 h-11 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer flex-1 sm:flex-none"
            @click="openCreate('todo')"
            data-testid="new-task-btn"
          >
            <i class="fa-solid fa-plus text-[11px]"></i>
            New Task
          </button>
          <button
            type="button"
            class="hidden sm:inline-flex px-4 h-11 rounded-xl border border-border-subtle text-ink-700 text-[13px] font-semibold items-center gap-2 bg-white hover:bg-canvas"
          >
            <i class="fa-solid fa-share-nodes text-[12px]"></i>
            Share
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="mt-6 sm:mt-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4"
      >
        <ViewToggle :manager="manager" />
        <div class="flex items-center gap-3 md:pb-2 w-full md:w-auto">
          <FilterBar :manager="manager" />
          <div class="hidden md:flex items-center gap-2 text-ink-500">
            <span class="text-meta">{{ filteredCount }} shown</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <section class="mt-5 sm:mt-6">
        <KanbanBoard
          v-if="manager.view === 'kanban'"
          :manager="manager"
          @edit="openEdit"
          @delete="askDelete"
          @add="openCreate"
        />
        <ListView
          v-else
          :manager="manager"
          @edit="openEdit"
          @delete="askDelete"
        />
      </section>
    </div>

    <TaskModal
      :manager="manager"
      :open="modalOpen"
      :editing="editingTask"
      :default-status="defaultStatus"
      @close="modalOpen = false"
      @saved="modalOpen = false"
    />

    <ConfirmDialog
      :open="confirmOpen"
      title="Delete task?"
      :message="
        pendingDelete
          ? `“${pendingDelete.title}” will be permanently removed. This cannot be undone.`
          : ''
      "
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </AppShell>
</template>
