export interface WorksheetStatus {
  id: string;
  worksheet_id: string;
  status_id: string;
  position: number;
  created_at: string;
}

export const worksheetStatuses: WorksheetStatus[] = [
  {
    id: "ws-1",
    worksheet_id: "worksheet-1",
    status_id: "status-1",
    position: 0,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ws-2",
    worksheet_id: "worksheet-1",
    status_id: "status-2",
    position: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "ws-3",
    worksheet_id: "worksheet-1",
    status_id: "status-4",
    position: 2,
    created_at: "2024-01-01T00:00:00Z",
  },
];
