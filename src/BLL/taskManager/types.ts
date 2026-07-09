export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type ViewMode = "kanban" | "list";
export type SortField = "due_date" | "priority";
export type SortDirection = "asc" | "desc";

export interface Assignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO yyyy-mm-dd
  assignee: Assignee;
  tags: string[];
  createdAt: string;
}

export interface TaskFilters {
  priority: TaskPriority | "all";
  assigneeId: string | "all";
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  tags: string[];
}

export interface ValidationErrors {
  title?: string;
  dueDate?: string;
}

export interface TaskManagerState {
  tasks: Task[];
  filters: TaskFilters;
  sort: SortState;
  view: ViewMode;
}

export interface AppShellNavItem {
  icon: string;
  label: string;
  active?: boolean;
  count?: string;
  link?: string;
}

export interface KanbanColumnDef {
  status: TaskStatus;
  title: string;
  accent: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In Progress",
  done: "Done",
};

export const STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "done"];
export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
