<script setup lang="ts">
/**
 * App shell (static decoration).
 * All functional wiring happens in the slot content (Task Manager page).
 */
interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  count?: string;
}

const menu: NavItem[] = [
  { icon: "fa-house", label: "Dashboard" },
  { icon: "fa-inbox", label: "Inbox" },
  { icon: "fa-calendar", label: "Calendar" },
];
const teamSpaces: NavItem[] = [
  { icon: "fa-square-check", label: "Tasks", active: true },
  { icon: "fa-file-lines", label: "Docs" },
  { icon: "fa-user-group", label: "Meeting" },
];
const other: NavItem[] = [
  { icon: "fa-gear", label: "Settings" },
  { icon: "fa-circle-question", label: "Support" },
];
</script>

<template>
  <div class="min-h-screen flex bg-canvas">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-white border-r border-border-subtle flex flex-col shrink-0"
    >
      <!-- profile -->
      <div
        class="flex items-center gap-3 px-5 py-4 border-b border-border-subtle"
      >
        <div
          class="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-[13px] font-semibold"
        >
          DD
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold text-ink-900 truncate">
            Davis Donin
          </div>
          <div class="text-meta text-ink-400 truncate">daviddoni@gmail.com</div>
        </div>
        <button class="w-7 h-7 rounded-md text-ink-400 hover:bg-canvas">
          <i class="fa-solid fa-ellipsis-vertical text-[12px]"></i>
        </button>
      </div>

      <!-- nav -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div
            class="px-3 mb-2 text-meta uppercase tracking-wider text-ink-400"
          >
            Menu
          </div>
          <ul class="space-y-1">
            <li v-for="item in menu" :key="item.label">
              <a
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-ink-700 hover:bg-canvas"
              >
                <i
                  class="fa-solid text-ink-400 text-[13px] w-4"
                  :class="item.icon"
                ></i>
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div class="px-3 mb-2 flex items-center justify-between">
            <span class="text-meta uppercase tracking-wider text-ink-400"
              >Team spaces</span
            >
            <button
              class="w-5 h-5 rounded-md text-ink-400 hover:bg-canvas hover:text-ink-900 flex items-center justify-center"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>
          <ul class="space-y-1">
            <li v-for="item in teamSpaces" :key="item.label">
              <a
                class="relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium"
                :class="
                  item.active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-canvas'
                "
              >
                <span
                  v-if="item.active"
                  class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-600 rounded-r"
                ></span>
                <i
                  class="fa-solid text-[13px] w-4"
                  :class="[
                    item.icon,
                    item.active ? 'text-brand-600' : 'text-ink-400',
                  ]"
                ></i>
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div
            class="px-3 mb-2 text-meta uppercase tracking-wider text-ink-400"
          >
            Other
          </div>
          <ul class="space-y-1">
            <li v-for="item in other" :key="item.label">
              <a
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-ink-700 hover:bg-canvas"
              >
                <i
                  class="fa-solid text-ink-400 text-[13px] w-4"
                  :class="item.icon"
                ></i>
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 min-w-0 flex flex-col">
      <!-- Topbar -->
      <header
        class="h-16 px-8 flex items-center justify-between border-b border-border-subtle bg-white"
      >
        <div class="flex items-center gap-3 text-body-xs text-ink-500">
          <button class="w-8 h-8 rounded-lg hover:bg-canvas text-ink-500">
            <i class="fa-solid fa-arrow-left text-[13px]"></i>
          </button>
          <span class="font-medium text-ink-500">Team spaces</span>
          <i class="fa-solid fa-chevron-right text-[10px] text-ink-300"></i>
          <span class="font-semibold text-ink-900">Tasks</span>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="hidden lg:flex items-center gap-2 px-3 h-10 rounded-xl border border-border-subtle bg-canvas w-72"
          >
            <i
              class="fa-solid fa-magnifying-glass text-ink-400 text-[12px]"
            ></i>
            <input
              type="text"
              placeholder="Search"
              class="bg-transparent outline-none text-[13px] text-ink-700 placeholder:text-ink-400 flex-1"
            />
            <kbd
              class="text-meta text-ink-400 px-2 py-0.5 rounded bg-white border border-border-subtle"
              >⌘F</kbd
            >
          </div>
          <button
            class="w-9 h-9 rounded-lg border border-border-subtle text-ink-500 hover:bg-canvas"
          >
            <i class="fa-solid fa-circle-question"></i>
          </button>
          <button
            class="w-9 h-9 rounded-lg border border-border-subtle text-ink-500 hover:bg-canvas relative"
          >
            <i class="fa-solid fa-bell"></i>
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-priority-highFg ring-2 ring-white"
            ></span>
          </button>
        </div>
      </header>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
