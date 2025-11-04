export interface CustomField {
  id: string;
  name: string;
  field_type: string;
  options: any[];
  is_required: boolean;
  organization_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const customFields: CustomField[] = [
  {
    id: "field-1",
    name: "Priority Level",
    field_type: "select",
    options: ["Low", "Medium", "High", "Critical"],
    is_required: true,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "field-2",
    name: "Department",
    field_type: "select",
    options: ["Engineering", "Design", "Marketing", "Sales"],
    is_required: false,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "field-3",
    name: "Estimated Hours",
    field_type: "number",
    options: [],
    is_required: false,
    organization_id: "33333333-3333-4333-a333-333333333333",
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
