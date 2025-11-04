export interface Status {
  id: string;
  name: string;
  color: string;
  type: string;
  is_editable: boolean;
  position: number;
  organization_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const statuses: Status[] = [
  {
    id: "status-1",
    name: "To Do",
    color: "#ef4444",
    type: "todo",
    is_editable: true,
    position: 0,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-2",
    name: "In Progress",
    color: "#3b82f6",
    type: "in_progress",
    is_editable: true,
    position: 1,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-3",
    name: "Under Review",
    color: "#f59e0b",
    type: "review",
    is_editable: true,
    position: 2,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-4",
    name: "Completed",
    color: "#10b981",
    type: "done",
    is_editable: true,
    position: 3,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-5",
    name: "On Hold",
    color: "#8b5cf6",
    type: "blocked",
    is_editable: true,
    position: 4,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-6",
    name: "Cancelled",
    color: "#6b7280",
    type: "cancelled",
    is_editable: true,
    position: 5,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "status-7",
    name: "Testing",
    color: "#ec4899",
    type: "testing",
    is_editable: true,
    position: 6,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
