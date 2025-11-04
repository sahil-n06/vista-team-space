export interface Worksheet {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const worksheets: Worksheet[] = [
  {
    id: "worksheet-1",
    name: "Reporting & Analytics",
    description: "Track and analyze performance metrics",
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "worksheet-2",
    name: "Client Projects",
    description: "Manage all client-related projects",
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "worksheet-3",
    name: "Internal Operations",
    description: "Handle internal tasks and processes",
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "worksheet-4",
    name: "Product Development",
    description: "Product roadmap and development tracking",
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
];
