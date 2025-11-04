export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_by: string | null;
  organization_id: string | null;
  project_id: string | null;
  parent_task_id: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Design homepage mockups",
    description: "Create initial design concepts for the new homepage",
    status: "in_progress",
    priority: "high",
    assigned_to: "11111111-1111-1111-1111-111111111111",
    created_by: "11111111-1111-1111-1111-111111111111",
    organization_id: "33333333-3333-4333-a333-333333333333",
    project_id: "project-1",
    parent_task_id: null,
    due_date: "2024-02-15T00:00:00Z",
    completed_at: null,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "task-2",
    title: "Set up development environment",
    description: "Configure local and staging environments",
    status: "done",
    priority: "high",
    assigned_to: "22222222-2222-2222-2222-222222222222",
    created_by: "11111111-1111-1111-1111-111111111111",
    organization_id: "33333333-3333-4333-a333-333333333333",
    project_id: "project-2",
    parent_task_id: null,
    due_date: "2024-02-01T00:00:00Z",
    completed_at: "2024-01-28T00:00:00Z",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-28T00:00:00Z",
  },
  {
    id: "task-3",
    title: "Write API documentation",
    description: "Document all API endpoints",
    status: "todo",
    priority: "medium",
    assigned_to: "33333333-3333-3333-3333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    organization_id: "33333333-3333-4333-a333-333333333333",
    project_id: "project-2",
    parent_task_id: null,
    due_date: "2024-03-01T00:00:00Z",
    completed_at: null,
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
  {
    id: "task-4",
    title: "User testing",
    description: "Conduct usability tests with target users",
    status: "todo",
    priority: "medium",
    assigned_to: "44444444-4444-4444-4444-444444444444",
    created_by: "11111111-1111-1111-1111-111111111111",
    organization_id: "33333333-3333-4333-a333-333333333333",
    project_id: "project-1",
    parent_task_id: null,
    due_date: "2024-04-01T00:00:00Z",
    completed_at: null,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
];
