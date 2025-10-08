import { NextResponse } from "next/server"
import { getTenders } from "@/lib/db/tenders"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const minValue = searchParams.get("minValue") ? Number(searchParams.get("minValue")) : undefined

    const tenders = await getTenders({
      category: category && category !== "all" ? category : undefined,
      search,
      minValue,
    })

    return NextResponse.json(tenders)
  } catch (error) {
    console.error("[v0] Error fetching tenders:", error)
    return NextResponse.json({ error: "Failed to fetch tenders" }, { status: 500 })
  }
}
