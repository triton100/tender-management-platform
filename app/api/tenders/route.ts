import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    console.log("[v0] Fetching tenders from external API...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    let response
    try {
      response = await fetch("https://41.72.130.234:8000/tenders", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        console.error("[v0] External API request timed out")
      } else {
        console.error("[v0] External API fetch error:", fetchError.message)
      }
      return NextResponse.json([])
    }

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("[v0] External API returned status:", response.status)
      const text = await response.text()
      console.error("[v0] Response body:", text.substring(0, 200))
      return NextResponse.json([])
    }

    const contentType = response.headers.get("content-type")
    console.log("[v0] Response content-type:", contentType)

    let tenders
    try {
      const text = await response.text()
      console.log("[v0] Response preview:", text.substring(0, 200))
      tenders = JSON.parse(text)
    } catch (parseError) {
      console.error("[v0] Failed to parse JSON response:", parseError)
      return NextResponse.json([])
    }

    if (!Array.isArray(tenders)) {
      console.error("[v0] External API returned non-array data:", typeof tenders)
      return NextResponse.json([])
    }

    console.log("[v0] Successfully fetched", tenders.length, "tenders")

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
    return NextResponse.json([])
  }
}
