-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'bid_manager' CHECK (role IN ('admin', 'bid_manager', 'analyst')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenders table
CREATE TABLE IF NOT EXISTS public.tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  issuing_department TEXT NOT NULL,
  category TEXT NOT NULL,
  value DECIMAL(15, 2),
  location TEXT,
  published_date TIMESTAMPTZ,
  closing_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded', 'cancelled')),
  source_url TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Qualifications table
CREATE TABLE IF NOT EXISTS public.ai_qualifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 10),
  recommendation TEXT CHECK (recommendation IN ('pursue', 'consider', 'skip')),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  estimated_effort_hours INTEGER,
  estimated_cost DECIMAL(15, 2),
  win_probability INTEGER CHECK (win_probability >= 0 AND win_probability <= 100),
  reasoning TEXT,
  key_requirements JSONB,
  strengths JSONB,
  concerns JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE,
  qualification_id UUID REFERENCES public.ai_qualifications(id),
  status TEXT DEFAULT 'qualifying' CHECK (status IN ('qualifying', 'preparing', 'submitted', 'won', 'lost')),
  assigned_to UUID REFERENCES public.users(id),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to UUID REFERENCES public.users(id),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance items table
CREATE TABLE IF NOT EXISTS public.compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'not_applicable')),
  notes TEXT,
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT,
  category TEXT CHECK (category IN ('technical', 'financial', 'legal', 'compliance', 'proposal')),
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES public.opportunities(id),
  contract_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  client TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES public.contracts(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(15, 2),
  spent DECIMAL(15, 2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  project_manager UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tenders_closing_date ON public.tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON public.tenders(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_documents_opportunity_id ON public.documents(opportunity_id);
