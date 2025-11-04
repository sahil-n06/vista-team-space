export interface LoginSession {
  id: string;
  user_id: string;
  login_at: string;
  last_active_at: string;
  device: string | null;
  browser: string | null;
  ip_address: string | null;
  location: string | null;
  is_active: boolean;
}

export const loginSessions: LoginSession[] = [
  {
    id: "session-1",
    user_id: "11111111-1111-1111-1111-111111111111",
    login_at: "2024-01-10T09:00:00Z",
    last_active_at: "2024-01-10T17:30:00Z",
    device: "MacBook Pro",
    browser: "Chrome 120",
    ip_address: "192.168.1.100",
    location: "San Francisco, CA",
    is_active: true,
  },
  {
    id: "session-2",
    user_id: "22222222-2222-2222-2222-222222222222",
    login_at: "2024-01-10T08:30:00Z",
    last_active_at: "2024-01-10T16:45:00Z",
    device: "iPhone 15",
    browser: "Safari",
    ip_address: "192.168.1.101",
    location: "New York, NY",
    is_active: true,
  },
  {
    id: "session-3",
    user_id: "11111111-1111-1111-1111-111111111111",
    login_at: "2024-01-09T10:00:00Z",
    last_active_at: "2024-01-09T18:00:00Z",
    device: "Windows PC",
    browser: "Edge",
    ip_address: "192.168.1.102",
    location: "San Francisco, CA",
    is_active: false,
  },
];
