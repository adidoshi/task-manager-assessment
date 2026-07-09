<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import type { TaskManager } from "../../BLL/taskManager/TaskManager";
import type {
  Task,
  TaskInput,
  ValidationErrors,
  TaskStatus,
  TaskPriority,
} from "../../BLL/taskManager/types";

const props = defineProps<{
  manager: TaskManager;
  open: boolean;
  editing: Task | null;
  defaultStatus: TaskStatus;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", task: Task): void;
}>();

const blankInput = (status: TaskStatus): TaskInput => ({
  title: "",
  description: "",
  status,
  priority: "medium",
  dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
  assigneeId: props.manager.assignees[0].id,
  tags: [],
});

const form = reactive<TaskInput>(blankInput(props.defaultStatus));
const errors = ref<ValidationErrors>({});
const tagInput = ref<string>("");

const isEditing = computed<boolean>(() => props.editing !== null);
const title = computed<string>(() =>
  isEditing.value ? "Edit task" : "Create task",
);

watch(
  () => [props.open, props.editing, props.defaultStatus] as const,
  ([open, editing, defaultStatus]) => {
    if (!open) return;
    errors.value = {};
    tagInput.value = "";
    if (editing) {
      form.title = editing.title;
      form.description = editing.description;
      form.status = editing.status;
      form.priority = editing.priority;
      form.dueDate = editing.dueDate;
      form.assigneeId = editing.assignee.id;
      form.tags = [...editing.tags];
    } else {
      const b = blankInput(defaultStatus);
      form.title = b.title;
      form.description = b.description;
      form.status = b.status;
      form.priority = b.priority;
      form.dueDate = b.dueDate;
      form.assigneeId = b.assigneeId;
      form.tags = b.tags;
    }
  },
  { immediate: true },
);

