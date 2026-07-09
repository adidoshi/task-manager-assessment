import { reactive, computed, watch, type ComputedRef } from "vue";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilters,
  SortState,
  SortField,
  SortDirection,
  ViewMode,
  Assignee,
  TaskInput,
  ValidationErrors,
  TaskManagerState,
} from "./types";
import { PRIORITY_ORDER } from "./types";
import { mockTasks, mockAssignees } from "./mockData";

const TASKS_KEY = "tm.tasks.v1";
const VIEW_KEY = "tm.view.v1";
const FILTER_KEY = "tm.filters.v1";
const SORT_KEY = "tm.sort.v1";

const AVATAR_PALETTE: string[] = [
  "#6A5AF9",
  "#F97066",
  "#F59E0B",
  "#10B981",
  "#0EA5E9",
  "#8B5CF6",
  "#EC4899",
  "#22C55E",
  "#EAB308",
  "#EF4444",
  "#14B8A6",
  "#F43F5E",
];

/**
 * TaskManager
 * -----------
 * Single owner of all task-related state and business logic.
 * Consumers pass this instance down as a prop; no store framework.
 */
export class TaskManager {
  private state: TaskManagerState;
  readonly assignees: Assignee[] = mockAssignees;

  constructor() {
    this.state = reactive<TaskManagerState>({
      tasks: this.loadTasks(),
      filters: this.loadFilters(),
      sort: this.loadSort(),
      view: this.loadView(),
    });

    // Persistence: all state changes flow through methods → watched here
    watch(
      () => this.state.tasks,
      (t) => this.persist(TASKS_KEY, t),
      { deep: true },
    );
    watch(
      () => this.state.filters,
      (f) => this.persist(FILTER_KEY, f),
      { deep: true },
    );
    watch(
      () => this.state.sort,
      (s) => this.persist(SORT_KEY, s),
      { deep: true },
    );
    watch(
      () => this.state.view,
      (v) => this.persist(VIEW_KEY, v),
    );
  }

  // ─── Persistence ──────────────────────────────────────────────
  private persist<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
  private read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private cloneMockTasks(): Task[] {
    return mockTasks.map((t) => ({ ...t, tags: [...t.tags] }));
  }

  private normalizePersistedTasks(tasks: Task[]): Task[] {
    return tasks.map((t) => {
      const rawStatus = (t as { status?: unknown }).status;
      let status: TaskStatus;

      if (
        rawStatus === "todo" ||
        rawStatus === "done" ||
        rawStatus === "in-progress"
      ) {
        status = rawStatus;
      } else if (rawStatus === "in_progress") {
        // Backward compatibility with old persisted shape.
        status = "in-progress";
      } else {
        status = "todo";
      }

      return {
        ...t,
        status,
        tags: Array.isArray(t.tags) ? [...t.tags] : [],
      };
    });
  }

  private loadTasks(): Task[] {
    const persisted = this.read<Task[]>(TASKS_KEY);

    if (persisted && Array.isArray(persisted) && persisted.length > 0) {
      const knownAssigneeIds = new Set(this.assignees.map((a) => a.id));
      const assigneesCompatible = persisted.every((t) =>
        knownAssigneeIds.has(t.assignee?.id),
      );

      if (assigneesCompatible) {
        const normalized = this.normalizePersistedTasks(persisted);
        this.persist(TASKS_KEY, normalized);
        return normalized;
      }

      // If assignee IDs changed in mock data, invalidate stale persisted tasks.
      const fresh = this.cloneMockTasks();
      this.persist(TASKS_KEY, fresh);
      return fresh;
    }

    return this.cloneMockTasks();
  }
  private loadView(): ViewMode {
    const v = this.read<ViewMode>(VIEW_KEY);
    return v === "list" || v === "kanban" ? v : "kanban";
  }
  private loadFilters(): TaskFilters {
    const f = this.read<TaskFilters>(FILTER_KEY);
    if (!f) return { priority: "all", assigneeId: "all" };

    const validPriority: TaskPriority | "all" =
      f.priority === "all" ||
      f.priority === "high" ||
      f.priority === "medium" ||
      f.priority === "low"
        ? f.priority
        : "all";

    const validAssigneeId: string | "all" =
      f.assigneeId === "all" ||
      this.assignees.some((a) => a.id === f.assigneeId)
        ? f.assigneeId
        : "all";

    return { priority: validPriority, assigneeId: validAssigneeId };
  }
  private loadSort(): SortState {
    const s = this.read<SortState>(SORT_KEY);
    return s ?? { field: "due_date", direction: "asc" };
  }

  // ─── Read (reactive getters) ──────────────────────────────────
  get view(): ViewMode {
    return this.state.view;
  }
  get filters(): TaskFilters {
    return this.state.filters;
  }
  get sort(): SortState {
    return this.state.sort;
  }
  get allTasks(): Task[] {
    return this.state.tasks;
  }
  get taskCount(): number {
    return this.state.tasks.length;
  }

