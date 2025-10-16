# API & Features Documentation

This document provides a comprehensive overview of all API endpoints, features, and integrations used in the project.

## Table of Contents
- [Database Tables](#database-tables)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Authentication](#authentication)
- [Integrations](#integrations)

---

## Database Tables

### Organizations
**Table Name:** `organizations`

**Columns:**
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `slug` (TEXT, Unique)
- `description` (TEXT)
- `logo_url` (TEXT)
- `created_by` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Admins can manage organizations
- All authenticated users can view organizations

---

### Projects
**Table Name:** `projects`

**Columns:**
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `description` (TEXT)
- `organization_id` (UUID, Foreign Key to organizations)
- `status` (TEXT: 'active', 'on_hold', 'completed')
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `created_by` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Admins can manage projects
- Users can view projects in accessible organizations

---

### Tasks
**Table Name:** `tasks`

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `status` (ENUM: 'todo', 'in_progress', 'in_review', 'completed', 'blocked')
- `priority` (ENUM: 'low', 'medium', 'high', 'urgent')
- `project_id` (UUID, Foreign Key to projects)
- `organization_id` (UUID, Foreign Key to organizations)
- `assigned_to` (UUID, Foreign Key to profiles)
- `created_by` (UUID, Foreign Key to profiles)
- `parent_task_id` (UUID, Foreign Key to tasks - for subtasks)
- `due_date` (TIMESTAMP)
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Users can view tasks they're assigned to or created
- Assigned users and admins can update tasks
- Users can create tasks

---

### Task Checklist Items
**Table Name:** `task_checklist_items`

**Columns:**
- `id` (UUID, Primary Key)
- `task_id` (UUID, Foreign Key to tasks)
- `title` (TEXT)
- `completed` (BOOLEAN, Default: false)
- `position` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Users can manage checklist items for their tasks
- Users can view checklist items for accessible tasks

---

### Comments
**Table Name:** `comments`

**Columns:**
- `id` (UUID, Primary Key)
- `content` (TEXT)
- `task_id` (UUID, Foreign Key to tasks)
- `user_id` (UUID, Foreign Key to profiles)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Users can view comments on accessible tasks
- Users can create comments

---

### Profiles
**Table Name:** `profiles`

**Columns:**
- `id` (UUID, Primary Key, Foreign Key to auth.users)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**RLS Policies:**
- Users can view all profiles
- Users can update their own profile

---

### User Roles
**Table Name:** `user_roles`

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `role` (ENUM: 'staff', 'admin', 'super_admin')
- `created_at` (TIMESTAMP)

**RLS Policies:**
- Users can view all roles
- Only admins can manage roles

---

## API Endpoints

### Authentication Endpoints

#### Sign Up
```typescript
supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    data: {
      full_name?: string,
      avatar_url?: string
    }
  }
})
```

#### Sign In
```typescript
supabase.auth.signInWithPassword({
  email: string,
  password: string
})
```

#### Sign Out
```typescript
supabase.auth.signOut()
```

#### Get Current User
```typescript
supabase.auth.getUser()
```

---

### Database Query Endpoints

All database queries use Supabase's auto-generated REST API:

#### Get Tasks
```typescript
supabase
  .from('tasks')
  .select(`
    *,
    organization:organizations(name),
    assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url),
    task_checklist_items(*),
    comments:comments(id, content, created_at)
  `)
  .eq('assigned_to', userId)
  .order('created_at', { ascending: false })
```

#### Update Task Status
```typescript
supabase
  .from('tasks')
  .update({ status: newStatus })
  .eq('id', taskId)
```

#### Get Organizations with Projects
```typescript
supabase
  .from('organizations')
  .select(`
    id,
    name,
    slug,
    projects (
      id,
      name,
      status
    )
  `)
  .order('name')
```

#### Get User Role
```typescript
supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .single()
```

#### Create Comment
```typescript
supabase
  .from('comments')
  .insert({
    content: string,
    task_id: string,
    user_id: string
  })
```

---

## Features

### 1. Dashboard
- **Route:** `/dashboard`
- **Features:**
  - Welcome message with user greeting
  - Statistics overview (Total Tasks, My Tasks, Organizations, Projects)
  - Task distribution pie chart
  - Weekly activity bar chart
  - Quick access to key metrics

### 2. My Tasks
- **Route:** `/tasks`
- **Features:**
  - View all tasks assigned to the current user
  - Filter by status, priority
  - Task cards with progress indicators
  - Checklist completion tracking
  - Comment counts
  - Team member avatars
  - Click to open task detail modal

### 3. Project Management
- **Route:** `/projects/:id`
- **Features:**
  - Kanban Board view
  - Drag-and-drop task status updates
  - Task cards with priority indicators
  - Subtask tracking
  - Checklist progress
  - Calendar view
  - Gantt chart view
  - Team member management

### 4. Task Detail Modal
- **Features:**
  - Full task information display
  - Edit task title and description
  - Update status and priority
  - Set start and due dates
  - Assign team members
  - File attachments
  - Checklist management
  - Subtask creation and tracking
  - Comment system (chat-like interface)
  - Activity timeline

### 5. Reports & Analytics
- **Route:** `/reports`
- **Features:**
  - Task completion trends (bar chart)
  - Project status distribution (pie chart)
  - Team performance metrics
  - Weekly activity tracking
  - Multiple report views (Overview, Projects, Team, Activity)
  - Performance statistics cards

### 6. Access Control
- **Route:** `/access`
- **Features:**
  - User role management
  - Permission matrix
  - Role assignment
  - Team member list with roles

### 7. Settings
- **Route:** `/settings`
- **Features:**
  - Profile management
  - Notification preferences
  - Appearance settings (theme, language, timezone)
  - Security settings (password, 2FA)
  - General preferences (auto-save, view options)

### 8. Admin Portal
- **Route:** `/admin`
- **Access:** Super Admin only
- **Features:**
  - User management
  - Organization management
  - System statistics
  - Permission management
  - Analytics overview

---

## Authentication

### User Roles
- **staff:** Basic user with limited permissions
- **admin:** Can manage organizations and projects
- **super_admin:** Full system access, including admin portal

### Security Functions

#### has_role Function
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;
```

### Triggers

#### handle_new_user
Automatically creates a profile and assigns default role when a user signs up.

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  
  RETURN NEW;
END;
$$;
```

---

## Integrations

### Supabase
- **Authentication:** Email/password authentication with automatic profile creation
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Real-time:** Real-time subscriptions for live updates
- **Storage:** File storage for attachments (to be implemented)

### React Query
- **Purpose:** Data fetching, caching, and synchronization
- **Usage:** All database queries use React Query for optimal performance

### DND Kit
- **Purpose:** Drag-and-drop functionality for Kanban board
- **Usage:** Task status updates via drag-and-drop

### Recharts
- **Purpose:** Data visualization and analytics
- **Usage:** Charts and graphs in Reports section

### Shadcn UI
- **Purpose:** UI component library
- **Components Used:**
  - Card, Button, Badge, Avatar
  - Dialog, Sheet, Tabs
  - Input, Select, Switch
  - Chart components
  - And more...

---

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

## Best Practices

1. **Security:**
   - Always use RLS policies for data access control
   - Validate user permissions on the server side
   - Never expose sensitive data in client-side code

2. **Performance:**
   - Use React Query for efficient data caching
   - Implement optimistic updates for better UX
   - Lazy load heavy components

3. **Code Organization:**
   - Keep components small and focused
   - Use custom hooks for reusable logic
   - Organize files by feature

4. **Testing:**
   - Test RLS policies thoroughly
   - Verify role-based access control
   - Test drag-and-drop functionality across browsers

---

## Future Enhancements

- [ ] File upload and attachment system
- [ ] Real-time collaboration features
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Time tracking integration
- [ ] Mobile app version
- [ ] API webhooks
- [ ] Third-party integrations (Slack, GitHub, etc.)

---

**Last Updated:** December 2024
**Version:** 1.0.0
