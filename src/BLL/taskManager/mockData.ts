import type { Assignee, Task } from "./types";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

export const mockAssignees: Assignee[] = [
  { id: "priya", name: "Priya Sharma" },
  { id: "rahul", name: "Rahul Verma" },
  { id: "aisha", name: "Aisha Khan" },
  { id: "neha", name: "Neha Patel" },
];

const byName = (name: string): Assignee => {
  const found = mockAssignees.find((a) => a.name === name);
  if (!found) throw new Error(`Unknown assignee: ${name}`);
  return found;
};

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Fix pagination bug on invoice list",
    description:
      "Page size parameter is ignored when filters are applied, causing duplicate rows on page 2.",
    priority: "high",
    dueDate: daysAgo(5),
    assignee: byName("Priya Sharma"),
    status: "in_progress",
    tags: ["backend", "blocked"],
    createdAt: daysAgo(15),
  },
  {
    id: "2",
    title: "Implement password reset flow",
    description:
      "Add reset password request, token validation, and new password submission screens.",
    priority: "high",
    dueDate: daysFromNow(7),
    assignee: byName("Rahul Verma"),
    status: "todo",
    tags: ["frontend", "auth"],
    createdAt: daysAgo(8),
  },
  {
    id: "3",
    title: "Resolve API timeout on reports",
    description:
      "Investigate slow database queries causing report generation requests to exceed timeout.",
    priority: "high",
    dueDate: daysAgo(2),
    assignee: byName("Aisha Khan"),
    status: "todo",
    tags: ["backend", "api"],
    createdAt: daysAgo(10),
  },
  {
    id: "4",
    title: "Redesign login screen layout",
    description:
      "Update spacing, typography, and responsive behavior to match the latest design system.",
    priority: "medium",
    dueDate: daysFromNow(5),
    assignee: byName("Neha Patel"),
    status: "in_progress",
    tags: ["frontend", "ux"],
    createdAt: daysAgo(6),
  },
  {
    id: "5",
    title: "Add audit logs for admin actions",
    description:
      "Capture create, update, and delete events performed by administrators.",
    priority: "medium",
    dueDate: daysFromNow(2),
    assignee: byName("Priya Sharma"),
    status: "done",
    tags: ["backend", "api"],
    createdAt: daysAgo(12),
  },
  {
    id: "6",
    title: "Update onboarding tooltip copy",
    description:
      "Revise onboarding messages to improve clarity and reduce user confusion.",
    priority: "medium",
    dueDate: daysFromNow(10),
    assignee: byName("Rahul Verma"),
    status: "todo",
    tags: ["ux"],
    createdAt: daysAgo(4),
  },
  {
    id: "7",
    title: "Optimize dashboard chart rendering",
    description:
      "Reduce unnecessary re-renders to improve chart performance on large datasets.",
    priority: "low",
    dueDate: daysFromNow(4),
    assignee: byName("Aisha Khan"),
    status: "done",
    tags: ["frontend"],
    createdAt: daysAgo(14),
  },
  {
    id: "8",
    title: "Clean up unused feature flags",
    description:
      "Remove obsolete feature flags and related configuration from the codebase.",
    priority: "low",
    dueDate: daysFromNow(8),
    assignee: byName("Neha Patel"),
    status: "todo",
    tags: ["backend"],
    createdAt: daysAgo(5),
  },
  {
    id: "9",
    title: "Fix broken email notification template",
    description:
      "Correct placeholder mapping so order confirmation emails render customer details properly.",
    priority: "low",
    dueDate: daysAgo(1),
    assignee: byName("Priya Sharma"),
    status: "in_progress",
    tags: ["api"],
    createdAt: daysAgo(7),
  },
  {
    id: "10",
    title: "Improve search filter accessibility",
    description:
      "Add proper labels and keyboard navigation support for filter controls.",
    priority: "high",
    dueDate: daysFromNow(12),
    assignee: byName("Rahul Verma"),
    status: "done",
    tags: ["frontend", "ux"],
    createdAt: daysAgo(9),
  },
  {
    id: "11",
    title: "Migrate user profile endpoint to v2 API",
    description:
      "Switch frontend integration to the new versioned profile endpoint and update response mapping.",
    priority: "medium",
    dueDate: daysFromNow(6),
    assignee: byName("Aisha Khan"),
    status: "in_progress",
    tags: ["backend", "api"],
    createdAt: daysAgo(11),
  },
  {
    id: "12",
    title: "Validate file upload size before submit",
    description:
      "Prevent oversized uploads with client-side validation and clear error messages.",
    priority: "low",
    dueDate: daysFromNow(9),
    assignee: byName("Neha Patel"),
    status: "todo",
    tags: ["frontend", "auth"],
    createdAt: daysAgo(3),
  },
];
