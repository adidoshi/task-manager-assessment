<script setup lang="ts">
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type { ViewMode } from "../../BLL/taskManager/types";

const props = defineProps<{ manager: TaskManager }>();

const items: {
  value: ViewMode;
  label: string;
  icon: string;
  testId: string;
}[] = [
  {
    value: "kanban",
    label: "Board",
    icon: "fa-columns",
    testId: "view-toggle-kanban",
  },
  { value: "list", label: "List", icon: "fa-list", testId: "view-toggle-list" },
];

const setView = (v: ViewMode): void => {
  props.manager.setView(v);
};
</script>

<template>
  <nav
    class="flex items-center gap-6 border-b border-border-subtle"
    data-testid="view-toggle"
  >
    <!-- static tab (matches screenshots) -->
    <button
      type="button"
      class="relative px-1 pb-3 pt-2 text-[13px] font-semibold text-ink-400"
    >
      Overview
    </button>

    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="relative px-1 pb-3 pt-2 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
      :class="
        manager.view === item.value
          ? 'text-brand-600'
          : 'text-ink-500 hover:text-ink-900'
      "
      :data-testid="item.testId"
      @click="setView(item.value)"
    >
      <i class="fa-solid" :class="item.icon"></i>
      <span>{{ item.label }}</span>
      <span
        v-if="manager.view === item.value"
        class="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-600 rounded-full"
      ></span>
    </button>

    <button
      type="button"
      class="relative px-1 pb-3 pt-2 text-[13px] font-semibold text-ink-400 flex items-center gap-2"
    >
      <i class="fa-solid fa-table-cells"></i>Table
    </button>
    <button
      type="button"
      class="relative px-1 pb-3 pt-2 text-[13px] font-semibold text-ink-400 flex items-center gap-2"
    >
      <i class="fa-solid fa-clock"></i>Timeline
    </button>
  </nav>
</template>
