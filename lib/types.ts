// Database types for the tender management system

export type UserRole = "BidManager" | "BidUser" | "Executive"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface Tender {
  id: string
  tender_number: string
  title: string
  description: string
  issuing_department: string
  closing_date: string
  value_estimate?: number
  category: string
  location: string
  status: "new" | "qualified" | "in-progress" | "submitted" | "won" | "lost"
  source_url?: string
  fetched_at: string
}

export interface AIQualification {
  tender_id: string
  match_score: number // 0-100
  risk_level: "low" | "medium" | "high"
  recommendation: "pursue" | "consider" | "skip"
  reasoning: string
  key_requirements: string[]
  estimated_effort_days: number
  confidence: number // 0-100
  created_at: string
}

export interface Opportunity {
  id: string
  tender_id: string
  tender: Tender
  ai_qualification?: AIQualification
  assigned_to?: string
  status: "qualifying" | "preparing" | "review" | "submitted" | "won" | "lost"
  win_probability: number // 0-100
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  opportunity_id: string
  title: string
  description?: string
  assigned_to?: string
  due_date?: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  created_at: string
}

export interface ComplianceItem {
  id: string
  opportunity_id: string
  requirement: string
  status: "pending" | "compliant" | "non-compliant" | "not-applicable"
  notes?: string
  verified_by?: string
  verified_at?: string
}

export interface Document {
  id: string
  opportunity_id: string
  name: string
  type: string
  size: number
  url: string
  uploaded_by: string
  uploaded_at: string
}

export interface ProposalSection {
  id: string
  opportunity_id: string
  section_name: string
  content: string
  word_count: number
  last_edited_by?: string
  last_edited_at?: string
}
