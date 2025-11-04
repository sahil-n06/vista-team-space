export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const comments: Comment[] = [
  {
    id: "comment-1",
    task_id: "task-1",
    user_id: "11111111-1111-1111-1111-111111111111",
    content: "Started working on the mockups",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "comment-2",
    task_id: "task-1",
    user_id: "22222222-2222-2222-2222-222222222222",
    content: "Looks great! Can we try a different color scheme?",
    created_at: "2024-01-11T14:30:00Z",
    updated_at: "2024-01-11T14:30:00Z",
  },
];
