-- Create statuses table
CREATE TABLE public.statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('default', 'custom')),
  is_editable BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE
);

-- Create worksheets table (project-specific workflows)
CREATE TABLE public.worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create worksheet_statuses junction table
CREATE TABLE public.worksheet_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id UUID NOT NULL REFERENCES public.worksheets(id) ON DELETE CASCADE,
  status_id UUID NOT NULL REFERENCES public.statuses(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(worksheet_id, status_id)
);

-- Create custom_fields table
CREATE TABLE public.custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'select', 'multiselect', 'checkbox')),
  options JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN NOT NULL DEFAULT false,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create login_sessions table for tracking
CREATE TABLE public.login_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device TEXT,
  browser TEXT,
  ip_address TEXT,
  location TEXT,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheet_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for statuses
CREATE POLICY "Users can view statuses in their organization"
  ON public.statuses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE organizations.id = statuses.organization_id
    )
  );

CREATE POLICY "Admins can manage statuses"
  ON public.statuses FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- RLS Policies for worksheets
CREATE POLICY "Users can view worksheets in their organization"
  ON public.worksheets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE organizations.id = worksheets.organization_id
    )
  );

CREATE POLICY "Admins can manage worksheets"
  ON public.worksheets FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- RLS Policies for worksheet_statuses
CREATE POLICY "Users can view worksheet statuses"
  ON public.worksheet_statuses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.worksheets
      WHERE worksheets.id = worksheet_statuses.worksheet_id
    )
  );

CREATE POLICY "Admins can manage worksheet statuses"
  ON public.worksheet_statuses FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- RLS Policies for custom_fields
CREATE POLICY "Users can view custom fields in their organization"
  ON public.custom_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE organizations.id = custom_fields.organization_id
    )
  );

CREATE POLICY "Admins can manage custom fields"
  ON public.custom_fields FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- RLS Policies for login_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.login_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions"
  ON public.login_sessions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
  ON public.login_sessions FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Create indexes for performance
CREATE INDEX idx_statuses_organization ON public.statuses(organization_id);
CREATE INDEX idx_worksheets_organization ON public.worksheets(organization_id);
CREATE INDEX idx_worksheet_statuses_worksheet ON public.worksheet_statuses(worksheet_id);
CREATE INDEX idx_worksheet_statuses_status ON public.worksheet_statuses(status_id);
CREATE INDEX idx_custom_fields_organization ON public.custom_fields(organization_id);
CREATE INDEX idx_login_sessions_user ON public.login_sessions(user_id);
CREATE INDEX idx_login_sessions_active ON public.login_sessions(is_active);

-- Create triggers for updated_at
CREATE TRIGGER update_statuses_updated_at
  BEFORE UPDATE ON public.statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_worksheets_updated_at
  BEFORE UPDATE ON public.worksheets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_custom_fields_updated_at
  BEFORE UPDATE ON public.custom_fields
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();