import { NextResponse } from "next/server"
import { getDocuments } from "@/lib/db/documents"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const opportunityId = searchParams.get("opportunityId") || undefined

    const documents = await getDocuments(opportunityId)
    return NextResponse.json(documents)
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