  // ─── View toggle ──────────────────────────────────────────────
  setView(view: ViewMode): void {
    this.state.view = view;
  }

  // ─── Filters ──────────────────────────────────────────────────
  setPriorityFilter(priority: TaskPriority | "all"): void {
    this.state.filters.priority = priority;
  }
  setAssigneeFilter(assigneeId: string | "all"): void {
    this.state.filters.assigneeId = assigneeId;
  }
  clearFilters(): void {
    this.state.filters.priority = "all";
    this.state.filters.assigneeId = "all";
  }

  /** Apply the current filter state to an arbitrary task list. */
  applyFilters(tasks: Task[]): Task[] {
    const { priority, assigneeId } = this.state.filters;
    return tasks.filter((t) => {
      if (priority !== "all" && t.priority !== priority) return false;
      if (assigneeId !== "all" && t.assignee.id !== assigneeId) return false;
      return true;
    });
  }

  /** Filtered tasks scoped to a specific Kanban column. */
  tasksByStatus(status: TaskStatus): Task[] {
    return this.applyFilters(
      this.state.tasks.filter((t) => t.status === status),
    );
  }

  /** Fully filtered + sorted list for the List view. */
  sortedTasks(): Task[] {
    const filtered = this.applyFilters(this.state.tasks);
    const { field, direction } = this.state.sort;
    const dir = direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (field === "due_date") {
        return (
          (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir
        );
      }
      // priority
      return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
    });
  }

  // ─── Sorting ──────────────────────────────────────────────────
  setSort(field: SortField, direction: SortDirection): void {
    this.state.sort.field = field;
    this.state.sort.direction = direction;
  }
  toggleSort(field: SortField): void {
    if (this.state.sort.field === field) {
      this.state.sort.direction =
        this.state.sort.direction === "asc" ? "desc" : "asc";
    } else {
      this.state.sort.field = field;
      this.state.sort.direction = "asc";
    }
  }

  // ─── Validation ───────────────────────────────────────────────
  validate(input: TaskInput, editingId: string | null): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!input.title.trim()) {
      errors.title = "Title is required";
    } else if (input.title.trim().length > 120) {
      errors.title = "Title must be 120 characters or fewer";
    }
    if (!input.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      // due date must not be in the past for NEW tasks; when editing an existing
      // task keep its historical date valid (only reject when user shifts to past)
      const original = editingId
        ? this.state.tasks.find((t) => t.id === editingId)
        : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const picked = new Date(input.dueDate);
      picked.setHours(0, 0, 0, 0);
      const unchanged = original && original.dueDate === input.dueDate;
      if (!unchanged && picked.getTime() < today.getTime()) {
        errors.dueDate = "Due date cannot be in the past";
      }
    }
    return errors;
  }

  // ─── CRUD ─────────────────────────────────────────────────────
  createTask(input: TaskInput): Task | null {
    const errors = this.validate(input, null);
    if (Object.keys(errors).length > 0) return null;
    const assignee =
      this.assignees.find((a) => a.id === input.assigneeId) ??
      this.assignees[0];
    const task: Task = {
      id: `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      assignee,
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.state.tasks.unshift(task);
    return task;
  }

  updateTask(id: string, input: TaskInput): Task | null {
    const errors = this.validate(input, id);
    if (Object.keys(errors).length > 0) return null;
    const idx = this.state.tasks.findIndex((t) => t.id === id);
    if (idx < 0) return null;
    const assignee =
      this.assignees.find((a) => a.id === input.assigneeId) ??
      this.state.tasks[idx].assignee;
    const updated: Task = {
      ...this.state.tasks[idx],
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      assignee,
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
    };
    this.state.tasks.splice(idx, 1, updated);
    return updated;
  }

  deleteTask(id: string): boolean {
    const idx = this.state.tasks.findIndex((t) => t.id === id);
    if (idx < 0) return false;
    this.state.tasks.splice(idx, 1);
    return true;
  }

  moveTo(id: string, status: TaskStatus): boolean {
    const idx = this.state.tasks.findIndex((t) => t.id === id);
    if (idx < 0) return false;
    if (this.state.tasks[idx].status === status) return false;
    this.state.tasks[idx] = { ...this.state.tasks[idx], status };
    return true;
  }

  findTask(id: string): Task | undefined {
    return this.state.tasks.find((t) => t.id === id);
  }

  // ─── Presentation helpers ─────────────────────────────────────
  isOverdue(task: Task): boolean {
    if (task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  }

  formatDueDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  colorFor(name: string): string {
    let h = 0;
    for (let i = 0; i < name.length; i++)
      h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
  }

  // ─── Reactive computed helpers for templates ──────────────────
  columnCount(status: TaskStatus): ComputedRef<number> {
    return computed(() => this.tasksByStatus(status).length);
  }
}
