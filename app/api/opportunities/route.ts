import { NextResponse } from "next/server"
import { getOpportunities, createOpportunity } from "@/lib/db/opportunities"

export async function GET() {
  try {
    const opportunities = await getOpportunities()
    return NextResponse.json(opportunities)
  } catch (error) {
    console.error("[v0] Error fetching opportunities:", error)
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const opportunity = await createOpportunity({
      tenderId: body.tenderId,
      qualificationId: body.qualificationId,
      assignedTo: body.assignedTo,
      status: body.status,
    })

    return NextResponse.json(opportunity)
  } catch (error) {
    console.error("[v0] Error creating opportunity:", error)
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 })
  }
}
