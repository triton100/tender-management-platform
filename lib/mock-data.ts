import type { Tender, AIQualification, Opportunity, Task, ComplianceItem } from "./types"

// Mock tender data
export const MOCK_TENDERS: Tender[] = [
  {
    id: "t1",
    tender_number: "DPWI-2024-001",
    title: "Supply and Installation of Network Infrastructure for Government Buildings",
    description:
      "The Department of Public Works and Infrastructure requires a comprehensive network infrastructure solution for 15 government buildings across Gauteng province.",
    issuing_department: "Department of Public Works and Infrastructure",
    closing_date: "2024-12-15T17:00:00Z",
    value_estimate: 8500000,
    category: "ICT Infrastructure",
    location: "Gauteng",
    status: "new",
    source_url: "https://etenders.gov.za/content/supply-and-installation-network-infrastructure",
    fetched_at: new Date().toISOString(),
  },
  {
    id: "t2",
    tender_number: "DOH-2024-089",
    title: "Healthcare Management Information System Implementation",
    description:
      "Implementation of an integrated healthcare management system for 8 district hospitals in KwaZulu-Natal.",
    issuing_department: "Department of Health",
    closing_date: "2024-12-20T17:00:00Z",
    value_estimate: 12000000,
    category: "Software Development",
    location: "KwaZulu-Natal",
    status: "new",
    source_url: "https://etenders.gov.za/content/healthcare-management-system",
    fetched_at: new Date().toISOString(),
  },
  {
    id: "t3",
    tender_number: "DOE-2024-045",
    title: "Digital Learning Platform for Rural Schools",
    description:
      "Development and deployment of a digital learning platform with offline capabilities for 200 rural schools.",
    issuing_department: "Department of Education",
    closing_date: "2024-12-10T17:00:00Z",
    value_estimate: 6500000,
    category: "Education Technology",
    location: "Eastern Cape",
    status: "new",
    source_url: "https://etenders.gov.za/content/digital-learning-platform",
    fetched_at: new Date().toISOString(),
  },
]

export const MOCK_AI_QUALIFICATIONS: Record<string, AIQualification> = {
  t1: {
    tender_id: "t1",
    match_score: 87,
    risk_level: "low",
    recommendation: "pursue",
    reasoning:
      "Strong alignment with our network infrastructure expertise. We have completed 3 similar projects for government departments in the past 2 years. Technical requirements match our current capabilities.",
    key_requirements: [
      "Cisco certified network engineers (minimum 5 years experience)",
      "Previous government project experience",
      "BBBEE Level 2 or higher",
      "ISO 27001 certification",
      "Project value insurance of R10M+",
    ],
    estimated_effort_days: 180,
    confidence: 92,
    created_at: new Date().toISOString(),
  },
  t2: {
    tender_id: "t2",
    match_score: 72,
    risk_level: "medium",
    recommendation: "consider",
    reasoning:
      "Good technical fit but higher complexity. Healthcare domain requires specialized compliance knowledge. Consider partnering with a healthcare IT specialist.",
    key_requirements: [
      "POPIA compliance expertise",
      "Healthcare system integration experience",
      "HL7/FHIR standards knowledge",
      "On-site support capability in KZN",
      "Minimum 10 years software development",
    ],
    estimated_effort_days: 240,
    confidence: 78,
    created_at: new Date().toISOString(),
  },
  t3: {
    tender_id: "t3",
    match_score: 65,
    risk_level: "medium",
    recommendation: "consider",
    reasoning:
      "Moderate fit. Offline-first architecture is outside our typical scope. Budget may be tight for the scope of work. Consider if we can leverage existing platforms.",
    key_requirements: [
      "Progressive Web App development",
      "Offline-first architecture experience",
      "Educational content management",
      "Rural deployment experience",
      "Training and support plan",
    ],
    estimated_effort_days: 150,
    confidence: 68,
    created_at: new Date().toISOString(),
  },
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp1",
    tender_id: "t1",
    tender: MOCK_TENDERS[0],
    ai_qualification: MOCK_AI_QUALIFICATIONS.t1,
    assigned_to: "1",
    status: "preparing",
    win_probability: 75,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const MOCK_TASKS: Task[] = [
  {
    id: "task1",
    opportunity_id: "opp1",
    title: "Complete technical specification document",
    description: "Detail network architecture and equipment specifications",
    assigned_to: "2",
    due_date: "2024-12-08T17:00:00Z",
    status: "in-progress",
    priority: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: "task2",
    opportunity_id: "opp1",
    title: "Obtain BBBEE certificate",
    description: "Ensure current BBBEE certificate is valid and meets requirements",
    assigned_to: "1",
    due_date: "2024-12-05T17:00:00Z",
    status: "done",
    priority: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: "task3",
    opportunity_id: "opp1",
    title: "Prepare project timeline and resource allocation",
    assigned_to: "1",
    due_date: "2024-12-10T17:00:00Z",
    status: "todo",
    priority: "medium",
    created_at: new Date().toISOString(),
  },
]

export const MOCK_COMPLIANCE: ComplianceItem[] = [
  {
    id: "comp1",
    opportunity_id: "opp1",
    requirement: "BBBEE Level 2 or higher certification",
    status: "compliant",
    notes: "Current certificate valid until March 2025",
    verified_by: "1",
    verified_at: new Date().toISOString(),
  },
  {
    id: "comp2",
    opportunity_id: "opp1",
    requirement: "ISO 27001 Information Security certification",
    status: "compliant",
    notes: "Certified since 2022, annual audit passed",
    verified_by: "1",
    verified_at: new Date().toISOString(),
  },
  {
    id: "comp3",
    opportunity_id: "opp1",
    requirement: "Minimum 5 Cisco certified engineers on staff",
    status: "compliant",
    notes: "Currently have 7 CCNP certified engineers",
  },
  {
    id: "comp4",
    opportunity_id: "opp1",
    requirement: "Project value insurance of R10M+",
    status: "pending",
    notes: "Awaiting quote from insurance provider",
  },
  {
    id: "comp5",
    opportunity_id: "opp1",
    requirement: "Tax clearance certificate",
    status: "compliant",
    notes: "Valid until June 2025",
    verified_by: "1",
    verified_at: new Date().toISOString(),
  },
]