const addTagFromInput = (): void => {
  const raw = tagInput.value.trim().replace(/^#/, "");
  if (!raw) return;
  if (!form.tags.includes(raw)) form.tags.push(raw);
  tagInput.value = "";
};
const removeTag = (t: string): void => {
  form.tags = form.tags.filter((x) => x !== t);
};
const onTagKey = (evt: KeyboardEvent): void => {
  if (evt.key === "Enter" || evt.key === ",") {
    evt.preventDefault();
    addTagFromInput();
  } else if (
    evt.key === "Backspace" &&
    tagInput.value === "" &&
    form.tags.length > 0
  ) {
    form.tags.pop();
  }
};

const submit = (evt: Event): void => {
  evt.preventDefault();
  const validationErrors = props.manager.validate(
    form,
    props.editing?.id ?? null,
  );
  errors.value = validationErrors;
  if (Object.keys(validationErrors).length > 0) return;
  const saved = props.editing
    ? props.manager.updateTask(props.editing.id, {
        ...form,
        tags: [...form.tags],
      })
    : props.manager.createTask({ ...form, tags: [...form.tags] });
  if (saved) {
    emit("saved", saved);
    emit("close");
  }
};

const priorities: TaskPriority[] = ["low", "medium", "high"];
const statuses: TaskStatus[] = ["todo", "in-progress", "done"];
const statusLabel = (s: TaskStatus): string =>
  s === "todo" ? "To do" : s === "in-progress" ? "In Progress" : "Done";

const priorityChipClass = (p: TaskPriority): string => {
  const isActive = form.priority === p;
  const base =
    "px-4 h-8 rounded-full text-badge border transition-colors cursor-pointer ";
  const ring = isActive ? "ring-2 ring-offset-1 ring-brand-500 " : "";
  const map: Record<TaskPriority, string> = {
    high: "bg-priority-high text-priority-highFg border-priority-high",
    medium: "bg-priority-med text-priority-medFg border-priority-med",
    low: "bg-priority-low text-priority-lowFg border-priority-low",
  };
  return base + ring + map[p];
};

const today = new Date().toISOString().slice(0, 10);
</script>

<template>
  <Teleport to="body">
    <Transition name="list">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/35 backdrop-blur-[2px]"
        @click.self="emit('close')"
        data-testid="task-modal-backdrop"
      >
        <form
          class="w-full max-w-145 bg-white rounded-3xl shadow-modal border border-border-subtle overflow-hidden"
          @submit="submit"
          data-testid="task-modal"
        >
          <header
            class="flex items-center justify-between px-6 py-4 border-b border-border-subtle"
          >
            <div>
              <p class="text-meta text-ink-400 uppercase tracking-wider">
                {{ isEditing ? "Editing" : "New task" }}
              </p>
              <h2
                class="text-page-title text-ink-900"
                style="font-size: 18px; line-height: 24px"
              >
                {{ title }}
              </h2>
            </div>
            <button
              type="button"
              class="w-9 h-9 rounded-lg text-ink-500 hover:bg-canvas hover:text-ink-900"
              @click="emit('close')"
              data-testid="task-modal-close"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div class="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">
            <!-- title -->
            <div>
              <label
                for="tm-title"
                class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                >Title</label
              >
              <input
                id="tm-title"
                v-model="form.title"
                type="text"
                autocomplete="off"
                class="w-full px-4 h-10 rounded-xl border bg-white text-[14px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-brand-500"
                :class="
                  errors.title ? 'border-priority-highFg' : 'border-border'
                "
                placeholder="e.g. Ship dark mode audit"
                data-testid="task-modal-title"
              />
              <p
                v-if="errors.title"
                class="mt-1 text-meta text-priority-highFg"
                data-testid="error-title"
              >
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ errors.title }}
              </p>
            </div>

            <!-- description -->
            <div>
              <label
                for="tm-desc"
                class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                >Description</label
              >
              <textarea
                id="tm-desc"
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-border bg-white text-[13px] text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-brand-500 resize-none"
                placeholder="What needs to happen?"
                data-testid="task-modal-description"
              ></textarea>
            </div>

            <!-- status + due date -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  for="tm-status"
                  class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                  >Status</label
                >
                <select
                  id="tm-status"
                  v-model="form.status"
                  class="w-full px-3 h-10 rounded-xl border border-border bg-white text-[13px] text-ink-700 focus:outline-none focus:border-brand-500"
                  data-testid="task-modal-status"
                >
                  <option v-for="s in statuses" :key="s" :value="s">
                    {{ statusLabel(s) }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="tm-due"
                  class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                  >Due date</label
                >
                <input
                  id="tm-due"
                  v-model="form.dueDate"
                  type="date"
                  :min="today"
                  class="w-full px-3 h-10 rounded-xl border bg-white text-[13px] text-ink-700 focus:outline-none focus:border-brand-500"
                  :class="
                    errors.dueDate ? 'border-priority-highFg' : 'border-border'
                  "
                  data-testid="task-modal-due"
                />
                <p
                  v-if="errors.dueDate"
                  class="mt-1 text-meta text-priority-highFg"
                  data-testid="error-due"
                >
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {{ errors.dueDate }}
                </p>
              </div>
            </div>

            <!-- priority -->
            <div>
              <label
                class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                >Priority</label
              >
              <div class="flex items-center gap-2">
                <button
                  v-for="p in priorities"
                  :key="p"
                  type="button"
                  :class="priorityChipClass(p)"
                  @click="form.priority = p"
                  :data-testid="`priority-${p}`"
                >
                  {{ p.charAt(0).toUpperCase() + p.slice(1) }}
                </button>
              </div>
            </div>

            <!-- assignee -->
            <div>
              <label
                for="tm-assignee"
                class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                >Assignee</label
              >
              <select
                id="tm-assignee"
                v-model="form.assigneeId"
                class="w-full px-3 h-10 rounded-xl border border-border bg-white text-[13px] text-ink-700 focus:outline-none focus:border-brand-500"
                data-testid="task-modal-assignee"
              >
                <option
                  v-for="a in manager.assignees"
                  :key="a.id"
                  :value="a.id"
                >
                  {{ a.name }}
                </option>
              </select>
            </div>

            <!-- tags -->
            <div>
              <label
                for="tm-tags"
                class="block text-badge text-ink-700 uppercase tracking-wider mb-1.5"
                >Tags</label
              >
              <div
                class="flex flex-wrap items-center gap-2 px-2 py-2 rounded-xl border border-border bg-white focus-within:border-brand-500"
              >
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-canvas text-ink-700 text-badge"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    class="text-ink-400 hover:text-priority-highFg"
                    @click="removeTag(tag)"
                    :aria-label="`Remove tag ${tag}`"
                  >
                    <i class="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                </span>
                <input
                  id="tm-tags"
                  v-model="tagInput"
                  type="text"
                  autocomplete="off"
                  class="flex-1 min-w-25 px-2 py-0.5 text-[13px] text-ink-700 placeholder:text-ink-300 outline-none"
                  placeholder="Add tag and press Enter"
                  @keydown="onTagKey"
                  @blur="addTagFromInput"
                  data-testid="task-modal-tag-input"
                />
              </div>
            </div>
          </div>

          <footer
            class="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle bg-canvas/50"
          >
            <button
              type="button"
              class="px-4 h-10 rounded-xl text-[13px] font-semibold text-ink-700 hover:bg-white border border-transparent hover:border-border-subtle cursor-pointer"
              @click="emit('close')"
              data-testid="task-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 h-10 rounded-xl text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm inline-flex items-center gap-2 cursor-pointer"
              data-testid="task-modal-save"
            >
              <i
                class="fa-solid"
                :class="isEditing ? 'fa-check' : 'fa-plus'"
              ></i>
              {{ isEditing ? "Save changes" : "Create task" }}
            </button>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
