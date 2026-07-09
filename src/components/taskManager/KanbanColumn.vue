<script setup lang="ts">
import { ref, computed } from "vue";
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { Task, TaskStatus } from "../../BLL/taskManager/types";
import TaskCard from "./TaskCard.vue";

const props = defineProps<{
  manager: TaskManager;
  status: TaskStatus;
  title: string;
  accentColor: string;
}>();
const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "add", status: TaskStatus): void;
}>();

const tasks = computed<Task[]>(() => props.manager.tasksByStatus(props.status));
const dragOver = ref(false);

const emptyMessage = computed(() => {
  switch (props.status) {
    case "todo":
      return {
        icon: "fa-clipboard-list",
        text: "Nothing to do — enjoy the calm.",
      };
    case "in-progress":
      return { icon: "fa-rocket", text: "No work in flight. Pull a task in." };
    case "done":
      return {
        icon: "fa-champagne-glasses",
        text: "Nothing shipped yet. Go finish one!",
      };
  }
});

const onDrop = (evt: DragEvent): void => {
  evt.preventDefault();
  dragOver.value = false;
  const id = evt.dataTransfer?.getData("text/plain");
  if (id) props.manager.moveTo(id, props.status);
};
const onDragOver = (evt: DragEvent): void => {
  evt.preventDefault();
  if (evt.dataTransfer) evt.dataTransfer.dropEffect = "move";
  dragOver.value = true;
};
const onDragLeave = (evt: DragEvent): void => {
  // only clear when leaving the column completely
  const rt = evt.relatedTarget as Node | null;
  if (rt && (evt.currentTarget as HTMLElement).contains(rt)) return;
  dragOver.value = false;
};
</script>

<template>
  <section
    class="kb-column flex flex-col w-73 min-w-73 rounded-2xl bg-[#FAFBFD] border border-border-subtle p-4 transition-colors"
    :class="{ 'drag-over': dragOver }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    :data-testid="`kanban-column-${status}`"
  >
    <!-- column header -->
    <header class="flex items-center justify-between px-1 pb-4">
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full"
          :style="{ backgroundColor: accentColor }"
        ></span>
        <h2 class="text-col-heading uppercase text-ink-700">{{ title }}</h2>
        <span
          class="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-white border border-border-subtle text-meta text-ink-500"
        >
          {{ tasks.length }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="w-6 h-6 rounded-md flex items-center justify-center text-ink-400 hover:bg-white hover:text-ink-900"
          @click="emit('add', status)"
          :data-testid="`column-add-${status}`"
          :aria-label="`Add task to ${title}`"
        >
          <i class="fa-solid fa-plus text-[12px]"></i>
        </button>
        <button
          type="button"
          class="w-6 h-6 rounded-md flex items-center justify-center text-ink-400 hover:bg-white hover:text-ink-900"
          aria-label="Column options"
        >
          <i class="fa-solid fa-ellipsis text-[12px]"></i>
        </button>
      </div>
    </header>

    <!-- cards -->
    <div
      class="flex flex-col gap-3 flex-1 overflow-y-auto pr-1"
      style="scrollbar-gutter: stable"
    >
      <TransitionGroup name="list" tag="div" class="flex flex-col gap-3">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :manager="manager"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </TransitionGroup>

      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center rounded-xl border border-dashed border-border-subtle bg-white/80"
        :data-testid="`empty-column-${status}`"
      >
        <div
          class="w-12 h-12 rounded-full bg-white border border-dashed border-border flex items-center justify-center text-ink-300"
        >
          <i class="fa-solid" :class="emptyMessage.icon"></i>
        </div>
        <p class="text-body-xs text-ink-400 max-w-55">
          {{ emptyMessage.text }}
        </p>
      </div>
    </div>
  </section>
</template>
