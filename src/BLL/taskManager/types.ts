export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
}

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

// filters
export type SortField = "dueDate" | "priority";
export type SortDirection = "asc" | "desc";
export type ViewMode = "kanban" | "list";

export interface TaskFilters {
  priority?: TaskPriority;
  assignee?: string;
}

// Payload types for create/edit
// since id/createdAt shouldn't be settable by the user
export type TaskInput = Omit<Task, "id" | "createdAt">;

export interface TaskFormErrors {
  title?: string;
  dueDate?: string;
}

// modal union
export type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; task: Task };
