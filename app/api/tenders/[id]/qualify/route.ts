import { NextResponse } from "next/server"
import type { AIQualification } from "@/lib/types"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const tenderId = params.id

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock AI qualification based on tender ID
  const qualifications: Record<string, AIQualification> = {
    t1: {
      tender_id: tenderId,
      match_score: 87,
      risk_level: "low",
      recommendation: "pursue",
      reasoning:
        "Strong alignment with our network infrastructure expertise. We have completed 3 similar projects for government departments in the past 2 years. Technical requirements match our current capabilities. The project scope is well-defined and the timeline is realistic.",
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
      tender_id: tenderId,
      match_score: 72,
      risk_level: "medium",
      recommendation: "consider",
      reasoning:
        "Good technical fit but higher complexity. Healthcare domain requires specialized compliance knowledge (POPIA, HIPAA-equivalent). Consider partnering with a healthcare IT specialist to strengthen the bid. Budget appears adequate but timeline may be aggressive.",
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
      tender_id: tenderId,
      match_score: 65,
      risk_level: "medium",
      recommendation: "consider",
      reasoning:
        "Moderate fit. Offline-first architecture is outside our typical scope. Budget may be tight for the scope of work (200 schools). Consider if we can leverage existing platforms or partner with an education technology specialist. Rural deployment adds logistical complexity.",
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
    t4: {
      tender_id: tenderId,
      match_score: 91,
      risk_level: "low",
      recommendation: "pursue",
      reasoning:
        "Excellent fit with our cybersecurity expertise. We have extensive experience with similar security infrastructure projects. Strong existing relationships with security vendors. High-value project with clear requirements and realistic timeline.",
      key_requirements: [
        "Certified cybersecurity professionals (CISSP, CEH)",
        "Security operations center experience",
        "Government security clearance",
        "24/7 support capability",
        "Incident response team",
      ],
      estimated_effort_days: 200,
      confidence: 94,
      created_at: new Date().toISOString(),
    },
    t5: {
      tender_id: tenderId,
      match_score: 58,
      risk_level: "high",
      recommendation: "skip",
      reasoning:
        "Limited fit. Biometric systems are not our core competency. High complexity and regulatory requirements. Would require significant subcontracting or new hires. Consider only if strategic partnership opportunity exists.",
      key_requirements: [
        "Biometric system integration experience",
        "National scale deployment capability",
        "Home Affairs system integration",
        "Facial recognition technology expertise",
        "Data privacy and security compliance",
      ],
      estimated_effort_days: 300,
      confidence: 72,
      created_at: new Date().toISOString(),
    },
  }

  const qualification = qualifications[tenderId] || {
    tender_id: tenderId,
    match_score: 50,
    risk_level: "medium" as const,
    recommendation: "consider" as const,
    reasoning: "Standard qualification - requires detailed analysis.",
    key_requirements: ["To be determined"],
    estimated_effort_days: 120,
    confidence: 60,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json(qualification)
}
