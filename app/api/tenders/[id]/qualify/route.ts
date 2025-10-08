import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getTenderById } from "@/lib/db/tenders"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const tenderId = params.id

    const tender = await getTenderById(tenderId)

    if (!tender) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const matchScore = Math.floor(Math.random() * 40) + 60 // 60-100
    const riskLevel = matchScore >= 80 ? "low" : matchScore >= 65 ? "medium" : "high"
    const recommendation = matchScore >= 80 ? "pursue" : matchScore >= 65 ? "consider" : "skip"

    const qualification = {
      match_score: matchScore,
      risk_level: riskLevel,
      recommendation,
      reasoning: `Based on analysis of ${tender.title}, this opportunity ${
        matchScore >= 80
          ? "strongly aligns with our capabilities"
          : matchScore >= 65
            ? "shows moderate alignment with our expertise"
            : "presents significant challenges"
      }. ${
        riskLevel === "low"
          ? "Low risk profile with clear requirements."
          : riskLevel === "medium"
            ? "Moderate risk requiring careful planning."
            : "High risk - consider partnership or additional resources."
      }`,
      key_requirements: [
        "Relevant industry experience (minimum 5 years)",
        "BBBEE Level 2 or higher certification",
        "ISO 27001 or equivalent certification",
        "Previous government project experience",
        "Technical team with required certifications",
      ],
      strengths: [
        "Clear project scope and requirements",
        "Realistic timeline and budget",
        "Alignment with our core competencies",
      ],
      concerns:
        riskLevel === "high"
          ? ["Complex requirements", "Tight timeline", "Resource constraints"]
          : riskLevel === "medium"
            ? ["Some technical challenges", "Competitive landscape"]
            : ["Minimal concerns identified"],
      estimated_effort_hours: Math.floor(Math.random() * 800) + 400,
      estimated_cost: Math.floor(Math.random() * 2000000) + 500000,
      win_probability: matchScore,
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("ai_qualifications")
      .insert([
        {
          tender_id: tenderId,
          match_score: qualification.match_score,
          recommendation: qualification.recommendation,
          risk_level: qualification.risk_level,
          estimated_effort_hours: qualification.estimated_effort_hours,
          estimated_cost: qualification.estimated_cost,
          win_probability: qualification.win_probability,
          reasoning: qualification.reasoning,
          key_requirements: qualification.key_requirements,
          strengths: qualification.strengths,
          concerns: qualification.concerns,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving qualification:", error)
      return NextResponse.json({ error: "Failed to save qualification" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error qualifying tender:", error)
    return NextResponse.json({ error: "Failed to qualify tender" }, { status: 500 })
  }
}
