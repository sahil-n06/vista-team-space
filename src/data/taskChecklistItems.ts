export interface TaskChecklistItem {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export const taskChecklistItems: TaskChecklistItem[] = [
  {
    id: "checklist-1",
    task_id: "task-1",
    title: "Research competitor websites",
    completed: true,
    position: 0,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
  {
    id: "checklist-2",
    task_id: "task-1",
    title: "Create wireframes",
    completed: true,
    position: 1,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "checklist-3",
    task_id: "task-1",
    title: "Design high-fidelity mockups",
    completed: false,
    position: 2,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];
