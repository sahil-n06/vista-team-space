export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export const userRoles: UserRole[] = [
  {
    id: "role-1",
    user_id: "11111111-1111-1111-1111-111111111111",
    role: "super_admin",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-2",
    user_id: "22222222-2222-2222-2222-222222222222",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-3",
    user_id: "33333333-3333-3333-3333-333333333333",
    role: "staff",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-4",
    user_id: "44444444-4444-4444-4444-444444444444",
    role: "staff",
    created_at: "2024-01-01T00:00:00Z",
  },
];
