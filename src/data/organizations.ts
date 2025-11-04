export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const organizations: Organization[] = [
  {
    id: "33333333-3333-4333-a333-333333333333",
    name: "Acme Corporation",
    slug: "acme-corp",
    description: "Leading technology solutions provider",
    logo_url: null,
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Tech Innovators Inc",
    slug: "tech-innovators",
    description: "Innovation at its finest",
    logo_url: null,
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
];
