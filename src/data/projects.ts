export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  organization_id: string;
  start_date: string | null;
  end_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "active",
    organization_id: "33333333-3333-4333-a333-333333333333",
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-06-30T00:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "iOS and Android app development",
    status: "active",
    organization_id: "33333333-3333-4333-a333-333333333333",
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-12-31T00:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "project-3",
    name: "Marketing Campaign",
    description: "Q1 marketing initiatives",
    status: "completed",
    organization_id: "33333333-3333-4333-a333-333333333333",
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-03-31T00:00:00Z",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
];
