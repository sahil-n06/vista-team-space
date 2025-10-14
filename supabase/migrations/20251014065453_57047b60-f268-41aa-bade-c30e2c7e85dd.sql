-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'archived')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects RLS policies
CREATE POLICY "Users can view projects in accessible organizations"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organizations
    WHERE organizations.id = projects.organization_id
  )
);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Add project_id to tasks table
ALTER TABLE public.tasks ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Create task_checklist_items table
CREATE TABLE public.task_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on checklist items
ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;

-- Checklist items RLS policies
CREATE POLICY "Users can view checklist items for accessible tasks"
ON public.task_checklist_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = task_checklist_items.task_id
    AND (
      tasks.assigned_to = auth.uid() OR 
      tasks.created_by = auth.uid() OR 
      has_role(auth.uid(), 'admin'::app_role) OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

CREATE POLICY "Users can manage checklist items for their tasks"
ON public.task_checklist_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = task_checklist_items.task_id
    AND (
      tasks.assigned_to = auth.uid() OR 
      tasks.created_by = auth.uid() OR 
      has_role(auth.uid(), 'admin'::app_role) OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- Add parent_task_id to tasks for subtasks
ALTER TABLE public.tasks ADD COLUMN parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_task_checklist_items_updated_at
  BEFORE UPDATE ON public.task_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();