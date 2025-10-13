import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    // Fetch from external API
    const response = await fetch("http://41.72.130.234:8000/tenders", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tenders from external API")
    }

    let tenders = await response.json()

    // Apply filters if provided
    if (search) {
      const searchLower = search.toLowerCase()
      tenders = tenders.filter(
        (tender: any) =>
          tender.description?.toLowerCase().includes(searchLower) ||
          tender.tender_No?.toLowerCase().includes(searchLower) ||
          tender.department?.toLowerCase().includes(searchLower),
      )
    }

    if (category && category !== "all") {
      tenders = tenders.filter((tender: any) => tender.category === category)
    }

    return NextResponse.json(tenders)
  } catch (error) {
    console.error("[v0] Error fetching tenders:", error)
    return NextResponse.json({ error: "Failed to fetch tenders" }, { status: 500 })
  }
}
