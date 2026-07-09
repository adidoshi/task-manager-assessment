<script setup lang="ts">
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { TaskPriority } from "../../BLL/taskManager/types";

const props = defineProps<{ manager: TaskManager }>();

const priorityOptions: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
</script>

<template>
  <div
    class="w-full md:w-auto flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3"
    data-testid="filter-bar"
  >
    <div class="relative w-full sm:w-auto">
      <select
        class="w-full sm:w-auto sm:min-w-45 appearance-none pl-9 pr-8 h-10 rounded-xl border border-border-subtle bg-white text-[13px] text-ink-700 hover:border-border cursor-pointer focus:outline-none focus:border-brand-500"
        :value="props.manager.filters.priority"
        @change="
          (e) =>
            props.manager.setPriorityFilter(
              (e.target as HTMLSelectElement).value as TaskPriority | 'all',
            )
        "
        data-testid="filter-priority"
      >
        <option
          v-for="opt in priorityOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <i
        class="fa-solid fa-flag pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-[12px]"
      ></i>
      <i
        class="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-[10px]"
      ></i>
    </div>

    <div class="relative w-full sm:w-auto">
      <select
        class="w-full sm:w-auto sm:min-w-45 appearance-none pl-9 pr-8 h-10 rounded-xl border border-border-subtle bg-white text-[13px] text-ink-700 hover:border-border cursor-pointer focus:outline-none focus:border-brand-500"
        :value="props.manager.filters.assigneeId"
        @change="
          (e) =>
            props.manager.setAssigneeFilter(
              (e.target as HTMLSelectElement).value,
            )
        "
        data-testid="filter-assignee"
      >
        <option value="all">All assignees</option>
        <option v-for="a in props.manager.assignees" :key="a.id" :value="a.id">
          {{ a.name }}
        </option>
      </select>
      <i
        class="fa-solid fa-user pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-[12px]"
      ></i>
      <i
        class="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-[10px]"
      ></i>
    </div>

    <button
      v-if="
        props.manager.filters.priority !== 'all' ||
        props.manager.filters.assigneeId !== 'all'
      "
      type="button"
      class="px-3 h-10 rounded-xl text-[13px] text-ink-500 hover:text-ink-900 hover:bg-canvas border border-transparent self-start cursor-pointer"
      @click="props.manager.clearFilters()"
      data-testid="filter-clear"
    >
      Clear filters
    </button>
  </div>
</template>
