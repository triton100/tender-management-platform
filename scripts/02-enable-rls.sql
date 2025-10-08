-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tenders policies (all authenticated users can view)
CREATE POLICY "Anyone can view tenders" ON public.tenders
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert tenders" ON public.tenders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update tenders" ON public.tenders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- AI Qualifications policies
CREATE POLICY "Anyone can view qualifications" ON public.ai_qualifications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert qualifications" ON public.ai_qualifications
  FOR INSERT WITH CHECK (true);

-- Opportunities policies
CREATE POLICY "Anyone can view opportunities" ON public.opportunities
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage opportunities" ON public.opportunities
  FOR ALL USING (true);

-- Tasks policies
CREATE POLICY "Anyone can view tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage tasks" ON public.tasks
  FOR ALL USING (true);

-- Compliance policies
CREATE POLICY "Anyone can view compliance" ON public.compliance_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage compliance" ON public.compliance_items
  FOR ALL USING (true);

-- Documents policies
CREATE POLICY "Anyone can view documents" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage documents" ON public.documents
  FOR ALL USING (true);

-- Contracts policies
CREATE POLICY "Anyone can view contracts" ON public.contracts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage contracts" ON public.contracts
  FOR ALL USING (true);

-- Projects policies
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage projects" ON public.projects
  FOR ALL USING (true);
