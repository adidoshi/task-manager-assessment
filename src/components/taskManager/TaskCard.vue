<script setup lang="ts">
import { computed } from "vue";
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { Task } from "../../BLL/taskManager/types";

const props = defineProps<{ task: Task; manager: TaskManager }>();
const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "dragstart", id: string): void;
  (e: "dragend"): void;
}>();

const overdue = computed(() => props.manager.isOverdue(props.task));
const initials = computed(() =>
  props.manager.initials(props.task.assignee.name),
);
const avatarColor = computed(() =>
  props.manager.colorFor(props.task.assignee.name),
);
const priorityClass = computed(() => {
  switch (props.task.priority) {
    case "high":
      return "bg-priority-high text-priority-highFg";
    case "medium":
      return "bg-priority-med text-priority-medFg";
    case "low":
      return "bg-priority-low text-priority-lowFg";
  }
});
const priorityLabel = computed(
  () =>
    props.task.priority.charAt(0).toUpperCase() + props.task.priority.slice(1),
);
const statusChipClass = computed(() => {
  switch (props.task.status) {
    case "todo":
      return "bg-status-todoBg text-status-todoFg";
    case "in_progress":
      return "bg-status-progBg text-status-progFg";
    case "done":
      return "bg-status-doneBg text-status-doneFg";
  }
});
const statusDotClass = computed(() => {
  switch (props.task.status) {
    case "todo":
      return "bg-status-todoFg";
    case "in_progress":
      return "bg-status-progFg";
    case "done":
      return "bg-status-doneFg";
  }
});
const statusChipLabel = computed(() => {
  switch (props.task.status) {
    case "todo":
      return "Not Started";
    case "in_progress":
      return "On Track";
    case "done":
      return "Complete";
  }
});

const onDragStart = (evt: DragEvent): void => {
  if (!evt.dataTransfer) return;
  evt.dataTransfer.setData("text/plain", props.task.id);
  evt.dataTransfer.effectAllowed = "move";
  emit("dragstart", props.task.id);
};
</script>

<template>
  <article
    class="kb-card group relative bg-white rounded-card border border-border-subtle p-5 shadow-card cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-px"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="emit('dragend')"
    :data-testid="`task-card-${task.id}`"
  >
    <!-- header row: status chip + kebab -->
    <div class="flex items-center justify-between">
      <span
        class="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-badge"
        :class="statusChipClass"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
        {{ statusChipLabel }}
      </span>

      <div class="relative">
        <details class="group/menu">
          <summary
            class="list-none w-7 h-7 rounded-md flex items-center justify-center text-ink-400 hover:bg-canvas hover:text-ink-700 cursor-pointer"
            :data-testid="`task-menu-${task.id}`"
          >
            <i class="fa-solid fa-ellipsis text-[13px]"></i>
          </summary>
          <div
            class="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg border border-border-subtle shadow-modal py-1"
            @click.stop
          >
            <button
              type="button"
              class="w-full text-left px-3 py-2 text-body-xs text-ink-700 hover:bg-canvas flex items-center gap-2 cursor-pointer"
              @click="emit('edit', task.id)"
              :data-testid="`task-edit-${task.id}`"
            >
              <i class="fa-solid fa-pen-to-square text-ink-400"></i>
              <span>Edit task</span>
            </button>
            <button
              type="button"
              class="w-full text-left px-3 py-2 text-body-xs text-priority-highFg hover:bg-priority-high/50 flex items-center gap-2 cursor-pointer"
              @click="emit('delete', task.id)"
              :data-testid="`task-delete-${task.id}`"
            >
              <i class="fa-solid fa-trash-can"></i>
              <span>Delete task</span>
            </button>
          </div>
        </details>
      </div>
    </div>

    <!-- title + description -->
    <h3
      class="mt-4 text-card-title text-ink-900 clamp-1"
      @click="emit('edit', task.id)"
      style="cursor: pointer"
    >
      {{ task.title }}
    </h3>
    <p class="mt-1 text-body-xs text-ink-500 clamp-2">{{ task.description }}</p>

    <!-- assignees row -->
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-meta text-ink-400">Assignees:</span>
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ring-2 ring-white"
          :style="{ backgroundColor: avatarColor }"
          :title="task.assignee.name"
          >{{ initials }}</span
        >
      </div>
    </div>

    <!-- due date + priority -->
    <div class="mt-4 flex items-center justify-between">
      <div
        class="flex items-center gap-2 text-meta"
        :class="overdue ? 'text-overdue font-semibold' : 'text-ink-500'"
      >
        <i
          v-if="overdue"
          class="fa-solid fa-triangle-exclamation text-[11px]"
        ></i>
        <i v-else class="fa-solid fa-flag text-[11px]"></i>
        <span>{{ manager.formatDueDate(task.dueDate) }}</span>
      </div>
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-md text-badge"
        :class="priorityClass"
        >{{ priorityLabel }}</span
      >
    </div>

    <!-- tag chips -->
    <div
      v-if="task.tags.length > 0"
      class="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border-subtle"
    >
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="inline-flex items-center px-2 py-0.5 rounded-md bg-canvas text-ink-500 text-badge"
        >#{{ tag }}</span
      >
    </div>
  </article>
</template>
